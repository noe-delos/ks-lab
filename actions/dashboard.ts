/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

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

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedObjectives: number;
  urgentTickets: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  objectives_completed: number;
  urgent_tickets: number;
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

  // Fetch user's profile and company details in a single query
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

  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata.full_name,
    role: profile.company_users.role as "admin" | "manager" | "member",
    avatar_url: session.user.user_metadata?.avatar_url,
    company: {
      id: profile.id,
      name: profile.name,
      code: profile.company_code,
      icon_url: profile.icon_url,
      theme_color: profile.theme_color,
    },
  };
}

export async function getDashboardData() {
  const profile = await getUserProfile();
  if (!profile || !profile.company) return null;

  const { data: stats, error: statsError }: any = await supabaseAdmin
    .from("projects")
    .select(
      `
     count,
     active_count:count(status.eq.in_progress),
     objectives:project_objectives(count(status.eq.completed)),
     tickets:tickets(count(and(priority.eq.urgent,status.eq.open)))
   `
    )
    .eq("company_id", profile.company.id)
    .single();

  if (statsError) {
    console.error("[getDashboardData] Stats error:", statsError);
    return null;
  }

  const { data: projects, error: projectsError } = await supabaseAdmin
    .from("projects")
    .select(
      `
     id,
     name,
     description,
     status,
     created_at,
     objectives_completed:project_objectives(count(status.eq.completed)),
     urgent_tickets:tickets(count(and(priority.eq.urgent,status.eq.open)))
   `
    )
    .eq("company_id", profile.company.id)
    .order("created_at", { ascending: false })
    .limit(5);

  if (projectsError) {
    console.error("[getDashboardData] Projects error:", projectsError);
    return null;
  }

  return {
    stats: {
      totalProjects: stats?.count || 0,
      activeProjects: stats?.active_count || 0,
      completedObjectives: stats?.objectives[0]?.count || 0,
      urgentTickets: stats?.tickets[0]?.count || 0,
    },
    projects:
      projects?.map((p: any) => ({
        ...p,
        objectives_completed: p.objectives_completed[0]?.count || 0,
        urgent_tickets: p.urgent_tickets[0]?.count || 0,
      })) || [],
  };
}
