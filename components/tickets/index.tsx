/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { getTickets } from "@/actions/tickets";
import { CreateTicketDialog } from "@/components/tickets/create";
import { TicketsList } from "@/components/tickets/list";
import { Project, Ticket } from "@/types";
import { useCallback, useState } from "react";

interface TicketsClientPageProps {
  initialTickets: Ticket[];
  initialProjects: Project[];
  theme: string;
  companyId: string;
}

export function TicketsClientPage({
  initialTickets,
  initialProjects,
  theme,
  companyId,
}: TicketsClientPageProps) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const refreshData = useCallback(async () => {
    try {
      const updatedTickets = await getTickets(initialProjects.map((p) => p.id));
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    }
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <CreateTicketDialog
          projects={initialProjects}
          theme={theme}
          onTicketCreated={refreshData}
          companyId={companyId}
        />
      </div>
      <TicketsList tickets={tickets} onDataChange={refreshData} />
    </div>
  );
}
