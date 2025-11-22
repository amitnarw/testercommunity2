"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Lightbulb,
  Phone,
  Sun,
  Moon,
  Save,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserProfileData,
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
import { useTheme } from "next-themes";
import { Progress } from "@/components/ui/progress";
import { BackButton } from "@/components/back-button";

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
    id: "contact",
    title: "Preferences",
    description: "How you'd like to use inTesters.",
    icon: Phone,
  },
];

function ProfileSetupPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [profileData, setProfileData] = useState<Partial<UserProfileData>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;
  const { setTheme, theme } = useTheme();

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

  const handleSubmit = () => {
    console.log("Final profile data:", profileData);
    setIsSubmitted(true);
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-2 sm:p-4">
      <div className="absolute top-1 sm:top-4 right-4 flex items-center gap-2">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="text-xs sm:text-sm p-2 sm:px-4 h-auto"
        >
          <Link href="/dashboard">Skip for now</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="w-full max-w-4xl h-auto min-h-[70vh] bg-card rounded-2xl shadow-2xl shadow-primary/10 border flex flex-col overflow-hidden">
        {isSubmitted ? (
          <RegistrationSuccess />
        ) : (
          <div className="flex flex-col md:flex-row flex-1">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-1/3 bg-secondary/50 p-8 justify-between border-r">
              <div>
                <h2 className="text-xl font-bold">Complete Your Profile</h2>
                <p className="text-primary font-semibold mt-2 text-sm">
                  Get a <span className="font-bold">200 point bonus</span> for
                  completing your survey!
                </p>
                <nav className="mt-12 space-y-2">
                  {steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => goToStep(index)}
                      disabled={index >= currentStep}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-lg transition-all duration-300 w-full text-left",
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
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm">Step {index + 1}</p>
                        <p className="text-xs">{step.title}</p>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
              <p className="text-xs text-muted-foreground">© inTesters</p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col p-3 md:p-8">
              {/* Mobile Stepper */}
              <div className="md:hidden mb-6">
                <nav className="grid grid-cols-4 gap-2">
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
                <p className="text-center text-sm font-semibold text-muted-foreground mt-3">
                  {steps[currentStep].title}
                </p>
              </div>

              <div className="flex-grow relative min-h-[360px] md:min-h-0">
                <AnimatePresence initial={false} custom={delta}>
                  <motion.div
                    key={currentStep}
                    custom={delta}
                    initial={{ opacity: 0, x: delta > 0 ? 300 : -300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: delta > 0 ? -300 : 300 }}
                    transition={{
                      type: "tween",
                      duration: 0.3,
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
                    <Button onClick={handleSubmit} type="button">
                      <Save className="mr-2 h-4 w-4" /> Finish & Save
                    </Button>
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
            profileType: value as UserProfileType,
          }))
        }
        defaultValue={profileData?.profileType}
        className="grid grid-cols-2 gap-4 pt-2"
      >
        {Object.values(UserProfileType).map((type) => (
          <div key={type}>
            <RadioGroupItem value={type} id={type} className="peer sr-only" />
            <Label
              htmlFor={type}
              className="flex h-full flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
            >
              {type.replace("_", " ")}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    <div>
      <Label>Your job role</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({ ...prev, jobRole: value as UserJobRole }))
        }
        defaultValue={profileData?.jobRole}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your primary role" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserJobRole).map((role) => (
            <SelectItem key={role} value={role}>
              {role.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Your experience level</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            experienceLevel: value as UserExperienceLevel,
          }))
        }
        defaultValue={profileData?.experienceLevel}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your experience level" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserExperienceLevel).map((level) => (
            <SelectItem key={level} value={level}>
              {level.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const CompanyStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <StepWrapper>
    <div>
      <Label>Company Name</Label>
      <Input
        placeholder="Your Company Inc."
        value={profileData?.companyName || ""}
        onChange={(e) =>
          setProfileData((prev) => ({ ...prev, companyName: e.target.value }))
        }
      />
    </div>
    <div>
      <Label>Company Website</Label>
      <Input
        placeholder="https://example.com"
        value={profileData?.companyWebsite || ""}
        onChange={(e) =>
          setProfileData((prev) => ({
            ...prev,
            companyWebsite: e.target.value,
          }))
        }
      />
    </div>
    <div>
      <Label>Company Size</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            companySize: value as UserCompanySize,
          }))
        }
        defaultValue={profileData?.companySize}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select company size" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanySize).map((size) => (
            <SelectItem key={size} value={size}>
              {size.replace("SIZE_", "").replace(/_/g, "-")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Your Position</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            positionInCompany: value as UserCompanyPosition,
          }))
        }
        defaultValue={profileData?.positionInCompany}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your position" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserCompanyPosition).map((pos) => (
            <SelectItem key={pos} value={pos}>
              {pos.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const ProjectsStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <StepWrapper>
    <div>
      <Label>Total Published Apps</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            totalPublishedApps: value as UserTotalPublishedApps,
          }))
        }
        defaultValue={profileData?.totalPublishedApps}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select number of apps" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserTotalPublishedApps).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace("PUB_", "").replace(/_/g, "-")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>Primary Development Platform</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            platformDevelopment: value as UserDevelopmentPlatform,
          }))
        }
        defaultValue={profileData?.platformDevelopment}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select platform" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserDevelopmentPlatform).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div>
      <Label>App Publish Frequency</Label>
      <Select
        onValueChange={(value) =>
          setProfileData((prev) => ({
            ...prev,
            publishFrequency: value as UserPublishFrequency,
          }))
        }
        defaultValue={profileData?.publishFrequency}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select frequency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserPublishFrequency).map((val) => (
            <SelectItem key={val} value={val}>
              {val.replace(/_/g, " ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  </StepWrapper>
);

const ContactStep = ({ profileData, setProfileData }: ProfileStepperProps) => (
  <div className="overflow-y-auto h-full">
    <StepWrapper>
      <div>
        <Label>Why are you using our service?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          {Object.values(UserTestingServiceReason).map((item) => (
            <div
              key={item}
              className="flex items-center space-x-2 rounded-md border p-3 has-[:checked]:border-primary"
            >
              <Checkbox
                checked={profileData?.serviceUsage?.includes(item)}
                onCheckedChange={(checked) => {
                  const current = profileData?.serviceUsage || [];
                  const updated = checked
                    ? [...current, item]
                    : current.filter((val) => val !== item);
                  setProfileData((prev) => ({
                    ...prev,
                    serviceUsage: updated,
                  }));
                }}
                id={`service-${item}`}
              />
              <Label
                htmlFor={`service-${item}`}
                className="text-sm font-normal cursor-pointer"
              >
                {item.replace(/_/g, " ")}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Preferred Communication Methods</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
          {Object.values(UserCommunicationMethod).map((item) => (
            <div
              key={item}
              className="flex items-center space-x-2 rounded-md border p-3 has-[:checked]:border-primary"
            >
              <Checkbox
                checked={profileData?.communicationMethods?.includes(item)}
                onCheckedChange={(checked) => {
                  const current = profileData?.communicationMethods || [];
                  const updated = checked
                    ? [...current, item]
                    : current.filter((val) => val !== item);
                  setProfileData((prev) => ({
                    ...prev,
                    communicationMethods: updated,
                  }));
                }}
                id={`comm-${item}`}
              />
              <Label
                htmlFor={`comm-${item}`}
                className="text-sm font-normal cursor-pointer"
              >
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </StepWrapper>
  </div>
);

interface ProfileStepperProps {
  profileData: Partial<UserProfileData>;
  setProfileData: React.Dispatch<
    React.SetStateAction<Partial<UserProfileData>>
  >;
}

export default ProfileSetupPage;
