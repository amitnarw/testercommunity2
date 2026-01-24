"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  FileText,
  Link as LinkIcon,
  Users,
  AlertCircle,
  Wallet,
  CheckCircle2,
  XCircle,
  CreditCard,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { useGetUserWallet } from "@/hooks/useUser";
import { useAddHubApp, useAppCategories } from "@/hooks/useHub";
import SkeletonSubmitAppBottom from "@/components/community-dashboard/submit-app-bottom-skeleton";
import { LoadingButton } from "@/components/ui/loading-button";

const minimum_android_versions = [
  { name: "Android 5.0 (Lollipop)", value: 5.0 },
  { name: "Android 5.1 (Lollipop)", value: 5.1 },
  { name: "Android 6.0 (Marshmallow)", value: 6.0 },
  { name: "Android 7.0 (Nougat)", value: 7.0 },
  { name: "Android 7.1 (Nougat)", value: 7.1 },
  { name: "Android 8.0 (Oreo)", value: 8.0 },
  { name: "Android 8.1 (Oreo)", value: 8.1 },
  { name: "Android 9 (Pie)", value: 9.0 },
  { name: "Android 10 (Quince Tart)", value: 10.0 },
  { name: "Android 11 (Red Velvet Cake)", value: 11.0 },
  { name: "Android 12 (Snow Cone)", value: 12.0 },
  { name: "Android 12L (Snow Cone v2)", value: 12.1 },
  { name: "Android 13 (Tiramisu)", value: 13.0 },
  { name: "Android 14 (Upside Down Cake)", value: 14.0 },
  { name: "Android 15 (Vanilla Ice Cream)", value: 15.0 },
  { name: "Android 16 (Baklava)", value: 16.0 },
];

const submissionSchema = z.object({
  app_url: z.string().url("Please enter a valid Google Play testing URL."),
  app_name: z.string().min(3, "App name must be at least 3 characters."),
  app_logo_url: z.string().url("Please enter a valid URL for the app logo."),
  app_screenshot_url_1: z
    .string()
    .url("Please enter a valid URL for the first screenshot."),
  app_screenshot_url_2: z
    .string()
    .url("Please enter a valid URL for the second screenshot."),
  category_id: z.string({ required_error: "Please select a category." }),
  app_description: z
    .string()
    .min(
      50,
      "Please provide a detailed description of at least 50 characters.",
    ),
  instruction_for_tester: z.string().optional(),
  minimum_android_version: z.coerce
    .number()
    .min(1, "Please specify the minimum Android version."),
  total_tester: z.coerce.number().min(1).max(20),
  total_days: z.coerce.number().min(1).max(20),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const formSteps = [
  {
    id: "connect",
    title: "Connect",
    icon: <LinkIcon className="w-5 h-5" />,
    fields: [
      "app_name",
      "app_url",
      "app_logo_url",
      "app_screenshot_url_1",
      "app_screenshot_url_2",
    ],
    description:
      "First, provide a link to your app on the Google Play Console internal testing track. This allows our testers to securely download it.",
  },
  {
    id: "describe",
    title: "Describe",
    icon: <FileText className="w-5 h-5" />,
    fields: ["category_id", "app_description", "instruction_for_tester"],
    description:
      "Tell us about your app and what you want testers to focus on. The more detail, the better the feedback.",
  },
  {
    id: "configure",
    title: "Configure",
    icon: <Users className="w-5 h-5" />,
    fields: ["minimum_android_version", "total_tester", "total_days"],
    description:
      "Finally, set the technical parameters and choose how many testers you need. Points will be deducted after admin review.",
  },
];

const Section = ({
  id,
  title,
  description,
  children,
  sectionRef,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
  sectionRef: React.Ref<HTMLDivElement>;
}) => {
  return (
    <section
      ref={sectionRef}
      id={id}
      className="min-h-[85vh] flex flex-col justify-center scroll-mt-10 py-16"
    >
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold">{title}</h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
};

export default function SubmitAppPage() {
  const [activeStep, setActiveStep] = useState(formSteps[0].id);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [cost, setCost] = useState(0);
  const router = useRouter();

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: {
      app_name: "",
      app_url: "",
      app_logo_url: "",
      app_screenshot_url_1: "",
      app_screenshot_url_2: "",
      category_id: "",
      app_description: "",
      instruction_for_tester: "",
      total_tester: 10,
      total_days: 14,
    },
  });

  const testers = form.watch("total_tester");
  const duration = form.watch("total_days");

  useEffect(() => {
    const calculatedCost = testers * 80 + duration * 10;
    setCost(calculatedCost);
  }, [testers, duration]);

  const onSubmit = (data: SubmissionFormData) => {
    if (isBalanceInsufficient) {
      setIsErrorModalOpen(true);
      return;
    }

    addHubAppMutate({
      app_name: data.app_name,
      app_url: data.app_url,
      app_logo_url: data.app_logo_url,
      app_screenshot_url_1: data.app_screenshot_url_1,
      app_screenshot_url_2: data.app_screenshot_url_2,
      category_id: data.category_id,
      app_description: data.app_description,
      instruction_for_tester: data.instruction_for_tester || "",
      minimum_android_version: data.minimum_android_version,
      total_tester: data.total_tester,
      total_days: data.total_days,
      points_cost: cost,
    });
  };

  const { ref: connectRef, inView: connectInView } = useInView({
    threshold: 0.5,
  });
  const { ref: describeRef, inView: describeInView } = useInView({
    threshold: 0.5,
  });
  const { ref: configureRef, inView: configureInView } = useInView({
    threshold: 0.4,
  });

  useEffect(() => {
    if (connectInView) setActiveStep("connect");
    else if (describeInView) setActiveStep("describe");
    else if (configureInView) setActiveStep("configure");
  }, [connectInView, describeInView, configureInView]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: walletData,
    isPending: walletIsPending,
    isError: walletIsError,
    error: walletError,
  } = useGetUserWallet();

  const {
    data: appCategoriesData,
    isPending: appCategoriesIsPending,
    isError: appCategoriesIsError,
    error: appCategoriesError,
  } = useAppCategories();

  const isBalanceInsufficient = cost > (walletData?.totalPoints || 0);

  const {
    mutate: addHubAppMutate,
    isPending: addHubAppIsPending,
    isSuccess: addHubAppIsSuccess,
    isError: addHubAppIsError,
    error: addHubAppError,
    reset: addHubAppReset,
  } = useAddHubApp();

  if (!isMounted) {
    return null;
  }

  if (addHubAppIsSuccess) {
    return (
      <SubmissionSuccess
        onReturn={() => router.push("/community-dashboard")}
        onSubmitAnother={() => {
          addHubAppReset();
          form.reset({
            total_tester: 10,
            total_days: 14,
          }); // Reset to defaults or initial values
          setActiveStep(formSteps[0].id);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  if (addHubAppIsError) {
    return (
      <SubmissionError
        error={addHubAppError}
        onRetry={() => {
          addHubAppReset();
          // Optional: Scroll to top or specific error
        }}
      />
    );
  }

  return (
    <>
      <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen">
        <PageHeader
          title="Submit"
          backHref="/community-dashboard"
          className="w-1/2 px-5 sm:px-10"
        />

        <div className="container mx-auto px-2 py-5">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 bg-background rounded-3xl px-3 sm:px-5">
            {/* Mobile Step Navigator */}
            <nav className="lg:hidden sticky top-12 sm:top-14 z-30 flex items-center justify-around border-b bg-background/80 backdrop-blur-lg">
              {formSteps.map((step) => (
                <a
                  key={`mobile-${step.id}`}
                  href={`#${step.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById(step.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 text-center p-3 text-sm font-medium transition-all text-muted-foreground relative",
                    activeStep === step.id && "text-primary",
                  )}
                >
                  {step.title}
                  {activeStep === step.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="mobile-active-step-indicator"
                    />
                  )}
                </a>
              ))}
            </nav>
            <aside className="hidden lg:block lg:col-span-3 py-16">
              <div className="sticky top-36">
                <nav>
                  <ul className="space-y-2">
                    {formSteps.map((step) => (
                      <li key={step.id}>
                        <a
                          href={`#${step.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            document
                              .getElementById(step.id)
                              ?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                            activeStep === step.id
                              ? "bg-primary/10 text-primary"
                              : "text-muted-foreground hover:bg-secondary/50",
                          )}
                        >
                          <div
                            className={cn(
                              "p-2 rounded-full flex items-center justify-center border-2 transition-all",
                              activeStep === step.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary border-border group-hover:border-primary/50",
                            )}
                          >
                            {step.icon}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-bold transition-all",
                                activeStep === step.id
                                  ? "text-primary"
                                  : "text-foreground",
                              )}
                            >
                              {step.title}
                            </p>
                            <p className="text-xs">
                              {step.description.split(".")[0]}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </aside>
            <main className="lg:col-span-9">
              <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <Section
                    sectionRef={connectRef}
                    id="connect"
                    title="1. Connect Your App"
                    description="Provide the essential links and name for your project."
                  >
                    <Card className="bg-secondary/30 border-dashed">
                      <CardContent className="grid md:grid-cols-2 gap-6 sm:gap-6 p-3 sm:p-6">
                        <FormField
                          control={form.control}
                          name="app_url"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_url">
                                Google Play Testing Link
                              </Label>
                              <FormControl>
                                <Input
                                  id="app_url"
                                  placeholder="https://play.google.com/apps/testing/..."
                                  {...field}
                                  className="py-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="app_name"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_name">App Name</Label>
                              <FormControl>
                                <Input
                                  id="app_name"
                                  placeholder="e.g., PhotoSnap Editor"
                                  {...field}
                                  className="py-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="app_logo_url"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_logo_url">App Logo URL</Label>
                              <FormControl>
                                <Input
                                  id="app_logo_url"
                                  placeholder="https://play-lh.googleusercontent.com/..."
                                  {...field}
                                  className="py-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="app_screenshot_url_1"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_screenshot_url_1">
                                Screenshot 1 URL
                              </Label>
                              <FormControl>
                                <Input
                                  id="app_screenshot_url_1"
                                  placeholder="https://play-lh.googleusercontent.com/..."
                                  {...field}
                                  className="py-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="app_screenshot_url_2"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_screenshot_url_2">
                                Screenshot 2 URL
                              </Label>
                              <FormControl>
                                <Input
                                  id="app_screenshot_url_2"
                                  placeholder="https://play-lh.googleusercontent.com/..."
                                  {...field}
                                  className="py-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </Section>

                  <Section
                    sectionRef={describeRef}
                    id="describe"
                    title="2. Describe Your Project"
                    description="Give testers the context they need for quality feedback."
                  >
                    <Card className="bg-secondary/30 border-dashed">
                      <CardContent className="p-3 sm:p-6 space-y-6">
                        <FormField
                          control={form.control}
                          name="category_id"
                          render={({ field }) => (
                            <FormItem>
                              <Label>Category</Label>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="py-0">
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {appCategoriesData?.map((category_id) => (
                                    <SelectItem
                                      key={category_id?.id}
                                      value={category_id?.id?.toString()}
                                    >
                                      {category_id?.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="app_description"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="app_description">
                                App Description
                              </Label>
                              <FormControl>
                                <Textarea
                                  id="app_description"
                                  placeholder="Briefly describe what your app does."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="instruction_for_tester"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="instruction_for_tester">
                                Instructions for Testers{" "}
                                <span className="text-muted-foreground ml-1">
                                  (Optional)
                                </span>
                              </Label>
                              <FormControl>
                                <Textarea
                                  id="instruction_for_tester"
                                  placeholder="Any specific areas or features you want testers to focus on? (e.g., 'Please test the new checkout flow')."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                    </Card>
                  </Section>

                  <Section
                    sectionRef={configureRef}
                    id="configure"
                    title="3. Configure Your Test"
                    description="Set the final parameters for your testing cycle. You must have enough earned points to cover this budget."
                  >
                    <Card className="bg-secondary/30 border-dashed">
                      <CardContent className="p-3 sm:p-6 grid md:grid-cols-1 gap-8">
                        <FormField
                          control={form.control}
                          name="minimum_android_version"
                          render={({ field }) => (
                            <FormItem>
                              <Label htmlFor="minimum_android_version">
                                Min. Android Version
                              </Label>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger className="py-0">
                                    <SelectValue placeholder="Select Android version" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {minimum_android_versions.map(
                                    (version: {
                                      name: string;
                                      value: number;
                                    }) => (
                                      <SelectItem
                                        key={version.value}
                                        value={version.value.toString()}
                                      >
                                        {version.name}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="total_tester"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Testers</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-4">
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={1}
                                    max={20}
                                    step={1}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                    className={cn("w-[85%]", field.name)}
                                  />
                                  <div className="font-bold text-lg text-primary w-[15%] text-center">
                                    {field.value}
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="mt-4 flex items-start gap-2 bg-secondary/80 p-3 rounded-lg border border-border">
                                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span>
                                  <span className="font-semibold text-foreground">
                                    Pro Tip:
                                  </span>{" "}
                                  We recommend selecting at least 15-20 testers.
                                  Since community testers can drop out, choosing
                                  extra provides a buffer to ensure you meet
                                  Google's 14-day/12-tester requirement without
                                  delays.
                                </span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="total_days"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Test Duration (Days)</FormLabel>
                              <FormControl>
                                <div className="flex items-center gap-4">
                                  <Slider
                                    defaultValue={[field.value]}
                                    min={1}
                                    max={20}
                                    step={1}
                                    onValueChange={(value) =>
                                      field.onChange(value[0])
                                    }
                                    className={cn("w-[85%]", field.name)}
                                  />
                                  <div className="font-bold text-lg text-primary w-[15%] text-center">
                                    {field.value}
                                  </div>
                                </div>
                              </FormControl>
                              <FormDescription className="mt-4 flex items-start gap-2 bg-secondary/80 p-3 rounded-lg border border-border">
                                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <span>
                                  <span className="font-semibold text-foreground">
                                    Pro Tip:
                                  </span>{" "}
                                  While the minimum is 14 days, we suggest 16-20
                                  days. This gives community testers a flexible
                                  window to complete the test period without
                                  pressure.
                                </span>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {walletIsPending ? (
                          <SkeletonSubmitAppBottom />
                        ) : (
                          <div className="mt-8 flex justify-center">
                            {/* Premium Card Design */}
                            <div
                              className={cn(
                                "relative w-full overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500",
                                isBalanceInsufficient
                                  ? "bg-gradient-to-br from-red-600 to-rose-900 shadow-red-900/20"
                                  : "bg-gradient-to-br from-[#1e293b] via-[#334155] to-[#0f172a] shadow-blue-900/20 dark:from-slate-900 dark:via-slate-800 dark:to-black",
                              )}
                            >
                              {/* Background Pattern/Noise */}
                              <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay pointer-events-none"></div>
                              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
                              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>

                              <div className="relative z-10 flex flex-col justify-between h-full min-h-[220px]">
                                {/* Card Header */}
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                                      <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <div>
                                      <p className="text-xs font-semibold text-white/60 tracking-widest uppercase">
                                        COMMUNITY POINTS
                                      </p>
                                      <p className="text-white text-sm font-medium tracking-wide">
                                        Virtual Card
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-end">
                                    <div className="text-white/80">
                                      <TrendingUp className="w-6 h-6" />
                                    </div>
                                  </div>
                                </div>

                                {/* Main Balance/Cost Display */}
                                <div className="my-6">
                                  <p className="text-sm text-white/60 font-medium mb-1">
                                    Total Campaign Cost
                                  </p>
                                  <div className="flex items-baseline gap-2">
                                    <h2 className="text-5xl sm:text-6xl font-bold text-white tracking-tighter">
                                      {cost.toLocaleString()}
                                    </h2>
                                    <span className="text-xl text-white/60 font-medium">
                                      pts
                                    </span>
                                  </div>
                                  {isBalanceInsufficient && (
                                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
                                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                      Exceeds Balance
                                    </div>
                                  )}
                                </div>

                                {/* Card Footer / Progress */}
                                <div className="space-y-4">
                                  <div className="flex justify-between items-end text-sm">
                                    <div className="flex flex-col">
                                      <span className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">
                                        Wallet Balance
                                      </span>
                                      <span className="text-2xl font-semibold text-white tracking-tight">
                                        {(
                                          walletData?.totalPoints || 0
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span
                                        className={cn(
                                          "text-xs font-bold px-2 py-1 rounded bg-white/10 backdrop-blur border border-white/5",
                                          isBalanceInsufficient
                                            ? "text-red-200"
                                            : "text-emerald-300",
                                        )}
                                      >
                                        {isBalanceInsufficient
                                          ? "INSUFFICIENT FUNDS"
                                          : "SUFFICIENT FUNDS"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Glassy Progress Bar */}
                                  <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div
                                      className={cn(
                                        "absolute top-0 left-0 h-full transition-all duration-700 ease-out rounded-full",
                                        isBalanceInsufficient
                                          ? "bg-white/40 w-full"
                                          : "bg-emerald-400 w-[var(--prog)] shadow-[0_0_10px_2px_rgba(52,211,153,0.5)]",
                                      )}
                                      style={
                                        {
                                          "--prog": `${Math.min(
                                            (cost /
                                              (walletData?.totalPoints || 1)) *
                                              100,
                                            100,
                                          )}%`,
                                        } as React.CSSProperties
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Decorative 'Chip' */}
                              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-12 h-16 rounded-lg bg-gradient-to-br from-yellow-200/20 to-yellow-500/10 border border-white/10 backdrop-blur-sm opacity-50 hidden sm:block"></div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-row items-center justify-end gap-1 sm:gap-3 w-full">
                          <div
                            onClick={form.handleSubmit(onSubmit)}
                            className={cn(
                              "cursor-pointer",
                              isBalanceInsufficient &&
                                "cursor-not-allowed opacity-50",
                            )}
                          >
                            <LoadingButton
                              className="rounded-xl"
                              isLoading={addHubAppIsPending}
                              isSuccess={addHubAppIsSuccess}
                              isError={addHubAppIsError}
                            >
                              Submit for Review
                            </LoadingButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Section>
                </form>
              </FormProvider>
            </main>
          </div>
        </div>
      </div>

      <AlertDialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Insufficient Points</AlertDialogTitle>
            <AlertDialogDescription>
              You do not have enough points to fund this test configuration.
              Your current balance is{" "}
              {(walletData?.totalPoints || 0).toLocaleString()} points, but you
              need {cost.toLocaleString()} points.
              <br />
              <br />
              Please either reduce the number of testers or earn more points by
              testing other apps in the Community Hub.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setIsErrorModalOpen(false)}>
              Okay, I'll adjust
            </Button>
            <Button variant="outline" asChild>
              <Link href="/community-dashboard">Go to Community Hub</Link>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// ----------------------------------------------------------------------
// Success View Component
// ----------------------------------------------------------------------

function SubmissionSuccess({
  onReturn,
  onSubmitAnother,
}: {
  onReturn: () => void;
  onSubmitAnother: () => void;
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative p-4 sm:p-12 flex flex-col items-center text-center">
          {/* Confetti / Decoration Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute top-10 left-10 w-2 h-2 rounded-full bg-emerald-400"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-20 right-20 w-3 h-3 rounded-full bg-blue-400"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="absolute bottom-20 left-20 w-2 h-2 rounded-full bg-purple-400"
            />
          </div>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-foreground mb-3"
          >
            Submission Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-8 max-w-sm"
          >
            Your app has been successfully submitted to the Community Hub. We
            will review it shortly to ensure it meets our quality standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <Button size="lg" className="w-full flex-1 py-3" onClick={onReturn}>
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={onSubmitAnother}
            >
              Submit Another
            </Button>
          </motion.div>
        </div>

        {/* Footer info */}
        <div className="bg-secondary/30 p-4 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            Need help?{" "}
            <a href="#" className="underline hover:text-primary">
              Contact Support
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Error View Component
// ----------------------------------------------------------------------

function SubmissionError({
  error,
  onRetry,
}: {
  error: any;
  onRetry: () => void;
}) {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f151e] min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-xl w-full bg-background rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="p-4 py-8 sm:p-12 flex flex-col items-center text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1,
            }}
            className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6 ring-8 ring-red-50 dark:ring-red-900/10"
          >
            <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-tight text-foreground mb-3"
          >
            Submission Failed
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground mb-2 max-w-sm"
          >
            We encountered an issue while submitting your app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg text-sm font-medium mb-8 max-w-full break-words"
          >
            {error?.message ||
              "An unexpected error occurred. Please try again."}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={onRetry}
              className="w-full sm:min-w-[200px]"
            >
              Try Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
