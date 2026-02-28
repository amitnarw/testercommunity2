"use client";

import { useState, Suspense } from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useAllPromoCodes,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
} from "@/hooks/useAdmin";
import { PromoCodesTable } from "@/components/admin/promo-codes-table";
import { useToast } from "@/hooks/use-toast";

const promoSchema = z.z.object({
  id: z.number().optional(),
  code: z.string().min(1, "Code is required").max(50),
  fixedPoints: z.coerce.number().min(0),
  isActive: z.boolean().default(true),
  maxUses: z.coerce.number().nullable().optional(),
  maxPerUser: z.coerce.number().nullable().optional(),
});

type PromoFormValues = z.infer<typeof promoSchema>;

function AdminPromoCodesContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoFormValues | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: promoCodes = [], isLoading, refetch } = useAllPromoCodes();
  const createMutation = useCreatePromoCode({
    onSuccess: () => {
      toast({ title: "Success", description: "Promo code created" });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to create",
        variant: "destructive",
      }),
  });

  const updateMutation = useUpdatePromoCode({
    onSuccess: () => {
      toast({ title: "Success", description: "Promo code updated" });
      refetch();
      setIsDialogOpen(false);
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to update",
        variant: "destructive",
      }),
  });

  const deleteMutation = useDeletePromoCode({
    onSuccess: () => {
      toast({ title: "Success", description: "Promo code deleted" });
      refetch();
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message || "Failed to delete",
        variant: "destructive",
      }),
  });

  const form = useForm<PromoFormValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: "",
      fixedPoints: 200,
      isActive: true,
      maxUses: null,
      maxPerUser: 1,
    },
  });

  const onOpenCreate = () => {
    setEditingPromo(null);
    form.reset({
      code: "",
      fixedPoints: 200,
      isActive: true,
      maxUses: null,
      maxPerUser: 1,
    });
    setIsDialogOpen(true);
  };

  const onEdit = (promo: any) => {
    setEditingPromo(promo);
    form.reset({
      id: promo.id,
      code: promo.code,
      fixedPoints: promo.fixedPoints,
      isActive: promo.isActive,
      maxUses: promo.maxUses,
      maxPerUser: promo.maxPerUser,
    });
    setIsDialogOpen(true);
  };

  const onDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (values: PromoFormValues) => {
    if (editingPromo) {
      updateMutation.mutate({ ...values, id: editingPromo.id! });
    } else {
      createMutation.mutate(values);
    }
  };

  const filteredPromoCodes = promoCodes.filter((p: any) =>
    p.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-6 container mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-b from-primary to-primary/40 bg-clip-text text-transparent leading-[unset]">
            Promo Codes
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage discount codes and user usage limits for the Community Hub.
          </p>
        </div>
        <Button onClick={onOpenCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Create Promo Code
        </Button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500">
            How Promo Codes Work
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Promo codes (like{" "}
            <span className="font-mono font-bold text-foreground">
              WELCOME200
            </span>
            ) allow users to submit apps in the{" "}
            <span className="font-bold text-foreground underline decoration-primary/30">
              Community Hub
            </span>{" "}
            for a fixed point cost, regardless of the actual configuration
            price.
            <br />
            <span className="font-semibold text-amber-600 dark:text-amber-500 mt-1 block italic text-[11px]">
              ⚠️ Note: These codes apply ONLY to the Community Hub (Free)
              section and are not valid for Developer Dashboard (Paid)
              submissions.
            </span>
          </p>
        </div>
      </div>

      <div className="relative w-full md:w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search codes..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <PromoCodesTable
        promoCodes={filteredPromoCodes}
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {editingPromo ? "Edit Promo Code" : "Create Promo Code"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="WELCOME200"
                        {...field}
                        className="uppercase"
                      />
                    </FormControl>
                    <FormDescription>
                      The code users enter during Community Hub submission.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fixedPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fixed Price (Points)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                      The total cost for the user when this code is applied
                      (e.g., 200), overriding the original configuration price.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxUses"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Uses (Total)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxPerUser"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Per User</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Unlimited"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this code.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPromo ? "Update Code" : "Create Code"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminPromoCodesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AdminPromoCodesContent />
    </Suspense>
  );
}
