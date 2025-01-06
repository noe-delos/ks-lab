/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type UserProfile = {
  id: string;
  email: string;
  role: "admin" | "manager" | "member";
  avatar_url?: string;
  name?: string;
  company: {
    id: string;
    name: string;
    code: string;
    type?: string;
    updated_at?: string;
    icon_url: string | null;
    theme_color: string;
  } | null;
};

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  picture_url?: string;
  progress: number;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  date: string;
  files: string[];
  participants: Array<{
    id: string;
    name: string;
    avatar_url?: string;
  }>;
}

export interface CompanyUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  avatar_url?: string;
  join_date: string;
}

export interface ActivityData {
  month: string;
  projects: number;
  tickets: number;
  members: number;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error("[getUserProfile] Session error:", sessionError);
    return null;
  }

  const { data: profile, error: profileError }: any = await supabaseAdmin
    .from("companies")
    .select(
      `
      id,
      name,
      company_code,
      icon_url,
      theme_color,
      company_users!inner (role)
    `
    )
    .eq("company_users.user_id", session.user.id)
    .eq("company_users.is_primary", true)
    .single();

  if (profileError || !profile) {
    console.error("[getUserProfile] Profile error:", profileError);
    return null;
  }

  const { data: userData, error: userError } = await supabaseAdmin
    .from("users")
    .select("full_name, profile_picture_url")
    .eq("id", session.user.id)
    .single();

  if (userError) {
    console.error("[getUserProfile] User error:", userError);
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    name: userData.full_name || session.user.user_metadata.full_name,
    role: profile.company_users.role,
    avatar_url: userData.profile_picture_url,
    company: {
      id: profile.id,
      name: profile.name,
      code: profile.company_code,
      icon_url: profile.icon_url,
      theme_color: profile.theme_color,
    },
  };
}

export async function getCompanyProjects(
  companyId: string
): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select(
      `
      id,
      name,
      description,
      status,
      created_at,
      picture_url,
      tickets(count)
    `
    )
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getCompanyProjects] Error:", error);
    return [];
  }

  return data.map((project: any) => ({
    ...project,
    progress: calculateProjectProgress(project.status),
  }));
}

export async function getCompanyUsers(
  companyId: string
): Promise<CompanyUser[]> {
  const { data, error } = await supabaseAdmin
    .from("company_users")
    .select(
      `
      id,
      role,
      created_at,
      users (
        id,
        email,
        full_name,
        profile_picture_url
      )
    `
    )
    .eq("company_id", companyId);

  if (error) {
    console.error("[getCompanyUsers] Error:", error);
    return [];
  }

  return data.map((user: any) => ({
    id: user.users.id,
    name: user.users.full_name,
    email: user.users.email,
    role: user.role,
    status: "active",
    avatar_url: user.users.profile_picture_url,
    join_date: user.created_at,
  }));
}

export async function getActivityData(
  companyId: string
): Promise<ActivityData[]> {
  const { data: projectsData, error: projectsError } = await supabaseAdmin
    .from("projects")
    .select("created_at")
    .eq("company_id", companyId)
    .gte(
      "created_at",
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    );

  // Fixed query: Adding proper join with projects table
  const { data: ticketsData, error: ticketsError } = await supabaseAdmin
    .from("tickets")
    .select("created_at, projects!inner(company_id)")
    .eq("projects.company_id", companyId)
    .gte(
      "created_at",
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    );

  const { data: membersData, error: membersError } = await supabaseAdmin
    .from("company_users")
    .select("created_at")
    .eq("company_id", companyId)
    .gte(
      "created_at",
      new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
    );

  if (projectsError || ticketsError || membersError) {
    console.error("[getActivityData] Error:", {
      projectsError,
      ticketsError,
      membersError,
    });
    return [];
  }

  // Rest of the function remains the same...
  const monthlyData: { [key: string]: ActivityData } = {};
  const processDate = (
    date: string,
    type: "projects" | "tickets" | "members"
  ) => {
    const monthKey = new Date(date).toISOString().slice(0, 7);
    monthlyData[monthKey] = monthlyData[monthKey] || {
      month: new Date(monthKey + "-01").toLocaleDateString("fr-FR", {
        month: "short",
      }),
      projects: 0,
      tickets: 0,
      members: 0,
    };
    monthlyData[monthKey][type]++;
  };

  projectsData?.forEach((p) => processDate(p.created_at, "projects"));
  ticketsData?.forEach((t) => processDate(t.created_at, "tickets"));
  membersData?.forEach((m) => processDate(m.created_at, "members"));

  return Object.values(monthlyData).sort(
    (a, b) =>
      new Date(a.month + " 2024").getTime() -
      new Date(b.month + " 2024").getTime()
  );
}

export async function getCompanyMeetings(
  companyId: string
): Promise<Meeting[]> {
  const { data, error } = await supabaseAdmin
    .from("meetings")
    .select(
      `
      id,
      title,
      description,
      date,
      files,
      meeting_participants (
        users (
          id,
          full_name,
          profile_picture_url
        )
      )
    `
    )
    .eq("company_id", companyId)
    .order("date", { ascending: true });

  if (error) {
    console.error("[getCompanyMeetings] Error:", error);
    return [];
  }

  return data.map((meeting: any) => ({
    id: meeting.id,
    title: meeting.title,
    description: meeting.description,
    date: meeting.date,
    files: meeting.files || [],
    participants: meeting.meeting_participants.map((p: any) => ({
      id: p.users.id,
      name: p.users.full_name,
      avatar_url: p.users.profile_picture_url,
    })),
  }));
}

export async function createMeeting(formData: FormData) {
  const profile = await getUserProfile();
  if (!profile?.company) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const date = formData.get("date") as string;
  const participantIds = formData.getAll("participants") as string[];
  const files = formData.getAll("files") as string[];

  const { data: meeting, error: meetingError } = await supabaseAdmin
    .from("meetings")
    .insert({
      company_id: profile.company.id,
      created_by: profile.id,
      title,
      description,
      date,
      files,
    })
    .select()
    .single();

  if (meetingError) {
    console.error("[createMeeting] Meeting error:", meetingError);
    return { error: "Failed to create meeting" };
  }

  // Add participants
  const participants = participantIds.map((userId) => ({
    meeting_id: meeting.id,
    user_id: userId,
  }));

  const { error: participantsError } = await supabaseAdmin
    .from("meeting_participants")
    .insert(participants);

  if (participantsError) {
    console.error("[createMeeting] Participants error:", participantsError);
    return { error: "Failed to add participants" };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

function calculateProjectProgress(status: string): number {
  switch (status) {
    case "planning":
      return 10;
    case "in_progress":
      return 50;
    case "on_hold":
      return status === "on_hold" ? 75 : 90;
    case "completed":
      return 100;
    default:
      return 0;
  }
}
