import Projects from "@/components/projects";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default async function Page() {
  // Get the current user and their company_id

  // Fetch projects for the user's company
  const { data: projects, error: projectsError } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    return <div>Error loading projects</div>;
  }

  return <Projects initialProjects={projects} />;
}
