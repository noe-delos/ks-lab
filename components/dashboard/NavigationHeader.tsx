/* eslint-disable @next/next/no-img-element */
"use client";

import { updateCompany } from "@/actions/company";
import { Project, UserProfile } from "@/actions/dashboard";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainNavItems } from "@/config/navigation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

type CompanyFormData = {
  name: string;
  theme_color: string;
  icon?: File;
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyFormData>({
    name: profile.company?.name || "",
    theme_color: profile.company?.theme_color || "#0066FF",
  });
  const [previewIcon, setPreviewIcon] = useState<string | null>(
    profile.company?.icon_url || null
  );

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData({ ...formData, icon: file });
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      breadcrumbs.push({
        title: "Projects",
        href: "/dashboard/projects",
        icon: "ion:cube",
      });

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
      breadcrumbs.push({
        title: "Tickets",
        href: "/dashboard/tickets",
        icon: "solar:ticket-bold-duotone",
      });

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

  const handleSaveSettings = async () => {
    if (!profile.company?.id) return;

    setIsLoading(true);
    try {
      const result = await updateCompany(profile.company.id, formData);

      if (!result.success) {
        throw new Error("Failed to update company");
      }

      toast.success("Company settings updated successfully");
      setIsSettingsOpen(false);
    } catch (error) {
      toast.error("Failed to update company settings");
      console.error("Failed to save company settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = getBreadcrumbs();
  const isDashboard = pathname === "/dashboard";

  return (
    <>
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
                  (isDashboard && index === 0) ||
                  item.isProject ||
                  item.isTicket
                    ? "text-gray-400 pointer-events-none"
                    : "text-gray-600 hover:text-gray-900 hover:underline"
                }`}
              >
                {item.isCompany ? (
                  <img
                    src={profile.company?.icon_url || "/placeholder.png"}
                    alt="Company icon"
                    width={16}
                    height={16}
                    className="rounded-sm object-cover"
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
            onClick={() => setIsSettingsOpen(true)}
          >
            <Icon icon="solar:settings-bold-duotone" className="w-4 h-4" />
            <span className="text-sm">Paramètres</span>
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

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Company Settings</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Theme Color</Label>
              <ColorPicker
                value={formData.theme_color}
                onChange={(color) =>
                  setFormData({ ...formData, theme_color: color })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Company Icon</Label>
              <div className="flex items-center gap-4">
                {previewIcon && (
                  <img
                    src={previewIcon}
                    alt="Company icon preview"
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-gray-500">
                Recommended: Square image, max 5MB
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
