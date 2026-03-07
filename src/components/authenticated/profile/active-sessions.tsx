"use client";

import { Fragment, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, Monitor, Smartphone, Tablet, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  useSessionLogoutAll,
  useSessionLogoutSingle,
  useSessionsData,
} from "@/hooks/useUser";
import { SessionResponse } from "@/lib/types";
import SkeletonSessions from "@/components/authenticated/profile/session-skeleton";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTransitionRouter } from "@/context/transition-context";
import { ROUTES } from "@/lib/routes";

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

export function ActiveSessions() {
  const router = useTransitionRouter();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState({ show: false, index: -1 });
  const [isOpenAll, setIsOpenAll] = useState(false);

  const {
    data: sessionData,
    isPending: sessionIsPending,
    isError: sessionIsError,
    error: sessionError,
    refetch: sessionRefetch,
  } = useSessionsData();

  const {
    mutate: sessionLSMutate,
    isPending: sessionLSIsPending,
    isSuccess: sessionLSIsSuccess,
    isError: sessionLSIsError,
    error: sessionLSError,
    reset: resetSessionLS,
  } = useSessionLogoutSingle({
    onSuccess: () => {
      toast({
        title: "Device Logged Out",
        description: "The selected session has been terminated.",
      });
      sessionRefetch();
      resetSessionLS();
      setIsOpen({ show: false, index: -1 });
    },
  });

  const {
    mutate: sessionLAMutate,
    isPending: sessionLAIsPending,
    isSuccess: sessionLAIsSuccess,
    isError: sessionLAIsError,
    error: sessionLAError,
    reset: resetSessionLA,
  } = useSessionLogoutAll({
    onSuccess: () => {
      toast({
        title: "All Other Sessions Logged Out",
        description: "You have been logged out from all other devices.",
      });
      setIsOpenAll(false);
      router.push(ROUTES.AUTH.LOGIN);
    },
  });

  const handleLogoutDevice = (id: string) => {
    sessionLSMutate({ session_id: id });
  };

  const handleLogoutAll = () => {
    sessionLAMutate(undefined);
  };

  return (
    <Card className="border-0 shadow-xl shadow-primary/5 px-3 sm:px-6">
      <CardHeader className="px-2">
        <CardTitle className="text-xl sm:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">
          Active Sessions
        </CardTitle>
        <CardDescription>
          You have{" "}
          <span className="font-semibold">{sessionData?.length} active</span>{" "}
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
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex flex-row gap-4 items-center">
                      <DeviceIcon type={device?.deviceType} />
                      <div>
                        <p className="font-semibold">
                          {device.os} - {device.browser}
                        </p>
                        <div className="flex flex-col md:flex-row md:items-center md:gap-4 text-sm text-muted-foreground">
                          <div className="flex-row items-center gap-1.5 hidden md:flex">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="text-xs sm:text-sm">
                              {getLocation(
                                device?.city,
                                device?.region,
                                device?.country,
                              )}
                            </span>
                          </div>
                          <span className="hidden md:inline">•</span>
                          {device.isCurrent ? (
                            <span className="text-sm font-semibold text-green-500">
                              Active now
                            </span>
                          ) : (
                            <div className="flex-row gap-2 hidden sm:flex">
                              <span className="text-xs sm:text-sm text-muted-foreground">
                                Last login:
                              </span>
                              <span className="text-xs sm:text-sm">
                                {device?.lastLogin}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start md:hidden text-xs sm:text-sm">
                      {!device.isCurrent ? (
                        <div className="flex flex-row gap-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            Last login:
                          </span>
                          <span className="text-xs sm:text-sm">
                            {device?.lastLogin}
                          </span>
                        </div>
                      ) : null}
                      <div className="flex flex-row gap-2">
                        <span className="text-muted-foreground">
                          Location:{" "}
                        </span>
                        <span>
                          {getLocation(
                            device?.city,
                            device?.region,
                            device?.country,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start md:justify-end mt-4 md:mt-0 w-full md:w-auto">
                    {!device.isCurrent && (
                      <Dialog
                        open={isOpen.show && isOpen.index === index}
                        onOpenChange={(open) => {
                          if (!open) setIsOpen({ show: false, index: -1 });
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive bg-destructive/10 dark:bg-red-700/20 hover:text-red-500 hover:bg-destructive/20 hover:scale-[1.1] w-full md:w-auto justify-center"
                            onClick={() =>
                              setIsOpen({ show: true, index: index })
                            }
                          >
                            <LogOut className="mr-2 h-4 w-4" /> Logout
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Are you sure?</DialogTitle>
                            <DialogDescription>
                              This will terminate the session on{" "}
                              {device.browser} on {device.os}. You will need to
                              log in again on that device.
                            </DialogDescription>
                          </DialogHeader>

                          <DialogFooter className="flex justify-between">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>

                            <LoadingButton
                              className="rounded-xl"
                              isLoading={sessionLSIsPending}
                              isSuccess={sessionLSIsSuccess}
                              isError={sessionLSIsError}
                              reset={resetSessionLS}
                              onClick={() => handleLogoutDevice(device.id)}
                            >
                              Log Out
                            </LoadingButton>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
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
          <Dialog open={isOpenAll} onOpenChange={setIsOpenAll}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => setIsOpenAll(true)}
              >
                Logout From All Other Devices
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Logout From All Other Devices?</DialogTitle>
                <DialogDescription>
                  This will terminate all other active sessions for your
                  account. You will remain logged in on this device.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex justify-between">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                <LoadingButton
                  type="button"
                  className="rounded-xl"
                  isLoading={sessionLAIsPending}
                  isSuccess={sessionLAIsSuccess}
                  isError={sessionLAIsError}
                  reset={resetSessionLA}
                  onClick={handleLogoutAll}
                >
                  Log Out
                </LoadingButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
