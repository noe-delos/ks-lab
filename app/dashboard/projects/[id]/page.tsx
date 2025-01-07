/* eslint-disable @typescript-eslint/no-explicit-any */
import { getUserProfile } from "@/actions/dashboard";
import { getProject } from "@/actions/project";
import ProjectDetails from "@/components/projects/project/";

export default async function ProjectPage({ params }: any) {
  // Convert params to string and validate
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;

  const profile = await getUserProfile();

  if (!profile) return null;

  if (!projectId) {
    return <div>Invalid project ID</div>;
  }

  try {
    const project = await getProject(projectId);

    if (!project) {
      return <div>Project not found</div>;
    }

    return (
      <ProjectDetails
        project={project}
        theme={profile.company?.theme_color as string}
      />
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    return <div>Error loading project</div>;
  }
}
