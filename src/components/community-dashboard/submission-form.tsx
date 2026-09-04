"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Info,
  ArrowRight,
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
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
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
  { name: "Android 10 (Quince Tart)", value: 10.0 },
  { name: "Android 11 (Red Velvet Cake)", value: 11.0 },
  { name: "Android 12 (Snow Cone)", value: 12.0 },
  { name: "Android 12L (Snow Cone v2)", value: 12.1 },
  { name: "Android 13 (Tiramisu)", value: 13.0 },
  { name: "Android 14 (Upside Down Cake)", value: 14.0 },
  { name: "Android 15 (Vanilla Ice Cream)", value: 15.0 },
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
}: SubmissionFormProps) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [hoveredTooltip, setHoveredTooltip] = useState<string | null>(null);
  const [pinnedTooltip, setPinnedTooltip] = useState<string | null>(null);

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

  const { data: appCategoriesData } = useAppCategories();

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
    if (value.trim().length < 3) return "App name must be at least 3 characters.";
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

    return !nameErr && !urlErr && !logoErr;
  };

  const validateDescribeStep = () => {
    const catErr = validateCategory(categoryId);
    setCategoryError(catErr);
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
    if (minAndroidErr) return;

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
    <div>
      <header className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground via-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1 leading-tight tracking-tight">
          Submit Your App for Handshake Testing
        </h1>
        <p className="text-muted-foreground text-md sm:text-lg leading-relaxed">
          Fill in your app details to start handshake testing with our community.
        </p>

        <StepIndicator
          steps={[...STEP_LABELS]}
          currentStep={step}
          variant="emerald"
          className="mt-6 sm:mt-8"
        />
      </header>

      <main>
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 pb-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Connect Your App</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Provide the essential links and name for your project.
              </p>
            </div>

            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="grid md:grid-cols-2 gap-6 p-3 sm:p-6">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="app_name">App Name <span className="text-destructive">*</span></Label>
                    <TooltipWithClick id="app_name" content="This will be displayed to testers" />
                  </div>
                  <Input
                    id="app_name"
                    placeholder="e.g., PhotoSnap Editor"
                    value={appName}
                    onChange={(e) => {
                      setAppName(e.target.value);
                      if (appNameError) setAppNameError(validateAppName(e.target.value));
                    }}
                    onBlur={() => setAppNameError(validateAppName(appName))}
                    className="py-0 mt-2"
                  />
                  {appNameError ? (
                    <p className="text-xs text-destructive mt-1">{appNameError}</p>
                  ) : null}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="app_url">Google Play Testing Link <span className="text-destructive">*</span></Label>
                    <TooltipWithClick id="app_url" content="Paste your app's Google Play Store page URL. Example: https://play.google.com/store/apps/details?id=com.example.app" />
                  </div>
                  <Input
                    id="app_url"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    value={appUrl}
                    onChange={(e) => {
                      setAppUrl(e.target.value);
                      if (appUrlError) setAppUrlError(validateAppUrl(e.target.value));
                    }}
                    onBlur={() => setAppUrlError(validateAppUrl(appUrl))}
                    className="py-0 mt-2"
                  />
                  {appUrlError ? (
                    <p className="text-xs text-destructive mt-1">{appUrlError}</p>
                  ) : null}
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="app_logo_url">App Logo URL <span className="text-destructive">*</span></Label>
                    <TooltipWithClick id="app_logo_url" content="Go to Play Console → Side Menu → Grow Users → Store Presence → Store listing → Open Default Store Listing → Right-click on your app icon and open the image in a new tab → Copy the image URL" />
                  </div>
                  <Input
                    id="app_logo_url"
                    placeholder="https://play-lh.googleusercontent.com/..."
                    value={appLogoUrl}
                    onChange={(e) => {
                      setAppLogoUrl(e.target.value);
                      if (appLogoUrlError) setAppLogoUrlError(validateAppLogoUrl(e.target.value));
                    }}
                    onBlur={() => setAppLogoUrlError(validateAppLogoUrl(appLogoUrl))}
                    className="py-0 mt-2"
                  />
                  {appLogoUrlError ? (
                    <p className="text-xs text-destructive mt-1">{appLogoUrlError}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end">
              <Button
                type="button"
                onClick={handleContinueFromConnect}
                className="rounded-xl px-8 h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 pb-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Describe Your Project</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Give testers the context they need for quality feedback.
              </p>
            </div>

            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="p-3 sm:p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Label>Category <span className="text-destructive">*</span></Label>
                    <TooltipWithClick id="category_id" content="Choose the category that best describes your app" />
                  </div>
                  <Select
                    value={categoryId}
                    onValueChange={(v) => {
                      setCategoryId(v);
                      setCategoryError(validateCategory(v));
                    }}
                  >
                    <SelectTrigger id="category_id" className="py-0 mt-2">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {appCategoriesData?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {categoryError ? (
                    <p className="text-xs text-destructive mt-1">{categoryError}</p>
                  ) : null}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <Label htmlFor="instruction_for_tester">
                      Instructions for Testers <span className="text-muted-foreground ml-1">(Optional)</span>
                    </Label>
                    <TooltipWithClick id="instruction_for_tester" content="Include any login credentials, specific features to test, or setup instructions" />
                  </div>
                  <Textarea
                    id="instruction_for_tester"
                    placeholder="Any specific areas you want testers to focus on?"
                    value={instructionForTester}
                    onChange={(e) => setInstructionForTester(e.target.value)}
                    className="min-h-[120px] mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(0)}
                className="rounded-xl h-12"
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={handleContinueFromDescribe}
                className="rounded-xl px-8 h-12 text-base font-semibold bg-emerald-600 hover:bg-emerald-700"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 pb-12"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold">Configure Your Test</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Set the minimum Android version for your testing cycle.
              </p>
            </div>

            <Card className="bg-secondary/30 border-dashed">
              <CardContent className="p-3 sm:p-6 space-y-4">
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

                <div>
                  <Label htmlFor="minimum_android_version" className="text-sm font-medium">
                    Min. Android Version <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={minimumAndroidVersion?.toString() || ""}
                    onValueChange={(v) => {
                      setMinimumAndroidVersion(parseFloat(v));
                      setMinimumAndroidVersionError("");
                    }}
                  >
                    <SelectTrigger id="minimum_android_version" className="py-0 mt-2">
                      <SelectValue placeholder="Select Android version" />
                    </SelectTrigger>
                    <SelectContent>
                      {minimum_android_versions.map((version) => (
                        <SelectItem key={version.value} value={version.value.toString()}>
                          {version.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {minimumAndroidVersionError ? (
                    <p className="text-xs text-destructive mt-1">{minimumAndroidVersionError}</p>
                  ) : null}
                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-muted-foreground">
                  Handshake campaigns run at a fixed setup of{" "}
                  <span className="font-semibold text-foreground">14 tester slots</span> for{" "}
                  <span className="font-semibold text-foreground">16 days</span> — no
                  configuration needed. An admin can adjust these later if required.
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
              {onCancel && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={onCancel}
                  className="w-full sm:w-auto h-12 rounded-xl"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto h-12 rounded-xl"
              >
                Back
              </Button>
              <LoadingButton
                className="w-full sm:w-auto rounded-xl px-8 h-12 text-base font-semibold"
                isLoading={isPending}
                isSuccess={isSuccess}
                isError={isError}
                disabled={isPending}
                onClick={handleSubmit}
                type="button"
              >
                {mode === "create" ? "Submit for Review" : "Save Changes and Resubmit"}
              </LoadingButton>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
