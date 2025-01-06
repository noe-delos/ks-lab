"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

type UpdateCompanyInput = {
  name: string;
  theme_color: string;
  icon?: File;
};

export async function updateCompany(
  companyId: string,
  input: UpdateCompanyInput
) {
  try {
    let icon_url = undefined;

    // Handle icon upload if provided
    if (input.icon) {
      const fileExt = input.icon.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabaseAdmin.storage
        .from("company-icons")
        .upload(fileName, input.icon);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabaseAdmin.storage.from("company-icons").getPublicUrl(fileName);

      icon_url = publicUrl;
    }

    // Update company data
    const { error: updateError } = await supabaseAdmin
      .from("companies")
      .update({
        name: input.name,
        theme_color: input.theme_color,
        ...(icon_url && { icon_url }),
        updated_at: new Date().toISOString(),
      })
      .eq("id", companyId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { success: false, error };
  }
}
