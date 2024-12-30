// app/dashboard/page.tsx
import { getUserProfile } from "@/actions/dashboard";
import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
  const profile = await getUserProfile();
  if (!profile) return null;

  return (
    <div className="p-6 space-y-6 size-full">
      <DashboardView profile={profile} />
    </div>
  );
}
