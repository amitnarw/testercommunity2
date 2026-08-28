"use client";

import { Star, ShieldCheck, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useMyLevel, useLeaderboard } from "@/hooks/useLevel";
import { EliteBadge } from "@/components/handshake/elite-badge";
import { LevelProgressBar } from "@/components/handshake/level-progress-bar";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * S10: Elite Badge lives on the profile now (the standalone
 * /app/handshake-testing/elite-badge page was removed). Shows badge status,
 * handshake level progress, and the compact top-10 leaderboard.
 */
export function EliteBadgeSection() {
  const { data: myLevel, isLoading } = useMyLevel();
  const { data: leaderboard } = useLeaderboard(10);

  return (
    <section id="elite-badge" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-amber-500 fill-current" />
          Elite Badge
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Awarded by admins to trusted, highly reliable developers. It&apos;s a
          visual indicator of your reputation , it doesn&apos;t unlock features
          or remove restrictions.
        </p>
      </div>

      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 via-background to-amber-500/5">
        <CardContent className="p-6 text-center">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-40 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          ) : myLevel?.eliteBadge ? (
            <>
              <EliteBadge size="lg" showLabel />
              <p className="text-lg font-semibold mt-3">
                You have the Elite Badge
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Keep up the great work , it&apos;s a signal of your reliability.
              </p>
            </>
          ) : (
            <>
              <ShieldCheck className="w-10 h-10 text-muted-foreground mx-auto" />
              <p className="text-lg font-semibold mt-3">
                You don&apos;t have the Elite Badge yet
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Admins award the Elite Badge to developers with strong testing
                history and reliability. Keep completing handshakes!
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {myLevel && (
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
            Your handshake level
          </h3>
          <LevelProgressBar />
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Top 10 developers
          </h3>
          <div className="space-y-2">
            {(leaderboard?.items ?? []).map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <span className="w-6 text-sm font-bold text-muted-foreground">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0 truncate">{entry.name}</div>
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                  L{entry.handshakeLevel}
                </span>
                {entry.eliteBadge && <EliteBadge size="xs" />}
                <span className="text-xs text-muted-foreground">
                  {entry.handshakeCompletedCount}
                </span>
              </div>
            ))}
            {(!leaderboard?.items || leaderboard.items.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No completed handshakes yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
