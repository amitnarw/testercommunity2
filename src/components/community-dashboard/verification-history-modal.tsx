"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SafeImage } from "@/components/safe-image";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Info,
  XCircle,
  MapPin,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface VerificationData {
  id: number;
  dayNumber: number;
  proofImageUrl: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedAt: string; // Date string
  rejectionReason?: string;
  metaData?: any;
}

interface VerificationHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerificationData | null;
}

export function VerificationHistoryModal({
  isOpen,
  onClose,
  data,
}: VerificationHistoryModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 overflow-y-auto md:overflow-hidden border-border bg-background shadow-2xl block max-h-[90vh] md:max-h-none md:h-auto gap-0">
        <div className="flex flex-col md:grid md:grid-cols-5 h-auto md:h-[600px]">
          {/* Left: Image Preview (3 cols) */}
          <div className="md:col-span-3 relative bg-black/5 dark:bg-black flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-border h-64 shrink-0 md:h-full">
            {/* Decorative Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            <div className="relative w-full h-full max-h-[500px] aspect-[9/16] rounded-xl overflow-hidden shadow-none md:shadow-2xl group">
              <SafeImage
                src={data.proofImageUrl}
                alt={`Day ${data.dayNumber} Proof`}
                fill
                className="object-contain md:object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Metadata (2 cols) */}
          <div className="md:col-span-2 flex flex-col w-full md:h-full bg-background md:bg-muted/5 md:overflow-hidden">
            <DialogHeader className="p-3 sm:p-6 pb-2 border-b border-border space-y-0.5 shrink-0">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <span className="text-muted-foreground">#</span>
                Day {data.dayNumber} Verification
              </DialogTitle>
              <p className="text-start text-sm text-muted-foreground">
                Detailed proof analysis
              </p>
            </DialogHeader>

            <div className="md:flex-1 md:overflow-y-auto p-3 sm:p-6 space-y-8">
              {/* Status Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Status
                </h4>
                <div
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-xl border",
                    data.status === "VERIFIED"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : data.status === "REJECTED"
                        ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
                  )}
                >
                  {data.status === "VERIFIED" ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : data.status === "REJECTED" ? (
                    <XCircle className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                  <div>
                    <p className="font-bold text-lg">{data.status}</p>
                    <p className="text-xs opacity-70">
                      {data.status === "VERIFIED"
                        ? "Successfully verified by system"
                        : "Pending review"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Anti-Cheat Metadata */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    Security Metadata
                  </h4>
                  <Badge
                    variant="outline"
                    className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-xs font-medium">Timestamp</span>
                    </div>
                    <span className="text-end text-xs font-mono text-foreground">
                      {data.verifiedAt
                        ? format(new Date(data.verifiedAt), "PPP p")
                        : "N/A"}
                    </span>
                  </div>

                  {data.metaData?.ipAddress && (
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs font-medium">IP Address</span>
                      </div>
                      <span className="text-xs font-mono text-foreground">
                        {data.metaData.ipAddress}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Monitor className="w-4 h-4" />
                      <span className="text-xs font-medium">System Scan</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                      Passed
                    </span>
                  </div>
                </div>
              </div>

              {data.rejectionReason && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2">
                  <h5 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Rejection Reason
                  </h5>
                  <p className="text-xs text-red-600/80 dark:text-red-300/80 leading-relaxed">
                    {data.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border bg-muted/20 shrink-0">
              <p className="text-[10px] text-center text-muted-foreground">
                Verification ID: {data.id} • Session validated via Google Play
                Guidelines
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
