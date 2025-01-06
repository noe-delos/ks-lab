/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { type UserProfile } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mainNavItems } from "@/config/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationItems({}: { role: UserProfile["role"] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [projectCount, setProjectCount] = useState(0);
  const [ticketCount, setTicketCount] = useState(0);
  const [searchResults, setSearchResults] = useState<{
    projects: any[];
    tickets: any[];
  }>({
    projects: [],
    tickets: [],
  });

  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCounts = async () => {
      const { count: projectsCount } = await supabaseAdmin
        .from("projects")
        .select("*", { count: "exact", head: true });

      const { count: ticketsCount } = await supabaseAdmin
        .from("tickets")
        .select("*", { count: "exact", head: true });

      if (projectsCount !== null) setProjectCount(projectsCount);
      if (ticketsCount !== null) setTicketCount(ticketsCount);
    };

    fetchCounts();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearch) {
        const { data: projects } = await supabaseAdmin
          .from("projects")
          .select("id, name")
          .ilike("name", `%${debouncedSearch}%`)
          .limit(5);

        const { data: tickets } = await supabaseAdmin
          .from("tickets")
          .select("id, title")
          .ilike("title", `%${debouncedSearch}%`)
          .limit(5);

        setSearchResults({
          projects: projects || [],
          tickets: tickets || [],
        });
      }
    };

    fetchSearchResults();
  }, [debouncedSearch]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchDialogOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") {
      return true;
    }
    return pathname.startsWith(href) && href !== "/dashboard";
  };

  return (
    <div className="flex flex-col gap-0 justify-between h-full pt-5">
      <div className="mb-0">
        <div className="px-2 relative">
          <Icon
            icon="iconamoon:search"
            className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          />
          <Input
            placeholder="Rechercher..."
            onClick={() => setSearchDialogOpen(true)}
            readOnly
            className="w-full text-sm h-9 border-zinc-300 bg-zinc-100 rounded-[0.5rem] pl-9 pr-16 cursor-pointer"
          />
          <div className="absolute right-5 top-1/2 text-zinc-400 -translate-y-1/2 bg-white px-1.5 focus:ring-0 py-0.5 rounded text-xs font-medium border border-zinc-200">
            ⌘K
          </div>
        </div>

        <CommandDialog
          open={searchDialogOpen}
          onOpenChange={setSearchDialogOpen}
        >
          <CommandInput
            placeholder="Search..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Navigation">
              {mainNavItems.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    if (!item.disabled) {
                      router.push(item.href);
                      setSearchDialogOpen(false);
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

            {searchResults.projects.length > 0 && (
              <CommandGroup heading="Projects">
                {searchResults.projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    onSelect={() => {
                      router.push(`/dashboard/projects/${project.id}`);
                      setSearchDialogOpen(false);
                    }}
                  >
                    <Icon icon="ion:cube" className="w-4 h-4 mr-2" />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {searchResults.tickets.length > 0 && (
              <CommandGroup heading="Tickets">
                {searchResults.tickets.map((ticket) => (
                  <CommandItem
                    key={ticket.id}
                    onSelect={() => {
                      router.push(`/dashboard/tickets/${ticket.id}`);
                      setSearchDialogOpen(false);
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-1">
                  <SidebarMenuButton
                    onClick={() => !item.disabled && router.push(item.href)}
                    className={cn(
                      "relative py-4 w-full",
                      item.disabled ? "opacity-50 cursor-not-allowed" : "",
                      isActiveRoute(item.href)
                        ? "bg-white rounded-lg shadow-sm border border-zinc-100"
                        : ""
                    )}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row items-center gap-2">
                        <Icon
                          icon={item.icon}
                          className={cn(
                            "w-5 h-5",
                            isActiveRoute(item.href)
                              ? "text-zinc-900"
                              : "text-zinc-400"
                          )}
                        />
                        <span
                          className={cn(
                            isActiveRoute(item.href)
                              ? "text-zinc-900"
                              : "text-zinc-500"
                          )}
                        >
                          {item.title === "Dashboard" && "Tableau de bord"}
                          {item.title === "Projects" &&
                            `Projets (${projectCount})`}
                          {item.title === "Tickets" &&
                            `Tickets (${ticketCount})`}
                          {item.title === "Calendar" && "Calendrier"}
                          {item.title === "Analytics" && "Analyses"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.isNew && (
                          <Badge
                            variant="default"
                            className="bg-white hover:bg-white rounded-md mx-0 w-fit px-2 self-center text-black border-zinc-200"
                          >
                            Soon !
                          </Badge>
                        )}
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>

      <SidebarGroup className="mt-auto">
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
          Support
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  (window.location.href = "mailto:support@yourdomain.com")
                }
              >
                <Icon
                  icon="mynaui:message-solid"
                  className="w-5 h-5 text-zinc-400"
                />
                <span>Contacter le support</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => {}}
                className="relative flex justify-between items-center opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mingcute:notification-fill"
                    className="w-5 h-5 text-zinc-400"
                  />
                  <span>Notifications</span>
                </div>
                <Badge
                  variant="destructive"
                  className="h-5 w-5 flex items-center justify-center p-0 bg-red-500 border border-red-200"
                >
                  3
                </Badge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
