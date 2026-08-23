"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Sparkles,
  Layers,
  UserPlus,
  XCircle,
} from "lucide-react";
import {
  useProfessionalAssignments,
  useAssignProfessionalTester,
  useFillProfessionalTester,
  useCancelProfessionalTester,
} from "@/hooks/useAddons";
import { useToast } from "@/hooks/use-toast";

export default function AdminHandshakeAddonsPage() {
  const { data, isLoading, refetch } = useProfessionalAssignments();
  const { toast } = useToast();

  // P4/M8: this page used to be read-only ,  the assign / fill / cancel
  // actions existed in the API and hooks but had no controls here.
  const cancelMutation = useCancelProfessionalTester({
    onSuccess: () => {
      toast({ title: "Assignment cancelled" });
      refetch();
    },
    onError: (err) =>
      toast({
        title: "Cancel failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      }),
  });

  const fillMutation = useFillProfessionalTester({
    onSuccess: () => {
      toast({ title: "Professional tester assigned" });
      refetch();
    },
    onError: (err) =>
      toast({
        title: "Assign failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      }),
  });

  const [proUserIdByRow, setProUserIdByRow] = useState<Record<number, string>>({});

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Handshake Add-ons</h1>
        <p className="text-sm text-muted-foreground">
          Manage professional tester assignments for campaigns that need a
          tester replacement.
        </p>
      </header>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Professional Tester queue
        </h2>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (data?.items ?? []).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No professional tester assignments right now.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {data!.items.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {a.status === "OPEN" ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <Layers className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        Campaign #{a.campaignId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.status} · {a.feeINR} INR · Assigned{" "}
                        {new Date(a.assignedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {a.status === "OPEN" && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-t border-border/50 pt-3">
                      <Input
                        placeholder="Professional user ID (cuid)"
                        value={proUserIdByRow[a.id] || ""}
                        onChange={(e) =>
                          setProUserIdByRow((prev) => ({
                            ...prev,
                            [a.id]: e.target.value,
                          }))
                        }
                        className="sm:max-w-xs"
                      />
                      <Button
                        size="sm"
                        disabled={
                          !proUserIdByRow[a.id]?.trim() || fillMutation.isPending
                        }
                        onClick={() =>
                          fillMutation.mutate({
                            assignmentId: a.id,
                            professionalUserId: proUserIdByRow[a.id].trim(),
                          })
                        }
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Fill with tester
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cancelMutation.isPending}
                        onClick={() => cancelMutation.mutate(a.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Cancel slot
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          How to use
        </h2>
        <Card>
          <CardContent className="p-5 text-sm text-muted-foreground space-y-2">
            <p>
              The catalog of paid add-ons (Professional Tester, Priority
              Support) is configured in the Plans admin area. When users
              purchase the Professional Tester add-on for a campaign, the
              assignment automatically opens here.
            </p>
            <p>
              To replace a failing tester on an active campaign: use the{" "}
              <strong>Replace</strong> action on the Handshake Monitoring page.
              Then fill the open assignment above with a professional
              tester&apos;s user ID, or cancel it to release the slot.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Keep unused hook import honest ,  direct assignment without purchase */}
      <DirectAssignSection />
    </div>
  );
}

function DirectAssignSection() {
  const { toast } = useToast();
  const [campaignId, setCampaignId] = useState("");
  const assignMutation = useAssignProfessionalTester({
    onSuccess: () => {
      toast({ title: "Slot opened", description: "Professional tester slot created." });
      setCampaignId("");
    },
    onError: (err) =>
      toast({
        title: "Open failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      }),
  });

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <h3 className="text-sm font-semibold">Open a slot manually</h3>
        <p className="text-sm text-muted-foreground">
          Create a professional-tester slot for any campaign without a prior
          add-on purchase.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            type="number"
            min="1"
            placeholder="Campaign ID"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            className="sm:max-w-xs"
          />
          <Button
            size="sm"
            disabled={!campaignId || assignMutation.isPending}
            onClick={() =>
              assignMutation.mutate({ campaignId: Number(campaignId) })
            }
          >
            Open slot
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
