"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";
import { ROUTES } from "@/lib/routes";
import type { HubSubmittedAppResponse } from "@/lib/types";

interface ExistingHandshakesSectionProps {
  apps: HubSubmittedAppResponse[];
  isLoading: boolean;
}

export function ExistingHandshakesSection({ apps, isLoading }: ExistingHandshakesSectionProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!apps || apps.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
        No active handshakes yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {apps.map((app, i) => (
        <motion.div
          key={app.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <Card
            className="cursor-pointer hover:border-emerald-500/40 transition-colors"
            onClick={() => router.push(ROUTES.AUTHENTICATED.HANDSHAKE_TESTING + `/${app.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {app.androidApp?.appLogoUrl ? (
                    <SafeImage
                      src={app.androidApp.appLogoUrl}
                      alt={app.androidApp.appName}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {app.androidApp?.appName || "Untitled"}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Handshake className="w-3 h-3 text-emerald-500" />
                    <p className="text-xs text-muted-foreground truncate">
                      {app.appOwner?.name}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
