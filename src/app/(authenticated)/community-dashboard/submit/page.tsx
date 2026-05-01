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
import {
  FileText,
  Link as LinkIcon,
  Users,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Zap,
  Clock,
  BookOpen,
  ArrowRight,
  PlayCircle,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FeedbackModal } from "@/components/feedback-modal";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { IconRain } from "@/components/icon-rain";
import { useGetUserWallet } from "@/hooks/useUser";
import {
  useAddHubApp,
  useAppCategories,
  useValidatePromoCode,
} from "@/hooks/useHub";
import SkeletonSubmitAppBottom from "@/components/community-dashboard/submit-app-bottom-skeleton";
import { LoadingButton } from "@/components/ui/loading-button";
import { ModernSlider } from "@/components/ui/modern-slider";
import dynamic from "next/dynamic";

const SubmissionSuccess = dynamic(() =>
  import("@/components/community-dashboard/submission-success").then(
    (mod) => mod.SubmissionSuccess,
  ),
);
const SubmissionError = dynamic(() =>
  import("@/components/community-dashboard/submission-error").then(
    (mod) => mod.SubmissionError,
  ),
);

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
  category_id: z.string().min(1, "Please select a category."),
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
  promo_code: z.string().optional(),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const formSteps = [
  {
    id: "rules",
    title: "Rules",
    icon: <BookOpen className="w-5 h-5" />,
    fields: [],
    description:
      "Read and understand the submission guidelines before you begin.",
  },
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
      "First, provide a link to your app on the Google Play Console closed testing track. This allows our testers to securely download it.",
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
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [cost, setCost] = useState(0);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    fixedPoints: number;
  } | null>(null);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);
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
    if (appliedPromo) {
      setCost(appliedPromo.fixedPoints);
    } else {
      const calculatedCost = testers * 80 + duration * 10;
      setCost(calculatedCost);
    }
  }, [testers, duration, appliedPromo]);

  const onSubmit = (data: SubmissionFormData) => {
    if (!data.category_id) {
      form.setError("category_id", {
        type: "manual",
        message: "Please select a category.",
      });
      return;
    }

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
      promo_code: appliedPromo?.code,
    });
  };

  const { ref: rulesRef, inView: rulesInView } = useInView({
    threshold: 0.5,
  });
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
    if (rulesInView) setActiveStep("rules");
    else if (connectInView) setActiveStep("connect");
    else if (describeInView) setActiveStep("describe");
    else if (configureInView) setActiveStep("configure");
  }, [rulesInView, connectInView, describeInView, configureInView]);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    mutate: validatePromoMutate,
    isPending: isValidatingPromo,
    isError: isValidPromoError,
    isSuccess: isValidPromoSuccess,
  } = useValidatePromoCode({
    onSuccess: (data: any) => {
      if (data && data.fixedPoints !== undefined) {
        setAppliedPromo({
          code: promoCodeInput,
          fixedPoints: data.fixedPoints,
        });
        setPromoCodeError(null);
      }
    },
    onError: (error: any) => {
      setPromoCodeError(error?.message || "Invalid or inactive promo code");
      setAppliedPromo(null);
    },
  });

  const handleApplyPromo = () => {
    setPromoCodeError(null);
    if (!promoCodeInput.trim()) {
      setPromoCodeError("Promo code is required");
      return;
    }
    validatePromoMutate({ code: promoCodeInput });
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput("");
    setPromoCodeError(null);
  };

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
            promo_code: "",
          }); // Reset to defaults or initial values
          setAppliedPromo(null);
          setPromoCodeInput("");
          setPromoCodeError(null);
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
      <div className="bg-brand-background min-h-screen">
        <PageHeader
          title="Submit"
          backHref="/community-dashboard"
          className="w-1/2 px-5 sm:px-10"
        />

        <div className="mx-auto px-2 py-5">
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
                    sectionRef={rulesRef}
                    id="rules"
                    title="1. Read the Guidelines"
                    description="Take a moment to understand how this process works. This will help you fill out the form correctly."
                  >
                    <div className="space-y-8">
                      <div className="rounded-xl overflow-hidden shadow-lg relative bg-gradient-to-br from-primary/50 to-primary">
                        {isMounted && <IconRain />}
                        {isVideoExpanded ? (
                          <div className="relative aspect-video">
                            <iframe
                              className="absolute top-0 left-0 w-full h-full"
                              src="https://www.youtube.com/embed/9M1Cv8V_I3U?autoplay=1"
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div
                            className="p-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer relative z-10"
                            onClick={() => setIsVideoExpanded(true)}
                          >
                            <div>
                              <h3 className="font-bold text-xl sm:text-2xl mb-1 flex flex-col sm:flex-row items-center sm:gap-3 text-white">
                                Quick Walkthrough{" "}
                                <span className="text-sm font-medium text-black">
                                  (2-min watch)
                                </span>
                              </h3>
                              <p className="text-white/80 text-sm text-center sm:text-start">
                                Watch a short video on how to submit your app for community testing.
                              </p>
                            </div>
                            <Button size="lg" variant="outline">
                              <PlayCircle className="mr-2 h-5 w-5" />
                              Watch Guide
                            </Button>
                          </div>
                        )}
                      </div>

                      <p className="text-center text-muted-foreground text-sm">
                        You can either watch the video above or follow the step-by-step guide below. Both cover the same process.
                      </p>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                      <AccordionItem
                        value="app-info"
                        className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
                      >
                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                          <div className="flex items-start flex-1">
                            <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">
                              01
                            </span>
                            <div>
                              <h3 className="font-bold text-xl mb-1">
                                Finding Your App Details
                              </h3>
                              <p className="text-muted-foreground text-sm text-left">
                                Where to get your testing link, logo, and screenshots
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="flex flex-col gap-6 items-start">
                            <div className="flex-1 space-y-4 text-muted-foreground">
                              <p>
                                To submit your app for testing, you need to share some links from the Google Play Console. Here is how to find each one:
                              </p>
                              <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                    Testing Link
                                  </p>
                                  <p className="text-sm">Go to your app in the Google Play Console. Click on <span className="font-medium text-foreground">Testing</span> from the left menu. Click on <span className="font-medium text-foreground">Closed Testing</span>. Click on the testers tab. Look for the "Join on the web" link and copy it. This is the link our testers will use to download your app.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                    App Logo
                                  </p>
                                  <p className="text-sm">Go to your app in Google Play Console. Click on <span className="font-medium text-foreground">Store presence</span> on the left menu. Click on <span className="font-medium text-foreground">Store listing</span>. Scroll down to <span className="font-medium text-foreground">Graphic Assets</span>. Find the App Icon section. Right-click on the icon and copy the image address. This is your logo URL.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                    Screenshots
                                  </p>
                                  <p className="text-sm">In the same Store listing page, scroll down to <span className="font-medium text-foreground">Screenshots</span>. Click on any screenshot. Right-click and copy the image address. You need to provide two screenshots. These help testers understand what your app looks like.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="points"
                        className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
                      >
                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                          <div className="flex items-start flex-1">
                            <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">
                              02
                            </span>
                            <div>
                              <h3 className="font-bold text-xl mb-1">
                                Understanding Points
                              </h3>
                              <p className="text-muted-foreground text-sm text-left">
                                How the point system works and how much it costs
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="flex flex-col gap-6 items-start">
                            <div className="flex-1 space-y-4 text-muted-foreground">
                              <p>
                                Points are the currency for our community testing. Here is how it works:
                              </p>
                              <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                    What are points?
                                  </p>
                                  <p className="text-sm">Points represent your budget for testing. When you submit an app, points are deducted based on how many testers you need and how long your test runs. You earn points when other community members test your apps.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                    How cost is calculated
                                  </p>
                                  <p className="text-sm">The total cost depends on two things. First, how many testers you want. Second, how many days your test should run. More testers and longer tests mean higher costs. The formula is simple. Multiply testers by 80. Multiply days by 10. Add both numbers together to get your total cost.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                    Checking your balance
                                  </p>
                                  <p className="text-sm">You can see your current point balance on your dashboard. If you do not have enough points, you can still submit but it will be reviewed once you earn more points from testing other apps.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem
                        value="test-config"
                        className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
                      >
                        <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                          <div className="flex items-start flex-1">
                            <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">
                              03
                            </span>
                            <div>
                              <h3 className="font-bold text-xl mb-1">
                                Setting Up Your Test
                              </h3>
                              <p className="text-muted-foreground text-sm text-left">
                                How to choose testers, duration, and Android version
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="flex flex-col gap-6 items-start">
                            <div className="flex-1 space-y-4 text-muted-foreground">
                              <p>
                                When you configure your test, you need to decide three things:
                              </p>
                              <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                    Number of testers
                                  </p>
                                  <p className="text-sm">Choose how many testers you want for your app. We recommend at least 15 testers because some testers may drop out during the testing period. Each tester must complete testing within the time limit you set. The more testers you choose, the more points the test will cost.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                    Test duration
                                  </p>
                                  <p className="text-sm">Choose how many days testers have to complete their testing. The minimum is 14 days. We recommend 16 to 20 days because testers have different schedules. Longer durations give testers more flexibility to provide thorough feedback. Each extra day adds to your total cost.</p>
                                </div>
                                <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                  <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                    Minimum Android version
                                  </p>
                                  <p className="text-sm">Select the oldest Android version your app supports. This helps us match testers who have devices that can run your app. If your app works on Android 8, select Android 8.0 from the list. Only testers with devices running that version or newer will be assigned to your test.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    </div>
                  </Section>

                  <Section
                    sectionRef={connectRef}
                    id="connect"
                    title="2. Connect Your App"
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
                    title="3. Describe Your Project"
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
                    title="4. Configure Your Test"
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
                                <ModernSlider
                                  value={field.value}
                                  onChange={field.onChange}
                                  min={1}
                                  max={20}
                                  label=""
                                  unit="testers"
                                  accentColor="primary"
                                />
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
                                <ModernSlider
                                  value={field.value}
                                  onChange={field.onChange}
                                  min={1}
                                  max={20}
                                  label=""
                                  unit="days"
                                  accentColor="primary"
                                />
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

                                {/* Promo Code Section (Moved to Card bottom) */}
                                <div className="mt-4 space-y-3">
                                  <div className="flex gap-2 items-center">
                                    <Input
                                      id="promo_code"
                                      placeholder="Have a promo code?"
                                      value={promoCodeInput}
                                      onChange={(e) =>
                                        setPromoCodeInput(e.target.value)
                                      }
                                      disabled={
                                        !!appliedPromo || isValidatingPromo
                                      }
                                      className="max-w-[200px] h-9 bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-white/20"
                                    />
                                    {!appliedPromo ? (
                                      <LoadingButton
                                        type="button"
                                        className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white border-0"
                                        onClick={handleApplyPromo}
                                        isLoading={isValidatingPromo}
                                        isError={isValidPromoError}
                                        isSuccess={isValidPromoSuccess}
                                        showSuccessState={false}
                                      >
                                        Apply
                                      </LoadingButton>
                                    ) : (
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        className="h-9 px-4 bg-red-500/80 hover:bg-red-500/90 text-white border-0"
                                        onClick={handleRemovePromo}
                                      >
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                  {appliedPromo && (
                                    <p className="text-emerald-400 font-medium text-xs flex items-center gap-1.5">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Promo applied! Cost reduced to{" "}
                                      {appliedPromo.fixedPoints}.
                                    </p>
                                  )}
                                  {promoCodeError && !appliedPromo && (
                                    <p className="text-red-400 font-medium text-xs flex items-center gap-1.5">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      {promoCodeError}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Decorative 'Chip' */}
                              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-12 h-16 rounded-lg bg-gradient-to-br from-yellow-200/20 to-yellow-500/10 border border-white/10 backdrop-blur-sm opacity-50 hidden sm:block"></div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col items-end gap-3 w-full">
                          <LoadingButton
                              className="rounded-xl"
                              isLoading={addHubAppIsPending}
                              isSuccess={addHubAppIsSuccess}
                              isError={addHubAppIsError}
                              disabled={isBalanceInsufficient || !isMounted}
                              onClick={() => form.handleSubmit(onSubmit)()}
                            >
                              Submit for Review
                            </LoadingButton>
                          {Object.keys(form.formState.errors).length > 0 && (
                            <div className="text-destructive text-sm font-medium animate-pulse flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              Please fix the errors above before submitting.
                            </div>
                          )}
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

      <FeedbackModal
        open={isErrorModalOpen}
        onOpenChange={setIsErrorModalOpen}
        status="error"
        title="Insufficient Points"
        description={`You do not have enough points to fund this test configuration. Your current balance is ${(walletData?.totalPoints || 0).toLocaleString()} points, but you need ${cost.toLocaleString()} points.`}
        primaryAction={{
          label: "Okay, I'll adjust",
          onClick: () => setIsErrorModalOpen(false),
        }}
        secondaryAction={{
          label: "Go to Community Hub",
          onClick: () => router.push("/community-dashboard"),
        }}
      />
    </>
  );
}
