/* eslint-disable @next/next/no-img-element */
import { type UserProfile } from "@/actions/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyBranding({
  company,
}: {
  company: UserProfile["company"];
}) {
  if (!company) return null;

  return (
    <div className="flex items-center gap-3">
      {company.icon_url ? (
        <img
          src={company.icon_url}
          alt={company.name}
          className="size-9 rounded-lg"
        />
      ) : (
        <div
          className="w-8 h-8 md:w-12 md:h-12 rounded-lg"
          style={{ backgroundColor: company.theme_color }}
        />
      )}
      <div className="flex flex-col">
        <span className="text-lg md:text-lg font-semibold truncate">
          {company.name}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground hidden md:block">
          Enterprise
        </span>
      </div>
    </div>
  );
}

export function CompanyBrandingSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
