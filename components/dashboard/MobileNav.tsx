import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { UserProfile } from "@/actions/dashboard";
import { CompanyBranding } from "@/components/dashboard/CompanyBranding";
import { NavigationItems } from "@/components/dashboard/NavigationItems";
import { UserProfileSection } from "@/components/dashboard/UserProfileSection";

export function MobileNav({ profile }: { profile: UserProfile }) {
  return (
    <div className="sticky top-0 z-50 flex items-center gap-4 p-4 bg-background border-b md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Icon icon="mdi-light:menu" className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <div className="h-full flex flex-col">
            <SidebarHeader className="p-6">
              <CompanyBranding company={profile.company} />
            </SidebarHeader>

            <SidebarContent className="px-3 overflow-y-auto flex-grow">
              <NavigationItems role={profile.role} />
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
              <UserProfileSection />
            </SidebarFooter>
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex-1 flex items-center gap-4">
        <CompanyBranding company={profile.company} />
      </div>
    </div>
  );
}
