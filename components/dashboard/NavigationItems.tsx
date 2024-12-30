/* eslint-disable react/no-unescaped-entities */
"use client";

import { type UserProfile } from "@/actions/dashboard";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function NavigationItems({ role }: { role: UserProfile["role"] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm h-9 border-zinc-300 bg-zinc-100 rounded-[0.5rem] pl-9 pr-16"
          />
          <div className="absolute right-5 top-1/2 text-zinc-400 -translate-y-1/2 bg-white px-1.5 focus:ring-0 py-0.5 rounded text-xs font-medium border border-zinc-200">
            ⌘K
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mt-1">
                  <SidebarMenuButton
                    onClick={() => router.push(item.href)}
                    className={cn(
                      "relative py-4 w-full",
                      pathname === item.href
                        ? "bg-white rounded-lg shadow-sm border border-zinc-100"
                        : ""
                    )}
                  >
                    <div className="flex flex-row justify-between w-full items-center">
                      <div className="flex flex-row items-center gap-2">
                        <Icon
                          icon={item.icon}
                          className={cn(
                            "w-5 h-5 text-zinc-900",
                            pathname === item.href
                              ? "text-zinc-900"
                              : "text-zinc-400"
                          )}
                        />
                        <span
                          className={cn(
                            pathname === item.href
                              ? "text-zinc-900"
                              : "text-zinc-500"
                          )}
                        >
                          {item.title === "Dashboard" && "Tableau de bord"}
                          {item.title === "Projects" && "Projets"}
                          {item.title === "Tickets" && "Tickets"}
                          {item.title === "Calendar" && "Calendrier"}
                          {item.title === "Analytics" && "Analyses"}
                          {item.title === "Monitoring" && "Surveillance"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 self-end">
                        {item.title === "Projects" && (
                          <span
                            className={cn(
                              pathname === item.href
                                ? "text-zinc-900"
                                : "text-zinc-500"
                            )}
                          >
                            12
                          </span>
                        )}
                        {item.title === "Tickets" && (
                          <span
                            className={cn(
                              pathname === item.href
                                ? "text-zinc-900"
                                : "text-zinc-500"
                            )}
                          >
                            5
                          </span>
                        )}
                        {item.isNew && (
                          <Badge
                            variant="default"
                            className="bg-white rounded-md mx-0 w-fit px-2 self-center text-black border-zinc-200"
                          >
                            Nouveau
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

      {role === "admin" && (
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => router.push("/dashboard/settings")}
                  className={cn(
                    pathname === "/dashboard/settings"
                      ? "bg-white rounded-lg shadow-sm border border-zinc-100"
                      : "text-zinc-500"
                  )}
                >
                  <Icon
                    icon="mdi-light:cog"
                    className={cn(
                      "w-5 h-5",
                      pathname === "/dashboard/settings"
                        ? "text-zinc-900"
                        : "text-zinc-400"
                    )}
                  />
                  <span>Paramètres</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      <SidebarGroup className="mt-auto">
        <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
          Support
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push("/dashboard/help")}>
                <Icon
                  icon="material-symbols:help-rounded"
                  className="w-5 h-5 text-zinc-400"
                />
                <span>Centre d'aide</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => router.push("/dashboard/contact")}
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
                onClick={() => router.push("/dashboard/notifications")}
                className="relative flex justify-between items-center"
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
