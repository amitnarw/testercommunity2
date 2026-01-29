"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Monitor,
  Moon,
  Sun,
  Zap,
  Shield,
  FileText,
  Trash2,
  Download,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { useTransitionContext } from "@/context/transition-context";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const {
    transitionType,
    setTransitionType,
    transitionColor,
    setTransitionColor,
  } = useTransitionContext();
  const [enableTransitions, setEnableTransitions] = useState(true);
  const [transitionDuration, setTransitionDuration] = useState(400);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTransitionPrefs = localStorage.getItem(
      "enable-page-transitions",
    );
    if (storedTransitionPrefs !== null) {
      setEnableTransitions(storedTransitionPrefs === "true");
    }

    const storedDuration = localStorage.getItem("transition-duration");
    if (storedDuration) setTransitionDuration(parseInt(storedDuration));
  }, []);

  const handleTransitionToggle = (enabled: boolean) => {
    setEnableTransitions(enabled);
    localStorage.setItem("enable-page-transitions", String(enabled));
  };

  const handleTypeChange = (val: string) => {
    setTransitionType(val);
  };

  const handleDurationChange = (val: number[]) => {
    setTransitionDuration(val[0]);
    localStorage.setItem("transition-duration", val[0].toString());
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      data-loc="SettingsPage"
      className="mx-auto pb-12 max-w-4xl px-4 md:px-6"
    >
      <PageHeader title="Settings" backHref="/profile" className="w-1/2" />

      <div className="space-y-8 mt-6">
        {/* Appearance Section */}
        <Card className="rounded-2xl shadow-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how the application looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">Theme Preference</Label>
              <RadioGroup
                defaultValue={theme}
                onValueChange={(value) => setTheme(value)}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                <div>
                  <RadioGroupItem
                    value="light"
                    id="light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="light"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-white [&:has([data-state=checked])]:text-white cursor-pointer transition-all h-full"
                  >
                    <Sun className="mb-3 h-6 w-6" />
                    <span className="font-semibold text-center">Light</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="dark"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="dark"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-white [&:has([data-state=checked])]:text-white cursor-pointer transition-all h-full"
                  >
                    <Moon className="mb-3 h-6 w-6" />
                    <span className="font-semibold text-center">Dark</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="system"
                    id="system"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="system"
                    className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-white [&:has([data-state=checked])]:text-white cursor-pointer transition-all h-full"
                  >
                    <Monitor className="mb-3 h-6 w-6" />
                    <span className="font-semibold text-center">System</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility & UX Section */}
        <Card className="rounded-2xl shadow-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Experience & Accessibility
            </CardTitle>
            <CardDescription>
              Manage animations and interaction preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Page Transitions</Label>
                <div className="text-sm text-muted-foreground">
                  Show smooth animation effects when navigating between pages.
                </div>
              </div>
              <Switch
                checked={enableTransitions}
                onCheckedChange={handleTransitionToggle}
              />
            </div>

            {enableTransitions && (
              <div className="grid gap-6 pt-4 border-t border-border animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid gap-2">
                  <Label>Animation Style</Label>
                  <Select
                    value={transitionType || "stairs"}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select animation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stairs">Stairs (Classic)</SelectItem>
                      <SelectItem value="curve">Fluid Curve</SelectItem>
                      <SelectItem value="curtain">Curtain Reveal</SelectItem>
                      <SelectItem value="counter">Loading Counter</SelectItem>
                      <SelectItem value="slide">Left to Right Slide</SelectItem>
                      <SelectItem value="zoom">Zoom Wipe</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the visual effect used when moving between pages.
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label>Animation Color</Label>
                  <div className="flex items-center gap-3 pt-2">
                    {[
                      { value: "primary", label: "Brand", bg: "bg-primary" },
                      { value: "black", label: "Dark", bg: "bg-black" },
                      { value: "white", label: "Light", bg: "bg-white" },
                    ].map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setTransitionColor(color.value)}
                        className={`w-8 h-8 rounded-full ${color.bg} transition-all ${
                          transitionColor === color.value
                            ? "ring-2 ring-ring ring-offset-2 ring-offset-background scale-110"
                            : "hover:scale-110 opacity-80 hover:opacity-100 shadow-xl border"
                        }`}
                        title={color.label}
                        aria-label={`Select ${color.label} color`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose the background color for page transitions.
                  </p>
                </div>

                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Animation Duration</Label>
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                      {(transitionDuration / 1000).toFixed(1)}s
                    </span>
                  </div>
                  <Slider
                    value={[transitionDuration]}
                    onValueChange={handleDurationChange}
                    min={200}
                    max={2000}
                    step={100}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Controls how fast the transition animation plays (0.2s to
                    2.0s).
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="rounded-2xl shadow-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Data & Privacy
            </CardTitle>
            <CardDescription>
              Manage your data usage and privacy settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-medium">Export Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  Download a copy of your personal data, including profile
                  details and activity history.
                </p>
              </div>
              <Button variant="outline" className="shrink-0">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Legal & About */}
        <Card className="rounded-2xl shadow-sm border-white/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" />
              Legal & About
            </CardTitle>
            <CardDescription>Read our terms and policies.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="justify-between group"
                asChild
              >
                <a href="/privacy" target="_blank" rel="noreferrer">
                  Privacy Policy
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="justify-between group"
                asChild
              >
                <a href="/terms" target="_blank" rel="noreferrer">
                  Terms of Service
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="justify-between group"
                asChild
              >
                <a href="/cookie-policy" target="_blank" rel="noreferrer">
                  Cookie Policy
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="justify-between group"
                asChild
              >
                <a href="/acceptable-use" target="_blank" rel="noreferrer">
                  Acceptable Use Policy
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="rounded-2xl shadow-sm border-red-500/20 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-red-500">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions related to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-background p-4">
              <div>
                <h4 className="font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <Button variant="destructive" className="shrink-0">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
