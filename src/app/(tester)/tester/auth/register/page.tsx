"use client";

import { useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  CheckCircle,
  Moon,
  Sun,
  User,
  Briefcase,
  Smartphone,
  EyeOff,
  Eye,
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
import { BackButton } from "@/components/back-button";
import Image from "next/image";

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
  <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

const step1Schema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z
    .string()
    .email("Please enter a valid email.")
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed.",
    }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional(),
});

const step2Schema = z.object({
  experience: z.string().min(1, "Please select your years of experience."),
  testingTypes: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one testing type.",
    }),
  bio: z.string().optional(),
});

const step3Schema = z.object({
  devices: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You must select at least one device.",
  }),
  osVersions: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You must select at least one OS version.",
    }),
  languages: z.string().optional(),
});

const formSchemas = [step1Schema, step2Schema, step3Schema];

const formSteps = [
  {
    id: "account",
    title: "Account Information",
    description: "Your basic login details.",
    icon: User,
  },
  {
    id: "experience",
    title: "Professional Background",
    description: "Your testing experience and expertise.",
    icon: Briefcase,
  },
  {
    id: "skills",
    title: "Technical Skills & Devices",
    description: "Devices you own and skills.",
    icon: Smartphone,
  },
];

const testingTypeOptions = [
  { id: "manual", label: "Manual Testing" },
  { id: "automation", label: "Automation Testing" },
  { id: "performance", label: "Performance Testing" },
  { id: "security", label: "Security Testing" },
  { id: "usability", label: "Usability Testing" },
  { id: "api", label: "API Testing" },
] as const;

const deviceOptions = [
  { id: "pixel", label: "Google Pixel" },
  { id: "samsung", label: "Samsung Galaxy" },
  { id: "oneplus", label: "OnePlus" },
  { id: "xiaomi", label: "Xiaomi/Redmi" },
  { id: "oppo", label: "Oppo/Realme" },
  { id: "other", label: "Other Brands" },
];

const osOptions = [
  { id: "android_16 ", label: "Android 16" },
  { id: "android_15", label: "Android 15" },
  { id: "android_14", label: "Android 14" },
  { id: "android_13", label: "Android 13" },
  { id: "android_12", label: "Android 12" },
  { id: "android_11", label: "Android 11 or older" },
];

const RegistrationSuccess = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center h-full p-12 text-center"
  >
    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
    <h2 className="text-2xl font-bold">Application Submitted!</h2>
    <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
      Thank you for your interest in becoming a professional tester. Our team
      will review your application and get back to you via email within 3-5
      business days.
    </p>
    <Button asChild className="mt-8">
      <Link href="/">Return to Homepage</Link>
    </Button>
  </motion.div>
);

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

// Full-page layout transitions
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setTheme, theme } = useTheme();
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error } = useRegisterTester();

  const form = useForm<any>({
    resolver: zodResolver(formSchemas[currentStep]),
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: {
      testingTypes: [],
      devices: [],
      osVersions: [],
    },
  });

  const { trigger, handleSubmit, setValue } = form;

  const next = async () => {
    const output = await trigger();
    if (!output) return;

    if (currentStep < formSteps.length - 1) {
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

  const goToStep = async (index: number) => {
    // Only allow going backwards or to validated next steps
    if (index < currentStep) {
      setPreviousStep(currentStep);
      setCurrentStep(index);
    }
  };

  const processForm: SubmitHandler<any> = (data) => {
    const allData = form.getValues();
    console.log("Final application data:", allData);

    mutate(
      {
        email: allData.email,
        password: allData.password || "google.oauth.123", // Mock for quick testing if using google
        firstName: allData.firstName || "Pro",
        lastName: allData.lastName || "Tester",
        experience: allData.experience,
        testingTypes: allData.testingTypes,
        bio: allData.bio,
        devices: allData.devices,
        osVersions: allData.osVersions,
        languages: allData.languages,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      },
    );
  };

  const handleGoogleRegister = () => {
    setIsGoogleAuth(true);
    // Simulate pre-filling form with Google data
    setValue("firstName", "Pro", { shouldValidate: true });
    setValue("lastName", "Tester", { shouldValidate: true });
    setValue("email", "pro.tester@gmail.com", { shouldValidate: true });
    next();
  };

  const delta = currentStep - previousStep;

  return (
    <div className="min-h-screen w-full bg-background relative overflow-hidden">
      <AnimatePresence mode="wait" custom={delta}>
        {currentStep === 0 ? (
          <motion.div
            key="step-basic"
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
                <BackButton href="/" />
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
                <FormProvider {...form}>
                  <form className="overflow-hidden relative">
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
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="you@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                  />
                                </FormControl>
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
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
                  </form>
                </FormProvider>
              </div>
            </div>
            {/* Same login background right side */}
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
            key="step-advanced"
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
              {isSubmitted ? (
                <RegistrationSuccess />
              ) : (
                <div className="flex flex-col md:flex-row flex-1 relative">
                  {/* Sidebar */}
                  <aside className="hidden md:flex flex-col w-1/3 bg-secondary/50 p-8 justify-between border-r rounded-l-xl">
                    <div>
                      <h2 className="text-xl font-bold">Your Details</h2>
                      <p className="text-muted-foreground mt-2 text-xs">
                        Fill in your experience and devices to find optimal bug
                        bounties.
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
                      <nav className="grid grid-cols-2 gap-2">
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

                    <FormProvider {...form}>
                      <form
                        onSubmit={handleSubmit(processForm)}
                        className="flex-grow flex flex-col relative w-full"
                      >
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

                              <div className="w-full flex items-center justify-center">
                                {currentStep === 1 && (
                                  <div className="space-y-5 max-w-md mx-auto md:mx-0 w-full">
                                    <FormField
                                      name="experience"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Years of QA Experience
                                          </FormLabel>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                          >
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select your experience level" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="0-1">
                                                0-1 years
                                              </SelectItem>
                                              <SelectItem value="1-3">
                                                1-3 years
                                              </SelectItem>
                                              <SelectItem value="3-5">
                                                3-5 years
                                              </SelectItem>
                                              <SelectItem value="5+">
                                                5+ years
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      name="testingTypes"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Areas of Expertise
                                          </FormLabel>
                                          <div className="grid grid-cols-2 gap-3">
                                            {testingTypeOptions.map((item) => (
                                              <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="testingTypes"
                                                render={({ field }) => (
                                                  <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0"
                                                  >
                                                    <FormControl>
                                                      <Checkbox
                                                        checked={field.value?.includes(
                                                          item.id,
                                                        )}
                                                        onCheckedChange={(
                                                          checked,
                                                        ) => {
                                                          return checked
                                                            ? field.onChange([
                                                                ...(field.value ||
                                                                  []),
                                                                item.id,
                                                              ])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                  (
                                                                    value: string,
                                                                  ) =>
                                                                    value !==
                                                                    item.id,
                                                                ),
                                                              );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                                      {item.label}
                                                    </FormLabel>
                                                  </FormItem>
                                                )}
                                              />
                                            ))}
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      name="bio"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Professional Bio (Optional)
                                          </FormLabel>
                                          <FormControl>
                                            <Textarea
                                              className="resize-none"
                                              placeholder="Tell us about your experience..."
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}

                                {currentStep === 2 && (
                                  <div className="space-y-6 w-full max-w-lg mx-auto md:mx-0">
                                    <FormField
                                      control={form.control}
                                      name="devices"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Device Inventory
                                          </FormLabel>
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {deviceOptions.map((item) => (
                                              <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="devices"
                                                render={({ field }) => (
                                                  <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                  >
                                                    <FormControl>
                                                      <Checkbox
                                                        checked={field.value?.includes(
                                                          item.id,
                                                        )}
                                                        onCheckedChange={(
                                                          checked,
                                                        ) => {
                                                          return checked
                                                            ? field.onChange([
                                                                ...(field.value ||
                                                                  []),
                                                                item.id,
                                                              ])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                  (
                                                                    value: string,
                                                                  ) =>
                                                                    value !==
                                                                    item.id,
                                                                ),
                                                              );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                                      {item.label}
                                                    </FormLabel>
                                                  </FormItem>
                                                )}
                                              />
                                            ))}
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="osVersions"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Operating Systems
                                          </FormLabel>
                                          <div className="grid grid-cols-2 gap-3">
                                            {osOptions.map((item) => (
                                              <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="osVersions"
                                                render={({ field }) => (
                                                  <FormItem
                                                    key={item.id}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                  >
                                                    <FormControl>
                                                      <Checkbox
                                                        checked={field.value?.includes(
                                                          item.id,
                                                        )}
                                                        onCheckedChange={(
                                                          checked,
                                                        ) => {
                                                          return checked
                                                            ? field.onChange([
                                                                ...(field.value ||
                                                                  []),
                                                                item.id,
                                                              ])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                  (
                                                                    value: string,
                                                                  ) =>
                                                                    value !==
                                                                    item.id,
                                                                ),
                                                              );
                                                        }}
                                                      />
                                                    </FormControl>
                                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                                      {item.label}
                                                    </FormLabel>
                                                  </FormItem>
                                                )}
                                              />
                                            ))}
                                          </div>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      name="languages"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>
                                            Programming/Scripting Languages
                                            (Optional)
                                          </FormLabel>
                                          <FormControl>
                                            <Input
                                              placeholder="e.g., Python, JavaScript, Java"
                                              {...field}
                                            />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* Controls */}
                        <div className="mt-auto pt-4 border-t flex items-center justify-between gap-4  flex-col sm:flex-row">
                          <Button type="button" variant="ghost" onClick={prev}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to{" "}
                            {currentStep === 1 ? "Account Info" : "Experience"}
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
                                type="submit"
                              >
                                Submit Application
                              </LoadingButton>
                            )}
                          </div>
                        </div>
                        {isError && !isPending && (
                          <div className="bg-destructive/10 text-destructive p-3 rounded-md mt-4 text-sm">
                            {error?.message ||
                              "An error occurred during registration. Please try again."}
                          </div>
                        )}
                      </form>
                    </FormProvider>
                  </main>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
