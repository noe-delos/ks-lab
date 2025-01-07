/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types";
import { Icon } from "@iconify/react";
import { useState } from "react";

interface FilterState {
  status: Ticket["status"][];
  priority: Ticket["priority"][];
  hasAssignee: boolean | null;
  hasDueDate: boolean | null;
}

interface TicketsFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

const statusOptions = [
  {
    value: "backlog",
    label: "Backlog",
    icon: "lets-icons:progress",
    color: "text-zinc-400",
  },
  {
    value: "todo",
    label: "À faire",
    icon: "charm:circle",
    color: "text-zinc-600",
  },
  {
    value: "in_progress",
    label: "En cours",
    icon: "ri:progress-4-line",
    color: "text-yellow-500",
  },
  {
    value: "in_review",
    label: "En validation",
    icon: "ri:progress-5-line",
    color: "text-emerald-600",
  },
  {
    value: "done",
    label: "Terminé",
    icon: "mdi:check-circle",
    color: "text-blue-600",
  },
  {
    value: "canceled",
    label: "Annulé",
    icon: "mdi:close-circle-outline",
    color: "text-red-500",
  },
] as const;

const priorityOptions = [
  {
    value: "low",
    label: "Basse",
    icon: "healthicons:low-bars",
    color: "text-emerald-600",
  },
  {
    value: "medium",
    label: "Moyenne",
    icon: "healthicons:medium-bars",
    color: "text-yellow-500",
  },
  {
    value: "high",
    label: "Haute",
    icon: "healthicons:high-bars",
    color: "text-orange-500",
  },
  {
    value: "urgent",
    label: "Urgente",
    icon: "solar:danger-square-bold",
    color: "text-red-500",
  },
] as const;

type FilterView = "main" | "status" | "priority";

export function TicketsFilter({ onFilterChange }: TicketsFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    priority: [],
    hasAssignee: null,
    hasDueDate: null,
  });
  const [view, setView] = useState<FilterView>("main");
  const [open, setOpen] = useState(false);

  const handleFilterToggle = (
    category: "status" | "priority",
    value: string
  ) => {
    const currentFilters: any = filters[category];
    let newFilters: string[];

    if (currentFilters.includes(value)) {
      newFilters = currentFilters.filter((item: any) => item !== value);
    } else {
      newFilters = [...currentFilters, value];
    }

    const updatedFilters = {
      ...filters,
      [category]: newFilters,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleBooleanFilter = (
    category: "hasAssignee" | "hasDueDate",
    value: boolean | null
  ) => {
    const updatedFilters = {
      ...filters,
      [category]: filters[category] === value ? null : value,
    };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const activeFiltersCount = Object.values(filters).reduce(
    (count, value) =>
      count + (Array.isArray(value) ? value.length : value !== null ? 1 : 0),
    0
  );

  const renderMainView = () => (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-muted cursor-pointer"
        onClick={() => setView("status")}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:filter-variant" className="h-4 w-4" />
          <span className="text-sm font-medium">Statut</span>
        </div>
        {filters.status.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
            {filters.status.length}
          </span>
        )}
      </div>

      <div
        className="flex items-center justify-between rounded-md px-3 py-1.5 hover:bg-muted cursor-pointer"
        onClick={() => setView("priority")}
      >
        <div className="flex items-center gap-2">
          <Icon icon="mdi:priority-high" className="h-4 w-4" />
          <span className="text-sm font-medium">Priorité</span>
        </div>
        {filters.priority.length > 0 && (
          <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
            {filters.priority.length}
          </span>
        )}
      </div>

      <Separator className="my-1" />

      <div className="px-3">
        <h4 className="mb-1.5 text-sm font-medium text-muted-foreground">
          Autres filtres
        </h4>
        <div className="mx-0 px-0 border-none">
          <Command className="rounded-lg border-none shadow-none mx-0 px-0">
            <CommandList className="p-0 mx-0 px-0 border-none">
              <CommandGroup className="mx-0 px-0 border-none">
                <CommandItem
                  onSelect={() => handleBooleanFilter("hasAssignee", true)}
                  className="py-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:account-circle"
                      className={cn(
                        "h-4 w-4",
                        filters.hasAssignee === true
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm">Assignés uniquement</span>
                  </div>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleBooleanFilter("hasAssignee", false)}
                  className=" py-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:account-off"
                      className={cn(
                        "h-4 w-4",
                        filters.hasAssignee === false
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm">Non assignés uniquement</span>
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem
                  onSelect={() => handleBooleanFilter("hasDueDate", true)}
                  className=" py-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:calendar-clock"
                      className={cn(
                        "h-4 w-4",
                        filters.hasDueDate === true
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm">Avec date d'échéance</span>
                  </div>
                </CommandItem>
                <CommandItem
                  onSelect={() => handleBooleanFilter("hasDueDate", false)}
                  className=" py-1.5 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="mdi:calendar-remove"
                      className={cn(
                        "h-4 w-4",
                        filters.hasDueDate === false
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    />
                    <span className="text-sm">Sans date d'échéance</span>
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );

  const renderStatusView = () => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setView("main")}
        >
          <Icon icon="mdi:chevron-left" className="h-4 w-4" />
        </Button>
        <h4 className="text-sm font-medium">Filtrer par statut</h4>
      </div>
      <Command className="rounded-lg shadow-none">
        <CommandInput
          placeholder="Rechercher un statut..."
          className="px-3 py-1.5"
        />
        <CommandList>
          <CommandEmpty>Aucun statut trouvé.</CommandEmpty>
          <CommandGroup>
            {statusOptions.map((status) => (
              <CommandItem
                key={status.value}
                onSelect={() => handleFilterToggle("status", status.value)}
                className="px-3 py-1.5 cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2",
                    filters.status.includes(status.value) && "text-primary",
                    status.color
                  )}
                >
                  <Icon icon={status.icon} className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-sm",
                    filters.status.includes(status.value) && "font-medium"
                  )}
                >
                  {status.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );

  const renderPriorityView = () => (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setView("main")}
        >
          <Icon icon="mdi:chevron-left" className="h-4 w-4" />
        </Button>
        <h4 className="text-sm font-medium">Filtrer par priorité</h4>
      </div>
      <Command className="rounded-lg border-none shadow-none">
        <CommandInput
          placeholder="Rechercher une priorité..."
          className="px-3 py-1.5"
        />
        <CommandList>
          <CommandEmpty>Aucune priorité trouvée.</CommandEmpty>
          <CommandGroup>
            {priorityOptions.map((priority) => (
              <CommandItem
                key={priority.value}
                onSelect={() => handleFilterToggle("priority", priority.value)}
                className="px-3 py-1.5 cursor-pointer"
              >
                <div
                  className={cn(
                    "mr-2",
                    filters.priority.includes(priority.value) && "text-primary",
                    priority.color
                  )}
                >
                  <Icon icon={priority.icon} className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    "text-sm",
                    filters.priority.includes(priority.value) && "font-medium"
                  )}
                >
                  {priority.label}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Icon icon="mdi:filter-variant" className="mr-2 h-4 w-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        {view === "main" && renderMainView()}
        {view === "status" && renderStatusView()}
        {view === "priority" && renderPriorityView()}
      </PopoverContent>
    </Popover>
  );
}
