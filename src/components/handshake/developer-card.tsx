"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/safe-image";
import { EliteBadge } from "./elite-badge";
import { SendHandshakeModal } from "./send-handshake-modal";
import { ROUTES } from "@/lib/routes";

interface DeveloperCardData {
  id: number;
  appName: string;
  appLogoUrl: string;
  packageName?: string;
  appOwnerId: string;
  appOwnerName: string;
  appOwnerImage: string | null;
  appOwnerLevel: number;
  eliteBadge: boolean;
  totalTester: number;
  currentTester: number;
  status: string;
}

interface DeveloperCardProps {
  data: DeveloperCardData;
  currentUserId?: string;
  hasOwnPublishedApp?: boolean;
}

type SlotPillState = {
  label: string;
  className: string;
  dotClassName: string;
};

function slotPillState(current: number, total: number): SlotPillState {
  if (total <= 0) {
    return {
      label: `${current} slots`,
      className:
        "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      dotClassName: "bg-emerald-500",
    };
  }
  const remaining = total - current;
  if (remaining <= 0) {
    return {
      label: "Full",
      className:
        "bg-muted text-muted-foreground border-border line-through",
      dotClassName: "bg-muted-foreground/50",
    };
  }
  if (remaining <= 3) {
    return {
      label: `${current}/${total}`,
      className:
        "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      dotClassName: "bg-amber-500",
    };
  }
  return {
    label: `${current}/${total}`,
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    dotClassName: "bg-emerald-500",
  };
}

export function DeveloperCard({
  data,
  currentUserId,
  hasOwnPublishedApp = false,
}: DeveloperCardProps) {
  const router = useRouter();
  const [sendOpen, setSendOpen] = useState(false);

  const isOwn = data.appOwnerId === currentUserId;
  const isFull =
    data.totalTester > 0 && data.currentTester >= data.totalTester;
  const disabled = isOwn || isFull;
  const needPublish = !hasOwnPublishedApp && !isOwn;

  const ownerInitial =
    (data.appOwnerName || "?").trim().charAt(0).toUpperCase() || "?";
  const appInitial =
    (data.appName || "?").trim().charAt(0).toUpperCase() || "?";
  const pill = slotPillState(data.currentTester, data.totalTester);

  return (
    <>
      <Card className="group h-full overflow-hidden border-border/60 bg-card hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Top row: app logo + Elite badge (opposite corners, no gradient header) */}
          <div className="flex items-start justify-between gap-3 px-5 pt-5">
            <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-amber-500/10 ring-1 ring-border/40 flex-shrink-0">
              {data.appLogoUrl ? (
                <SafeImage
                  src={data.appLogoUrl}
                  alt={data.appName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-muted-foreground/60">
                  {appInitial}
                </div>
              )}
            </div>
            {data.eliteBadge ? (
              <div className="flex-shrink-0 -mt-1">
                <EliteBadge size="sm" />
              </div>
            ) : null}
          </div>

          {/* Identity */}
          <div className="px-5 mt-3">
            <h3 className="font-semibold text-base leading-tight line-clamp-1 text-foreground">
              {data.appName || "Untitled app"}
            </h3>
            {data.packageName ? (
              <p className="mt-0.5 text-xs text-muted-foreground font-mono truncate">
                {data.packageName}
              </p>
            ) : null}
          </div>

          {/* Hairline divider */}
          <div className="my-4 mx-5 border-t border-border/60" />

          {/* Owner row: avatar + name + level chip */}
          <div className="px-5 flex items-center gap-2.5 min-w-0">
            <Avatar className="h-8 w-8 ring-1 ring-border/40">
              {data.appOwnerImage ? (
                <AvatarImage
                  src={data.appOwnerImage}
                  alt={data.appOwnerName}
                />
              ) : null}
              <AvatarFallback className="text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                {ownerInitial}
              </AvatarFallback>
            </Avatar>
            <p className="flex-1 min-w-0 text-sm text-foreground/80 truncate">
              {data.appOwnerName}
            </p>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold whitespace-nowrap">
              L{data.appOwnerLevel}
            </span>
          </div>

          {/* Twin CTA: slots pill + Handshake button */}
          <div className="px-5 pb-5 pt-4 mt-auto">
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl border text-xs font-semibold",
                  pill.className,
                )}
                aria-label={`${data.currentTester} of ${data.totalTester} slots filled`}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    pill.dotClassName,
                  )}
                />
                {pill.label}
              </div>
              {needPublish ? (
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 font-semibold"
                    onClick={() =>
                      router.push(ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT)
                    }
                  >
                    Publish first
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    className={cn(
                      "h-10 px-4 rounded-xl font-semibold transition-all",
                      !disabled &&
                        "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40",
                    )}
                    variant={disabled ? "outline" : "default"}
                    disabled={disabled}
                    onClick={() => !disabled && setSendOpen(true)}
                  >
                    <Handshake className="w-3.5 h-3.5 mr-1.5" />
                    {isOwn ? "Your app" : isFull ? "Full" : "Handshake"}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <SendHandshakeModal
        open={sendOpen}
        onOpenChange={setSendOpen}
        targetAppId={data.id}
        targetAppName={data.appName}
        targetOwnerId={data.appOwnerId}
        targetOwnerName={data.appOwnerName}
      />
    </>
  );
}
