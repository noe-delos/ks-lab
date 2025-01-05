"use client";

import { Project, UserProfile } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { mainNavItems } from "@/config/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type BreadcrumbItem = {
  title: string;
  href: string;
  icon: string;
  isCompany?: boolean;
  isNew?: boolean;
  isProject?: boolean;
  isTicket?: boolean;
  pictureUrl?: string;
};

export function NavigationHeader({
  profile,
  projects,
}: {
  profile: UserProfile;
  projects: Project[];
}) {
  const pathname = usePathname();
  const companyName = profile.company?.name;

  // Generate breadcrumb items based on current path
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Add dashboard as first item
    breadcrumbs.push({
      title: "Dashboard",
      href: "/dashboard",
      icon: "material-symbols:dashboard-rounded",
    });

    // Add company info if we're on dashboard root
    if (paths.length === 1 && paths[0] === "dashboard") {
      breadcrumbs.push({
        title: companyName ?? "",
        href: "#",
        icon: "lucide:building",
        isCompany: true,
      });
      return breadcrumbs;
    }

    // Handle projects section
    if (paths.includes("projects")) {
      // Add Projects nav item
      breadcrumbs.push({
        title: "Projects",
        href: "/dashboard/projects",
        icon: "ion:cube",
      });

      // If we're on a specific project page
      if (paths.length > 2 && paths[1] === "projects") {
        const projectId = paths[2];
        const currentProject = projects.find((p) => p.id === projectId);

        if (currentProject) {
          breadcrumbs.push({
            title: currentProject.name,
            href: `/dashboard/projects/${currentProject.id}`,
            icon: "ion:cube",
            isProject: true,
            pictureUrl: currentProject.picture_url,
          });
        }
      }

      return breadcrumbs;
    }

    // Handle tickets section
    if (paths.includes("tickets")) {
      // Add Tickets nav item
      breadcrumbs.push({
        title: "Tickets",
        href: "/dashboard/tickets",
        icon: "solar:ticket-bold-duotone",
      });

      // If we're on a specific ticket page
      if (paths.length > 2 && paths[1] === "tickets") {
        const ticketId = paths[2];
        breadcrumbs.push({
          title: `Ticket ${ticketId.slice(0, 8)}...`,
          href: `/dashboard/tickets/${ticketId}`,
          icon: "solar:ticket-bold-duotone",
          isTicket: true,
        });
      }

      return breadcrumbs;
    }

    // Handle other nav sections
    const currentNavItem = mainNavItems.find((item) =>
      pathname.startsWith(item.href)
    );
    if (currentNavItem) {
      breadcrumbs.push(currentNavItem as BreadcrumbItem);
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const isDashboard = pathname === "/dashboard";

  return (
    <div className="w-full px-6 py-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {breadcrumbs.map((item, index) => (
          <div key={item.href} className="flex items-center">
            {index > 0 && (
              <Icon
                icon="material-symbols:chevron-right-rounded"
                className="mx-2 text-gray-400"
                width="16"
                height="16"
              />
            )}
            <Link
              href={item.href}
              className={`flex items-center gap-2 ${
                (isDashboard && index === 0) || item.isProject || item.isTicket
                  ? "text-gray-400 pointer-events-none"
                  : "text-gray-600 hover:text-gray-900 hover:underline"
              }`}
            >
              {item.isCompany ? (
                <Icon
                  icon={profile.company?.icon_url || ""}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              ) : item.isProject && item.pictureUrl ? (
                <Icon
                  icon={item.pictureUrl}
                  width={16}
                  height={16}
                  className="rounded-sm object-cover"
                />
              ) : (
                <Icon
                  icon={item.icon}
                  className={`w-4 h-4 ${
                    item.isProject || item.isTicket ? "text-blue-500" : ""
                  }`}
                />
              )}
              <span
                className={`text-sm ${
                  item.isProject || item.isTicket ? "font-medium" : ""
                }`}
              >
                {item.title}
              </span>
              {item.isNew && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  New
                </span>
              )}
            </Link>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-8"
          onClick={() => {}}
        >
          <Icon icon="jam:settings-alt" className="w-4 h-4" />
          <span className="text-sm">Manage</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 h-8"
          disabled
        >
          <Icon icon="icon-park-outline:share" className="w-4 h-4" />
          <span className="text-sm">Share</span>
        </Button>
      </div>
    </div>
  );
}
