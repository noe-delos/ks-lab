/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getSearchResults } from "@/actions/search";
import { Icon } from "@iconify/react";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [results, setResults] = React.useState<{
    projects: any[];
    tickets: any[];
  }>({
    projects: [],
    tickets: [],
  });

  React.useEffect(() => {
    if (debouncedSearch) {
      getSearchResults(debouncedSearch).then(setResults);
    }
  }, [debouncedSearch]);

  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "material-symbols:dashboard-rounded",
    },
    { title: "Projects", href: "/dashboard/projects", icon: "ion:cube" },
    {
      title: "Tickets",
      href: "/dashboard/tickets",
      icon: "iconoir:mail-solid",
    },
    {
      title: "Calendar",
      href: "/dashboard/calendar",
      icon: "basil:calendar-solid",
      disabled: true,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: "mdi:google-analytics",
      disabled: true,
    },
  ];

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => {
                if (!item.disabled) {
                  router.push(item.href);
                  onOpenChange(false);
                }
              }}
              disabled={item.disabled}
            >
              <Icon icon={item.icon} className="w-4 h-4 mr-2" />
              {item.title}
              {item.disabled && (
                <span className="ml-2 text-sm text-muted-foreground">
                  (Coming soon)
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        {results.projects.length > 0 && (
          <CommandGroup heading="Projects">
            {results.projects.map((project) => (
              <CommandItem
                key={project.id}
                onSelect={() => {
                  router.push(`/dashboard/projects/${project.id}`);
                  onOpenChange(false);
                }}
              >
                <Icon icon="ion:cube" className="w-4 h-4 mr-2" />
                {project.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.tickets.length > 0 && (
          <CommandGroup heading="Tickets">
            {results.tickets.map((ticket) => (
              <CommandItem
                key={ticket.id}
                onSelect={() => {
                  router.push(`/dashboard/tickets/${ticket.id}`);
                  onOpenChange(false);
                }}
              >
                <Icon icon="iconoir:mail-solid" className="w-4 h-4 mr-2" />
                {ticket.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
