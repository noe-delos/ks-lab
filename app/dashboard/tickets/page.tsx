import { getUserProfile } from "@/actions/dashboard";
import { getTickets } from "@/actions/tickets";
import { TicketsClientPage } from "@/components/tickets";
import { Project } from "@/types";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default async function TicketsPage() {
  const profile = await getUserProfile();
  if (!profile) return null;

  const { data: projects } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("company_id", profile.company?.id)
    .order("created_at", { ascending: false });

  const tickets = await getTickets(projects?.map((p) => p.id) || []);

  return (
    <TicketsClientPage
      initialTickets={tickets}
      initialProjects={projects as Project[]}
      theme={profile.company?.theme_color as string}
      companyId={profile.company?.id as string}
    />
  );
}
