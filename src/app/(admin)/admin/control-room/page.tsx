"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Save, Zap, Banknote, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackModal } from "@/components/feedback-modal";
import { useControlRoomData, useUpdateControlRoom } from "@/hooks/useAdmin";
import { IconPickerModal } from "@/components/admin/icon-picker-modal";
import { resolveIcon } from "@/lib/lucideIconCatalog";

 interface StatCardDef {
   id: string;
   iconName: string;
   title: string;
   description: string;
   value: string;
 }

  const LANDING_STAT_DEFINITIONS: StatCardDef[] = [
   { id: "countriesSupported", iconName: "Globe",       title: "Countries Supported",      description: "Developers and testers worldwide.",  value: "10+" },
   { id: "bugsFound",          iconName: "Bug",          title: "Bugs Squashed",          description: "Critical & minor bugs found.",       value: "554+" },
   { id: "proAppsTested",      iconName: "Rocket",       title: "Pro Apps Tested",        description: "Paid apps fully tested.",            value: "4200+" },
   { id: "platformUptime",     iconName: "Shield",       title: "Platform Uptime",        description: "Reliable platform availability.",    value: "99%" },
   { id: "uniqueDevices",      iconName: "Smartphone",   title: "Unique Devices",         description: "Diverse Android models.",            value: "350+" },
   { id: "fastTurnaround",     iconName: "Clock",        title: "Fast Turnaround",      description: "Average testing turnaround time.",   value: "48hr" },
 ];

export default function AdminControlRoomPage() {
  const { data: controlRoom, isLoading } = useControlRoomData();
  const updateMutation = useUpdateControlRoom();

  const [formValues, setFormValues] = useState({
    landingHeading: "",
    landingSubheading: "",
    landingStatTitles: [] as Array<{ id: string; title: string }>,
    landingStatDescriptions: [] as Array<{ id: string; description: string }>,
    landingStatValues: [] as Array<{ id: string; value: string }>,
    profileSurveyPoints: 200,
    pointsWithdrawalLimit: 2000,
    pointsWithdrawalThreshold: 20000,
    humanChatEnabled: true,
    alexSystemPrompt: "",
  });

  // Unified, editable view of the 6 stat cards (resolved: DB value overrides default).
  const [statCards, setStatCards] = useState<StatCardDef[]>([...LANDING_STAT_DEFINITIONS]);

  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    status: "success" | "error" | "warning" | "info";
    title: string;
    description: string;
    primaryAction?: { label: string; onClick: () => void };
    secondaryAction?: { label: string; onClick: () => void };
  } | null>(null);

  const [toggleSaved, setToggleSaved] = useState(false);

  const [iconPickerCard, setIconPickerCard] = useState<string | null>(null);

  useEffect(() => {
    if (controlRoom) {
      setFormValues({
        landingHeading: controlRoom.landingHeading ?? "",
        landingSubheading: controlRoom.landingSubheading ?? "",
        landingStatTitles: controlRoom.landingStatTitles ?? [],
        landingStatDescriptions: controlRoom.landingStatDescriptions ?? [],
        landingStatValues: controlRoom.landingStatValues ?? [],
        profileSurveyPoints: controlRoom.profileSurveyPoints ?? 200,
        pointsWithdrawalLimit: controlRoom.pointsWithdrawalLimit ?? 2000,
        pointsWithdrawalThreshold: controlRoom.pointsWithdrawalThreshold ?? 20000,
        humanChatEnabled: controlRoom.humanChatEnabled ?? true,
        alexSystemPrompt: controlRoom.alexSystemPrompt ?? "",
      });

      // Resolve the 6 editable cards: DB overrides defaults by id (canonical order preserved).
      const titles = controlRoom.landingStatTitles ?? [];
      const descriptions = controlRoom.landingStatDescriptions ?? [];
      const values = controlRoom.landingStatValues ?? [];
      const icons = controlRoom.landingStatIcons ?? [];
      setStatCards(
        LANDING_STAT_DEFINITIONS.map((card) => {
          const t = titles.find((x) => x.id === card.id);
          const d = descriptions.find((x) => x.id === card.id);
          const v = values.find((x) => x.id === card.id);
          const ic = icons.find((x) => x.id === card.id);
          return {
            ...card,
            title: (typeof t?.title === "string" && t.title.trim() !== "") || typeof t?.title === "number"
              ? String(t.title)
              : card.title,
            description:
              (typeof d?.description === "string" && d.description.trim() !== "") || typeof d?.description === "number"
                ? String(d.description)
                : card.description,
            value:
              typeof v?.value === "string" && v.value.trim() !== ""
                ? v.value
                : card.value,
            iconName:
              typeof ic?.icon === "string" && ic.icon.trim() !== ""
                ? ic.icon
                : card.iconName,
          };
        }),
      );
    }
  }, [controlRoom]);

   const handleChange = (field: string, value: string | number | boolean) => {
     setFormValues((prev) => ({ ...prev, [field]: value }));
   };

   // Update one field of a stat card by its id; adds a new entry when editing (so blanks can be restored to defaults).
    const updateStatCard = (id: string, field: "title" | "description" | "value" | "iconName", next: string) => {
      setStatCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, [field]: next } : card,
        ),
      );
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
          landingHeading: formValues.landingHeading,
          landingSubheading: formValues.landingSubheading,
          landingStatTitles: statCards.map((c) => ({ id: c.id, title: c.title })),
          landingStatDescriptions: statCards.map((c) => ({ id: c.id, description: c.description })),
          landingStatValues: statCards.map((c) => ({ id: c.id, value: c.value })),
          landingStatIcons: statCards.map((c) => ({ id: c.id, icon: c.iconName })),
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

      {iconPickerCard && (
        <IconPickerModal
          open={true}
          onOpenChange={(open) => { if (!open) setIconPickerCard(null); }}
          value={statCards.find((c) => c.id === iconPickerCard)?.iconName ?? ""}
          onSelect={(name) => {
            updateStatCard(iconPickerCard, "iconName", name);
            setIconPickerCard(null);
          }}
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
               These values appear on the homepage under the Global Impact Section.
             </CardDescription>
          </CardHeader>
           <CardContent className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="landingHeading">Section Heading</Label>
                <Input
                  id="landingHeading"
                  maxLength={300}
                  value={formValues.landingHeading}
                  onChange={(e) => handleChange("landingHeading", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The main heading displayed at the top of the Global Impact Section on the homepage.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landingSubheading">Section Subheading</Label>
                <Textarea
                  id="landingSubheading"
                  maxLength={300}
                  rows={3}
                  value={formValues.landingSubheading}
                  onChange={(e) => handleChange("landingSubheading", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  The supporting description text displayed below the heading.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-muted-foreground">Stat Cards</Label>
                  <p className="text-xs text-muted-foreground">
                    Edit the heading, description, and numeric value for each stat card shown on the homepage.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {statCards.map((card) => {
                    const Icon = resolveIcon(card.iconName);
                    return (
                      <div key={card.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-2 font-medium">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setIconPickerCard(card.id)}
                            title="Change icon"
                          >
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          {card.title}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                             <Label htmlFor={`value-${card.id}`} className="text-xs">Value</Label>
                             <Input
                               id={`value-${card.id}`}
                               type="text"
                               value={card.value}
                               onChange={(e) =>
                                 updateStatCard(card.id, "value", e.target.value)
                               }
                             />
                           </div>
                          <div className="space-y-1.5">
                            <Label htmlFor={`title-${card.id}`} className="text-xs">Title</Label>
                            <Input
                              id={`title-${card.id}`}
                              maxLength={80}
                              value={card.title}
                              onChange={(e) => updateStatCard(card.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1.5">
                            <Label htmlFor={`desc-${card.id}`} className="text-xs">Description</Label>
                            <Textarea
                              id={`desc-${card.id}`}
                              maxLength={120}
                              rows={2}
                              value={card.description}
                              onChange={(e) => updateStatCard(card.id, "description", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
