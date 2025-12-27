"use client";

import { Fragment, useEffect, useState } from "react";
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
import {
  Upload,
  Save,
  LogOut,
  Monitor,
  Smartphone,
  Tablet,
  UserCog,
  MapPin,
  Gift,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { BackButton } from "@/components/back-button";
import { useSessionsData, useUserProfileData } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { SessionResponse } from "@/lib/types";
import SkeletonSessions from "@/components/authenticated/profile/session-skeleton";

const profileSchema = z.object({
  first_name: z.string().min(2, "First name is required."),
  last_name: z.string().min(2, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  phone: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const DeviceIcon = ({ type }: { type: SessionResponse["deviceType"] }) => {
  if (type === "mobile")
    return <Smartphone className="w-8 h-8 text-muted-foreground" />;
  if (type === "tablet")
    return <Tablet className="w-8 h-8 text-muted-foreground" />;
  return <Monitor className="w-8 h-8 text-muted-foreground" />;
};

const getLocation = (city: string, region: string, country: string) => {
  let location = "";
  location = city !== "Unknown" ? city : "";
  location = region !== "Unknown" ? location + " | " + region : "";
  location = country !== "Unknown" ? location + " | " + country : "";
  location =
    city === "Unknown" && region === "Unknown" && country === "Unknown"
      ? "Unknown"
      : location;
  return location;
};

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  const { toast } = useToast();
  const [avatar, setAvatar] = useState();

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
  }, []);

  useEffect(() => {
    if (!userProfileIsPending && !isPending && userProfileData && session) {
      console.log(session?.user, userProfileData, "sdsd");
      reset({
        first_name: userProfileData.first_name,
        last_name: userProfileData.last_name,
        email: session.user.email,
        phone: userProfileData.phone,
        country: userProfileData.country,
      });
    }
  }, [userProfileIsPending, isPending, userProfileData, session, reset]);

  const {
    data: sessionData,
    isPending: sessionIsPending,
    isError: sessionIsError,
    error: sessionError,
    refetch: sessionRefetch,
  } = useSessionsData();

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

  const handleLogoutDevice = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
    toast({
      title: "Device Logged Out",
      description: "The selected session has been terminated.",
    });
  };

  const handleLogoutAll = () => {
    setDevices(devices.filter((d) => d.isCurrent));
    toast({
      title: "All Other Sessions Logged Out",
      description: "You have been logged out from all other devices.",
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 pb-12">
      <div className="flex flex-row gap-5 items-center sticky top-0 z-[50] py-2 pb-4 px-2 sm:mx-auto max-w-4xl w-1/2 sm:w-full">
        <BackButton href="/dashboard" />
        <h1 className="font-semibold tracking-tight text-xl sm:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">
          Profile
        </h1>
      </div>
      <div className="max-w-4xl mx-auto space-y-12">
        <Card className="overflow-hidden rounded-2xl shadow-xl shadow-primary/5 border border-dashed">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-1 bg-secondary/50 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r">
              <Label
                htmlFor="avatar-upload"
                className="relative cursor-pointer group"
              >
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg group-hover:opacity-80 transition-opacity">
                  <AvatarImage src={avatar} />
                  <AvatarFallback>
                    {session?.user?.name.charAt(0)}
                  </AvatarFallback>
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
                <CardTitle className="text-xl sm:text-2xl">User data</CardTitle>
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

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-lg bg-secondary/50 p-2 sm:p-4">
                  <div className="text-center sm:text-start">
                    <h4 className="font-semibold">Advanced Profile Setup</h4>
                    <p className="text-xs text-muted-foreground">
                      Add more details about your role and projects to get
                      better matches.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto"
                  >
                    <Link href="/profile/profile-setup">
                      <UserCog className="mr-2 h-4 w-4" /> Go to Setup
                    </Link>
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" className="w-full sm:w-auto">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </form>
          </div>
        </Card>

        <Card className="border-0 shadow-xl shadow-primary/5 px-3 sm:px-6">
          <CardHeader className="px-2">
            <CardTitle className="text-xl sm:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">
              Active Sessions
            </CardTitle>
            <CardDescription>
              You have{" "}
              <span className="font-semibold">
                {sessionData?.length} active
              </span>{" "}
              sessions. For your security, revoke any sessions that you do not
              recognize.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-0 pb-6">
            <div className="rounded-xl border border-dashed px-3 sm:px-6 py-2">
              {sessionIsPending ? (
                <SkeletonSessions />
              ) : !sessionData?.length ? (
                <p>No session found</p>
              ) : (
                sessionData?.map((device, index) => (
                  <Fragment key={device.id}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6">
                      <div className="flex items-center gap-4">
                        <DeviceIcon type={device?.deviceType} />
                        <div>
                          <p className="font-semibold">
                            {device.os} - {device.browser}
                          </p>
                          <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 hidden md:block">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="text-xs sm:text-sm">
                                {getLocation(
                                  device?.city,
                                  device?.region,
                                  device?.country
                                )}
                              </span>
                            </div>
                            <span className="hidden md:inline">•</span>
                            <span className="text-xs sm:text-sm">
                              {device.isCurrent ? (
                                <span className="font-semibold text-green-500">
                                  Active now
                                </span>
                              ) : (
                                `Last login ${device?.lastLogin}`
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 block md:block text-xs sm:text-sm">
                          <span className="text-muted-foreground">
                            Location:{" "}
                          </span>
                          <span>
                            {getLocation(
                              device?.city,
                              device?.region,
                              device?.country
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-start md:justify-end mt-4 md:mt-0 w-full md:w-auto">
                        {!device.isCurrent && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className=" text-destructive bg-destructive/10 dark:bg-red-700/20 hover:text-red-500 hover:bg-destructive/20 hover:scale-[1.1] w-full md:w-auto justify-start md:justify-center"
                              >
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will terminate the session on{" "}
                                  {device.browser} on {device.os}. You will need
                                  to log in again on that device.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleLogoutDevice(device.id)}
                                >
                                  Log Out
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                    {index < sessionData?.length - 1 && (
                      <Separator className="bg-transparent border border-dashed" />
                    )}
                  </Fragment>
                ))
              )}
            </div>
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Logout From All Other Devices
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Logout From All Other Devices?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will terminate all other active sessions for your
                      account. You will remain logged in on this device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogoutAll}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl shadow-primary/5 p-6 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-gradient-to-br from-primary/30 to-primary/0 sm:bg-primary/10 text-primary/50 sm:text-primary p-4 rounded-full absolute -top-4 -left-4 sm:static scale-125 sm:scale-100">
                <Gift className="w-8 h-8" />
              </div>
              <div className="z-10">
                <h3 className="text-xl font-bold">Refer &amp; Earn</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Invite friends and earn points when they sign up!
                </p>
              </div>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/profile/referral">
                View Details <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
