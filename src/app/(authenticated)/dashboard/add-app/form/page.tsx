"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  FileText,
  Link as LinkIcon,
  Info,
  Save,
  Clock,
  Users,
  ShieldCheck,
  CheckCircle2,
  Package,
  ArrowRight,
  BadgeCheck,
  Zap,
  Sparkles,
  Tag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { PageHeader } from "@/components/page-header";
import { useDashboardData } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { useAppCategories } from "@/hooks/useHub";
import {
  useAddDashboardAppSubmit,
  useSaveDashboardAppDraft,
} from "@/hooks/useDashboard";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

export default function AddAppFormPage() {
  const queryClient = useQueryClient();
  const { data: dashboardData } = useDashboardData();
  const userPackages = Number(dashboardData?.wallet) || 0;
  const hasEnoughPackages = userPackages >= 1;

  // Form state
  const [appName, setAppName] = useState("");
  const [testingUrl, setTestingUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [category, setCategory] = useState("");
  const [instructions, setInstructions] = useState("");

  const {
    data: appCategoriesData,
    isPending: appCategoriesIsPending,
    isError: appCategoriesIsError,
    error: appCategoriesError,
  } = useAppCategories();

  // Save draft mutation - only triggered when user clicks Draft button
  const { mutate: saveDraft, isPending: isSavingDraft } =
    useSaveDashboardAppDraft({
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Draft saved successfully!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to save draft",
          variant: "destructive",
        });
      },
    });

  // Submit mutation
  const {
    mutate: submitApp,
    isPending: isSubmitting,
    isSuccess: isSubmitSuccess,
    isError: isSubmitError,
  } = useAddDashboardAppSubmit({
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "App submitted for testing successfully!",
      });
      // Invalidate dashboard data to refresh wallet balance
      queryClient.invalidateQueries({ queryKey: ["useDashboardData"] });
      // Reset form
      setAppName("");
      setTestingUrl("");
      setLogoUrl("");
      setCategory("");
      setInstructions("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit app for testing",
        variant: "destructive",
      });
    },
  });

  // Form validation
  const isFormValid =
    appName.trim() && testingUrl.trim() && logoUrl.trim() && category;

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!hasEnoughPackages) {
      toast({
        title: "Insufficient Packages",
        description: "Please purchase more packages to submit an app.",
        variant: "destructive",
      });
      return;
    }

    submitApp({
      appName,
      testingUrl,
      logoUrl,
      categoryId: parseInt(category),
      instructions: instructions.trim() || null,
    } as any); // Using 'as any' since the exact payload structure depends on your backend
  };

  // Handle save as draft - calls the API when user clicks Draft button
  const handleSaveDraft = () => {
    saveDraft({
      appName,
      testingUrl,
      logoUrl,
      categoryId: parseInt(category) || 0,
      instructions: instructions.trim() || null,
    } as any); // Using 'as any' since the exact payload structure depends on your backend
  };

  return (
    <div className="min-h-screen bg-brand-background max-w-6xl mx-auto px-4 md:px-6 pb-16">
      <PageHeader title="" backHref="/dashboard/add-app" className="w-1/2" />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-tr from-blue-500/15 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <div
          className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-tl from-violet-500/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "5s" }}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Header - Enhanced */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground via-foreground to-muted-foreground/60 bg-clip-text text-transparent pb-1 leading-tight tracking-tight">
            Submit App for Testing
          </h1>
          <p className="text-muted-foreground text-md sm:text-lg leading-relaxed">
            Join hundreds of developers who have improved their apps with
            professional community testing
          </p>

          {/* Step indicator */}
          <div className="flex items-center justify-center mt-6 sm:mt-8">
            <div className="flex items-center">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg shadow-primary/30">
                Details
              </div>
            </div>
            <div className="w-6 sm:w-12 h-0.5 bg-gradient-to-r from-primary to-primary/30 rounded-full" />
            <div className="flex items-center">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs sm:text-sm font-bold border border-primary/30">
                Review
              </div>
            </div>
            <div className="w-6 sm:w-12 h-0.5 bg-border rounded-full" />
            <div className="flex items-center">
              <div className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-full bg-secondary text-muted-foreground flex items-center justify-center text-xs sm:text-sm font-medium border border-border">
                Submit
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Form - Left Side */}
          <div className="lg:col-span-3 space-y-6">
            {/* Section 1: App Details */}
            <Card className="group rounded-2xl bg-card/90 backdrop-blur-md border-border/40 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-primary/5 hover:border-primary/20">
              <div className="h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      App Details
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Basic information about your application
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-foreground flex items-center gap-2"
                    >
                      App Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group/input">
                      <Input
                        id="name"
                        placeholder="E.g., Project Phoenix"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        className="py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:bg-card transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">
                      This will be displayed to testers
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="url"
                      className="text-sm font-semibold text-foreground"
                    >
                      Testing URL <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LinkIcon className="w-4 h-4 text-primary" />
                      </div>
                      <Input
                        id="url"
                        placeholder="https://play.google.com/apps/testing/..."
                        value={testingUrl}
                        onChange={(e) => setTestingUrl(e.target.value)}
                        className="pl-14 py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:bg-card transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">
                      The internal testing link from Google Play Console
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="logo"
                      className="text-sm font-semibold text-foreground"
                    >
                      App Logo URL <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group/input">
                      <Input
                        id="logo"
                        placeholder="https://example.com/logo.png"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:bg-card transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">
                      Direct URL to your app&apos;s logo image
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="category"
                      className="text-sm font-semibold text-foreground flex items-center gap-2"
                    >
                      App Category <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center z-10">
                        <Tag className="w-4 h-4 text-primary" />
                      </div>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger
                          id="category"
                          className="pl-14 py-3 h-13 text-base rounded-xl bg-secondary/20 border-border/60 focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-card transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30"
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
                                key={cat?.id}
                                value={cat?.id?.toString()}
                              >
                                {cat?.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-focus-within/input:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">
                      Choose the category that best describes your app
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 2: Instructions */}
            <Card className="group rounded-2xl bg-card/90 backdrop-blur-md border-border/40 shadow-2xl shadow-black/5 overflow-hidden transition-all duration-500 hover:shadow-blue-500/5 hover:border-blue-500/20">
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center border border-blue-500/20 shadow-lg shadow-blue-500/10 shrink-0">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Instructions for Testers
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Help testers get started with your app
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label
                      htmlFor="instructions"
                      className="text-sm font-semibold text-foreground"
                    >
                      Test Credentials & Instructions{" "}
                      <span className="text-muted-foreground text-xs font-normal ml-1 px-2 py-0.5 rounded-full bg-secondary/50">
                        Optional
                      </span>
                    </Label>
                    <div className="relative group/input">
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Use demo@test.com / password123 to log in. Please test the checkout flow and profile settings."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="min-h-[140px] py-4 text-base rounded-xl bg-secondary/20 border-border/60 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary focus-visible:bg-card transition-all duration-300 hover:border-primary/40 hover:bg-secondary/30 resize-none"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground pl-1">
                      Include any login credentials, specific features to test,
                      or setup instructions
                    </p>
                  </div>

                  <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-orange-500/5 border border-amber-500/20 overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-2xl" />
                    <div className="flex gap-3 sm:gap-4 relative">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 flex-wrap">
                          Pro Tip
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium">
                            +40% feedback
                          </span>
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 leading-relaxed">
                          Apps with clear instructions receive significantly
                          more detailed and actionable feedback from testers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Summary Card */}
            <Card className="rounded-2xl bg-gradient-to-br from-card via-card to-secondary/20 backdrop-blur-md border-border/40 shadow-2xl shadow-black/10 overflow-hidden sticky top-6">
              {/* Decorative top gradient */}
              <div className="h-24 bg-gradient-to-br from-primary/10 via-primary/0 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
                <div
                  className="absolute top-4 right-4 w-16 h-16 rounded-full bg-primary/20 blur-xl animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
                <div
                  className="absolute top-8 right-12 w-8 h-8 rounded-full bg-primary/30 blur-lg animate-pulse"
                  style={{ animationDuration: "2s", animationDelay: "0.5s" }}
                />
              </div>

              <div className="p-6 sm:p-8 -mt-20 relative">
                {/* Cost Summary */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold text-foreground uppercase tracking-wider">
                      Submission Summary
                    </h3>
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-br from-secondary/60 via-secondary/40 to-secondary/20 border border-border/50 backdrop-blur-sm">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">
                        Testing Package
                      </span>
                      <span className="font-semibold text-foreground">
                        1 Package
                      </span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-semibold">Total Cost</span>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="text-lg font-bold text-primary">
                          1
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Balance */}
                  <div
                    className={cn(
                      "p-5 rounded-2xl border relative overflow-hidden transition-all duration-300",
                      hasEnoughPackages
                        ? "bg-gradient-to-br from-green-500/10 via-green-500/5 to-emerald-500/5 border-green-500/20 hover:border-green-500/30"
                        : "bg-gradient-to-br from-destructive/10 via-destructive/5 to-red-500/5 border-destructive/20 hover:border-destructive/30",
                    )}
                  >
                    {hasEnoughPackages && (
                      <div className="absolute top-2 right-2 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
                    )}
                    <div className="flex justify-between items-center relative">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
                          Your Balance
                        </p>
                        <p className="text-3xl font-bold tracking-tight">
                          {userPackages}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Packages available
                        </p>
                      </div>
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105",
                          hasEnoughPackages
                            ? "bg-gradient-to-br from-green-500/20 to-green-600/10 shadow-green-500/20"
                            : "bg-gradient-to-br from-destructive/20 to-red-600/10 shadow-destructive/20",
                        )}
                      >
                        {hasEnoughPackages ? (
                          <CheckCircle2 className="w-7 h-7 text-green-500" />
                        ) : (
                          <Package className="w-7 h-7 text-destructive" />
                        )}
                      </div>
                    </div>
                    {!hasEnoughPackages && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 text-destructive border-destructive/30 hover:bg-destructive/10 rounded-xl h-10 font-medium"
                      >
                        Buy More Packages
                      </Button>
                    )}
                  </div>

                  {/* Remaining Balance Preview */}
                  {hasEnoughPackages && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 text-center border border-border/30">
                      <p className="text-xs text-muted-foreground">
                        Balance after submission:{" "}
                        <span className="font-bold text-foreground ml-1">
                          {userPackages - 1} packages
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                    className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl border-border/60 shrink-0 hover:bg-secondary/50 hover:border-border transition-all duration-300"
                  >
                    <Save
                      className={cn(
                        "w-4 h-4",
                        isSavingDraft && "animate-pulse",
                      )}
                    />
                    <span className="hidden sm:inline font-medium ml-2">
                      {isSavingDraft ? "Saving..." : "Draft"}
                    </span>
                  </Button>
                  <LoadingButton
                    isLoading={isSubmitting}
                    isSuccess={isSubmitSuccess}
                    isError={isSubmitError}
                    disabled={!hasEnoughPackages || isSubmitting}
                    onClick={handleSubmit}
                    className="flex-1 h-10 sm:h-12 text-xs sm:text-base font-bold rounded-xl bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/85 hover:to-primary/80 shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98]"
                    type="button"
                  >
                    <div className="flex flex-row gap-1 sm:gap-2 items-center justify-center">
                      <span className="hidden sm:inline">
                        Submit for Testing
                      </span>
                      <span className="sm:hidden">Submit</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </LoadingButton>
                </div>

                {/* Compact Verified Testing Protocol */}
                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border/40">
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      Verified Testing Protocol
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-primary/20 hover:shadow-md cursor-default">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        14-15
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Days
                      </span>
                    </div>
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-primary/20 hover:shadow-md cursor-default">
                      <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        12-14
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Testers
                      </span>
                    </div>
                    <div className="group/stat flex flex-col items-center text-center p-2 sm:p-3 rounded-xl bg-gradient-to-br from-secondary/60 to-secondary/30 border border-border/30 transition-all duration-300 hover:border-primary/20 hover:shadow-md cursor-default">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 mb-1 sm:mb-1.5 transition-transform duration-300 group-hover/stat:scale-110" />
                      <span className="text-[10px] sm:text-xs font-bold">
                        100%
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 text-xs text-muted-foreground px-4 py-2 rounded-full bg-secondary/30 border border-border/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span className="font-medium">
                      Secured by inTesters Community
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
