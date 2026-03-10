"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, Save, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useUserProfileData } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { TransitionLink } from "@/components/transition-link";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name is required."),
  last_name: z.string().min(2, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface UserDataFormProps {
  title?: string;
  showAdvancedSetup?: boolean;
}

export function UserDataForm({ title = "User data", showAdvancedSetup = true }: UserDataFormProps) {
  const { data: session, isPending } = authClient.useSession();

  const { toast } = useToast();
  const [avatar, setAvatar] = useState("");

  const {
    data: userProfileData,
    isPending: userProfileIsPending,
    isError: userProfileIsError,
    error: userProfileError,
    refetch: userProfileRefetch,
  } = useUserProfileData();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      country: "",
    },
  });

  useEffect(() => {
    userProfileRefetch();
  }, [userProfileRefetch]);

  useEffect(() => {
    if (!userProfileIsPending && !isPending && userProfileData && session) {
      reset({
        first_name: userProfileData.first_name,
        last_name: userProfileData.last_name,
        email: session.user.email,
        phone: userProfileData.phone,
        country: userProfileData.country,
      });
    }
  }, [userProfileIsPending, isPending, userProfileData, session, reset]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        toast({
          title: "Avatar Updated",
          description: "Your new profile picture has been set.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <Card className="overflow-hidden rounded-2xl shadow-xl shadow-primary/5 border border-dashed">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="md:col-span-1 bg-secondary/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
          <Label
            htmlFor="avatar-upload"
            className="relative cursor-pointer group"
          >
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg group-hover:opacity-80 transition-opacity">
              <AvatarImage src={avatar} />
              <AvatarFallback>{session?.user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="h-8 w-8 text-white" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm transition-opacity duration-300"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <h2 className="text-lg sm:text-xl font-bold mt-4">
            {session?.user?.name}
          </h2>
          <p className="text-muted-foreground text-sm">
            {session?.user?.email}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-2">
          <CardHeader className="px-3 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl flex items-center justify-between">
              {title}
            </CardTitle>
            <CardDescription>
              Manage your public profile and account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input id="first_name" {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" {...register("phone")} />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register("country")} />
                {errors.country && (
                  <p className="text-xs text-destructive">
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {showAdvancedSetup && (
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-lg bg-secondary/50 p-2 sm:p-4">
                <div className="text-center sm:text-start">
                  <h4 className="font-semibold">Advanced Profile Setup</h4>
                  <p className="text-xs text-muted-foreground">
                    Add more details about your role and projects to get better
                    matches.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto px-2"
                >
                  <TransitionLink href="/profile/profile-setup">
                    <UserCog className="mr-2 h-4 w-4" /> Go to Setup
                  </TransitionLink>
                </Button>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </form>
      </div>
    </Card>
  );
}
