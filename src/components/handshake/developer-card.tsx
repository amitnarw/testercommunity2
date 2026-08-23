"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function DeveloperCard({
  data,
  currentUserId,
  hasOwnPublishedApp = false,
}: DeveloperCardProps) {
  const router = useRouter();
  const [sendOpen, setSendOpen] = useState(false);

  const isOwn = data.appOwnerId === currentUserId;
  const isFull = data.totalTester > 0 && data.currentTester >= data.totalTester;
  const disabled = isOwn || isFull || !hasOwnPublishedApp;

  return (
    <>
      <Card className="overflow-hidden hover:border-emerald-500/40 transition-all duration-300 group">
        <CardContent className="p-0">
          <div className="relative h-24 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-amber-500/10">
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />
            <div className="absolute top-2 right-2 flex items-center gap-1">
              {data.eliteBadge && <EliteBadge size="sm" />}
            </div>
          </div>

          <div className="px-4 pb-4 -mt-10 relative">
            <div className="flex items-end justify-between mb-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-card border-2 border-background shadow-md">
                {data.appLogoUrl ? (
                  <SafeImage
                    src={data.appLogoUrl}
                    alt={data.appName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                <Users className="w-3 h-3" />
                {data.currentTester}/{data.totalTester}
              </span>
            </div>

            <h3 className="font-semibold text-base leading-tight line-clamp-2 min-h-[2.5rem]">
              {data.appName || "Untitled app"}
            </h3>

            <div className="flex items-center gap-2 mt-1.5">
              <div className="relative w-5 h-5 rounded-full overflow-hidden bg-muted flex-shrink-0">
                {data.appOwnerImage ? (
                  <SafeImage
                    src={data.appOwnerImage}
                    alt={data.appOwnerName}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {data.appOwnerName}
              </p>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
                L{data.appOwnerLevel}
              </span>
            </div>

            <motion.div whileTap={{ scale: 0.97 }} className="mt-3">
              {!hasOwnPublishedApp && !isOwn ? (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_SUBMIT)}
                >
                  Publish an app first
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full"
                  variant={disabled ? "outline" : "default"}
                  disabled={disabled}
                  onClick={() => !disabled && setSendOpen(true)}
                >
                  {isOwn ? "Your app" : isFull ? "Full" : "Handshake"}
                </Button>
              )}
            </motion.div>
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
