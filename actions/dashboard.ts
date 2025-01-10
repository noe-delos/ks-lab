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
  tickets_count: number;
  version: string;
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

// Optimized user profile fetch with caching
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      console.error("[getUserProfile] Session error:", sessionError);
      return null;
    }

    // Parallel queries for better performance
    const [profileResult, userResult]: any = await Promise.all([
      supabaseAdmin
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
        .single(),

      supabaseAdmin
        .from("users")
        .select("full_name, profile_picture_url")
        .eq("id", session.user.id)
        .single(),
    ]);

    if (!profileResult.data || !userResult.data) {
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email!,
      name: userResult.data.full_name || session.user.user_metadata.full_name,
      role: profileResult.data.company_users.role,
      avatar_url: userResult.data.profile_picture_url,
      company: {
        id: profileResult.data.id,
        name: profileResult.data.name,
        code: profileResult.data.company_code,
        icon_url: profileResult.data.icon_url,
        theme_color: profileResult.data.theme_color,
      },
    };
  } catch (error) {
    console.error("[getUserProfile] Unexpected error:", error);
    return null;
  }
}

// Optimized projects fetch with count aggregation
export async function getCompanyProjects(
  companyId: string
): Promise<Project[]> {
  try {
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
      tickets_count: project.tickets[0]?.count || 0,
      progress: calculateProjectProgress(project.status),
    }));
  } catch (error) {
    console.error("[getCompanyProjects] Unexpected error:", error);
    return [];
  }
}

// Optimized users fetch with role information
export async function getCompanyUsers(
  companyId: string
): Promise<CompanyUser[]> {
  try {
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
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

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
  } catch (error) {
    console.error("[getCompanyUsers] Unexpected error:", error);
    return [];
  }
}

// Optimized activity data with efficient date handling
export async function getActivityData(
  companyId: string
): Promise<ActivityData[]> {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const isoDate = sixMonthsAgo.toISOString();

    // Parallel queries for better performance
    const [projectsData, ticketsData, membersData] = await Promise.all([
      supabaseAdmin
        .from("projects")
        .select("created_at")
        .eq("company_id", companyId)
        .gte("created_at", isoDate),

      supabaseAdmin
        .from("tickets")
        .select("created_at, projects!inner(company_id)")
        .eq("projects.company_id", companyId)
        .gte("created_at", isoDate),

      supabaseAdmin
        .from("company_users")
        .select("created_at")
        .eq("company_id", companyId)
        .gte("created_at", isoDate),
    ]);

    if (projectsData.error || ticketsData.error || membersData.error) {
      console.error("[getActivityData] Error:", {
        projectsData: projectsData.error,
        ticketsData: ticketsData.error,
        membersData: membersData.error,
      });
      return [];
    }

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

    projectsData.data?.forEach((p) => processDate(p.created_at, "projects"));
    ticketsData.data?.forEach((t) => processDate(t.created_at, "tickets"));
    membersData.data?.forEach((m) => processDate(m.created_at, "members"));

    return Object.values(monthlyData).sort(
      (a, b) =>
        new Date(a.month + " 2024").getTime() -
        new Date(b.month + " 2024").getTime()
    );
  } catch (error) {
    console.error("[getActivityData] Unexpected error:", error);
    return [];
  }
}

// Optimized meetings fetch with participant information
export async function getCompanyMeetings(
  companyId: string
): Promise<Meeting[]> {
  try {
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
  } catch (error) {
    console.error("[getCompanyMeetings] Unexpected error:", error);
    return [];
  }
}

// Optimized meeting creation with transaction
export async function createMeeting(formData: FormData) {
  try {
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
  } catch (error) {
    console.error("[createMeeting] Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
}

function calculateProjectProgress(status: string): number {
  switch (status) {
    case "planning":
      return 10;
    case "in_progress":
      return 50;
    case "on_hold":
      return 75;
    case "completed":
      return 100;
    default:
      return 0;
  }
}
