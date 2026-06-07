"use client";

import { useState, useEffect, useCallback, ChangeEvent } from "react";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Moon,
  Sun,
  User,
  Briefcase,
  Smartphone,
  EyeOff,
  Eye,
  Settings,
} from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ROUTES } from "@/lib/routes";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { useRegisterTester } from "@/hooks/useAuth";
import { LoadingButton } from "@/components/ui/loading-button";
import { useRouter } from "next/navigation";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { Separator } from "@/components/ui/separator";
import { HomeButton } from "@/components/home-button";
import Image from "next/image";
import { TesterAboutYouStep } from "@/components/profile-setup/tester-about-you-step";
import { DeviceStep } from "@/components/profile-setup/device-step";
import { TesterPreferencesStep } from "@/components/profile-setup/tester-preferences-step";

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
  <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

const step0Schema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z
    .string()
    .email("Please enter a valid email.")
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed.",
    }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const step1Schema = z.object({
  years_of_experience: z.string().min(1, "Please select your years of experience."),
  areas_of_expertise: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one area of expertise.",
    }),
  bio: z.string().optional(),
});

const step2Schema = z.object({
  device_company: z.string().min(1, "Device company is required."),
  device_model: z.string().min(1, "Device model is required."),
  ram: z.string().min(1, "RAM is required."),
  os: z.string().min(1, "Operating system is required."),
  screen_resolution: z.string().min(1, "Screen resolution is required."),
  language: z.string().min(1, "Language is required."),
  network: z.string().min(1, "Network is required."),
});

const step3Schema = z.object({
  country: z.string().min(1, "Country is required."),
  phone: z.string().min(1, "Phone number is required."),
});

const formSchemas = [step0Schema, step1Schema, step2Schema, step3Schema];

const formSteps = [
  {
    id: "account",
    title: "Account Information",
    description: "Your basic login details.",
    icon: User,
  },
  {
    id: "about",
    title: "About You",
    description: "Your testing experience.",
    icon: Briefcase,
  },
  {
    id: "device",
    title: "Your Device",
    description: "Information about your device.",
    icon: Smartphone,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Your contact preferences.",
    icon: Settings,
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

const layoutVariants = {
  initial: (delta: number) => ({
    opacity: 0,
    scale: delta >= 0 ? 0.95 : 1.05,
    y: delta >= 0 ? 20 : -20,
  }),
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: (delta: number) => ({
    opacity: 0,
    scale: delta >= 0 ? 1.05 : 0.95,
    y: delta >= 0 ? -20 : 20,
  }),
};

export default function ProfessionalRegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const { setTheme, theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    // Account Info
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    // About You
    years_of_experience: "",
    areas_of_expertise: [] as string[],
    bio: "",
    // Your Device
    device_company: "",
    device_model: "",
    ram: "",
    os: "",
    screen_resolution: "",
    language: "",
    network: "",
    // Preferences
    country: "",
    phone: "",
  });

  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {},
  );

  const { mutate, isPending, isSuccess, isError, error } = useRegisterTester();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileChange = (update: Partial<typeof formValues>) => {
    setFormValues((prev) => ({ ...prev, ...update }));
  };

  const validateStep = useCallback((step: number): boolean => {
    const result = formSchemas[step].safeParse(formValues);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [formValues]);

  const next = useCallback(() => {
    if (!validateStep(currentStep)) return;

    if (currentStep < formSteps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  }, [currentStep, validateStep]);

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

  const processForm = useCallback(() => {
    if (!validateStep(3)) return;

    mutate(
      {
        email: formValues.email,
        password: formValues.password,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        // About You
        years_of_experience: formValues.years_of_experience,
        areas_of_expertise: formValues.areas_of_expertise,
        bio: formValues.bio,
        // Your Device
        device_company: formValues.device_company,
        device_model: formValues.device_model,
        ram: formValues.ram,
        os: formValues.os,
        screen_resolution: formValues.screen_resolution,
        language: formValues.language,
        network: formValues.network,
        // Preferences
        country: formValues.country,
        phone: formValues.phone,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.AUTH.REGISTER_CHECK_EMAIL);
        },
      },
    );
  }, [formValues, mutate, router, validateStep]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (currentStep < formSteps.length - 1) {
          next();
        } else {
          processForm();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, next, processForm]);

  const handleGoogleRegister = () => {
    // Google register not implemented for testers yet
  };

  const delta = currentStep - previousStep;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <AnimatePresence mode="wait" custom={delta}>
        {currentStep === 0 ? (
          <motion.div
            key="step-account"
            custom={delta}
            variants={layoutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="min-h-screen w-full lg:grid lg:grid-cols-2 bg-background absolute inset-0 z-10"
          >
            <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-2 sm:px-6 bg-background">
              <div className="absolute top-2 sm:top-4 right-4 flex items-center gap-4">
                <HomeButton href="/" />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>

              <div className="w-full max-w-md">
                <div className="overflow-hidden relative">
                  <div className="rounded-2xl px-2 sm:px-6 pt-10 pb-20">
                    <div className="mb-8 text-center">
                      <h2 className="font-bold tracking-tight text-2xl sm:text-3xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                        Create an Account
                      </h2>

                      <p className="text-muted-foreground mt-2">
                        Or{" "}
                        <Link
                          href={ROUTES.TESTER.AUTH.LOGIN}
                          className="text-primary hover:underline"
                        >
                          login to your account
                        </Link>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl py-2 sm:py-6 text-sm sm:text-base"
                        type="button"
                        onClick={handleGoogleRegister}
                      >
                        <GoogleIcon className="mr-3" />
                        Sign up with Google
                      </Button>
                      <div className="flex items-center gap-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">
                          OR
                        </span>
                        <Separator className="flex-1" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="firstName" className="text-sm">
                            First Name
                          </label>
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formValues.firstName}
                            onChange={handleChange}
                          />
                          {errors?.firstName && (
                            <p className="text-red-500 text-sm">
                              {errors.firstName[0]}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="lastName" className="text-sm">
                            Last Name
                          </label>
                          <Input
                            id="lastName"
                            name="lastName"
                            placeholder="Doe"
                            value={formValues.lastName}
                            onChange={handleChange}
                          />
                          {errors?.lastName && (
                            <p className="text-red-500 text-sm">
                              {errors.lastName[0]}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm">
                          Email
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formValues.email}
                          onChange={handleChange}
                        />
                        {errors?.email && (
                          <p className="text-red-500 text-sm">
                            {errors.email[0]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm">
                          Password
                        </label>
                        <div className="relative">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={formValues.password}
                            onChange={handleChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-1/2 -translate-y-1/2 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </Button>
                        </div>
                        {errors?.password && (
                          <p className="text-red-500 text-sm">
                            {errors.password[0]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-end">
                        <Button
                          className="text-sm sm:text-base w-full sm:w-auto"
                          type="button"
                          onClick={next}
                        >
                          Continue Application{" "}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
              <InteractiveGridPattern
                className={cn(
                  "[mask-image:radial-gradient(700px_circle_at_center,rgba(255,255,255,0.6),transparent)]",
                  "transform -skew-y-12",
                )}
                width={30}
                height={30}
                squares={[30, 30]}
                squaresClassName="hover:fill-gray-100"
              />
              <div className="relative z-10 flex flex-col items-center">
                <Logo className="w-20 h-20 mb-4" />
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Join the Community
                </h1>
                <p className="mt-2 max-w-md mx-auto text-muted-foreground">
                  Start your journey to building flawless apps with a global
                  community of testers.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="step-profile"
            custom={delta}
            variants={layoutVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
            className="h-full min-h-[100dvh] w-full flex flex-col items-center justify-start sm:justify-center p-4 py-8 bg-background relative z-20"
          >
            <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
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

            <PageHeader
              title="Application Details"
              backHref="/"
              onBack={prev}
              className="w-full max-w-4xl mx-auto mb-4"
            />

            <div className="w-full max-w-4xl h-auto min-h-[70vh] bg-card rounded-2xl shadow-2xl shadow-primary/10 border border-dashed flex flex-col relative z-20">
              <div className="flex flex-col md:flex-row flex-1 relative">
                {/* Sidebar */}
                <aside className="hidden md:flex flex-col w-1/3 bg-secondary/50 p-8 justify-between border-r rounded-l-xl">
                  <div>
                    <h2 className="text-xl font-bold">Your Details</h2>
                    <p className="text-muted-foreground mt-2 text-xs">
                      Complete your profile to get started.
                    </p>
                  </div>
                  <nav className="space-y-2">
                    {formSteps.slice(1).map((step, index) => {
                      const actualStepId = index + 1;
                      return (
                        <button
                          key={step.id}
                          onClick={() => goToStep(actualStepId)}
                          disabled={actualStepId > currentStep}
                          className={cn(
                            "flex items-center gap-4 p-3 py-2 rounded-lg transition-all duration-300 w-full text-left",
                            currentStep === actualStepId
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground",
                            actualStepId < currentStep
                              ? "hover:bg-accent cursor-pointer"
                              : "cursor-not-allowed",
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 rounded-full border-2 transition-all",
                              currentStep === actualStepId
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary border-border",
                              actualStepId < currentStep &&
                                "bg-green-500/20 text-green-600 border-green-500/30",
                            )}
                          >
                            {actualStepId < currentStep ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <step.icon className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              Step {index + 1}
                            </p>
                            <p className="text-xs">{step.title}</p>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                  <p className="text-xs text-muted-foreground">© inTesters</p>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col p-3 pt-6 md:p-8">
                  {/* Mobile Stepper */}
                  <div className="md:hidden mb-6">
                    <nav className="grid grid-cols-3 gap-2">
                      {formSteps.slice(1).map((step, index) => {
                        const actualStepId = index + 1;
                        return (
                          <button
                            key={`mobile-${step.id}`}
                            onClick={() => goToStep(actualStepId)}
                            disabled={actualStepId >= currentStep}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 py-2 rounded-lg transition-all duration-300",
                              currentStep === actualStepId
                                ? "bg-primary/10"
                                : "",
                              actualStepId < currentStep
                                ? "cursor-pointer"
                                : "cursor-not-allowed opacity-50",
                            )}
                          >
                            <div
                              className={cn(
                                "p-2 rounded-full border-2 transition-all",
                                currentStep === actualStepId
                                  ? "border-primary"
                                  : "border-border",
                                actualStepId < currentStep &&
                                  "bg-green-500/20 border-green-500/30",
                              )}
                            >
                              {actualStepId < currentStep ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <step.icon
                                  className={cn(
                                    "w-4 h-4",
                                    currentStep === actualStepId
                                      ? "text-primary"
                                      : "text-muted-foreground",
                                  )}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                    <Progress
                      value={(currentStep / (formSteps.length - 1)) * 100}
                      className="h-1 mt-4"
                    />
                    <div className="text-center mt-3">
                      <p className="text-sm font-semibold">
                        {formSteps[currentStep].title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formSteps[currentStep].description}
                      </p>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col relative w-full">
                    <div className="flex-grow relative min-h-[460px] md:min-h-[360px] w-full overflow-hidden px-1">
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
                          className="absolute w-full h-full pb-10 overflow-y-auto pr-1"
                        >
                          <h3 className="font-bold text-xl mb-4 hidden md:block">
                            {formSteps[currentStep].title}
                          </h3>

                          <div className="w-full">
                            {currentStep === 1 && (
                              <TesterAboutYouStep
                                profileData={formValues}
                                setProfileData={(update) => {
                                  if (typeof update === "function") {
                                    setFormValues((prev) => {
                                      const result = update(prev);
                                      return { ...prev, ...result };
                                    });
                                  } else {
                                    handleProfileChange(update);
                                  }
                                }}
                              />
                            )}

                            {currentStep === 2 && (
                              <DeviceStep
                                profileData={formValues}
                                setProfileData={(update) => {
                                  if (typeof update === "function") {
                                    setFormValues((prev) => {
                                      const result = update(prev);
                                      return { ...prev, ...result };
                                    });
                                  } else {
                                    handleProfileChange(update);
                                  }
                                }}
                              />
                            )}

                            {currentStep === 3 && (
                              <TesterPreferencesStep
                                profileData={formValues}
                                setProfileData={(update) => {
                                  if (typeof update === "function") {
                                    setFormValues((prev) => {
                                      const result = update(prev);
                                      return { ...prev, ...result };
                                    });
                                  } else {
                                    handleProfileChange(update);
                                  }
                                }}
                              />
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="mt-auto pt-4 border-t flex items-center justify-between gap-4 flex-col sm:flex-row">
                      <Button type="button" variant="ghost" onClick={prev}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                      </Button>

                      <div className="flex items-center gap-4">
                        {currentStep < formSteps.length - 1 ? (
                          <Button onClick={next} type="button">
                            Next Step{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <LoadingButton
                            isLoading={isPending}
                            isSuccess={isSuccess}
                            isError={isError}
                            onClick={processForm}
                          >
                            Submit Application
                          </LoadingButton>
                        )}
                      </div>
                    </div>

                    {/* Validation errors in footer */}
                    {Object.keys(errors).length > 0 && currentStep > 0 && (
                      <div className="mt-2 text-red-500 text-sm text-center truncate">
                        {Object.values(errors).flat()[0]}
                        {Object.values(errors).flat().length > 1 && 
                          ` (+${Object.values(errors).flat().length - 1} more)`}
                      </div>
                    )}

                    {isError && !isPending && (
                      <div className="bg-destructive/10 text-destructive p-3 rounded-md mt-4 text-sm">
                        {error?.message ||
                          "An error occurred during registration. Please try again."}
                      </div>
                    )}
                  </div>
                </main>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
