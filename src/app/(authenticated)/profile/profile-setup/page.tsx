"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Lightbulb,
  Phone,
  Save,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { countries } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserProfileType,
  UserJobRole,
  UserExperienceLevel,
  UserCompanySize,
  UserCompanyPosition,
  UserTotalPublishedApps,
  UserDevelopmentPlatform,
  UserPublishFrequency,
  UserTestingServiceReason,
  UserCommunicationMethod,
  UserProfileDataAttributes,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  useProfileDataSave,
  useUserProfileData,
  useUserProfileInitial,
} from "@/hooks/useUser";
import { useControlRoomData } from "@/hooks/useAdmin";
import SkeletonProfileSetup from "@/components/profile-setup/loading-skeleton";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
import Confetti from "react-dom-confetti";

const isValidUrl = (url: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

import dynamic from "next/dynamic";

const RegistrationSuccess = dynamic(() =>
  import("@/components/profile-setup/registration-success").then(
    (mod) => mod.RegistrationSuccess,
  ),
);

const stepsMeta = [
  {
    id: "role",
    title: "About You",
    description: "Tell us about your professional role.",
    icon: User,
  },
  {
    id: "company",
    title: "Your Company",
    description: "A little about your organization.",
    icon: Briefcase,
  },
  {
    id: "projects",
    title: "Your Projects",
    description: "Details about your development work.",
    icon: Lightbulb,
  },
  {
    id: "device",
    title: "Your Device",
    description: "Information about your primary device.",
    icon: Smartphone,
  },
  {
    id: "contact",
    title: "Preferences",
    description: "How you'd like to use inTesters.",
    icon: Phone,
  },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

function ProfileSetupPage() {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "EARNED_NOW" | "ALREADY_EARNED" | "INCOMPLETE"
  >("INCOMPLETE");
  const [profileData, setProfileData] = useState<
    Partial<UserProfileDataAttributes>
  >({});
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;

  const [skipClicked, setSkipClicked] = useState(false);

  const {
    data: userProfileData,
    isPending: userProfileIsPending,
    isError: userProfileIsError,
    error: userProfileError,
    refetch: userProfileRefetch,
  } = useUserProfileData();

  useEffect(() => {
    userProfileRefetch();
  }, [userProfileRefetch]);

  useEffect(() => {
    if (!userProfileIsPending && userProfileData) {
      setProfileData(userProfileData);
    }
  }, [userProfileIsPending, userProfileData]);

  useEffect(() => {
    if (skipClicked) {
      router.push("/dashboard");
    }
  }, [skipClicked]);
  useUserProfileInitial({ enabled: !!skipClicked });

  const next = () => {
    if (currentStep < stepsMeta.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index < currentStep) {
      setPreviousStep(currentStep);
      setCurrentStep(index);
    }
  };

  const progress = ((currentStep + 1) / stepsMeta.length) * 100;

  const {
    data: controlRoomData,
    isPending: controlRoomIsPending,
    isError: controlRoomIsError,
    error: controlRoomError,
  } = useControlRoomData({
    enabled: true,
  });

  const {
    mutate,
    isPending: profileDataIsPending,
    isSuccess: profileDataIsSuccess,
    isError: profileDataIsError,
    reset: profileDataReset,
  } = useProfileDataSave({
    onSuccess: (data) => {
      const status = data?.status || "INCOMPLETE";
      setSubmissionStatus(status);
      setIsSubmitted(true);
    },
    onError: (data) => {
      const errorMessage =
        data instanceof Error ? data.message : JSON.stringify(data);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
  });

  const handleSubmit = () => {
    if (
      profileData?.company_website &&
      !isValidUrl(profileData?.company_website)
    ) {
      toast({
        variant: "destructive",
        title: "Invalid company website url",
        description:
          "Please ensure that you enter a valid and complete company website URL (e.g. https://example.com/)",
      });
      setPreviousStep(0);
      setCurrentStep(1);
    } else {
      mutate(profileData);
    }
  };

  if (controlRoomIsPending || userProfileIsPending)
    return <SkeletonProfileSetup />;
  if (controlRoomIsError || userProfileIsError)
    return <p>{controlRoomError?.message || userProfileError?.message}</p>;

  return (
    <div
      className={`h-full w-full flex flex-col items-start sm:items-center p-2 pt-4 md:p-0 pb-4 ${
        profileData?.initial ? " justify-center" : " justify-start"
      }`}
    >
      {!profileData?.initial && (
        <PageHeader
          title="Setup"
          backHref="/profile"
          className="w-1/2 sm:w-full max-w-4xl sm:mx-auto"
        />
      )}
      <div className="w-full max-w-4xl h-auto min-h-[70vh] bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-dashed flex flex-col">
        {isSubmitted ? (
          <RegistrationSuccess status={submissionStatus} />
        ) : (
          <div className="flex flex-col md:flex-row flex-1 relative">
            {userProfileData?.initial && (
              <div className="absolute -top-4 right-5 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="text-xs sm:text-sm p-2 sm:px-4 h-auto"
                  onClick={() => setSkipClicked(true)}
                >
                  Skip for now
                </Button>
              </div>
            )}
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-1/3 bg-secondary/50 p-8 justify-between border-r rounded-l-xl">
              <div>
                <h2 className="text-xl font-bold">Complete Your Profile</h2>
                <p className="text-muted-foreground mt-2 text-xs">
                  This survey is optional, but you'll get a{" "}
                  <span className="text-primary font-bold">
                    {controlRoomData?.profileSurveyPoints ?? 200} point bonus
                  </span>{" "}
                  for completing it!
                </p>
              </div>
              <nav className="space-y-2">
                {stepsMeta.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => goToStep(index)}
                    disabled={index >= currentStep}
                    className={cn(
                      "flex items-center gap-4 p-3 py-2 rounded-lg transition-all duration-300 w-full text-left",
                      currentStep === index
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground",
                      index < currentStep
                        ? "hover:bg-accent cursor-pointer"
                        : "cursor-not-allowed",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full border-2 transition-all",
                        currentStep === index
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary border-border",
                        index < currentStep &&
                          "bg-green-500/20 text-green-600 border-green-500/30",
                      )}
                    >
                      {index < currentStep ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <step.icon className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm">Step {index + 1}</p>
                      <p className="text-xs">{step.title}</p>
                    </div>
                  </button>
                ))}
              </nav>
              <p className="text-xs text-muted-foreground">© inTesters</p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-3 pt-6 md:p-8">
              {/* Mobile Stepper */}
              <div className="md:hidden mb-6">
                <nav className="grid grid-cols-5 gap-2">
                  {stepsMeta.map((step, index) => (
                    <button
                      key={`mobile-${step.id}`}
                      onClick={() => goToStep(index)}
                      disabled={index >= currentStep}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300",
                        currentStep === index ? "bg-primary/10" : "",
                        index < currentStep
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50",
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-full border-2 transition-all",
                          currentStep === index
                            ? "border-primary"
                            : "border-border",
                          index < currentStep &&
                            "bg-green-500/20 border-green-500/30",
                        )}
                      >
                        {index < currentStep ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <step.icon
                            className={cn(
                              "w-4 h-4",
                              currentStep === index
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
                <Progress value={progress} className="h-1 mt-4" />
                <div className="text-center mt-3">
                  <p className="text-sm font-semibold">
                    {stepsMeta[currentStep].title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional Survey - Get{" "}
                    <span className="text-primary font-semibold">
                      200 points
                    </span>{" "}
                    for completion!
                  </p>
                </div>
              </div>

              <div className="flex-grow relative min-h-[360px] md:min-h-0">
                <AnimatePresence initial={false} custom={delta}>
                  <motion.div
                    key={currentStep}
                    custom={delta}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      type: "tween",
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                    className="absolute w-full h-full"
                  >
                    {currentStep === 0 && (
                      <RoleStep
                        profileData={profileData}
                        setProfileData={setProfileData}
                      />
                    )}
                    {currentStep === 1 && (
                      <CompanyStep
                        profileData={profileData}
                        setProfileData={setProfileData}
                      />
                    )}
                    {currentStep === 2 && (
                      <ProjectsStep
                        profileData={profileData}
                        setProfileData={setProfileData}
                      />
                    )}
                    {currentStep === 3 && (
                      <DeviceStep
                        profileData={profileData}
                        setProfileData={setProfileData}
                      />
                    )}
                    {currentStep === 4 && (
                      <ContactStep
                        profileData={profileData}
                        setProfileData={setProfileData}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="mt-2 pt-4 border-t flex items-center justify-between gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prev}
                  className={cn(
                    "transition-opacity",
                    currentStep === 0
                      ? "invisible opacity-0"
                      : "visible opacity-100",
                  )}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="flex items-center gap-4">
                  {currentStep < stepsMeta.length - 1 ? (
                    <Button onClick={next} type="button">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <LoadingButton
                      className="text-sm sm:text-base"
                      isLoading={profileDataIsPending}
                      isSuccess={profileDataIsSuccess}
                      isError={profileDataIsError}
                      onClick={handleSubmit}
                    >
                      <div className="flex flex-row items-center gap-2 sm:gap-4">
                        <Save className="h-4 w-4" />
                        <span>Finish & Save</span>
                      </div>
                    </LoadingButton>
                  )}
                </div>
              </div>
            </main>
          </div>
        )}
      </div>
    </div>
  );
}

const RoleStep = dynamic(() =>
  import("@/components/profile-setup/role-step").then((mod) => mod.RoleStep),
);
const CompanyStep = dynamic(() =>
  import("@/components/profile-setup/company-step").then(
    (mod) => mod.CompanyStep,
  ),
);
const ProjectsStep = dynamic(() =>
  import("@/components/profile-setup/projects-step").then(
    (mod) => mod.ProjectsStep,
  ),
);
const DeviceStep = dynamic(() =>
  import("@/components/profile-setup/device-step").then(
    (mod) => mod.DeviceStep,
  ),
);
const ContactStep = dynamic(() =>
  import("@/components/profile-setup/contact-step").then(
    (mod) => mod.ContactStep,
  ),
);

export default ProfileSetupPage;
