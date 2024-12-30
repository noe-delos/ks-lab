// app/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session, redirect to login
  if (!session) {
    redirect("/auth/login");
  }

  // If there is a session, redirect to dashboard
  redirect("/dashboard");
}
