"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Check,
  Play,
  Upload,
  Smartphone,
  ShieldCheck,
  Loader2,
  ImageIcon,
  Minimize2,
  ChevronRight,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useR2 } from "@/hooks/useR2";
import { useSubmitDailyVerification } from "@/hooks/useHub";
import { SafeImage } from "@/components/safe-image";
import { useDropzone } from "react-dropzone";

interface DailyTestingActionProps {
  appId: string;
  packageName: string;
  currentDay: number;
  totalDays: number;
  hasTestedToday?: boolean;
  onCheckIn?: () => void;
}

export function DailyTestingAction({
  appId,
  packageName,
  currentDay,
  totalDays,
  hasTestedToday = false,
  onCheckIn,
}: DailyTestingActionProps) {
  const { toast } = useToast();
  const { createUploadUrl, uploadFileToR2 } = useR2();

  // Compact state vs Expanded state
  const [isExpanded, setIsExpanded] = useState(!hasTestedToday);

  // Steps: 0: IDLE, 1: UPLOAD_WAIT, 2: SCANNING, 3: COMPLETED
  const [step, setStep] = useState(hasTestedToday ? 3 : 0);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [proofImage, setProofImage] = useState<string | null>(null);

  // Scanning logs
  const [scanLog, setScanLog] = useState("Initializing analysis...");

  const handleOpenApp = () => {
    window.open(
      `https://play.google.com/store/apps/details?id=${packageName}`,
      "_blank",
    );
    setStep(1); // Move to upload wait
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Start upload UI immediately
    setUploadPercent(1);

    try {
      const fileType = "image";
      const uploadConfig = await createUploadUrl.mutateAsync({
        filename: `proof-${appId}-${Date.now()}-${file.name}`,
        contentType: file.type,
        size: file.size,
        type: fileType,
      });

      await uploadFileToR2.mutateAsync({
        file,
        uploadUrl: uploadConfig.uploadUrl,
        onProgress: (percent) => setUploadPercent(percent),
      });

      const r2Url = process.env.NEXT_PUBLIC_R2_MEDIA_BASE_URL || "";
      const uploadedUrl = r2Url + "/" + uploadConfig.key;

      setProofImage(uploadedUrl);
      setStep(2); // Start Scanning
      setUploadPercent(0); // Reset for next time (though unmounting)
    } catch (error) {
      console.error("Upload failed", error);
      toast({
        title: "Upload Failed",
        description: "Please try again.",
        variant: "destructive",
      });
      setUploadPercent(0); // Reset on error
    }
  };

  const submitVerification = useSubmitDailyVerification();

  // Simulate High-Tech Scanning with Rich Data + Real API Call
  useEffect(() => {
    if (step === 2 && proofImage) {
      const logs = [
        "Analyzing image integrity...",
        "Checking EXIF timestamp match...",
        "Verifying device signature...",
        "Running anti-cheat heuristics...",
        "Detecting pixel manipulation...",
        "Cross-referencing telemetry...",
        "Validating Google Play session...",
        "Finalizing proof authenticity...",
      ];

      let logIndex = 0;
      const logInterval = setInterval(() => {
        if (logIndex < logs.length) {
          setScanLog(logs[logIndex]);
          logIndex++;
        }
      }, 700);

      // Run Mutation + Minimum Delay in parallel
      const minDelay = new Promise((resolve) => setTimeout(resolve, 6500));
      const apiCall = submitVerification.mutateAsync({
        hubId: appId,
        proofImage: proofImage,
        metaData: {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          screen: `${window.screen.width}x${window.screen.height}`,
        },
      });

      Promise.all([minDelay, apiCall])
        .then(() => {
          setStep(3);
          toast({
            title: "Verification Complete",
            description: "Proof accepted. Streak updated.",
            variant: "default",
          });
          if (onCheckIn) onCheckIn();
        })
        .catch((error) => {
          console.error("Verification failed:", error);
          setStep(1); // Go back to upload
          toast({
            title: "Verification Rejected",
            description: error.message || "Network error. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => {
          clearInterval(logInterval);
        });

      return () => {
        clearInterval(logInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, proofImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".png", ".jpg", ".webp"] },
    maxFiles: 1,
  });

  const progressPercentage = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <div className="w-full">
      <Card
        className={cn(
          "overflow-hidden border transition-all duration-300",
          isExpanded ? "shadow-xl shadow-primary/5" : "",
        )}
      >
        {/* Header Strip */}
        <div
          onClick={() => !hasTestedToday && setIsExpanded(!isExpanded)}
          className={cn(
            "p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-colors hover:bg-muted/30 select-none relative z-20 gap-3 sm:gap-0 bg-white dark:bg-zinc-950",
            isExpanded ? "border-b" : "",
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500",
                hasTestedToday || step === 3
                  ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
              )}
            >
              {hasTestedToday || step === 3 ? (
                <Check className="w-6 h-6" strokeWidth={3} />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-none mb-1.5">
                {hasTestedToday || step === 3
                  ? "Daily Task Completed"
                  : "Daily Verification"}
              </h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Day {currentDay}
                </span>{" "}
                <span className="opacity-50">/ {totalDays}</span>
                <div className="h-2 w-20 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      hasTestedToday || step === 3
                        ? "bg-emerald-500"
                        : "bg-blue-500",
                    )}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {!hasTestedToday && step !== 3 && (
              <div className="px-2.5 py-1 bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider rounded-md border border-amber-200 dark:border-amber-900/50 flex items-center gap-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Required
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground ml-auto sm:ml-0 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:grid md:grid-cols-2 min-h-[320px]">
                  {/* LEFT PANEL: VISUALS */}
                  <div className="relative flex flex-col items-center justify-center p-8 text-center order-2 md:order-1 overflow-hidden bg-slate-50/50 dark:bg-zinc-900/50 border-r border-border/40">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent pointer-events-none" />

                    {/* Step 0: Idle */}
                    {step === 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10 space-y-6 max-w-xs mx-auto"
                      >
                        <div className="relative mx-auto h-32 w-32">
                          <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
                          <div className="absolute inset-2 bg-white dark:bg-zinc-900 rounded-full shadow-sm flex items-center justify-center border border-blue-100 dark:border-blue-900/30">
                            <Smartphone className="w-14 h-14 text-blue-600 dark:text-blue-400" />
                          </div>
                          {/* Floating Elements */}
                          <div className="absolute top-0 right-0 p-2 bg-white dark:bg-zinc-800 shadow-md rounded-xl border border-border animate-bounce">
                            <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                            Launch & Explore
                          </h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                            Open the app from the store and use it for 1 minute
                            to qualify for verification.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 1 & 2: Preview & Scan */}
                    {(step === 1 || step === 2) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-sm mx-auto space-y-6 relative z-10"
                      >
                        <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-white dark:bg-black border shadow-lg ring-4 ring-white dark:ring-zinc-800 group">
                          {proofImage ? (
                            <>
                              <SafeImage
                                src={proofImage}
                                alt="Proof"
                                fill
                                className={cn(
                                  "object-cover transition-all duration-700",
                                  step === 2 && "scale-105 opacity-90",
                                )}
                              />
                              {step === 2 && (
                                <div className="absolute inset-0 z-20">
                                  <div className="absolute top-0 w-full h-1 bg-blue-500 shadow-[0_0_20px_2px_rgba(59,130,246,0.5)] animate-scan-beam" />
                                  <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-lg p-3 border border-blue-200 dark:border-blue-900 flex items-center gap-3 shadow-lg">
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                                    <span className="text-xs font-mono text-blue-700 dark:text-blue-300 font-medium truncate">
                                      {scanLog}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-slate-400">
                              <ImageIcon className="w-12 h-12 opacity-50" />
                              <span className="text-xs">No image selected</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {step === 3 && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="space-y-6 text-center"
                      >
                        <div className="h-28 w-28 mx-auto bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20 text-white">
                          <Check
                            className="w-14 h-14 drop-shadow-md"
                            strokeWidth={4}
                          />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Verified!
                          </h4>
                          <h4 className="text-slate-500 dark:text-slate-400 font-medium">
                            Streak +1
                          </h4>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* RIGHT PANEL: ACTIONS */}
                  <div className="p-6 sm:p-8 flex flex-col justify-center bg-white dark:bg-zinc-950 order-1 md:order-2">
                    {step === 0 && (
                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h4 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Instructions
                          </h4>
                          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                            1. Download & Open the app.
                            <br />
                            2. Take a screenshot of the home screen.
                            <br />
                            3. Upload it here to verify your daily activity.
                          </p>
                        </div>
                        <Button
                          onClick={handleOpenApp}
                          className="w-full h-14 text-base bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-xl shadow-slate-900/10 rounded-xl font-bold transition-all hover:scale-[1.01]"
                        >
                          <Play className="w-4 h-4 mr-2 fill-current" />
                          Launch App
                        </Button>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="h-full flex flex-col pb-4">
                        <div
                          {...getRootProps()}
                          className={cn(
                            "flex-1 border-2 border-dashed rounded-2xl transition-all duration-300 group cursor-pointer relative overflow-hidden bg-slate-50 dark:bg-zinc-900/50 min-h-[220px] flex flex-col justify-center",
                            isDragActive
                              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10"
                              : "border-slate-200 dark:border-zinc-800 hover:border-blue-400 hover:bg-white dark:hover:bg-zinc-900",
                          )}
                        >
                          <input {...getInputProps()} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 pointer-events-none">
                            {uploadPercent > 0 ? (
                              <div className="w-full max-w-[160px] space-y-3 animate-in fade-in zoom-in">
                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                  <span>Uploading...</span>
                                  <span>{Math.round(uploadPercent)}%</span>
                                </div>
                                <Progress
                                  value={uploadPercent}
                                  className="h-2"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="h-16 w-16 bg-white dark:bg-zinc-800 rounded-full shadow-sm flex items-center justify-center ring-1 ring-slate-100 dark:ring-zinc-700 group-hover:scale-110 transition-transform duration-300">
                                  <Upload className="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                </div>
                                <div className="text-center space-y-1">
                                  <p className="font-semibold text-slate-900 dark:text-white">
                                    Upload Screenshot
                                  </p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">
                                    Drag & Drop or Click
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => setStep(0)}
                          className="mt-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-500">
                        <div className="w-full max-w-[240px] space-y-3">
                          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                            <span>System Analysis</span>
                            <span className="text-blue-600 animate-pulse">
                              Running...
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden p-[2px]">
                            <motion.div
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 6.5, ease: "linear" }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                            />
                          </div>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl max-w-xs text-left space-y-2">
                          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-500">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wide">
                              Anti-Cheat Active
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-amber-800/80 dark:text-amber-400/80 font-medium">
                            Our system checks metadata for manipulation.
                            Uploading fake or reused screenshots will result in
                            an{" "}
                            <strong className="text-amber-900 dark:text-amber-300">
                              immediate permanent ban
                            </strong>
                            .
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                        <div className="p-6 rounded-2xl bg-green-50 dark:bg-emerald-950/20 border border-green-100 dark:border-emerald-900/50 w-full animate-in fade-in zoom-in duration-300">
                          <div className="flex items-center justify-center gap-3 mb-2">
                            <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="font-bold text-emerald-800 dark:text-emerald-200">
                              Daily Goal Met
                            </span>
                          </div>
                          <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80">
                            Great job! Come back tomorrow to keep your streak
                            alive.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsExpanded(false)}
                          className="w-full rounded-xl"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <style jsx global>{`
        @keyframes scan-beam {
          0% {
            top: 0%;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            top: 100%;
            opacity: 0;
          }
        }
        .animate-scan-beam {
          animation: scan-beam 2.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
