"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Star,
  Award,
  ShieldOff,
  Search,
  ShieldCheck,
  AlertTriangle,
  X,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AppPagination } from "@/components/app-pagination";
import {
  useAwardEliteBadge,
  useRevokeEliteBadge,
  useEliteBadgeHolders,
  useEliteBadgeActivity,
  useEliteBadgeUserSearch,
} from "@/hooks/useEliteBadge";
import { useToast } from "@/hooks/use-toast";
import { EliteBadge } from "@/components/handshake/elite-badge";
import type {
  EliteBadgeUserSearchItem,
  EliteBadgeHolder,
} from "@/lib/types";

const ITEMS_PER_PAGE = 10;
const ACTIVITY_PAGE_SIZE = 8;

export default function AdminEliteBadgesPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<EliteBadgeUserSearchItem | null>(
    null,
  );
  const [awardDialogOpen, setAwardDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [awardReason, setAwardReason] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const { toast } = useToast();

  const awardMutation = useAwardEliteBadge({
    onSuccess: () => {
      toast({
        title: "Elite Badge awarded",
        description: `${selectedUser?.name ?? "User"} is now elite.`,
      });
      setSelectedUser(null);
      setSearch("");
      setAwardReason("");
      setAwardDialogOpen(false);
    },
    onError: (e) =>
      toast({
        title: "Award failed",
        description: e?.message || "Unknown error",
        variant: "destructive",
      }),
  });

  const revokeMutation = useRevokeEliteBadge({
    onSuccess: () => {
      toast({
        title: "Elite Badge revoked",
        description: `${selectedUser?.name ?? "User"} lost the badge.`,
      });
      setSelectedUser(null);
      setSearch("");
      setRevokeReason("");
      setRevokeDialogOpen(false);
    },
    onError: (e) =>
      toast({
        title: "Revoke failed",
        description: e?.message || "Unknown error",
        variant: "destructive",
      }),
  });

  const { data: activityData, isLoading: activityLoading } =
    useEliteBadgeActivity({ page: 1, limit: 1 });
  const stats = activityData?.stats;

  const confirmAward = () => {
    if (!selectedUser) return;
    awardMutation.mutate({
      userId: selectedUser.id,
      reason: awardReason.trim() || undefined,
    });
  };

  const confirmRevoke = () => {
    if (!selectedUser) return;
    if (!revokeReason.trim()) {
      toast({
        title: "Reason required",
        description: "Revocations must include a reason for the audit log.",
        variant: "destructive",
      });
      return;
    }
    revokeMutation.mutate({
      userId: selectedUser.id,
      reason: revokeReason.trim(),
    });
  };

  return (
    <div className="flex-1 space-y-8 container mx-auto px-4 md:px-6 mb-8">
      <header>
        <div className="flex items-center gap-2">
          <Star className="w-7 h-7 text-amber-500 fill-current" />
          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset] pb-2">
            Elite Badge Management
          </h2>
        </div>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Award or revoke the visual Elite Badge. The badge signals trust and
          reliability , it does not unlock features or bypass penalties.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
          label="Active holders"
          value={stats?.totalHolders}
          loading={activityLoading}
        />
        <StatCard
          icon={<Award className="w-5 h-5 text-green-500" />}
          label="Awards , last 30d"
          value={stats?.awardsLast30d}
          loading={activityLoading}
        />
        <StatCard
          icon={<ShieldOff className="w-5 h-5 text-red-500" />}
          label="Revokes , last 30d"
          value={stats?.revokesLast30d}
          loading={activityLoading}
        />
      </div>

      <Tabs defaultValue="manage" className="w-full space-y-4">
        <TabsList className="w-full md:w-auto flex">
          <TabsTrigger value="manage">Manage</TabsTrigger>
          <TabsTrigger value="holders">Holders</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <Card className="lg:col-span-3">
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-base font-semibold">
                    Find a user
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Search by name or email. Select a user to view their badge
                    status.
                  </p>
                </div>

                <UserSearch
                  value={search}
                  onChange={setSearch}
                  onSelect={(u) => {
                    setSelectedUser(u);
                    setAwardReason("");
                    setRevokeReason("");
                  }}
                  selectedId={selectedUser?.id}
                />

                <SelectedUserCard
                  user={selectedUser}
                  onClear={() => {
                    setSelectedUser(null);
                    setAwardReason("");
                    setRevokeReason("");
                  }}
                />
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <ActionCard
                variant="award"
                title="Award Elite Badge"
                description="Marks the user as a trusted, highly reliable developer."
                reason={awardReason}
                onReasonChange={setAwardReason}
                required={false}
                ctaLabel="Award badge"
                onCta={() => setAwardDialogOpen(true)}
                disabled={!selectedUser || selectedUser.eliteBadge}
                pending={awardMutation.isPending}
              />
              <ActionCard
                variant="revoke"
                title="Revoke Elite Badge"
                description="Reason is required for audit. The user will lose the badge immediately."
                reason={revokeReason}
                onReasonChange={setRevokeReason}
                required
                ctaLabel="Revoke badge"
                onCta={() => setRevokeDialogOpen(true)}
                disabled={!selectedUser || !selectedUser.eliteBadge}
                pending={revokeMutation.isPending}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="holders" className="space-y-4">
          <HoldersTab />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityTab />
        </TabsContent>
      </Tabs>

      <Dialog open={awardDialogOpen} onOpenChange={setAwardDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Award Elite Badge
            </DialogTitle>
            <DialogDescription>
              Awarding the badge to{" "}
              <strong>{selectedUser?.name ?? "this user"}</strong>. This will
              be recorded in the activity log.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser.image || undefined} />
                <AvatarFallback>{initials(selectedUser.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedUser.email}
                </p>
              </div>
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Reason:</span>{" "}
            <span className="font-medium">
              {awardReason.trim() || "(none provided)"}
            </span>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setAwardDialogOpen(false)}
              disabled={awardMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={confirmAward}
              disabled={awardMutation.isPending}
            >
              {awardMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm award
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <ShieldOff className="w-5 h-5" />
              Revoke Elite Badge
            </DialogTitle>
            <DialogDescription>
              You are about to revoke the badge from{" "}
              <strong>{selectedUser?.name ?? "this user"}</strong>. This action
              is recorded with your admin id.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedUser.image || undefined} />
                <AvatarFallback>{initials(selectedUser.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-medium truncate">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {selectedUser.email}
                </p>
              </div>
              <EliteBadge size="sm" className="ml-auto" />
            </div>
          )}
          <div className="text-sm">
            <span className="text-muted-foreground">Reason:</span>{" "}
            <span className="font-medium">{revokeReason.trim()}</span>
          </div>
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 flex gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p>
              Revocation is permanent in the user record but the activity log
              keeps a full trail of every award/revoke event.
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setRevokeDialogOpen(false)}
              disabled={revokeMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRevoke}
              disabled={revokeMutation.isPending}
            >
              {revokeMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          {icon}
        </div>
        <div className="mt-3">
          {loading || value === undefined ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function UserSearch({
  value,
  onChange,
  onSelect,
  selectedId,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (u: EliteBadgeUserSearchItem) => void;
  selectedId?: string;
}) {
  const { data, isLoading } = useEliteBadgeUserSearch(value, 10);
  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setShowResults(false);
  }, [selectedId]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowResults(true);
        }}
        onFocus={() => setShowResults(true)}
        placeholder="Search by name or email..."
        className="pl-10"
        autoComplete="off"
      />
      {showResults && (value.trim() || items.length > 0) && (
        <div className="absolute z-30 mt-1 w-full max-h-80 overflow-y-auto rounded-lg border bg-popover shadow-xl">
          {isLoading && (
            <div className="p-3 space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {!isLoading && items.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No users match “{value}”.
            </div>
          )}
          {!isLoading &&
            items.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  onSelect(u);
                  setShowResults(false);
                }}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-muted/60 transition-colors"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src={u.image || undefined} />
                  <AvatarFallback>{initials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {u.email}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    L{u.handshakeLevel}
                  </span>
                  {u.eliteBadge && <EliteBadge size="xs" />}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function SelectedUserCard({
  user,
  onClear,
}: {
  user: EliteBadgeUserSearchItem | null;
  onClear: () => void;
}) {
  if (!user) {
    return (
      <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground">
        <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
        Pick a user above to manage their Elite Badge.
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || undefined} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold truncate">{user.name}</p>
            <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
              L{user.handshakeLevel}
            </span>
            {user.eliteBadge ? (
              <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/40">
                <EliteBadge size="xs" className="mr-1" /> Elite holder
              </Badge>
            ) : (
              <Badge variant="secondary">Not elite</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          <p className="text-[10px] text-muted-foreground mt-1 font-mono break-all">
            {user.id}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function ActionCard({
  variant,
  title,
  description,
  reason,
  onReasonChange,
  required,
  ctaLabel,
  onCta,
  disabled,
  pending,
}: {
  variant: "award" | "revoke";
  title: string;
  description: string;
  reason: string;
  onReasonChange: (v: string) => void;
  required: boolean;
  ctaLabel: string;
  onCta: () => void;
  disabled: boolean;
  pending: boolean;
}) {
  const isAward = variant === "award";
  return (
    <Card
      className={
        isAward
          ? "border-amber-500/40 bg-gradient-to-br from-amber-500/5 to-transparent"
          : "border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent"
      }
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          {isAward ? (
            <Award className="w-5 h-5 text-amber-600" />
          ) : (
            <ShieldOff className="w-5 h-5 text-red-500" />
          )}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <Textarea
          rows={3}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder={
            isAward
              ? "Optional: why is this user receiving the badge?"
              : "Required: why is the badge being revoked?"
          }
        />
        <Button
          className={
            isAward ? "w-full bg-amber-600 hover:bg-amber-700" : "w-full"
          }
          variant={isAward ? "default" : "destructive"}
          onClick={onCta}
          disabled={disabled || pending || (required && !reason.trim())}
        >
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isAward ? (
            <Award className="mr-2 h-4 w-4" />
          ) : (
            <ShieldOff className="mr-2 h-4 w-4" />
          )}
          {ctaLabel}
        </Button>
        {required && !reason.trim() && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> A reason is required to
            revoke.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function HoldersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading } = useEliteBadgeHolders({
    page,
    limit: ITEMS_PER_PAGE,
    search: search.trim() || undefined,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search elite badge holders..."
        />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Level</th>
                <th className="px-4 py-3 font-semibold">Completed</th>
                <th className="px-4 py-3 font-semibold">Awarded</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={5} className="px-4 py-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No elite badge holders found.
                  </td>
                </tr>
              )}
              {!isLoading &&
                items.map((u) => (
                  <HolderRow key={u.id} holder={u} />
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {!isLoading && totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

function HolderRow({ holder }: { holder: EliteBadgeHolder }) {
  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src={holder.image || undefined} />
            <AvatarFallback>{initials(holder.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium truncate flex items-center gap-1">
              {holder.name}
              <EliteBadge size="xs" />
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {holder.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
          L{holder.handshakeLevel}
        </span>
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {holder.handshakeCompletedCount}
      </td>
      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
        {holder.eliteBadgeAwardedAt
          ? new Date(holder.eliteBadgeAwardedAt).toLocaleString()
          : ", "}
      </td>
      <td className="px-4 py-3 max-w-xs">
        <p className="truncate text-muted-foreground" title={holder.eliteBadgeReason || ""}>
          {holder.eliteBadgeReason || ", "}
        </p>
      </td>
    </tr>
  );
}

function ActivityTab() {
  const [filter, setFilter] = useState<"ALL" | "AWARD" | "REVOKE">("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const { data, isLoading } = useEliteBadgeActivity({
    page,
    limit: ACTIVITY_PAGE_SIZE,
    action: filter,
  });

  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Filter:</Label>
          <div className="inline-flex rounded-md border bg-muted/30 p-1">
            {(["ALL", "AWARD", "REVOKE"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-medium rounded ${
                  filter === f
                    ? "bg-background shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "ALL" ? "All" : f === "AWARD" ? "Awards" : "Revokes"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {data?.total ?? 0} events
        </p>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b">
                <th className="px-4 py-3 font-semibold">Action</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">By admin</th>
                <th className="px-4 py-3 font-semibold">Reason</th>
                <th className="px-4 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                [1, 2, 3].map((i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={5} className="px-4 py-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))}
              {!isLoading && items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No activity yet.
                  </td>
                </tr>
              )}
              {!isLoading &&
                items.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      {entry.action === "AWARD" ? (
                        <Badge className="bg-green-500/15 text-green-700 border-green-500/40">
                          <Award className="w-3 h-3 mr-1" /> Award
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <ShieldOff className="w-3 h-3 mr-1" /> Revoke
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {entry.user ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src={entry.user.image || undefined} />
                            <AvatarFallback>
                              {initials(entry.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {entry.user.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {entry.user.email}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {entry.userId}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.admin?.name || entry.adminId}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p
                        className="truncate text-muted-foreground"
                        title={entry.reason || ""}
                      >
                        {entry.reason || ", "}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {!isLoading && totalPages > 1 && (
        <AppPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("");
}
