"use client";

import { signOutAction } from "@/actions/auth";
import { getUserProfile, type UserProfile } from "@/actions/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@iconify/react";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserProfileDialog } from "./UserProfileDialog";

export function UserProfileSection() {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 w-full p-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 w-full p-2 hover:bg-accent rounded-lg transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>{profile.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium">{profile.name}</span>
              <span className="text-xs text-muted-foreground capitalize">
                {profile.role}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 ml-auto" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 md:w-64"
          sideOffset={8}
        >
          <DropdownMenuItem onClick={() => setProfileDialogOpen(true)}>
            <Icon icon="mdi-light:user" className="w-4 h-4 mr-2" />
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem disabled className="opacity-50">
            <Icon icon="mdi-light:bell" className="w-4 h-4 mr-2" />
            Notifications
            <span className="ml-auto text-xs text-muted-foreground">Soon</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <form
            action={async () => {
              await signOutAction();
              router.push("/auth/login");
            }}
            method="post"
          >
            <DropdownMenuItem asChild>
              <button className="w-full flex items-center text-destructive">
                <Icon icon="mdi-light:logout" className="w-4 h-4 mr-2" />
                Sign out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>

      {profile && (
        <UserProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
          profile={profile}
        />
      )}
    </>
  );
}

export function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 w-full p-2">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
