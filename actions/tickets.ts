"use server";

import { Ticket } from "@/types";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function getTickets(projectIds: string[]) {
  if (!projectIds || projectIds.length === 0) {
    throw new Error("Project IDs are required");
  }

  const { data: tickets, error: ticketsError } = await supabaseAdmin
    .from("tickets")
    .select(
      `
      *,
      project:projects(*),
      attachments:ticket_attachments(count),
      comments:ticket_comments(count),
      assigned_to_user:users!tickets_assigned_to_fkey(*),
      created_by_user:users!tickets_created_by_fkey(*)
    `
    )
    .in("project_id", projectIds)
    .order("created_at", { ascending: false });

  if (ticketsError) throw ticketsError;

  // Transform attachments and comments count from array to number
  const enrichedTickets = tickets.map((ticket) => ({
    ...ticket,
    attachments_count: ticket.attachments?.[0]?.count || 0,
    comments_count: ticket.comments?.[0]?.count || 0,
  }));
  return enrichedTickets as Ticket[];
}

export async function updateTicketStatus(
  ticketId: string,
  status: Ticket["status"]
) {
  const { error } = await supabaseAdmin
    .from("tickets")
    .update({ status })
    .eq("id", ticketId);

  if (error) throw error;
}

export async function updateTicketPriority(
  ticketId: string,
  priority: Ticket["priority"]
) {
  const { error } = await supabaseAdmin
    .from("tickets")
    .update({ priority })
    .eq("id", ticketId);

  if (error) throw error;
}

export async function createTicket(data: Partial<Ticket>) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) throw new Error("Utilisateur non connecté");

  const { data: ticket, error } = await supabaseAdmin
    .from("tickets")
    .insert([
      {
        ...data,
        created_by: session.user.id,
        status: data.status || "backlog",
        priority: data.priority || "medium",
      },
    ])
    .select(
      `
      *,
      created_by_user:users!tickets_created_by_fkey(*)
    `
    )
    .single();

  if (error) throw error;

  return ticket;
}

export async function getUsers(companyId: string) {
  const { data: users, error } = await supabaseAdmin
    .from("company_users")
    .select(
      `
      user_id,
      user:users!company_users_user_id_fkey(
        id,
        email,
        full_name,
        profile_picture_url
      )
    `
    )
    .eq("company_id", companyId);

  if (error) throw error;
  return users.map((user) => user.user);
}

export async function uploadTicketAttachment(ticketId: string, file: File) {
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      throw new Error("Utilisateur non connecté");
    }

    // Ensure the user has access to this ticket
    const { data: ticket } = await supabaseAdmin
      .from("tickets")
      .select()
      .eq("id", ticketId)
      .single();

    if (!ticket) {
      throw new Error("Ticket non trouvé");
    }

    // Create unique filename
    const fileName = `${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = `${ticketId}/${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Upload to storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("ticket-attachments")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("ticket-attachments").getPublicUrl(filePath);

    // Create database record
    const { error: dbError } = await supabaseAdmin
      .from("ticket_attachments")
      .insert({
        ticket_id: ticketId,
        file_url: publicUrl,
        file_name: fileName,
        file_type: file.type,
        uploaded_by: session.user.id,
      })
      .select(
        `
        *,
        uploaded_by_user:users!ticket_attachments_uploaded_by_fkey(*)
      `
      )
      .single();

    if (dbError) throw dbError;

    return publicUrl;
  } catch (error) {
    console.error("Error uploading attachment:", error);
    throw error;
  }
}

export async function getProjects() {
  const { data: projects, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("name");

  if (error) throw error;

  return projects;
}

export async function getTicketComments(ticketId: string) {
  const { data: comments, error } = await supabaseAdmin
    .from("ticket_comments")
    .select(
      `
      *,
      created_by_user:users!ticket_comments_created_by_fkey(*)
    `
    )
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  console.log("fetched comments:", comments);
  if (error) throw error;

  if (!comments || comments.length === 0) {
    return [];
  }

  return comments;
}

export async function createTicketComment(ticketId: string, content: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) throw new Error("Utilisateur non connecté");

  const { data: comment, error } = await supabaseAdmin
    .from("ticket_comments")
    .insert({
      ticket_id: ticketId,
      content,
      created_by: session.user.id,
    })
    .select(
      `
      *,
      created_by_user:users!ticket_comments_created_by_fkey(*)
    `
    )
    .single();

  if (error) throw error;

  return comment;
}

export async function getTicketById(ticketId: string) {
  const { data: ticket, error: ticketError } = await supabaseAdmin
    .from("tickets")
    .select(
      `
      *,
      project:projects(*),
      assigned_to_user:users!tickets_assigned_to_fkey(*),
      created_by_user:users!tickets_created_by_fkey(*),
      attachments:ticket_attachments(
        *,
        uploaded_by_user:users!ticket_attachments_uploaded_by_fkey(*)
      ),
      comments:ticket_comments(
        *,
        created_by_user:users!ticket_comments_created_by_fkey(*)
      )
    `
    )
    .eq("id", ticketId)
    .single();

  if (ticketError) throw ticketError;

  return ticket;
}
