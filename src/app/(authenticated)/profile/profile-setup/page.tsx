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

const isValidUrl = (url: string) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const RegistrationSuccess = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 flex flex-col items-center justify-center h-full"
  >
    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold">Profile Setup Complete!</h2>
    <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
      Thank you for setting up your profile. You're all set to explore the
      dashboard.
    </p>
    <Button asChild className="mt-8">
      <Link href="/dashboard">Go to Dashboard</Link>
    </Button>
  </motion.div>
);

const steps = [
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
    if (currentStep < steps.length - 1) {
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

  const progress = ((currentStep + 1) / steps.length) * 100;

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
    onSuccess: () => {
      if (profileData?.initial) {
        setIsSubmitted(true);
      } else {
        toast({
          title: "Data saved",
          description: "Your profile data is saved successfully.",
        });
      }
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
          <RegistrationSuccess />
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
                {steps.map((step, index) => (
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
                        : "cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full border-2 transition-all",
                        currentStep === index
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-secondary border-border",
                        index < currentStep &&
                          "bg-green-500/20 text-green-600 border-green-500/30"
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
                  {steps.map((step, index) => (
                    <button
                      key={`mobile-${step.id}`}
                      onClick={() => goToStep(index)}
                      disabled={index >= currentStep}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300",
                        currentStep === index ? "bg-primary/10" : "",
                        index < currentStep
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-full border-2 transition-all",
                          currentStep === index
                            ? "border-primary"
                            : "border-border",
                          index < currentStep &&
                            "bg-green-500/20 border-green-500/30"
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
                                : "text-muted-foreground"
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
                    {steps[currentStep].title}
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
                      : "visible opacity-100"
                  )}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <div className="flex items-center gap-4">
                  {currentStep < steps.length - 1 ? (
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

const StepWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-6">{children}</div>
);

const RoleStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <StepWrapper>
    <div className="space-y-2">
      <Label>Your professional type</Label>
      <RadioGroup
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            profile_type: value as UserProfileType,
          }))
        }
        value={profileData?.profile_type}
        className="grid grid-cols-2 gap-4"
      >
        {Object.values(UserProfileType).map((type) => (
          <div key={type}>
            <RadioGroupItem value={type} id={type} className="peer sr-only" />
            <Label
              htmlFor={type}
              className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
            >
              {type.replace("_", " ")?.toLowerCase()}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your job role</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            job_role: value as UserJobRole,
          }))
        }
        value={profileData?.job_role}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your primary role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserJobRole).map((role) => (
            <SelectItem key={role} value={role}>
              {role.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your experience level</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            experience_level: value as UserExperienceLevel,
          }))
        }
        value={profileData?.experience_level}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserExperienceLevel).map((level) => (
            <SelectItem key={level} value={level}>
              {level.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const CompanyStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <StepWrapper>
    <div className="flex flex-col gap-2">
      <Label>Company Name</Label>
      <Input
        placeholder="Your Company Inc."
        value={profileData?.company_name}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, company_name: e.target.value }))
        }
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Company Website</Label>
      <Input
        placeholder="https://example.com"
        value={profileData?.company_website}
        onChange={(e) =>
          setProfileData((prev) => ({
            ...prev,
            company_website: e.target.value,
          }))
        }
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Company Size</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            company_size: value as UserCompanySize,
          }))
        }
        defaultValue={profileData?.company_size}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select company size" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanySize).map((size) => (
            <SelectItem key={size} value={size}>
              {size.replace("SIZE_", "").replace(/_/g, "-")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Your Position</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            position_in_company: value as UserCompanyPosition,
          }))
        }
        defaultValue={profileData?.position_in_company}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your position" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanyPosition).map((pos) => (
            <SelectItem key={pos} value={pos}>
              {pos.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const ProjectsStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <StepWrapper>
    <div className="flex flex-col gap-2">
      <Label>Total Published Apps</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            total_published_apps: value as UserTotalPublishedApps,
          }))
        }
        defaultValue={profileData?.total_published_apps}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select number of apps" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserTotalPublishedApps).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace("PUB_", "").replace(/_/g, "-")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Primary Development Platform</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            platform_development: value as UserDevelopmentPlatform,
          }))
        }
        defaultValue={profileData?.platform_development}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserDevelopmentPlatform).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="flex flex-col gap-2">
      <Label>App Publish Frequency</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            publish_frequency: value as UserPublishFrequency,
          }))
        }
        defaultValue={profileData?.publish_frequency}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserPublishFrequency).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")?.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const DeviceStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="overflow-y-auto h-full">
    <StepWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Device Company</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, device_company: value }))
            }
            defaultValue={profileData?.device_company as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., Google" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="Samsung">Samsung</SelectItem>
              <SelectItem value="OnePlus">OnePlus</SelectItem>
              <SelectItem value="Xiaomi">Xiaomi</SelectItem>
              <SelectItem value="Motorola">Motorola</SelectItem>
              <SelectItem value="Sony">Sony</SelectItem>
              <SelectItem value="LG">LG</SelectItem>
              <SelectItem value="Huawei">Huawei</SelectItem>
              <SelectItem value="Nokia">Nokia</SelectItem>
              <SelectItem value="Asus">Asus</SelectItem>
              <SelectItem value="Oppo">Oppo</SelectItem>
              <SelectItem value="Vivo">Vivo</SelectItem>
              <SelectItem value="Realme">Realme</SelectItem>
              <SelectItem value="Lenovo">Lenovo</SelectItem>
              <SelectItem value="HTC">HTC</SelectItem>
              <SelectItem value="ZTE">ZTE</SelectItem>
              <SelectItem value="Alcatel">Alcatel</SelectItem>
              <SelectItem value="TCL">TCL</SelectItem>
              <SelectItem value="Nothing">Nothing</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Device Model</Label>
          <Input
            placeholder="e.g., Pixel 8 Pro"
            value={profileData?.device_model as string | undefined}
            onChange={(e) =>
              setProfileData((prev) => ({
                ...prev,
                device_model: e.target.value,
              }))
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>RAM</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, ram: value }))
            }
            defaultValue={profileData?.ram as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., 8GB" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2GB">2GB</SelectItem>
              <SelectItem value="3GB">3GB</SelectItem>
              <SelectItem value="4GB">4GB</SelectItem>
              <SelectItem value="6GB">6GB</SelectItem>
              <SelectItem value="8GB">8GB</SelectItem>
              <SelectItem value="12GB">12GB</SelectItem>
              <SelectItem value="16GB">16GB</SelectItem>
              <SelectItem value="18GB">18GB</SelectItem>
              <SelectItem value="24GB">24GB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Operating System</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, os: value }))
            }
            defaultValue={profileData?.os as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., Android 14" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Android 16">Android 16</SelectItem>
              <SelectItem value="Android 15">Android 15</SelectItem>
              <SelectItem value="Android 14">Android 14</SelectItem>
              <SelectItem value="Android 13">Android 13</SelectItem>
              <SelectItem value="Android 12">Android 12</SelectItem>
              <SelectItem value="Android 11">Android 11</SelectItem>
              <SelectItem value="Android 10 or older">
                Android 10 or older
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Screen Resolution</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, screen_resolution: value }))
            }
            defaultValue={profileData?.screen_resolution as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., QHD+" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HD+ (720p)">HD+ (720p)</SelectItem>
              <SelectItem value="FHD+ (1080p)">FHD+ (1080p)</SelectItem>
              <SelectItem value="QHD+ (2K)">QHD+ (2K)</SelectItem>
              <SelectItem value="UHD (4K)">UHD (4K)</SelectItem>
              <SelectItem value="UHD (8K)">UHD (8K)</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Language</Label>
          <Select
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, language: value }))
            }
            defaultValue={profileData?.language as string | undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="e.g., English (US)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English (US)">English (US)</SelectItem>
              <SelectItem value="English (UK)">English (UK)</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Mandarin Chinese">Mandarin Chinese</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Arabic">Arabic</SelectItem>
              <SelectItem value="Portuguese">Portuguese</SelectItem>
              <SelectItem value="Bengali">Bengali</SelectItem>
              <SelectItem value="Russian">Russian</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
              <SelectItem value="German">German</SelectItem>
              <SelectItem value="French">French</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label>Primary Network</Label>
          <RadioGroup
            onValueChange={(value) =>
              setProfileData((prev) => ({ ...prev, network: value }))
            }
            defaultValue={profileData?.network as string | undefined}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="WiFi" id="wifi" className="peer sr-only" />
              <Label
                htmlFor="wifi"
                className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
              >
                WiFi
              </Label>
            </div>
            <div>
              <RadioGroupItem
                value="Cellular"
                id="cellular"
                className="peer sr-only"
              />
              <Label
                htmlFor="cellular"
                className="flex h-full flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
              >
                Cellular
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </StepWrapper>
  </div>
);

const ContactStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="overflow-y-auto h-full">
    <StepWrapper>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Country</Label>
          <Select
            value={profileData?.country || ""}
            onValueChange={(value) => {
              const country = countries.find((c) => c.name === value);
              setProfileData((prev) => ({
                ...prev,
                country: value,
                phone: country ? country.dial_code : prev.phone,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name} ({country.dial_code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Phone Number</Label>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={profileData?.phone || ""}
            disabled={!profileData?.country}
            onChange={(e) => {
              const value = e.target.value;
              const country = countries.find(
                (c) => c.name === profileData?.country
              );

              if (country) {
                // If the user tries to delete the dial code, prevent it or reset
                if (!value.startsWith(country.dial_code)) {
                  if (value.length < country.dial_code.length) {
                    setProfileData((prev) => ({
                      ...prev,
                      phone: country.dial_code,
                    }));
                  }
                  return;
                }

                const numberPart = value.slice(country.dial_code.length);

                // Allow only digits and check length
                if (
                  numberPart.length <= country.length &&
                  /^\d*$/.test(numberPart)
                ) {
                  setProfileData((prev) => ({ ...prev, phone: value }));
                }
              } else {
                setProfileData((prev) => ({ ...prev, phone: value }));
              }
            }}
          />
        </div>
      </div>
      <div>
        <Label>Why are you using our service?</Label>
        <RadioGroup
          value={profileData?.service_usage || ""}
          onValueChange={(value) =>
            setProfileData((prev) => ({
              ...prev,
              service_usage: value as UserTestingServiceReason,
            }))
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
        >
          {Object.values(UserTestingServiceReason).map((item) => (
            <div key={item} className="flex items-center gap-3">
              <RadioGroupItem
                key={item}
                value={item}
                id={`service-${item}`}
              ></RadioGroupItem>
              <Label
                htmlFor={`service-${item}`}
                className="text-sm font-normal cursor-pointer"
              >
                {item.replace(/_/g, " ").toLowerCase()}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        <Label>Preferred Communication Methods</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {Object.values(UserCommunicationMethod).map((item) => (
            <div
              key={item}
              className="flex items-center space-x-2 rounded-md border has-[:checked]:border-primary"
            >
              <Checkbox
                checked={profileData?.communication_methods?.includes(item)}
                onCheckedChange={(checked) => {
                  const current = profileData?.communication_methods || [];
                  const updated = checked
                    ? [...current, item]
                    : current.filter((val) => val !== item);
                  setProfileData((prev) => ({
                    ...prev,
                    communication_methods: updated,
                  }));
                }}
                id={`comm-${item}`}
                className="ml-3 rounded-[4px]"
                // className="flex items-center space-x-2
              />
              <Label
                htmlFor={`comm-${item}`}
                className="text-sm font-normal cursor-pointer w-full p-3"
              >
                {item?.toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </StepWrapper>
  </div>
);

interface ProfileStepperProps {
  profileData: Partial<UserProfileDataAttributes>;
  setProfileData: React.Dispatch<
    React.SetStateAction<Partial<UserProfileDataAttributes>>
  >;
}

export default ProfileSetupPage;
