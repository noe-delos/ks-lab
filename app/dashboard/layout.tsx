// app/dashboard/layout.tsx
import { getUserProfile } from "@/actions/dashboard";
import {
  CompanyBranding,
  CompanyBrandingSkeleton,
} from "@/components/dashboard/CompanyBranding";
import { MobileNav } from "@/components/dashboard/MobileNav";
import { NavigationHeader } from "@/components/dashboard/NavigationHeader";
import { NavigationItems } from "@/components/dashboard/NavigationItems";
import {
  UserProfileSection,
  UserProfileSkeleton,
} from "@/components/dashboard/UserProfileSection";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Suspense } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getUserProfile();
  if (!profile) return null;

  return (
    <div className="h-full bg-[hsl(var(--background))]">
      <SidebarProvider>
        {/* Large screen layout - unchanged */}
        <div className="hidden lg:flex">
          <Sidebar className="bg-[hsl(var(--background))] border-none">
            <SidebarHeader className="p-6">
              <Suspense fallback={<CompanyBrandingSkeleton />}>
                <CompanyBranding company={profile.company} />
              </Suspense>
            </SidebarHeader>

            <SidebarContent className="px-3">
              <NavigationItems role={profile.role} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
              <Suspense fallback={<UserProfileSkeleton />}>
                <UserProfileSection />
              </Suspense>
            </SidebarFooter>
          </Sidebar>
        </div>
        <main className="overflow-hidden hidden md:block w-full p-6 pl-0 pb-0 pr-0 ">
          <div className="bg-card rounded-tl-2xl border shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] h-full">
            <NavigationHeader profile={profile} />
            {children}
          </div>
        </main>

        {/* Mobile layout */}
        <div className="flex flex-col lg:hidden">
          <MobileNav profile={profile} />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
}
