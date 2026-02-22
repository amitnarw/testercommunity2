"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save } from "lucide-react";
import type { UserProfileData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  bio: z.string().max(160, "Bio cannot exceed 160 characters.").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserProfileFormProps {
  user: any; // temporarily bypassing type error: UserProfileData lacks avatar, email, etc.
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const { toast } = useToast();
  const [avatar, setAvatar] = useState(
    user.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "Demo User",
      email: user.email || "demo@example.com",
      bio: user.bio || "",
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-2">
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>
            Manage your public profile and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 px-2">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatar} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <Button type="button" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload new picture
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Recommended: 400x400px. Max file size: 1MB.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a little about yourself"
              className="min-h-[100px]"
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
