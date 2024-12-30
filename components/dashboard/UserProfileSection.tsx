import { getUserProfile } from "@/actions/dashboard";
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

export async function UserProfileSection() {
  const profile = await getUserProfile();
  if (!profile) return null;

  return (
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
      <DropdownMenuContent align="end" className="w-56 md:w-64" sideOffset={8}>
        <DropdownMenuItem>
          <Icon icon="mdi-light:user" className="w-4 h-4 mr-2" />
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="mdi-light:clock" className="w-4 h-4 mr-2" />
          Activity Log
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="mdi-light:bell" className="w-4 h-4 mr-2" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icon icon="mdi-light:help-circle" className="w-4 h-4 mr-2" />
          Help & Support
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action="/auth/signout" method="post">
          <DropdownMenuItem asChild>
            <button className="w-full flex items-center text-destructive">
              <Icon icon="mdi-light:logout" className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
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
