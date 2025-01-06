"use server";

import { supabaseAdmin } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";

export async function updateUserProfile(updates: {
  name?: string;
  avatar_url?: string;
}) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) throw new Error("Not authenticated");

  // Update auth.users metadata
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    session.user.id,
    {
      user_metadata: {
        full_name: updates.name,
        avatar_url: updates.avatar_url,
      },
    }
  );

  if (authError) throw authError;

  // Update public.users
  const { error: dbError } = await supabaseAdmin
    .from("users")
    .update({
      full_name: updates.name,
      profile_picture_url: updates.avatar_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id);

  if (dbError) throw dbError;

  return { success: true };
}

export async function uploadProfilePicture(file: File) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) throw new Error("Not authenticated");

  const fileExt = file.name.split(".").pop();
  const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
  const filePath = `profile-pictures/${fileName}`;

  // Convert File to ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();

  // Upload to storage
  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath);

  return { url: publicUrl };
}
