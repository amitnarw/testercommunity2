"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Link as LinkIcon,
  Tag,
  FileText,
  Sparkles,
} from "lucide-react";

import { Card } from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { StepIndicator } from "@/components/ui/step-indicator";
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
  { name: "Android 10", value: 10.0 },
  { name: "Android 11", value: 11.0 },
  { name: "Android 12", value: 12.0 },
  { name: "Android 12L", value: 12.1 },
  { name: "Android 13 (Tiramisu)", value: 13.0 },
  { name: "Android 14", value: 14.0 },
  { name: "Android 15", value: 15.0 },
  { name: "Android 16 (Baklava)", value: 16.0 },
];

interface SubmissionFormInitialData {
  app_name?: string;
  app_url?: string;
  app_logo_url?: string;
  category_id?: string;
  instruction_for_tester?: string;
  minimum_android_version?: number;
}

interface SubmissionFormProps {
  initialData?: SubmissionFormInitialData;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  mode?: "create" | "edit";
  onCancel?: () => void;
  showHeader?: boolean;
  step?: 0 | 1 | 2;
  setStep?: (step: 0 | 1 | 2) => void;
}

const STEP_LABELS = ["Connect", "Describe", "Configure"] as const;

export function SubmissionForm({
  initialData,
  onSubmit,
  isPending,
  isSuccess,
  isError,
  mode = "create",
  onCancel,
  showHeader = true,
  step: externalStep,
  setStep: externalSetStep,
}: SubmissionFormProps) {
  const [internalStep, setInternalStep] = useState<0 | 1 | 2>(0);
  const step = externalStep ?? internalStep;
  const setStep = externalSetStep ?? setInternalStep;

  const [appName, setAppName] = useState(initialData?.app_name || "");
  const [appUrl, setAppUrl] = useState(initialData?.app_url || "");
  const [appLogoUrl, setAppLogoUrl] = useState(initialData?.app_logo_url || "");
  const [categoryId, setCategoryId] = useState(initialData?.category_id || "");
  const [instructionForTester, setInstructionForTester] = useState(
    initialData?.instruction_for_tester || "",
  );
  const [minimumAndroidVersion, setMinimumAndroidVersion] = useState<
    number | undefined
  >(initialData?.minimum_android_version);

  const [appNameError, setAppNameError] = useState("");
  const [appUrlError, setAppUrlError] = useState("");
  const [appLogoUrlError, setAppLogoUrlError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [minimumAndroidVersionError, setMinimumAndroidVersionError] =
    useState("");

  const {
    data: appCategoriesData,
    isPending: appCategoriesIsPending,
    isError: appCategoriesIsError,
  } = useAppCategories();

  const isValidPlayStoreUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== "play.google.com") return false;
      if (
        !parsed.pathname.startsWith("/store/apps/details") &&
        !parsed.pathname.startsWith("/apps/testing")
      ) {
        return false;
      }
      if (!parsed.searchParams.get("id")) return false;
      return true;
    } catch {
      return false;
    }
  };

  const isValidPlayStoreLogoUrl = (url: string) => {
    if (!url.trim()) return false;
    try {
      const parsed = new URL(url);
      const allowedHosts = [
        "play-lh.googleusercontent.com",
        "lh3.googleusercontent.com",
      ];
      return (
        allowedHosts.includes(parsed.hostname) && parsed.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  const validateAppName = (value: string) => {
    if (!value.trim()) return "App name is required.";
    if (value.trim().length < 3)
      return "App name must be at least 3 characters.";
    return "";
  };

  const validateAppUrl = (value: string) => {
    if (!value.trim()) return "Google Play testing link is required.";
    if (!isValidPlayStoreUrl(value)) {
      return "Must be a Google Play Store link (e.g., https://play.google.com/store/apps/details?id=com.example.app).";
    }
    return "";
  };

  const validateAppLogoUrl = (value: string) => {
    if (!value.trim()) return "App logo URL is required.";
    if (!isValidPlayStoreLogoUrl(value)) {
      return "Must be from play-lh.googleusercontent.com or lh3.googleusercontent.com. Copy URL from Play Console → Store Listing → Graphic Assets.";
    }
    return "";
  };

  const validateCategory = (value: string) => {
    if (!value) return "Please select a category.";
    return "";
  };

  const validateMinimumAndroidVersion = (value: number | undefined) => {
    if (value === undefined || value === null)
      return "Please select the minimum Android version.";
    return "";
  };

  const validateConnectStep = () => {
    const nameErr = validateAppName(appName);
    const urlErr = validateAppUrl(appUrl);
    const logoErr = validateAppLogoUrl(appLogoUrl);

    setAppNameError(nameErr);
    setAppUrlError(urlErr);
    setAppLogoUrlError(logoErr);

    if (nameErr) {
      document
        .getElementById("app_name")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => document.getElementById("app_name")?.focus(), 500);
    } else if (urlErr) {
      document
        .getElementById("app_url")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => document.getElementById("app_url")?.focus(), 500);
    } else if (logoErr) {
      document
        .getElementById("app_logo_url")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => document.getElementById("app_logo_url")?.focus(), 500);
    }

    return !nameErr && !urlErr && !logoErr;
  };

  const validateDescribeStep = () => {
    const catErr = validateCategory(categoryId);
    setCategoryError(catErr);

    if (catErr) {
      document
        .getElementById("category_id")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return !catErr;
  };

  const handleContinueFromConnect = () => {
    if (!validateConnectStep()) return;
    setStep(1);
  };

  const handleContinueFromDescribe = () => {
    if (!validateDescribeStep()) return;
    setStep(2);
  };

  const hasChangesFromInitial = () => {
    if (mode !== "edit") return true;
    return (
      appName !== (initialData?.app_name || "") ||
      appUrl !== (initialData?.app_url || "") ||
      appLogoUrl !== (initialData?.app_logo_url || "") ||
      categoryId !== (initialData?.category_id || "") ||
      instructionForTester !== (initialData?.instruction_for_tester || "") ||
      minimumAndroidVersion !== initialData?.minimum_android_version
    );
  };

  const handleSubmit = () => {
    const minAndroidErr = validateMinimumAndroidVersion(minimumAndroidVersion);
    setMinimumAndroidVersionError(minAndroidErr);
    if (minAndroidErr) {
      document
        .getElementById("minimum_android_version")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (mode === "edit" && !hasChangesFromInitial()) {
      setAppNameError("Please make at least one change before resubmitting.");
      setStep(0);
      return;
    }

    onSubmit({
      app_name: appName,
      app_url: appUrl,
      app_logo_url: appLogoUrl,
      category_id: categoryId,
      instruction_for_tester: instructionForTester,
      minimum_android_version: minimumAndroidVersion,
      appType: "HANDSHAKE",
      total_tester: 14,
      total_days: 16,
    });
  };

  const inputClass =
    "py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 focus-visible:bg-card transition-all duration-300 hover:border-emerald-500/40 hover:bg-secondary/30";
  const selectTriggerClass =
    "py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-card transition-all duration-300 hover:border-emerald-500/40 hover:bg-secondary/30";
  const textareaClass =
    "min-h-[140px] py-4 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 focus-visible:bg-card transition-all duration-300 hover:border-emerald-500/40 hover:bg-secondary/30 resize-none";

  return (
    <div>
      {showHeader && (
        <header className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground via-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1 leading-tight tracking-tight">
            Submit Your App for Handshake Testing
          </h1>
          <p className="text-muted-foreground text-md sm:text-lg leading-relaxed">
            Fill in your app details to start handshake testing with our
            community.
          </p>

          <StepIndicator
            steps={[...STEP_LABELS]}
            currentStep={step}
            variant="emerald"
            className="mt-6 sm:mt-8"
          />
        </header>
      )}

      <main className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step-connect"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="group rounded-2xl bg-card/90 backdrop-blur-md border-border/40 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-emerald-500/5 hover:border-emerald-500/20">
                <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div className="p-5 sm:p-8">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Connect Your App
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Provide the essential links and name for your project.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* App Name */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="app_name"
                        className="text-sm font-semibold text-foreground"
                      >
                        App Name <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="app_name"
                          placeholder="E.g., PhotoSnap Editor"
                          value={appName}
                          onChange={(e) => {
                            setAppName(e.target.value);
                            if (appNameError)
                              setAppNameError(validateAppName(e.target.value));
                          }}
                          onBlur={() =>
                            setAppNameError(validateAppName(appName))
                          }
                          className={inputClass}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      {appNameError ? (
                        <p className="text-xs text-destructive pl-1">
                          {appNameError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground pl-1">
                          This will be displayed to testers
                        </p>
                      )}
                    </div>

                    {/* App URL */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="app_url"
                        className="text-sm font-semibold text-foreground"
                      >
                        Google Play Testing Link{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <LinkIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <Input
                          id="app_url"
                          placeholder="https://play.google.com/store/apps/details?id=..."
                          value={appUrl}
                          onChange={(e) => {
                            setAppUrl(e.target.value);
                            setAppUrlError(validateAppUrl(e.target.value));
                          }}
                          onBlur={() => setAppUrlError(validateAppUrl(appUrl))}
                          className="pl-14 py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 focus-visible:bg-card transition-all duration-300 hover:border-emerald-500/40 hover:bg-secondary/30"
                        />
                      </div>
                      {appUrlError ? (
                        <p className="text-xs text-destructive pl-1">
                          {appUrlError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground pl-1">
                          Paste your app&apos;s Google Play Store page URL.
                          Example:
                          https://play.google.com/store/apps/details?id=com.example.app
                        </p>
                      )}
                    </div>

                    {/* App Logo URL */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="app_logo_url"
                        className="text-sm font-semibold text-foreground"
                      >
                        App Logo URL <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative group/input">
                        <Input
                          id="app_logo_url"
                          placeholder="https://play-lh.googleusercontent.com/..."
                          value={appLogoUrl}
                          onChange={(e) => {
                            setAppLogoUrl(e.target.value);
                            if (appLogoUrlError)
                              setAppLogoUrlError(
                                validateAppLogoUrl(e.target.value),
                              );
                          }}
                          onBlur={() =>
                            setAppLogoUrlError(validateAppLogoUrl(appLogoUrl))
                          }
                          className={inputClass}
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      {appLogoUrlError ? (
                        <p className="text-xs text-destructive pl-1">
                          {appLogoUrlError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground pl-1 leading-relaxed">
                          Go to Play Console → Side Menu → Grow Users → Store
                          Presence → Store listing → Open Default Store Listing
                          → Right-click on your app icon and open the image in a
                          new tab → Copy the image URL
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-end mt-6">
                <Button
                  type="button"
                  onClick={handleContinueFromConnect}
                  className="rounded-xl px-8 h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step-describe"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="group rounded-2xl bg-card/90 backdrop-blur-md border-border/40 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-emerald-500/5 hover:border-emerald-500/20">
                <div className="h-1.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-green-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div className="p-5 sm:p-8">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Describe Your Project
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Give testers the context they need for quality feedback.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Category */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="category_id"
                        className="text-sm font-semibold text-foreground"
                      >
                        App Category <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center z-10">
                          <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <Select
                          value={categoryId}
                          onValueChange={(v) => {
                            setCategoryId(v);
                            setCategoryError(validateCategory(v));
                          }}
                        >
                          <SelectTrigger
                            id="category_id"
                            className="pl-14 py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-card transition-all duration-300 hover:border-emerald-500/40 hover:bg-secondary/30"
                          >
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {appCategoriesIsPending ? (
                              <SelectItem value="loading" disabled>
                                Loading categories...
                              </SelectItem>
                            ) : appCategoriesIsError ? (
                              <SelectItem value="error" disabled>
                                Error loading categories
                              </SelectItem>
                            ) : (
                              appCategoriesData?.map((cat) => (
                                <SelectItem
                                  key={cat.id}
                                  value={cat.id.toString()}
                                >
                                  {cat.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      {categoryError ? (
                        <p className="text-xs text-destructive pl-1">
                          {categoryError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground pl-1">
                          Choose the category that best describes your app
                        </p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="instruction_for_tester"
                        className="text-sm font-semibold text-foreground"
                      >
                        Instructions for Testers{" "}
                        <span className="text-muted-foreground text-xs font-normal ml-1 px-2 py-0.5 rounded-full bg-secondary/50">
                          Optional
                        </span>
                      </Label>
                      <div className="relative group/input">
                        <Textarea
                          id="instruction_for_tester"
                          placeholder="Any specific areas you want testers to focus on? e.g., Use demo@test.com / password123 to log in. Please test the checkout flow."
                          value={instructionForTester}
                          onChange={(e) =>
                            setInstructionForTester(e.target.value)
                          }
                          className={textareaClass}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground pl-1">
                        Include any login credentials, specific features to
                        test, or setup instructions
                      </p>

                      {/* Pro Tip */}
                      <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/5 border border-emerald-500/20 overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-2xl" />
                        <div className="flex gap-3 sm:gap-4 relative">
                          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 h-fit shrink-0">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-2 flex-wrap">
                              Pro Tip
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
                                +40% reliable matches
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 leading-relaxed">
                              Apps with detailed test instructions pair with
                              more committed testers and complete more
                              handshakes successfully.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(0)}
                  className="rounded-xl h-12 px-6 border-border/60 hover:bg-secondary/50"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleContinueFromDescribe}
                  className="rounded-xl px-8 h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-configure"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="group rounded-2xl bg-card/90 backdrop-blur-md border-border/40 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-emerald-500/5 hover:border-emerald-500/20">
                <div className="h-1.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
                <div className="p-5 sm:p-8">
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Configure Your Test
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Set the minimum Android version for your testing cycle.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Free Callout + Elite Badge */}
                    <div className="rounded-2xl p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Handshake Testing is free
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Publish your app and earn the Elite Badge through
                            reliability.
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/profile#elite-badge"
                        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 px-5 h-11 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                      >
                        <FileText className="w-4 h-4" />
                        About Elite Badge
                      </Link>
                    </div>

                    {/* Min Android Version */}
                    <div className="space-y-3">
                      <Label
                        htmlFor="minimum_android_version"
                        className="text-sm font-semibold text-foreground"
                      >
                        Min. Android Version{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={minimumAndroidVersion?.toString() || ""}
                        onValueChange={(v) => {
                          setMinimumAndroidVersion(parseFloat(v));
                          setMinimumAndroidVersionError("");
                        }}
                      >
                        <SelectTrigger
                          id="minimum_android_version"
                          className={selectTriggerClass}
                        >
                          <SelectValue placeholder="Select Android version" />
                        </SelectTrigger>
                        <SelectContent>
                          {minimum_android_versions.map((version) => (
                            <SelectItem
                              key={version.value}
                              value={version.value.toString()}
                            >
                              {version.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {minimumAndroidVersionError ? (
                        <p className="text-xs text-destructive pl-1">
                          {minimumAndroidVersionError}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground pl-1">
                          Lowest Android version that can install your app
                        </p>
                      )}
                    </div>

                    {/* Fixed Setup Info */}
                    <div className="rounded-xl border border-border/60 bg-secondary/30 p-4 text-sm text-muted-foreground leading-relaxed">
                      Handshake campaigns run at a fixed setup of{" "}
                      <span className="font-semibold text-foreground">
                        14 tester slots
                      </span>{" "}
                      for{" "}
                      <span className="font-semibold text-foreground">
                        16 days
                      </span>{" "}
                      , no configuration needed. An admin can adjust these later
                      if required.
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full mt-6">
                {onCancel && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={onCancel}
                    className="w-full sm:w-auto h-12 rounded-xl border-border/60 hover:bg-secondary/50"
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto h-12 rounded-xl border-border/60 hover:bg-secondary/50"
                >
                  Back
                </Button>
                <LoadingButton
                  className="w-full sm:w-auto rounded-xl px-8 h-12 text-base font-semibold bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-700 hover:via-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-white"
                  isLoading={isPending}
                  isSuccess={isSuccess}
                  isError={isError}
                  disabled={isPending}
                  onClick={handleSubmit}
                  type="button"
                >
                  {mode === "create"
                    ? "Submit for Review"
                    : "Save Changes and Resubmit"}
                </LoadingButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
