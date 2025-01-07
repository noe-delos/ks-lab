/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tickets/[id]/page.tsx
import { getUserProfile } from "@/actions/dashboard";
import { getTicketById, getTicketComments } from "@/actions/tickets";
import { TicketDetailLayout } from "@/components/tickets/id";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TicketPage({ params }: any) {
  try {
    const [ticket, comments, profile] = await Promise.all([
      getTicketById(params.id),
      getTicketComments(params.id),
      getUserProfile(),
    ]);

    if (!ticket || !profile) {
      notFound();
    }

    // Get the project for this ticket
    const { data: project } = await supabaseAdmin
      .from("projects")
      .select("*")
      .eq("id", ticket.project_id)
      .single();

    return (
      <TicketDetailLayout
        ticket={{
          ...ticket,
          project,
          attachments: ticket.attachments || [],
        }}
        comments={comments}
        theme={profile.company?.theme_color || "#000000"}
        companyId={profile.company?.id as string}
      />
    );
  } catch (error) {
    console.error("Error loading ticket:", error);
    notFound();
  }
}
