"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackModal } from "@/components/feedback-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Pencil,
  Trash2,
  GripVertical,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useFinancePlans,
  useCreateFinancePlan,
  useUpdateFinancePlan,
  useReorderFinancePlans,
  useDeleteFinancePlan,
} from "@/hooks/useAdmin";
import { useQueryClient } from "@tanstack/react-query";
import type { FinancePlan, PlanAccent } from "@/lib/types";

const ACCENT_OPTIONS: { value: PlanAccent; label: string; swatch: string }[] = [
  { value: "primary", label: "Primary (Violet)", swatch: "#7c3aed" },
  { value: "emerald", label: "Emerald", swatch: "#059669" },
  { value: "blue", label: "Blue", swatch: "#2563eb" },
  { value: "amber", label: "Amber", swatch: "#d97706" },
  { value: "purple", label: "Purple", swatch: "#9333ea" },
];

const HEX_RE = /^#[0-9a-fA-F]{3,8}$/;

type PlanFormState = {
  name: string;
  price: string;
  package: string;
  features: string[];
  description: string;
  badgeText: string;
  accent: PlanAccent;
  gradientFrom: string;
  gradientTo: string;
  customPriceLabel: string;
  customPriceSuffix: string;
  isPopular: boolean;
  billingType: "ONE_TIME" | "SUBSCRIPTION" | "CUSTOM" | "NONE";
  buttonAction: "BUY" | "REDIRECT" | "NONE";
  isActive: boolean;
  ctaLabel: string;
  ctaHref: string;
};

const emptyForm = (): PlanFormState => ({
  name: "",
  price: "",
  package: "1",
  features: [""],
  description: "",
  badgeText: "",
  accent: "primary",
  gradientFrom: "",
  gradientTo: "",
  customPriceLabel: "",
  customPriceSuffix: "",
  isPopular: false,
  billingType: "ONE_TIME",
  buttonAction: "BUY",
  isActive: true,
  ctaLabel: "",
  ctaHref: "",
});

function fromPlan(p: FinancePlan): PlanFormState {
  return {
    name: p.name ?? "",
    price: String(p.price ?? ""),
    package: String(p.package ?? 1),
    features: (p.features && Array.isArray(p.features) ? p.features : [""]).map(
      (f: any) => String(f ?? ""),
    ),
    description: p.description ?? "",
    badgeText: p.badgeText ?? "",
    accent: (p.accent as PlanAccent) || "primary",
    gradientFrom: p.gradientFrom ?? "",
    gradientTo: p.gradientTo ?? "",
    customPriceLabel: p.customPriceLabel ?? "",
    customPriceSuffix: p.customPriceSuffix ?? "",
    isPopular: !!p.isPopular,
    billingType:
      p.billingType === "SUBSCRIPTION" || p.billingType === "CUSTOM" || p.billingType === "NONE"
        ? p.billingType
        : "ONE_TIME",
    buttonAction:
      p.buttonAction === "REDIRECT" || p.buttonAction === "NONE" ? p.buttonAction : "BUY",
    isActive: p.isActive ?? true,
    ctaLabel: p.ctaLabel ?? "",
    ctaHref: p.ctaHref ?? "",
  };
}

function SortableRow({
  plan,
  onEdit,
  onDelete,
  savingOrder,
}: {
  plan: FinancePlan;
  onEdit: (plan: FinancePlan) => void;
  onDelete: (plan: FinancePlan) => void;
  savingOrder: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: plan.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const accent = (plan.accent as PlanAccent) || "primary";
  const swatch = ACCENT_OPTIONS.find((a) => a.value === accent)?.swatch || "#7c3aed";

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50 bg-muted/50" : ""} ${savingOrder ? "pointer-events-none" : ""}`}
    >
      <TableCell
        className={`w-8 cursor-grab active:cursor-grabbing ${savingOrder ? "opacity-40" : ""}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="font-medium">{plan.badgeText || plan.name}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ background: swatch }}
            title={accent}
          />
          {plan.gradientFrom && plan.gradientTo && (
            <span
              className="inline-block w-6 h-3 rounded-full border border-border"
              style={{
                background: `linear-gradient(90deg, ${plan.gradientFrom}, ${plan.gradientTo})`,
              }}
              title={`${plan.gradientFrom} → ${plan.gradientTo}`}
            />
          )}
        </div>
      </TableCell>
      <TableCell>
        {plan.customPriceLabel ? (
          <span className="font-semibold">{plan.customPriceLabel}</span>
        ) : (
          <span className="font-semibold">₹{plan.price}</span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          className={`text-xs ${
            plan.billingType === "SUBSCRIPTION"
              ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
              : plan.billingType === "CUSTOM"
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                : plan.billingType === "NONE"
                  ? "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                  : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
          }`}
        >
          {plan.billingType === "SUBSCRIPTION"
            ? "Subscription"
            : plan.billingType === "CUSTOM"
              ? "Custom"
              : plan.billingType === "NONE"
                ? "None"
                : "One-Time"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge
          className={`text-xs ${
            plan.buttonAction === "REDIRECT"
              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : plan.buttonAction === "NONE"
                ? "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
          }`}
        >
          {plan.buttonAction === "REDIRECT"
            ? "Redirect"
            : plan.buttonAction === "NONE"
              ? "None"
              : "Buy"}
        </Badge>
      </TableCell>
      <TableCell>
        {plan.isPopular ? (
          <Badge className="text-xs bg-amber-500/20 text-amber-600 dark:text-amber-400">
            Popular
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">, </span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          className={`text-xs ${plan.isActive ? "bg-green-500/20 text-green-600 dark:text-green-400" : "bg-gray-500/20 text-gray-500"}`}
        >
          {plan.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(plan)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            onClick={() => onDelete(plan)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function SortableFeatureRow({
  id,
  index,
  value,
  onChange,
  onRemove,
  removable,
}: {
  id: string;
  index: number;
  value: string;
  onChange: (v: string) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-lg ${isDragging ? "opacity-50" : ""}`}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-8 shrink-0 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
        aria-label={`Reorder feature ${index + 1}`}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Feature ${index + 1}`}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-8 shrink-0"
        disabled={!removable}
        onClick={onRemove}
        aria-label={`Remove feature ${index + 1}`}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}

export function PlansTable() {
  const queryClient = useQueryClient();
  const { data: plans, isLoading } = useFinancePlans();
  const createMutation = useCreateFinancePlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePlans"] });
      setEditorOpen(false);
      setFeedback({
        open: true,
        status: "success",
        title: "Created!",
        description: "Plan created successfully.",
      });
    },
    onError: (err: any) => {
      setFeedback({
        open: true,
        status: "error",
        title: "Failed",
        description: err?.message || "Failed to create plan",
      });
    },
  });
  const updateMutation = useUpdateFinancePlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePlans"] });
      setEditorOpen(false);
      setFeedback({
        open: true,
        status: "success",
        title: "Updated!",
        description: "Plan updated successfully.",
      });
    },
    onError: (err: any) => {
      setFeedback({
        open: true,
        status: "error",
        title: "Failed",
        description: err?.message || "Failed to update plan",
      });
    },
  });
  const reorderMutation = useReorderFinancePlans({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePlans"] });
      queryClient.invalidateQueries({ queryKey: ["pricingPlansGrid"] });
      queryClient.invalidateQueries({ queryKey: ["handshakePlan"] });
      queryClient.invalidateQueries({ queryKey: ["usePricingData"] });
      setSavingOrder(false);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePlans"] });
      setSavingOrder(false);
    },
  });
  const deleteMutation = useDeleteFinancePlan({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["useFinancePlans"] });
      setFeedback({
        open: true,
        status: "success",
        title: "Deleted!",
        description: "Plan deleted successfully.",
      });
    },
    onError: (err: any) => {
      setFeedback({
        open: true,
        status: "error",
        title: "Failed",
        description: err?.message || "Failed to delete plan",
      });
    },
  });

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [priceSuffixOpen, setPriceSuffixOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<FinancePlan | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<{
    subscriberCount: number;
  } | null>(null);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  const [savingOrder, setSavingOrder] = useState(false);
  const [savedOrder, setSavedOrder] = useState<string[]>([]);

  const [feedback, setFeedback] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const featureSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const list: FinancePlan[] = useMemo(() => {
    const arr = Array.isArray(plans) ? plans : [];
    return [...arr].sort(
      (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0),
    );
  }, [plans]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm());
    setPriceSuffixOpen(false);
    setFormError(null);
    setEditorOpen(true);
  };

  const openEdit = (plan: FinancePlan) => {
    setEditingId(plan.id);
    setForm(fromPlan(plan));
    setPriceSuffixOpen(!!(plan.customPriceSuffix ?? "").trim());
    setFormError(null);
    setEditorOpen(true);
  };

  const updateForm = (patch: Partial<PlanFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "Plan name is required";
    if (form.price === "" || Number.isNaN(Number(form.price)) || Number(form.price) < 0)
      return "A valid price is required";
    if (Number.isNaN(Number(form.package)) || Number(form.package) < 1)
      return "A valid package count is required";
    if (
      form.gradientFrom &&
      !HEX_RE.test(form.gradientFrom.trim())
    )
      return "Gradient From must be a hex color (e.g. #0ea5e9)";
    if (form.gradientTo && !HEX_RE.test(form.gradientTo.trim()))
      return "Gradient To must be a hex color (e.g. #7c3aed)";
    return null;
  };

  const saveEditor = () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      package: Number(form.package),
      features: form.features
        .map((f) => f.trim())
        .filter((f) => f.length > 0),
      description: form.description.trim() || null,
      badgeText: form.badgeText.trim() || null,
      accent: form.accent,
      gradientFrom: form.gradientFrom.trim() || null,
      gradientTo: form.gradientTo.trim() || null,
      customPriceLabel: form.customPriceLabel.trim() || null,
      customPriceSuffix: form.customPriceSuffix.trim() || null,
      isPopular: form.isPopular,
      billingType: form.billingType,
      buttonAction: form.buttonAction,
      isActive: form.isActive,
      ctaLabel: form.ctaLabel.trim() || null,
      ctaHref: form.ctaHref.trim() || null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = list.findIndex((p) => p.id === active.id);
    const newIndex = list.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(list, oldIndex, newIndex);
    const newOrder = reordered.map((p) => p.id);

    setSavedOrder(list.map((p) => p.id));
    queryClient.setQueryData(["useFinancePlans"], reordered);
    setSavingOrder(true);

    reorderMutation.mutate(
      { orderedIds: newOrder },
      {
        onError: () => {
          queryClient.setQueryData(
            ["useFinancePlans"],
            list,
          );
          setSavingOrder(false);
        },
      },
    );
  };

  const requestDelete = (plan: FinancePlan) => {
    setDeleteTarget(plan);
    setDeleteWarning(null);
    setDeleteConfirmOpen(true);
  };

  const performDelete = (confirmCancel: boolean) => {
    if (!deleteTarget) return;
    deleteMutation.mutate(
      {
        id: deleteTarget.id,
        confirmCancelSubscribers: confirmCancel,
      },
      {
        onError: (err: any) => {
          const subscriberCount = err?.response?.data?.data?.subscriberCount;
          const code = err?.response?.data?.data?.code;
          if (code === "ACTIVE_SUBSCRIBERS_EXIST" && typeof subscriberCount === "number") {
            setDeleteConfirmOpen(false);
            setDeleteWarning({ subscriberCount });
            setCancelConfirmOpen(true);
            return;
          }
          setDeleteConfirmOpen(false);
          setDeleteWarning(null);
          setFeedback({
            open: true,
            status: "error",
            title: "Failed",
            description: err?.message || "Failed to delete plan",
          });
        },
      },
    );
  };

  const listLoading = isLoading;

  return (
    <div className="space-y-4">
      <Card className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg">
        <CardContent className="p-6">
           <div className="flex items-center justify-between mb-4">
             <div>
               <h3 className="text-lg font-semibold">Plans</h3>
               <p className="text-sm text-muted-foreground">
                 Cards on Home, Pricing &amp; Billing pull everything from these plans. Drag to reorder.
               </p>
             </div>
             <Button onClick={openCreate} disabled={createMutation.isPending}>
               <Plus className="h-4 w-4 mr-2" /> Add Plan
             </Button>
           </div>

           {savingOrder && (
             <div className="flex items-center gap-2 text-sm text-primary mb-3">
               <Loader2 className="h-4 w-4 animate-spin" /> Saving order…
             </div>
           )}

           {listLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full bg-white/20" />
              <Skeleton className="h-8 w-full bg-white/20" />
            </div>
          ) : list.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-4xl mb-3">📦</p>
              <p>No plans configured yet. Click &quot;Add Plan&quot; to create one.</p>
              <p className="text-sm mt-1">
                Without a SUBSCRIPTION plan, the Handshake card is hidden everywhere.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={list.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-8"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Accent</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Button</TableHead>
                        <TableHead>Popular</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                       {list.map((plan) => (
                         <SortableRow
                           key={plan.id}
                           plan={plan}
                           onEdit={openEdit}
                           onDelete={requestDelete}
                           savingOrder={savingOrder}
                         />
                       ))}
                    </TableBody>
                  </Table>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={(open) => { if (!open) setEditorOpen(false); }}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Plan" : "Add Plan"}</DialogTitle>
            <DialogDescription>
              Configure every aspect of the card shown on Home, Pricing &amp; Billing.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                  placeholder="e.g. Handshake"
                />
              </div>
              <div className="grid gap-2">
                <Label>Badge Text</Label>
                <Input
                  value={form.badgeText}
                  onChange={(e) => updateForm({ badgeText: e.target.value })}
                  placeholder="e.g. HANDSHAKE TESTING"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) => updateForm({ price: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Package / Cycles</Label>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={form.package}
                  onChange={(e) => updateForm({ package: e.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Custom Price Label</Label>
              <Input
                value={form.customPriceLabel}
                onChange={(e) => updateForm({ customPriceLabel: e.target.value })}
                placeholder="e.g. ₹99 (overrides numeric price display)"
              />
            </div>

            {form.billingType !== "NONE" && (
              <div className="grid gap-2">
                {priceSuffixOpen ? (
                  <>
                    <Label>Custom Price Suffix</Label>
                    <Input
                      value={form.customPriceSuffix}
                      onChange={(e) => updateForm({ customPriceSuffix: e.target.value })}
                      placeholder="e.g. / per cycle (shown after the price)"
                    />
                    <button
                      type="button"
                      className="text-xs text-muted-foreground hover:text-foreground underline w-fit"
                      onClick={() => {
                        updateForm({ customPriceSuffix: "" });
                        setPriceSuffixOpen(false);
                      }}
                    >
                      Remove custom suffix
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground underline w-fit"
                    onClick={() => {
                      setPriceSuffixOpen(true);
                    }}
                  >
                    + Add custom price suffix
                  </button>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Short card sub-text shown under the price."
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Features</Label>
                <span className="text-xs text-muted-foreground">Drag handle to reorder</span>
              </div>
              <DndContext
                sensors={featureSensors}
                collisionDetection={closestCenter}
                onDragEnd={({ active, over }) => {
                  if (!over || active.id === over.id) return;
                  const oldIndex = Number(String(active.id).replace("feature-", ""));
                  const newIndex = Number(String(over.id).replace("feature-", ""));
                  if (Number.isNaN(oldIndex) || Number.isNaN(newIndex)) return;
                  updateForm({ features: arrayMove(form.features, oldIndex, newIndex) });
                }}
              >
                <SortableContext
                  items={form.features.map((_, i) => `feature-${i}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {form.features.map((feature, i) => (
                      <SortableFeatureRow
                        key={i}
                        id={`feature-${i}`}
                        index={i}
                        value={feature}
                        removable={form.features.length > 1}
                        onChange={(v) => {
                          const next = [...form.features];
                          next[i] = v;
                          updateForm({ features: next });
                        }}
                        onRemove={() => {
                          if (form.features.length === 1) return;
                          updateForm({
                            features: form.features.filter((_, idx) => idx !== i),
                          });
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => updateForm({ features: [...form.features, ""] })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Accent</Label>
                <Select
                  value={form.accent}
                  onValueChange={(v) => updateForm({ accent: v as PlanAccent })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCENT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{ background: opt.swatch }}
                          />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Billing Type</Label>
                <Select
                  value={form.billingType}
                  onValueChange={(v) =>
                    updateForm({
                      billingType: v as "ONE_TIME" | "SUBSCRIPTION" | "CUSTOM" | "NONE",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One-Time</SelectItem>
                    <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                    <SelectItem value="CUSTOM">Custom (Enterprise)</SelectItem>
                    <SelectItem value="NONE">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Button Action</Label>
                <Select
                  value={form.buttonAction}
                  onValueChange={(v) =>
                    updateForm({
                      buttonAction: v as "BUY" | "REDIRECT" | "NONE",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BUY">Buy via Razorpay</SelectItem>
                    <SelectItem value="REDIRECT">Redirect to URL</SelectItem>
                    <SelectItem value="NONE">None (no button)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {form.buttonAction !== "NONE" && (
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>CTA Label</Label>
                    <Input
                      value={form.ctaLabel}
                      onChange={(e) => updateForm({ ctaLabel: e.target.value })}
                      placeholder={
                        form.buttonAction === "REDIRECT"
                          ? "e.g. Learn More, Get in Touch"
                          : "e.g. Subscribe, Get Started, Contact Sales"
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.buttonAction === "REDIRECT"
                        ? "Left blank, the card shows &quot;Learn More&quot;."
                        : "Left blank, the card shows the default buy text."}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label>
                      {form.buttonAction === "REDIRECT" ? "Destination URL" : "CTA Link"}
                    </Label>
                    <Input
                      value={form.ctaHref}
                      onChange={(e) => updateForm({ ctaHref: e.target.value })}
                      placeholder="e.g. /pricing, /help, https://example.com"
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.buttonAction === "REDIRECT"
                        ? "Where the button navigates ,  internal route or full link."
                        : "Fallback for public pages where Razorpay isn't available."}
                    </p>
                  </div>
                </div>
                {form.buttonAction === "REDIRECT" && !form.ctaHref.trim() && (
                  <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-500/10 rounded-lg px-3 py-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    Add a destination URL ,  without it the button falls back to /pricing.
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Gradient From</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={form.gradientFrom}
                    onChange={(e) => updateForm({ gradientFrom: e.target.value })}
                    placeholder="#0ea5e9"
                  />
                  <input
                    type="color"
                    className="h-10 w-10 rounded-md border border-input bg-transparent cursor-pointer shrink-0"
                    value={HEX_RE.test(form.gradientFrom) ? form.gradientFrom : "#000000"}
                    onChange={(e) => updateForm({ gradientFrom: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Gradient To</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={form.gradientTo}
                    onChange={(e) => updateForm({ gradientTo: e.target.value })}
                    placeholder="#7c3aed"
                  />
                  <input
                    type="color"
                    className="h-10 w-10 rounded-md border border-input bg-transparent cursor-pointer shrink-0"
                    value={HEX_RE.test(form.gradientTo) ? form.gradientTo : "#000000"}
                    onChange={(e) => updateForm({ gradientTo: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {form.gradientFrom && form.gradientTo && (
              <div className="rounded-xl border border-border p-4">
                <Label className="mb-2 block text-xs text-muted-foreground">
                  Gradient Preview
                </Label>
                <div
                  className="h-16 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${form.gradientFrom}, ${form.gradientTo})`,
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Switch
                  id="isPopular"
                  checked={form.isPopular}
                  onCheckedChange={(checked) => updateForm({ isPopular: checked })}
                />
                <Label htmlFor="isPopular">Show &quot;Recommended&quot; badge</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="isActive"
                  checked={form.isActive}
                  onCheckedChange={(checked) => updateForm({ isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setEditorOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={saveEditor}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={(open) => { if (!open) setDeleteConfirmOpen(false); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Delete Plan</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => performDelete(false)}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel-subscribers Confirm Dialog */}
      <Dialog open={cancelConfirmOpen} onOpenChange={(open) => { if (!open) setCancelConfirmOpen(false); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Cancel {deleteWarning?.subscriberCount ?? 0} active subscription(s)?
            </DialogTitle>
            <DialogDescription className="pt-2 space-y-3">
              <p>
                This plan still has{" "}
                <span className="font-semibold text-foreground">
                  {deleteWarning?.subscriberCount ?? 0} active Razorpay subscriber(s)
                </span>
                . Deleting it will <strong>immediately cancel</strong> all of their
                Handshake subscriptions (revoking access and ending any future
                billing).
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-400 mb-1">
                  Important
                </p>
                <ul className="space-y-1 text-muted-foreground list-disc list-inside">
                  <li>Subscribers will lose access right away</li>
                  <li>Razorpay will stop charging them</li>
                  <li>This action cannot be undone</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setCancelConfirmOpen(false)}>
              Keep Plan
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => performDelete(true)}
            >
              {deleteMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Cancel All &amp; Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {feedback && (
        <FeedbackModal
          open={feedback.open}
          onOpenChange={() => setFeedback(null)}
          status={feedback.status}
          title={feedback.title}
          description={feedback.description}
        />
      )}
    </div>
  );
}
