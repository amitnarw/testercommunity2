"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Users, Bug, Rocket, Layout, Smartphone, Coins, Zap, Banknote, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackModal } from "@/components/feedback-modal";
import { useControlRoomData, useUpdateControlRoom } from "@/hooks/useAdmin";

export default function AdminControlRoomPage() {
  const { data: controlRoom, isLoading } = useControlRoomData();
  const updateMutation = useUpdateControlRoom();

  const [formValues, setFormValues] = useState({
    communitySize: 100,
    bugsFound: 554,
    proAppsTested: 55,
    communityApps: 106,
    uniqueDevices: 350,
    communityPoints: 25000,
    profileSurveyPoints: 200,
    pointsWithdrawalLimit: 2000,
    pointsWithdrawalThreshold: 20000,
    humanChatEnabled: true,
    alexSystemPrompt: "",
  });

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const [toggleSaved, setToggleSaved] = useState(false);

  useEffect(() => {
    if (controlRoom) {
      setFormValues({
        communitySize: controlRoom.communitySize ?? 100,
        bugsFound: controlRoom.bugsFound ?? 554,
        proAppsTested: controlRoom.proAppsTested ?? 55,
        communityApps: controlRoom.communityApps ?? 106,
        uniqueDevices: controlRoom.uniqueDevices ?? 350,
        communityPoints: controlRoom.communityPoints ?? 25000,
        profileSurveyPoints: controlRoom.profileSurveyPoints ?? 200,
        pointsWithdrawalLimit: controlRoom.pointsWithdrawalLimit ?? 2000,
        pointsWithdrawalThreshold: controlRoom.pointsWithdrawalThreshold ?? 20000,
        humanChatEnabled: controlRoom.humanChatEnabled ?? true,
        alexSystemPrompt: controlRoom.alexSystemPrompt ?? "",
      });
    }
  }, [controlRoom]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const showFeedback = useCallback(
    (status: "success" | "error", title: string, description: string) => {
      setFeedbackModal({
        open: true,
        status,
        title,
        description,
        primaryAction: { label: "Continue", onClick: () => setFeedbackModal(null) },
      });
    },
    [],
  );

  const handleSaveStats = () => {
    updateMutation.mutate(
      {
        communitySize: formValues.communitySize,
        bugsFound: formValues.bugsFound,
        proAppsTested: formValues.proAppsTested,
        communityApps: formValues.communityApps,
        uniqueDevices: formValues.uniqueDevices,
        communityPoints: formValues.communityPoints,
      },
      {
        onSuccess: () =>
          showFeedback("success", "Landing Page Stats Saved", "Impact section values updated."),
        onError: (err: any) =>
          showFeedback("error", "Landing Page Stats Update Failed", err?.message || "Something went wrong."),
      },
    );
  };

  const handleSavePoints = () => {
    updateMutation.mutate(
      {
        profileSurveyPoints: formValues.profileSurveyPoints,
        pointsWithdrawalLimit: formValues.pointsWithdrawalLimit,
        pointsWithdrawalThreshold: formValues.pointsWithdrawalThreshold,
      },
      {
        onSuccess: () =>
          showFeedback("success", "Points & Withdrawal Settings Saved", "Reward thresholds updated."),
        onError: (err: any) =>
          showFeedback("error", "Points & Withdrawal Settings Update Failed", err?.message || "Something went wrong."),
      },
    );
  };

  const handleToggleHumanChat = (checked: boolean) => {
    handleChange("humanChatEnabled", checked);
    updateMutation.mutate(
      { humanChatEnabled: checked },
      {
        onSuccess: () => {
          setToggleSaved(true);
          setTimeout(() => setToggleSaved(false), 2000);
        },
        onError: (err: any) =>
          showFeedback("error", "Feature Toggle Update Failed", err?.message || "Something went wrong."),
      },
    );
  };

  const handleSaveAI = () => {
    updateMutation.mutate(
      { alexSystemPrompt: formValues.alexSystemPrompt },
      {
        onSuccess: () =>
          showFeedback("success", "AI Assistant Settings Saved", "Alex's extra instructions have been updated."),
        onError: (err: any) =>
          showFeedback("error", "AI Assistant Settings Update Failed", err?.message || "Something went wrong."),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex-1 container mx-auto px-4 md:px-6 py-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      {feedbackModal && (
        <FeedbackModal
          open={feedbackModal.open}
          onOpenChange={(open) => setFeedbackModal((prev) => prev ? { ...prev, open } : null)}
          status={feedbackModal.status}
          title={feedbackModal.title}
          description={feedbackModal.description}
          primaryAction={feedbackModal.primaryAction}
          secondaryAction={feedbackModal.secondaryAction}
        />
      )}

      <div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
          Control Room
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage global platform settings, landing page stats, and feature toggles. Each section saves independently.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-primary" />
              Landing Page Stats
            </CardTitle>
            <CardDescription>
              These values appear on the homepage under the &ldquo;From Local to Global Ripples&rdquo; impact section.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="communitySize" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Thriving Community
                </Label>
                <Input
                  id="communitySize"
                  type="number"
                  value={formValues.communitySize}
                  onChange={(e) => handleChange("communitySize", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bugsFound" className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-muted-foreground" />
                  Bugs Squashed
                </Label>
                <Input
                  id="bugsFound"
                  type="number"
                  value={formValues.bugsFound}
                  onChange={(e) => handleChange("bugsFound", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proAppsTested" className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-muted-foreground" />
                  Pro Apps Tested
                </Label>
                <Input
                  id="proAppsTested"
                  type="number"
                  value={formValues.proAppsTested}
                  onChange={(e) => handleChange("proAppsTested", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityApps" className="flex items-center gap-2">
                  <Layout className="h-4 w-4 text-muted-foreground" />
                  Community Apps
                </Label>
                <Input
                  id="communityApps"
                  type="number"
                  value={formValues.communityApps}
                  onChange={(e) => handleChange("communityApps", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniqueDevices" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  Unique Devices
                </Label>
                <Input
                  id="uniqueDevices"
                  type="number"
                  value={formValues.uniqueDevices}
                  onChange={(e) => handleChange("uniqueDevices", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="communityPoints" className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  Community Points
                </Label>
                <Input
                  id="communityPoints"
                  type="number"
                  value={formValues.communityPoints}
                  onChange={(e) => handleChange("communityPoints", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button onClick={handleSaveStats} disabled={updateMutation.isPending} size="sm" className="gap-2">
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Section
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Banknote className="h-5 w-5 text-primary" />
              Points & Withdrawal Settings
            </CardTitle>
            <CardDescription>
              Configure point rewards and withdrawal thresholds for testers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="profileSurveyPoints">Profile Survey Points</Label>
                <Input
                  id="profileSurveyPoints"
                  type="number"
                  value={formValues.profileSurveyPoints}
                  onChange={(e) => handleChange("profileSurveyPoints", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsWithdrawalLimit">Withdrawal Limit</Label>
                <Input
                  id="pointsWithdrawalLimit"
                  type="number"
                  value={formValues.pointsWithdrawalLimit}
                  onChange={(e) => handleChange("pointsWithdrawalLimit", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pointsWithdrawalThreshold">Withdrawal Threshold</Label>
                <Input
                  id="pointsWithdrawalThreshold"
                  type="number"
                  value={formValues.pointsWithdrawalThreshold}
                  onChange={(e) => handleChange("pointsWithdrawalThreshold", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t mt-4">
              <Button onClick={handleSavePoints} disabled={updateMutation.isPending} size="sm" className="gap-2">
                {updateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Section
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-primary" />
              Feature Toggles
            </CardTitle>
            <CardDescription>
              Enable or disable platform-wide features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="humanChatEnabled" className="text-base">Human Chat Support</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, users can request to speak with a human support agent.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {toggleSaved && (
                  <span className="text-xs text-green-600 font-medium">Saved</span>
                )}
                <Switch
                  id="humanChatEnabled"
                  checked={formValues.humanChatEnabled}
                  onCheckedChange={handleToggleHumanChat}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              AI Assistant Settings
            </CardTitle>
            <CardDescription>
              Add extra instructions, knowledge, or tone adjustments for Alex (the AI support assistant).
              Base rules, topic scope, and tool instructions are always enforced and cannot be modified here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="alexSystemPrompt">Alex Extra Instructions</Label>
              <Textarea
                id="alexSystemPrompt"
                value={formValues.alexSystemPrompt}
                onChange={(e) => handleChange("alexSystemPrompt", e.target.value)}
                placeholder="e.g., We have a special Launchpad sale this month at 50% off. Mention it proactively."
                className="min-h-[120px]"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  These instructions are appended to Alex&apos;s base system prompt.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {(formValues.alexSystemPrompt?.length || 0)}/2000
                  </span>
                  {formValues.alexSystemPrompt && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => handleChange("alexSystemPrompt", "")}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t mt-4">
                <Button onClick={handleSaveAI} disabled={updateMutation.isPending} size="sm" className="gap-2">
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Section
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
