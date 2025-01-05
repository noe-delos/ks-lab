import { supabaseAdmin } from "@/utils/supabase/admin";

export async function getProject(id: string) {
  const { data: project, error } = await supabaseAdmin
    .from("projects")
    .select(
      `
      *,
      tickets (*),
      project_objectives (*),
      timeline_events (*),
      project_attachments (*)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return project;
}

export async function updateProject(
  id: string,
  updates: {
    name?: string;
    description?: string;
    picture_url?: string;
  }
) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createTicket(
  projectId: string,
  data: {
    title: string;
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    created_by: string;
  }
) {
  const { data: ticket, error } = await supabaseAdmin
    .from("tickets")
    .insert({
      ...data,
      project_id: projectId,
      status: "open",
    })
    .select()
    .single();

  if (error) throw error;
  return ticket;
}

export async function updateTicket(
  ticketId: string,
  updates: {
    status?: "open" | "in_progress" | "resolved" | "closed";
    description?: string;
    priority?: "low" | "medium" | "high" | "urgent";
    assigned_to?: string;
  }
) {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .update(updates)
    .eq("id", ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAttachment(
  projectId: string,
  file: File
): Promise<{ filePath: string; fileName: string }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `${projectId}/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("project-attachments")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  return { filePath, fileName: file.name };
}

export async function createAttachment(
  projectId: string,
  fileName: string,
  filePath: string
) {
  const { data, error } = await supabaseAdmin
    .from("project_attachments")
    .insert({
      project_id: projectId,
      file_name: fileName,
      file_path: filePath,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAttachments(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_attachments")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAttachmentUrl(filePath: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from("project-attachments")
    .createSignedUrl(filePath, 3600); // 1 hour expiry

  if (error) throw error;
  if (!data?.signedUrl) throw new Error("Failed to generate signed URL");

  return data.signedUrl;
}

export async function updateAttachment(
  attachmentId: string,
  updates: { file_name?: string; file_path?: string }
) {
  const { data, error } = await supabaseAdmin
    .from("project_attachments")
    .update(updates)
    .eq("id", attachmentId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAttachment(attachmentId: string) {
  // Get the attachment to retrieve file_path
  const { data: attachment, error: getError } = await supabaseAdmin
    .from("project_attachments")
    .select("file_path")
    .eq("id", attachmentId)
    .single();

  if (getError) throw getError;

  if (attachment) {
    // Delete the file from storage
    const { error: deleteStorageError } = await supabaseAdmin.storage
      .from("project-attachments") // Updated bucket name
      .remove([attachment.file_path]);

    if (deleteStorageError) throw deleteStorageError;

    // Delete the attachment record
    const { error: deleteRecordError } = await supabaseAdmin
      .from("project_attachments")
      .delete()
      .eq("id", attachmentId);

    if (deleteRecordError) throw deleteRecordError;
  }
}

// Type definitions
export interface Attachment {
  id: string;
  project_id: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export type AttachmentUploadResponse = {
  filePath: string;
  fileName: string;
};
