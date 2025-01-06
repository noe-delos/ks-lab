"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";

export async function getSearchResults(query: string) {
  const { data: projects } = await supabaseAdmin
    .from("projects")
    .select("id, name")
    .ilike("name", `%${query}%`)
    .limit(5);

  const { data: tickets } = await supabaseAdmin
    .from("tickets")
    .select("id, title")
    .ilike("title", `%${query}%`)
    .limit(5);

  return {
    projects: projects || [],
    tickets: tickets || [],
  };
}
