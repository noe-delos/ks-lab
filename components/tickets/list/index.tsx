/* eslint-disable react/no-unescaped-entities */
"use client";

import { updateTicketPriority, updateTicketStatus } from "@/actions/tickets";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { priority, Ticket } from "@/types";
import { Icon } from "@iconify/react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TicketsFilter } from "./filter";

const statusIcons: Record<Ticket["status"], { icon: string; color: string }> = {
  backlog: { icon: "lets-icons:progress", color: "text-zinc-400" },
  todo: { icon: "charm:circle", color: "text-zinc-600" },
  in_progress: { icon: "ri:progress-4-line", color: "text-yellow-500" },
  in_review: { icon: "ri:progress-5-line", color: "text-emerald-600" },
  done: { icon: "mdi:check-circle", color: "text-blue-600" },
  canceled: { icon: "mdi:close-circle", color: "text-red-500" },
};

const priorityIcons: Record<
  Ticket["priority"],
  { icon: string; color: string }
> = {
  low: { icon: "healthicons:low-bars", color: "text-emerald-600" },
  medium: { icon: "healthicons:medium-bars", color: "text-yellow-500" },
  high: { icon: "healthicons:high-bars", color: "text-orange-500" },
  urgent: { icon: "solar:danger-square-bold", color: "text-red-500" },
};

const statusOrder: Ticket["status"][] = [
  "todo",
  "in_progress",
  "in_review",
  "done",
  "backlog",
  "canceled",
];

interface TicketsListProps {
  tickets: Ticket[];
  onDataChange: () => Promise<void>;
  listClassname?: string;
}

export function TicketsList({
  tickets: initialTickets,
  onDataChange,
  listClassname,
}: TicketsListProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const router = useRouter();

  useEffect(() => {
    setTickets(initialTickets);
    setFilteredTickets(initialTickets);
  }, [initialTickets]);

  const handleStatusChange = async (
    ticketId: string,
    newStatus: Ticket["status"]
  ) => {
    try {
      await updateTicketStatus(ticketId, newStatus);
      if (onDataChange) {
        await onDataChange();
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (
    ticketId: string,
    newPriority: string
  ) => {
    try {
      await updateTicketPriority(ticketId, newPriority as priority);
      if (onDataChange) {
        await onDataChange();
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleFilterChange = useCallback(
    (filters: {
      status: Ticket["status"][];
      priority: Ticket["priority"][];
      hasAssignee: boolean | null;
      hasDueDate: boolean | null;
    }) => {
      const filtered = tickets.filter((ticket) => {
        if (
          filters.status.length > 0 &&
          !filters.status.includes(ticket.status)
        ) {
          return false;
        }

        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(ticket.priority)
        ) {
          return false;
        }

        if (filters.hasAssignee !== null) {
          const hasAssignee = !!ticket.assigned_to_user;
          if (hasAssignee !== filters.hasAssignee) {
            return false;
          }
        }

        if (filters.hasDueDate !== null) {
          const hasDueDate = !!ticket.due_date;
          if (hasDueDate !== filters.hasDueDate) {
            return false;
          }
        }

        return true;
      });

      setFilteredTickets(filtered);
    },
    [tickets]
  );

  // Group tickets by status
  const ticketsByStatus = statusOrder.reduce((acc, status) => {
    acc[status] = filteredTickets.filter((ticket) => ticket.status === status);
    return acc;
  }, {} as Record<Ticket["status"], Ticket[]>);

  // Get global ticket index
  const getTicketIndex = (ticketId: string) => {
    return tickets.findIndex((t) => t.id === ticketId) + 1;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4">
        <TicketsFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="flex-1 overflow-hidden rounded-xl bg-zinc-100">
        {tickets.length === 0 ? (
          <div
            className={`flex grow items-center justify-center text-zinc-500 ${
              listClassname ? "h-[30vh]" : "h-[68vh]"
            }`}
          >
            Aucun tickets enregistrés
          </div>
        ) : (
          <div className={"h-full overflow-auto p-4" + " " + listClassname}>
            {statusOrder.map((status) => {
              const statusTickets = ticketsByStatus[status];
              if (statusTickets.length === 0) return null;

              return (
                <div key={status} className="mb-6 last:mb-0">
                  <div className="mb-2 flex items-center gap-2 px-4">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Icon
                              icon={statusIcons[status].icon}
                              className={`h-5 w-5 ${statusIcons[status].color}`}
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Statut: {status.replace("_", " ")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <h3 className="font-medium">
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("_", " ")}
                      <span className="ml-2 text-sm text-zinc-500">
                        ({statusTickets.length})
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-1">
                    {statusTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() =>
                          router.push(`/dashboard/tickets/${ticket.id}`)
                        }
                        className="flex cursor-pointer items-center gap-4 rounded-lg bg-white p-4 hover:bg-zinc-50"
                      >
                        <div className="flex w-fit items-center gap-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="text-base font-mono font-medium text-zinc-500">
                                  #{getTicketIndex(ticket.id)}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ID: {ticket.id}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Icon
                                        icon={
                                          priorityIcons[ticket.priority].icon
                                        }
                                        className={`h-5 w-5 ${
                                          priorityIcons[ticket.priority].color
                                        }`}
                                      />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {Object.keys(priorityIcons).map(
                                      (priority) => (
                                        <DropdownMenuItem
                                          key={priority}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handlePriorityChange(
                                              ticket.id,
                                              priority
                                            );
                                          }}
                                        >
                                          <Icon
                                            icon={
                                              priorityIcons[
                                                priority as Ticket["priority"]
                                              ].icon
                                            }
                                            className={`h-4 w-4 mr-2 ${
                                              priorityIcons[
                                                priority as Ticket["priority"]
                                              ].color
                                            }`}
                                          />
                                          {priority.charAt(0).toUpperCase() +
                                            priority.slice(1)}
                                        </DropdownMenuItem>
                                      )
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Priorité: {ticket.priority}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenu>
                                  <DropdownMenuTrigger
                                    asChild
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Icon
                                        icon={statusIcons[ticket.status].icon}
                                        className={`h-5 w-5 ${
                                          statusIcons[ticket.status].color
                                        }`}
                                      />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    {Object.keys(statusIcons).map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStatusChange(
                                            ticket.id,
                                            status as Ticket["status"]
                                          );
                                        }}
                                      >
                                        <Icon
                                          icon={
                                            statusIcons[
                                              status as Ticket["status"]
                                            ].icon
                                          }
                                          className={`h-4 w-4 mr-2 ${
                                            statusIcons[
                                              status as Ticket["status"]
                                            ].color
                                          }`}
                                        />
                                        {status.charAt(0).toUpperCase() +
                                          status.slice(1).replace("_", " ")}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Statut: {ticket.status.replace("_", " ")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="flex-1">
                          <div className="text-lg font-medium">
                            {ticket.title}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500">
                            {ticket.labels && ticket.labels?.length > 0 && (
                              <>
                                <span>•</span>
                                <div className="flex gap-1">
                                  {ticket.labels.map((label) => (
                                    <Badge
                                      key={label}
                                      variant="secondary"
                                      className="bg-zinc-100"
                                    >
                                      {label}
                                    </Badge>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-zinc-500">
                                  <Icon
                                    icon="gridicons:attachment"
                                    className="h-5 w-5"
                                  />
                                  <span className="text-sm font-medium">
                                    {ticket.attachments_count || 0}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {ticket.attachments_count || 0} pièces jointes
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1 text-zinc-500">
                                  <Icon
                                    icon="iconamoon:comment-light"
                                    className="h-5 w-5"
                                  />
                                  <span className="text-sm font-medium">
                                    {ticket.comments_count || 0}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {ticket.comments_count || 0} commentaire
                                  {ticket.comments_count !== 1 ? "s" : ""}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          {ticket.due_date && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-sm font-medium text-zinc-500">
                                    {format(
                                      new Date(ticket.due_date),
                                      "MMM d, yyyy"
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Date d'échéance</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}

                          {ticket.assigned_to_user && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                      {ticket.assigned_to_user.email &&
                                        ticket.assigned_to_user.email[0].toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    Assigné à: {ticket.assigned_to_user.email}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
