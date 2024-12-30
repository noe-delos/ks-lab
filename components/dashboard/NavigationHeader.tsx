/* eslint-disable @next/next/no-img-element */
"use client";

import { UserProfile } from "@/actions/dashboard";
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
};

export function NavigationHeader({ profile }: { profile: UserProfile }) {
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

    // Find matching nav item for current path
    const currentNavItem = mainNavItems.find((item) => item.href === pathname);
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
                isDashboard && index === 0
                  ? "text-gray-400 pointer-events-none"
                  : "text-gray-600 hover:text-gray-900 hover:underline"
              }`}
            >
              {item.isCompany ? (
                <img
                  src={profile.company?.icon_url || ""}
                  alt={companyName || "Company icon"}
                  width={16}
                  height={16}
                  className="rounded-sm"
                />
              ) : (
                <Icon icon={item.icon} className="w-4 h-4" />
              )}
              <span className="text-sm">{item.title}</span>
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
