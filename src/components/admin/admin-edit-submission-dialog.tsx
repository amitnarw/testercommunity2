"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePaidSubmission } from "@/hooks/useAdmin";
import { useAppCategories } from "@/hooks/useHub";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Pencil, Loader2 } from "lucide-react";

const ANDROID_VERSIONS = [
  "5.0","5.1","6.0","7.0","7.1","8.0","8.1","9.0","10.0","11.0","12.0","12.1","13.0","14.0","15.0","16.0",
];

interface AdminEditSubmissionDialogProps {
  project: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AdminEditSubmissionDialog({
  project,
  open,
  onOpenChange,
  onSuccess,
}: AdminEditSubmissionDialogProps) {
  const { data: appCategoriesData } = useAppCategories();
  const appCategories = Array.isArray(appCategoriesData) ? appCategoriesData : [];

  const getVersionString = (v: number | undefined) => {
    if (v === undefined || v === null) return "";
    const s = v.toString();
    if (ANDROID_VERSIONS.includes(s)) return s;
    const withDotZero = `${v}.0`;
    if (ANDROID_VERSIONS.includes(withDotZero)) return withDotZero;
    return s;
  };

  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [description, setDescription] = useState("");
  const [appCategoryId, setAppCategoryId] = useState("");
  const [appLogoUrl, setAppLogoUrl] = useState("");
  const [appScreenshotUrl1, setAppScreenshotUrl1] = useState("");
  const [appScreenshotUrl2, setAppScreenshotUrl2] = useState("");
  const [totalTester, setTotalTester] = useState("");
  const [totalDay, setTotalDay] = useState("");
  const [minimumAndroidVersion, setMinimumAndroidVersion] = useState("");
  const [costMoney, setCostMoney] = useState("");
  const [instructionsForTester, setInstructionsForTester] = useState("");

  useEffect(() => {
    if (open && project) {
      setAppName(project.androidApp?.appName || "");
      setPackageName(project.androidApp?.packageName || "");
      setDescription(project.androidApp?.description || "");
      setAppCategoryId(project.androidApp?.appCategoryId?.toString() || "");
      setAppLogoUrl(project.androidApp?.appLogoUrl || "");
      setAppScreenshotUrl1(project.androidApp?.appScreenshotUrl1 || "");
      setAppScreenshotUrl2(project.androidApp?.appScreenshotUrl2 || "");
      setTotalTester(project.totalTester?.toString() || "");
      setTotalDay(project.totalDay?.toString() || "");
      setMinimumAndroidVersion(getVersionString(project.minimumAndroidVersion));
      setCostMoney(project.costMoney?.toString() || "");
      setInstructionsForTester(project.instructionsForTester || "");
    }
  }, [open, project]);

  const { mutate: updateSubmission, isPending } = useUpdatePaidSubmission({
    onSuccess: () => {
      toast({ title: "Success", description: "Submission updated successfully." });
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err?.message || "Failed to update submission.", variant: "destructive" });
    },
  });

  const handleSave = () => {
    const data: Record<string, unknown> = {};
    if (appName !== project.androidApp?.appName) data.appName = appName;
    if (packageName !== project.androidApp?.packageName) data.packageName = packageName;
    if (description !== (project.androidApp?.description || "")) data.description = description;
    if (appCategoryId !== (project.androidApp?.appCategoryId?.toString() || "")) data.appCategoryId = appCategoryId;
    if (appLogoUrl !== (project.androidApp?.appLogoUrl || "")) data.appLogoUrl = appLogoUrl;
    if (appScreenshotUrl1 !== (project.androidApp?.appScreenshotUrl1 || "")) data.appScreenshotUrl1 = appScreenshotUrl1;
    if (appScreenshotUrl2 !== (project.androidApp?.appScreenshotUrl2 || "")) data.appScreenshotUrl2 = appScreenshotUrl2;
    if (totalTester !== project.totalTester?.toString()) data.totalTester = totalTester;
    if (totalDay !== project.totalDay?.toString()) data.totalDay = totalDay;
    if (minimumAndroidVersion !== getVersionString(project.minimumAndroidVersion)) data.minimumAndroidVersion = minimumAndroidVersion;
    if (costMoney !== project.costMoney?.toString()) data.costMoney = costMoney;
    if (instructionsForTester !== (project.instructionsForTester || "")) data.instructionsForTester = instructionsForTester;

    if (Object.keys(data).length === 0) {
      toast({ title: "No changes", description: "No fields were modified." });
      return;
    }

    updateSubmission({ id: project.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-[700px] max-h-[90dvh] rounded-3xl overflow-hidden p-0 gap-0 border-none shadow-2xl bg-white dark:bg-[#1A1A1A]">
        <div className="bg-blue-500/5 p-4 sm:p-6 border-b border-blue-500/10">
          <DialogHeader>
            <DialogTitle className="text-blue-600 flex items-center gap-2 text-lg sm:text-xl font-bold">
              <Pencil className="w-5 h-5 sm:w-6 sm:h-6" />
              Edit Submission
            </DialogTitle>
            <DialogDescription className="text-blue-600/70 text-xs sm:text-sm">
              Update any field of this paid submission. Only changed fields will be saved.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[64vh] overflow-y-auto">
          {/* App Identity */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">App Identity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">App Name</Label>
                <Input value={appName} onChange={(e) => setAppName(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Package Name</Label>
                <Input value={packageName} onChange={(e) => setPackageName(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={appCategoryId} onValueChange={setAppCategoryId}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {appCategories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Logo URL</Label>
                <Input value={appLogoUrl} onChange={(e) => setAppLogoUrl(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Screenshot 1 URL</Label>
                <Input value={appScreenshotUrl1} onChange={(e) => setAppScreenshotUrl1(e.target.value)} className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Screenshot 2 URL</Label>
                <Input value={appScreenshotUrl2} onChange={(e) => setAppScreenshotUrl2(e.target.value)} className="h-11" />
              </div>
            </div>
          </div>

          {/* Execution Plan */}
          <div className="pt-4 border-t border-border/50 space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Execution Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Testers</Label>
                <Input type="number" value={totalTester} onChange={(e) => setTotalTester(e.target.value)} min="1" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Duration (Days)</Label>
                <Input type="number" value={totalDay} onChange={(e) => setTotalDay(e.target.value)} min="1" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Min Android Version</Label>
                <Select value={minimumAndroidVersion} onValueChange={setMinimumAndroidVersion}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANDROID_VERSIONS.map((v) => (
                      <SelectItem key={v} value={v}>Android {v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cost Money (₹)</Label>
                <Input type="number" value={costMoney} onChange={(e) => setCostMoney(e.target.value)} min="0" className="h-11" />
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="pt-4 border-t border-border/50 space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Instructions for Testers</h3>
            <Textarea value={instructionsForTester} onChange={(e) => setInstructionsForTester(e.target.value)} rows={4} />
          </div>
        </div>

        <DialogFooter className="p-4 sm:p-6 bg-secondary/30 flex flex-row gap-2 sm:gap-3 border-t border-border/50 items-center justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-10 sm:h-11 rounded-xl px-6 w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending} className="h-10 sm:h-11 rounded-xl px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 w-auto">
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
