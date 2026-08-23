"use client";

import { useState } from "react";
import { Star, Award, ShieldOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAwardEliteBadge, useRevokeEliteBadge } from "@/hooks/useEliteBadge";
import { useToast } from "@/hooks/use-toast";
import { EliteBadge } from "@/components/handshake/elite-badge";

export default function AdminEliteBadgesPage() {
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const award = useAwardEliteBadge();
  const revoke = useRevokeEliteBadge();
  const { toast } = useToast();

  const handleAward = () => {
    if (!userId.trim()) {
      toast({ title: "User ID required", variant: "destructive" });
      return;
    }
    award.mutate(
      { userId: userId.trim(), reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: "Elite Badge awarded", description: userId });
          setUserId("");
          setReason("");
        },
        onError: (e: any) =>
          toast({ title: "Failed", description: e?.message || "Unknown", variant: "destructive" }),
      },
    );
  };

  const handleRevoke = () => {
    if (!userId.trim()) {
      toast({ title: "User ID required", variant: "destructive" });
      return;
    }
    revoke.mutate(
      { userId: userId.trim(), reason: reason.trim() || undefined },
      {
        onSuccess: () => {
          toast({ title: "Elite Badge revoked", description: userId });
          setUserId("");
          setReason("");
        },
        onError: (e: any) =>
          toast({ title: "Failed", description: e?.message || "Unknown", variant: "destructive" }),
      },
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-6 h-6 text-amber-500 fill-current" />
          <h1 className="text-2xl font-bold">Elite Badge Management</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Award or revoke the visual Elite Badge. The badge is purely a
          reputation indicator ,  it does not unlock features.
        </p>
      </header>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-center p-6 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <EliteBadge size="lg" showLabel />
          </div>

          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user_abc123"
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Why is this user receiving/losing the badge?"
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-700"
              disabled={award.isPending || !userId.trim()}
              onClick={handleAward}
            >
              <Award className="w-4 h-4 mr-1" />
              Award
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={revoke.isPending || !userId.trim()}
              onClick={handleRevoke}
            >
              <ShieldOff className="w-4 h-4 mr-1" />
              Revoke
            </Button>
          </div>

          <Badge variant="secondary" className="w-full justify-center py-2">
            <span className="text-xs">Visual indicator only · No functional unlocks</span>
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
