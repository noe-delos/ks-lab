// app/api/auth/verify-company/route.ts
import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { companyCode } = await req.json();
    console.log("Verifying company code:", companyCode);

    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("id, name")
      .eq("company_code", companyCode)
      .single();

    console.log("Query result:", { data, error });

    if (error) {
      console.error("Database error:", error);
      throw error;
    }

    if (!data) {
      return NextResponse.json(
        { error: "Invalid company code" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Failed to verify company code" },
      { status: 500 }
    );
  }
}
