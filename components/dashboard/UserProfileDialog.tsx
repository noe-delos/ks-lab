"use client";

import { UserProfile } from "@/actions/dashboard";
import { updateUserProfile, uploadProfilePicture } from "@/actions/users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function UserProfileDialog({
  open,
  onOpenChange,
  profile,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
}) {
  const [fullName, setFullName] = useState(profile.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.avatar_url || null
  );
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Handle file upload if there's a new image
      const fileInput = (e.target as HTMLFormElement).querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      let newAvatarUrl = profile.avatar_url;

      if (fileInput.files?.length) {
        const uploadResponse = await uploadProfilePicture(fileInput.files[0]);
        newAvatarUrl = uploadResponse.url;
      }

      // Update user profile
      await updateUserProfile({
        name: fullName,
        avatar_url: newAvatarUrl,
      });

      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={
                  (profile.avatar_url as string) || (avatarPreview as string)
                }
              />
              <AvatarFallback>{profile.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label htmlFor="picture" className="text-center block">
                Profile Picture
              </Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={profile.email} disabled />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Input value={profile.role} disabled className="capitalize" />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
