"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FileText,
  Link as LinkIcon,
  Users,
  CheckCircle2,
  BookOpen,
  PlayCircle,
  Check,
  Clipboard,
  Info,
} from "lucide-react";

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
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconRain } from "@/components/icon-rain";
import { LoadingButton } from "@/components/ui/loading-button";
import { ModernSlider } from "@/components/ui/modern-slider";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useAppCategories } from "@/hooks/useHub";

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
    .url("Please enter a valid URL for the first screenshot.")
    .optional()
    .or(z.literal("")),
  app_screenshot_url_2: z
    .string()
    .url("Please enter a valid URL for the second screenshot.")
    .optional()
    .or(z.literal("")),
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
  promo_code: z.string().regex(/^[A-Z0-9]+$/, "Promo code must be alphanumeric").optional().or(z.literal("")),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const formSteps = [
  {
    id: "rules",
    title: "Rules",
    icon: <BookOpen className="w-5 h-5" />,
    fields: [],
    description: "Read and understand the submission guidelines before you begin.",
  },
  {
    id: "connect",
    title: "Connect",
    icon: <LinkIcon className="w-5 h-5" />,
    fields: ["app_name", "app_url", "app_logo_url", "app_screenshot_url_1", "app_screenshot_url_2"],
    description: "First, provide a link to your app on the Google Play Console closed testing track.",
  },
  {
    id: "describe",
    title: "Describe",
    icon: <FileText className="w-5 h-5" />,
    fields: ["category_id", "app_description", "instruction_for_tester"],
    description: "Tell us about your app and what you want testers to focus on.",
  },
  {
    id: "configure",
    title: "Configure",
    icon: <Users className="w-5 h-5" />,
    fields: ["minimum_android_version", "total_tester", "total_days"],
    description: "Finally, set the technical parameters and choose how many testers you need.",
  },
];

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span className="bg-primary/20 text-primary font-semibold px-1.5 py-0.5 rounded-md">
    {children}
  </span>
);

const CopyBlock = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-secondary/50 p-4 py-2 rounded-lg flex items-center justify-between my-4">
      <code className="text-sm text-muted-foreground">{textToCopy}</code>
      <Button variant="ghost" size="icon" type="button" onClick={handleCopy}>
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Clipboard className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

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

interface SubmissionFormProps {
  initialData?: Partial<SubmissionFormData>;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  mode?: "create" | "edit";
  variant?: "free" | "handshake";
  onCancel?: () => void;
}

export function SubmissionForm({
  initialData,
  onSubmit,
  isPending,
  isSuccess,
  isError,
  mode = "create",
  variant = "handshake",
  onCancel,
}: SubmissionFormProps) {
  const isHandshake = variant === "handshake";
  const [activeStep, setActiveStep] = useState(formSteps[0].id);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<string | null>(null);

  // Screenshots stay mandatory for Pro/PAID submissions; handshake only
  // requires App Name + Link + Logo, so the refinement is variant-aware.
  const resolverSchema = useMemo(
    () =>
      isHandshake
        ? submissionSchema
        : submissionSchema.superRefine((data, ctx) => {
            const requireScreenshotUrl = (
              field: "app_screenshot_url_1" | "app_screenshot_url_2",
              message: string,
            ) => {
              const value = data[field];
              if (!value || !z.string().url().safeParse(value).success) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message });
              }
            };
            requireScreenshotUrl(
              "app_screenshot_url_1",
              "Please enter a valid URL for the first screenshot.",
            );
            requireScreenshotUrl(
              "app_screenshot_url_2",
              "Please enter a valid URL for the second screenshot.",
            );
          }),
    [isHandshake],
  );

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(resolverSchema),
    mode: "onBlur",
    defaultValues: {
      app_name: initialData?.app_name || "",
      app_url: initialData?.app_url || "",
      app_logo_url: initialData?.app_logo_url || "",
      app_screenshot_url_1: initialData?.app_screenshot_url_1 || "",
      app_screenshot_url_2: initialData?.app_screenshot_url_2 || "",
      category_id: initialData?.category_id || "",
      app_description: initialData?.app_description || "",
      instruction_for_tester: initialData?.instruction_for_tester || "",
      total_tester: initialData?.total_tester || 10,
      total_days: initialData?.total_days || 14,
      minimum_android_version: initialData?.minimum_android_version ?? undefined,
    },
  });

  // S9: points cost / promo machinery removed , submissions are free.

  // Spec §2.1: Handshake Testing is free. No subscription check needed.

  const { ref: rulesRef, inView: rulesInView } = useInView({ threshold: 0.5 });
  const { ref: connectRef, inView: connectInView } = useInView({ threshold: 0.5 });
  const { ref: describeRef, inView: describeInView } = useInView({ threshold: 0.5 });
  const { ref: configureRef, inView: configureInView } = useInView({ threshold: 0.4 });

  useEffect(() => {
    if (rulesInView) setActiveStep("rules");
    else if (connectInView) setActiveStep("connect");
    else if (describeInView) setActiveStep("describe");
    else if (configureInView) setActiveStep("configure");
  }, [rulesInView, connectInView, describeInView, configureInView]);

  const { data: appCategoriesData } = useAppCategories();

  const watchedFields = form.watch();

  const getPendingRequirements = () => {
    const requirements = [];
    if (!watchedFields.app_name || watchedFields.app_name.length < 3)
      requirements.push("App Name (min 3 chars)");
    if (!watchedFields.app_url || !watchedFields.app_url.startsWith("http"))
      requirements.push("Valid Google Play URL");
    if (
      !watchedFields.app_logo_url ||
      !watchedFields.app_logo_url.startsWith("http")
    )
      requirements.push("App Logo URL");
    if (
      !isHandshake &&
      (!watchedFields.app_screenshot_url_1 ||
        !watchedFields.app_screenshot_url_1.startsWith("http"))
    )
      requirements.push("Screenshot 1");
    if (
      !isHandshake &&
      (!watchedFields.app_screenshot_url_2 ||
        !watchedFields.app_screenshot_url_2.startsWith("http"))
    )
      requirements.push("Screenshot 2");
    if (!watchedFields.category_id) requirements.push("Category Selection");
    if (
      !watchedFields.app_description ||
      watchedFields.app_description.length < 50
    )
      requirements.push("Description (min 50 chars)");
    if (!watchedFields.minimum_android_version)
      requirements.push("Minimum Android Version");

    if (mode === "edit") {
      const hasChanges =
        watchedFields.app_name !== initialData?.app_name ||
        watchedFields.app_url !== initialData?.app_url ||
        watchedFields.app_logo_url !== initialData?.app_logo_url ||
        watchedFields.app_screenshot_url_1 !== initialData?.app_screenshot_url_1 ||
        watchedFields.app_screenshot_url_2 !== initialData?.app_screenshot_url_2 ||
        watchedFields.category_id !== initialData?.category_id ||
        watchedFields.app_description !== initialData?.app_description ||
        watchedFields.instruction_for_tester !== initialData?.instruction_for_tester ||
        watchedFields.minimum_android_version !== initialData?.minimum_android_version;

      if (!hasChanges) requirements.push("At least one change");
    }

    // S9: no balance requirement , submissions are free.
    return requirements;
  };

  const pendingRequirements = getPendingRequirements();
  const isSubmitDisabled = isPending;

  const onInvalid = (errors: any) => {
    const errorFields = Object.keys(errors);
    if (errorFields.length > 0) {
      const firstField = errorFields[0];
      const element = document.getElementById(firstField);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          element.focus();
        }, 500);
      }
    }
  };

  const handleFormSubmit = (data: SubmissionFormData) => {
    // S9: no balance gate , submissions are free.

    if (mode === "edit") {
      const hasChanges =
        watchedFields.app_name !== initialData?.app_name ||
        watchedFields.app_url !== initialData?.app_url ||
        watchedFields.app_logo_url !== initialData?.app_logo_url ||
        watchedFields.app_screenshot_url_1 !== initialData?.app_screenshot_url_1 ||
        watchedFields.app_screenshot_url_2 !== initialData?.app_screenshot_url_2 ||
        watchedFields.category_id !== initialData?.category_id ||
        watchedFields.app_description !== initialData?.app_description ||
        watchedFields.instruction_for_tester !== initialData?.instruction_for_tester ||
        watchedFields.minimum_android_version !== initialData?.minimum_android_version;

      if (!hasChanges) {
        form.setError("app_name", { message: "Please make at least one change before resubmitting." });
        const element = document.getElementById("app_name");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    if (isHandshake) {
      onSubmit({
        ...data,
        appType: "HANDSHAKE",
        // Fixed campaign setup (Spec v2): 14 testers x 16 days. Backend
        // ignores client values anyway, but we send the canonical numbers.
        total_tester: 14,
        total_days: 16,
      });
    } else {
      // S9: no points cost / promo â€” submissions are free.
      onSubmit({ ...data });
    }
  };

  const TooltipWithClick = ({ id, content }: { id: string; content: string }) => {
    const isOpen = hoveredTooltip === id || pinnedTooltip === id;
    return (
      <Tooltip open={isOpen} onOpenChange={(open) => {
        if (!open) {
          setPinnedTooltip(null);
          setHoveredTooltip(null);
        }
      }}>
        <TooltipTrigger asChild>
          <span
            className="inline-flex items-center justify-center text-foreground/40 hover:text-foreground h-6 w-6 cursor-pointer"
            data-info-button
            onClick={() => setPinnedTooltip(prev => prev === id ? null : id)}
            onPointerEnter={() => setHoveredTooltip(id)}
            onPointerLeave={() => setHoveredTooltip(null)}
          >
            <Info className="h-4 w-4" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-16 bg-background rounded-3xl px-3 sm:px-5">
      {/* Mobile Step Navigator */}
      <nav className="lg:hidden sticky top-0 z-30 flex items-center justify-around border-b bg-background/80 backdrop-blur-lg">
        {formSteps.map((step) => (
          <a
            key={`mobile-${step.id}`}
            href={`#${step.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth" });
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
                      document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth" });
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
                      <p className={cn("font-bold transition-all", activeStep === step.id ? "text-primary" : "text-foreground")}>
                        {step.title}
                      </p>
                      <p className="text-xs">{step.description.split(".")[0]}</p>
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
          <form onSubmit={form.handleSubmit(handleFormSubmit, onInvalid)}>
            <Section
              sectionRef={rulesRef}
              id="rules"
              title="1. Read the Guidelines"
              description="Take a moment to understand how this process works."
            >
              <div className="space-y-8">
                <div className="rounded-xl overflow-hidden shadow-lg relative bg-gradient-to-br from-primary/50 to-primary">
                  <IconRain />
                  {isVideoExpanded ? (
                    <div className="relative aspect-video">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube-nocookie.com/embed/9V6kyq8z4UQ?autoplay=1"
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
                          Quick Walkthrough <span className="text-sm font-medium text-black">(2-min watch)</span>
                        </h3>
                        <p className="text-white/80 text-sm text-center sm:text-start">
                          Watch a short video on how to submit your app for handshake testing.
                        </p>
                      </div>
                      <Button size="lg" variant="outline" type="button">
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
                    value="prepare-app"
                    className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
                  >
                    <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                      <div className="flex items-start flex-1">
                        <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">
                          01
                        </span>
                        <div>
                          <h3 className="font-bold text-xl mb-1">
                            Prepare App for Testing
                          </h3>
                          <p className="text-muted-foreground text-sm text-left">
                            Grant access and enable global reach in Play Console
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="flex flex-col gap-6 items-start">
                        <div className="flex-1 space-y-4 text-muted-foreground">
                          <p>
                            Before you share your link, ensure your app is correctly configured in the Google Play Console:
                          </p>
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                Grant Testers Access
                              </p>
                              <div className="text-sm space-y-2">
                                <p>Navigate to the <Highlight>Closed Testing</Highlight> page and go to the <Highlight>Testers</Highlight> tab. Paste the following Google Group address in the "Add email addresses" field:</p>
                                <CopyBlock textToCopy="appstestlab@googlegroups.com" />
                                <p className="text-xs italic"><strong>Why?</strong> This allows our secure community of testers to download your app while it remains invisible to the public.</p>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                Enable Global Reach
                              </p>
                              <p className="text-sm">Click the <Highlight>Countries / regions</Highlight> tab and click <Highlight>Add countries / regions</Highlight>. Select the first checkbox to include <Highlight>All</Highlight> countries and regions for maximum test coverage.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                Submit for Google's Review
                              </p>
                              <p className="text-sm"><Highlight>Save</Highlight> your changes. Go to Publishing Overview and Send Changes for Review.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem
                    value="app-info"
                    className="bg-white dark:bg-secondary/80 rounded-xl overflow-hidden shadow-xl shadow-gray-200/70 dark:shadow-black/20"
                  >
                    <AccordionTrigger className="p-6 text-left hover:no-underline flex flex-row items-center justify-between w-full relative">
                      <div className="flex items-start flex-1">
                        <span className="text-7xl md:text-5xl font-black bg-gradient-to-br from-primary/20 to-primary/0 bg-clip-text text-transparent md:w-20 absolute -top-3 -left-3 md:relative md:top-auto md:left-auto">
                          02
                        </span>
                        <div>
                          <h3 className="font-bold text-xl mb-1">
                            Finding Your App Details
                          </h3>
                          <p className="text-muted-foreground text-sm text-left">
                            {isHandshake
                              ? "Where to get your testing link and logo"
                              : "Where to get your testing link, logo, and screenshots"}
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
                              <p className="text-sm">Go to your app in the Google Play Console. Click on <Highlight>Testing</Highlight> from the left menu. Click on <Highlight>Closed Testing</Highlight>. Click on the testers tab. Look for the <Highlight>Join on Android</Highlight> link and copy it. This is the link our testers will use to download your app.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                App Logo
                              </p>
                              <p className="text-sm">Go to your app in Google Play Console. Click on <Highlight>Store presence</Highlight> on the left menu. Click on <Highlight>Store listing</Highlight>. Scroll down to <Highlight>Graphic Assets</Highlight>. Find the App Icon section. Right-click on the icon and copy the image address. This is your logo URL.</p>
                            </div>
                            {!isHandshake && (
                              <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                  Screenshots
                                </p>
                                <p className="text-sm">In the same Store listing page, scroll down to <Highlight>Screenshots</Highlight>. Click on any screenshot. Right-click and copy the image address. You need to provide two screenshots. These help testers understand what your app looks like.</p>
                              </div>
                            )}
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
                          03
                        </span>
                        <div>
                          <h3 className="font-bold text-xl mb-1">
                            How Handshake Testing Works
                          </h3>
                          <p className="text-muted-foreground text-sm text-left">
                            Barter-based testing , free for everyone
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="flex flex-col gap-6 items-start">
                        <div className="flex-1 space-y-4 text-muted-foreground">
                          <p>
                            Handshake testing is a barter system. You test another developer's app and they test yours. Here is how it works:
                          </p>
                          <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                What is a handshake?
                              </p>
                              <p className="text-sm">When you request to test an app, you offer one of your own published apps in return. Both of you join each other's tests. No points are involved.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                Completely free
                              </p>
                              <p className="text-sm">No subscription and no points , publishing and joining handshake tests is free for everyone. Your level rises as you complete successful handshakes, unlocking more simultaneous test slots.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</span>
                                Slots and levels
                              </p>
                              <p className="text-sm">Each level grants more active handshake slots (start at 12, up to 20). Reach the next level's completion threshold to level up. Skipping your half of a test can temporarily block you from new handshakes.</p>
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
                          04
                        </span>
                        <div>
                          <h3 className="font-bold text-xl mb-1">
                            Setting Up Your Test
                          </h3>
                          <p className="text-muted-foreground text-sm text-left">
                            {isHandshake
                              ? "Test setup is fixed â€” here is what to know"
                              : "How to choose testers, duration, and Android version"}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="flex flex-col gap-6 items-start">
                        <div className="flex-1 space-y-4 text-muted-foreground">
                          {isHandshake ? (
                            <p>
                              Handshake campaigns use a fixed setup of{" "}
                              <Highlight>14 tester slots</Highlight> for{" "}
                              <Highlight>16 days</Highlight>. The only setting you choose is the minimum Android version.
                            </p>
                          ) : (
                            <p>
                              When you configure your test, you need to decide three things:
                            </p>
                          )}
                          <div className="space-y-4">
                            {!isHandshake && (
                              <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</span>
                                  Number of testers
                                </p>
                                <p className="text-sm">Choose how many testers you want for your app. We recommend at least <Highlight>15 testers</Highlight> because some testers may drop out during the testing period. Each tester must complete testing within the time limit you set.</p>
                              </div>
                            )}
                            {!isHandshake && (
                              <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                                <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</span>
                                  Test duration
                                </p>
                                <p className="text-sm">Choose how many days testers have to complete their testing. The minimum is <Highlight>14 days</Highlight>. We recommend <Highlight>16 to 20 days</Highlight> because testers have different schedules. Longer durations give testers more flexibility to provide thorough feedback.</p>
                              </div>
                            )}
                            <div className="p-4 rounded-lg bg-secondary/50 border border-border/40">
                              <p className="font-semibold text-foreground mb-2 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{isHandshake ? 1 : 3}</span>
                                Minimum Android version
                              </p>
                              <p className="text-sm">Select the oldest Android version your app supports. This helps us match testers who have devices that can run your app. If your app works on Android 8, select <Highlight>Android 8.0</Highlight> from the list. Only testers with devices running that version or newer will be assigned to your test.</p>
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
                <CardContent className="grid md:grid-cols-2 gap-6 p-3 sm:p-6">
                  <FormField
                    control={form.control}
                    name="app_url"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="app_url">Google Play Testing Link <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="app_url" content="Paste your app's Google Play Store page URL. Example: https://play.google.com/store/apps/details?id=com.example.app" />
                        </div>
                        <FormControl><Input id="app_url" placeholder="https://play.google.com/store/apps/details?id=..." {...field} value={field.value ?? ""} className="py-0" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="app_name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="app_name">App Name <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="app_name" content="This will be displayed to testers" />
                        </div>
                        <FormControl><Input id="app_name" placeholder="e.g., PhotoSnap Editor" {...field} value={field.value ?? ""} className="py-0" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="app_logo_url"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="app_logo_url">App Logo URL <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="app_logo_url" content="Go to Play Console â†’ Side Menu â†’ Grow Users â†’ Store Presence â†’ Store listing â†’ Open Default Store Listing â†’ Right-click on your app icon and open the image in a new tab â†’ Copy the image URL" />
                        </div>
                        <FormControl><Input id="app_logo_url" placeholder="https://play-lh.googleusercontent.com/..." {...field} value={field.value ?? ""} className="py-0" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isHandshake && (
                    <>
                      <FormField
                        control={form.control}
                        name="app_screenshot_url_1"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1.5">
                              <Label htmlFor="app_screenshot_url_1">Screenshot 1 URL <span className="text-destructive">*</span></Label>
                              <TooltipWithClick id="app_screenshot_url_1" content="Paste the screenshot URL from your Play Store listing" />
                            </div>
                            <FormControl><Input id="app_screenshot_url_1" placeholder="https://play-lh.googleusercontent.com/..." {...field} value={field.value ?? ""} className="py-0" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="app_screenshot_url_2"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-1.5">
                              <Label htmlFor="app_screenshot_url_2">Screenshot 2 URL <span className="text-destructive">*</span></Label>
                              <TooltipWithClick id="app_screenshot_url_2" content="Paste another screenshot URL from your Play Store listing" />
                            </div>
                            <FormControl><Input id="app_screenshot_url_2" placeholder="https://play-lh.googleusercontent.com/..." {...field} value={field.value ?? ""} className="py-0" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
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
                        <div className="flex items-center gap-1.5">
                          <Label>Category <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="category_id" content="Choose the category that best describes your app" />
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger id="category_id" className="py-0"><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {appCategoriesData?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
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
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="app_description">App Description <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="app_description" content="Minimum 50 characters. Describe what your app does and its key features." />
                        </div>
                        <FormControl><Textarea id="app_description" placeholder="Briefly describe what your app does." className="min-h-[120px]" {...field} value={field.value ?? ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="instruction_for_tester"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="instruction_for_tester">Instructions for Testers <span className="text-muted-foreground ml-1">(Optional)</span></Label>
                          <TooltipWithClick id="instruction_for_tester" content="Include any login credentials, specific features to test, or setup instructions" />
                        </div>
                        <FormControl><Textarea id="instruction_for_tester" placeholder="Any specific areas you want testers to focus on?" className="min-h-[120px]" {...field} value={field.value ?? ""} /></FormControl>
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
              description="Set the final parameters for your testing cycle."
            >
              <Card className="bg-secondary/30 border-dashed">
                <CardContent className="p-3 sm:p-6 grid gap-8">
                  <FormField
                    control={form.control}
                    name="minimum_android_version"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="minimum_android_version">Min. Android Version <span className="text-destructive">*</span></Label>
                          <TooltipWithClick id="minimum_android_version" content="Select the oldest Android version your app supports" />
                        </div>
                        <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                          <FormControl><SelectTrigger id="minimum_android_version" className="py-0"><SelectValue placeholder="Select Android version" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {minimum_android_versions.map((version) => (
                              <SelectItem key={version.value} value={version.value.toString()}>{version.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode === "create" && isHandshake && (
                    <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-sm text-muted-foreground">
                      Handshake campaigns run at a fixed setup of{" "}
                      <span className="font-semibold text-foreground">14 tester slots</span>{" "}
                      for{" "}
                      <span className="font-semibold text-foreground">16 days</span>
                      {" "}â€” no configuration needed. An admin can adjust these later if required.
                    </div>
                  )}

                  {mode === "create" && !isHandshake && (
                    <>
                      <FormField
                        control={form.control}
                        name="total_tester"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-sm font-medium text-foreground/80">Number of Testers</Label>
                            <FormControl>
                              <ModernSlider id="total_tester" value={field.value} onChange={field.onChange} min={1} max={20} label="" unit="testers" accentColor="primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="total_days"
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-sm font-medium text-foreground/80">Test Duration (Days)</Label>
                            <FormControl>
                              <ModernSlider value={field.value} onChange={field.onChange} min={1} max={20} label="" unit="days" accentColor="primary" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {mode === "create" && isHandshake && (
                    <div className="mt-8">
                      <div className="rounded-3xl p-6 border border-border/60 bg-secondary/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-500">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              Handshake Testing is free
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Publish your app and earn the Elite Badge through reliability.
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/profile#elite-badge"
                          className="shrink-0 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 h-11 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          About Elite Badge
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* S9: the "Community Points" virtual-card cost block was
                      removed with the points economy â€” submissions are free. */}


                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
                    {onCancel && (
                      <Button variant="outline" type="button" onClick={onCancel} className="w-full sm:w-auto h-12 rounded-xl">
                        Cancel
                      </Button>
                    )}
                    <LoadingButton
                      className="w-full sm:w-auto rounded-xl px-8 h-12 text-base font-semibold"
                      isLoading={isPending}
                      isSuccess={isSuccess}
                      isError={isError}
                      disabled={isSubmitDisabled}
                      type="submit"
                    >
                      {mode === "create" ? "Submit for Review" : "Save Changes and Resubmit"}
                    </LoadingButton>
                  </div>
                  {pendingRequirements.length > 0 && (
                    <p className="text-[11px] text-neutral-500 text-right">
                      Requirements: {pendingRequirements.join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Section>
          </form>
        </FormProvider>
      </main>
    </div>
  );
}
