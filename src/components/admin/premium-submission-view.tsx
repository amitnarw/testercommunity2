"use client";

import { useState } from "react";
import {
  Check,
  X,
  Calendar,
  Package,
  Globe,
  Shield,
  Clock,
  Smartphone,
  User,
  Mail,
  CreditCard,
  AlertCircle,
  LayoutGrid,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SafeImage } from "@/components/safe-image";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { HubSubmittedAppResponse } from "@/lib/types";
import { AdminRejectDialog } from "@/components/admin/admin-reject-dialog";
import { AdminAcceptDialog } from "@/components/admin/admin-accept-dialog";

interface PremiumSubmissionViewProps {
  project: HubSubmittedAppResponse;
}

export function PremiumSubmissionView({ project }: PremiumSubmissionViewProps) {
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "REJECTED":
        return "destructive";
      case "ACCEPTED":
      case "AVAILABLE":
      case "IN_TESTING":
      case "COMPLETED":
        return "default"; // Primary color
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* App Icon */}
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl border bg-card shrink-0 overflow-hidden">
            <SafeImage
              src={project.androidApp.appLogoUrl}
              alt={project.androidApp.appName}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
              {project.androidApp.appName}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline">{project.appType}</Badge>
              <span
                className="flex items-center gap-1 mx-2 cursor-pointer hover:text-foreground transition-colors"
                onClick={() =>
                  copyToClipboard(
                    project.androidApp.packageName,
                    "Package Name",
                  )
                }
              >
                <Package className="w-4 h-4" />
                <span className="font-mono">
                  {project.androidApp.packageName}
                </span>
                <Copy className="w-3 h-3 ml-1 opacity-50" />
              </span>
              <span className="flex items-center gap-1">
                <LayoutGrid className="w-4 h-4" />
                <span>{project.androidApp.appCategory.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {project.status === "IN_REVIEW" && (
            <>
              <Button onClick={() => setShowAcceptDialog(true)}>
                <Check className="w-4 h-4 mr-2" /> Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
              >
                <X className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          )}
          <Button variant="outline" asChild>
            <a
              href={`https://play.google.com/store/apps/details?id=${project.androidApp.packageName}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Globe className="w-4 h-4 mr-2" /> Play Store
            </a>
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={CreditCard}
          label="Payment Status"
          value="Paid Submission"
          subValue="High Priority"
          highlight // Use primary highlight
        />
        <StatsCard
          icon={User}
          label="Submitted By"
          value={project.appOwner.name}
          subValue={project.appOwner.email}
        />
        <StatsCard
          icon={Shield}
          label="Safety Check"
          value="Standard Pass"
          subValue="Automated Scan"
        />
        <StatsCard
          icon={Calendar}
          label="Days Active"
          value={`${project.totalDay || 0} Days`}
          subValue="Since Approval"
        />
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Description Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-md bg-background border border-border">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                </div>
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {project.androidApp.description || "No description provided."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Developer Instructions Card */}
          {project.instructionsForTester && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-md bg-background border border-border">
                    <AlertCircle className="w-5 h-5 text-primary" />
                  </div>
                  Instructions for Testers
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="bg-secondary/50 p-6 rounded-lg border border-border overflow-x-auto">
                  <pre className="font-mono text-foreground leading-relaxed whitespace-pre-wrap">
                    {project.instructionsForTester}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-md bg-background border border-border">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                Submission Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                <DetailRow label="App ID" value={project.appId.toString()} />
                <DetailRow label="Platform" value="Android" />
                <DetailRow
                  label="Category"
                  value={project.androidApp.appCategory.name}
                />
                <DetailRow
                  label="Testers Required"
                  value={`${project.totalTester} Testers`}
                />
                <DetailRow
                  label="Min Android Version"
                  value={`v${project.minimumAndroidVersion}`}
                />
                <DetailRow
                  label="Points Cost"
                  value={project.costPoints?.toString() || "0"}
                />
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Creator Profile Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Creator
                </CardTitle>
                <Badge
                  variant={
                    project.appOwner.emailVerified ? "default" : "secondary"
                  }
                >
                  {project.appOwner.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full border border-border bg-secondary flex items-center justify-center overflow-hidden">
                  {project.appOwner.image ? (
                    <SafeImage
                      src={project.appOwner.image}
                      alt={project.appOwner.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-muted-foreground">
                      {project.appOwner.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">
                    {project.appOwner.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {project.appOwner.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-secondary/50 border border-border">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="font-medium text-foreground">
                    {new Date(project.appOwner.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-secondary/50 border border-border">
                  <span className="text-muted-foreground">Total Apps</span>
                  <span className="font-medium text-foreground">
                    Verified Developer
                  </span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 border-border hover:bg-secondary/80"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Creator
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Submission Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative ml-2">
                {/* Vertical Line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border" />

                <TimelineItem
                  icon={Check}
                  title="App Submitted"
                  date={project.createdAt}
                  status="completed"
                />

                <TimelineItem
                  icon={Shield}
                  title="Automated Review"
                  date={project.createdAt} // Assuming same day
                  status="completed"
                />

                <TimelineItem
                  icon={User}
                  title="Admin Review"
                  date={project.updatedAt}
                  status={
                    project.status === "IN_REVIEW"
                      ? "current"
                      : project.status === "REJECTED"
                        ? "error"
                        : "completed"
                  }
                />

                <TimelineItem
                  icon={Smartphone}
                  title="Live on Hub"
                  status={
                    ["AVAILABLE", "IN_TESTING", "COMPLETED"].includes(
                      project.status,
                    )
                      ? "completed"
                      : "pending"
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Reject/Accept Dialogs */}
          <AdminRejectDialog
            appId={project.id}
            open={showRejectDialog}
            onOpenChange={setShowRejectDialog}
            onSuccess={() => window.location.reload()}
          />

          <AdminAcceptDialog
            appId={project.id}
            open={showAcceptDialog}
            onOpenChange={setShowAcceptDialog}
            onSuccess={() => window.location.reload()}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-components

function StatsCard({ icon: Icon, label, value, subValue, highlight }: any) {
  return (
    <Card className={cn(highlight && "border-primary/50 bg-primary/5")}>
      <CardContent className="p-6 flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {label}
          </p>
          <h3
            className={cn(
              "text-2xl font-bold tracking-tight text-foreground",
              highlight && "text-primary",
            )}
          >
            {value}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        </div>
        <div
          className={cn(
            "p-3 rounded-lg border",
            highlight
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background border-border text-muted-foreground",
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-border last:border-0">
      <dt className="text-sm text-muted-foreground font-medium">{label}</dt>
      <dd className="text-sm font-semibold text-foreground text-right">
        {value}
      </dd>
    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  date,
  status,
}: {
  icon?: any;
  title: string;
  date?: string | Date;
  status: "completed" | "current" | "pending" | "error";
}) {
  let iconClass = "text-muted-foreground bg-secondary border-border";
  let ringClass = "";

  if (status === "completed") {
    iconClass = "text-primary-foreground bg-primary border-primary";
  } else if (status === "current") {
    iconClass = "text-primary-foreground bg-primary border-primary";
    ringClass = "ring-4 ring-primary/20";
  } else if (status === "error") {
    iconClass = "text-destructive-foreground bg-destructive border-destructive";
  }

  return (
    <div className="flex gap-4 relative">
      <div
        className={cn(
          "relative z-10 w-4 h-4 rounded-full flex items-center justify-center mt-1 flex-shrink-0 border transition-all",
          iconClass,
          ringClass,
        )}
      >
        {status === "completed" && <Check className="w-2.5 h-2.5" />}
      </div>
      <div>
        <p
          className={cn(
            "text-sm font-medium",
            status === "pending" ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {title}
        </p>
        {date && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(date).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
