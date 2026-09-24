"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Info,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBillingInfo, useBillingInfoSave } from "@/hooks/useBilling";
import { toast } from "@/hooks/use-toast";
import { INDIAN_STATES, getIndianStateFromGstin, getIndianStateCode } from "@/lib/indian-states";
import { Combobox } from "@/components/ui/combobox";
import {
  countries,
  getCountryByName,
  getStatesOfCountry,
  normalizeCountryName,
  type StateEntry,
} from "@/lib/countries";

interface BillingInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function BillingInfoModal({
  open,
  onOpenChange,
  onSuccess,
}: BillingInfoModalProps) {
  const { data: billingInfo, refetch } = useBillingInfo({ enabled: open });
  const saveMutation = useBillingInfoSave();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    stateCode: "",
    zipCode: "",
    country: "India",
    gstin: "",
  });

  // States/provinces for the selected non-India country (lazy-loaded).
  const [stateOptions, setStateOptions] = useState<StateEntry[]>([]);
  const [statesLoadedFor, setStatesLoadedFor] = useState<string | null>(null);

  const selectedCountryIso = getCountryByName(formData.country)?.code ?? null;

  useEffect(() => {
    if (!selectedCountryIso || formData.country === "India") {
      setStateOptions([]);
      setStatesLoadedFor(null);
      return;
    }
    let cancelled = false;
    setStatesLoadedFor(null);
    getStatesOfCountry(selectedCountryIso).then((opts) => {
      if (cancelled) return;
      setStateOptions(opts);
      setStatesLoadedFor(selectedCountryIso);
    });
    return () => {
      cancelled = true;
    };
  }, [formData.country, selectedCountryIso]);

  useEffect(() => {
    if (billingInfo) {
      const country = normalizeCountryName(billingInfo.country || "India");
      setFormData({
        name: billingInfo.name || "",
        email: billingInfo.email || "",
        phone: billingInfo.phone || "",
        address: billingInfo.address || "",
        city: billingInfo.city || "",
        state: billingInfo.state || "",
        stateCode:
          country === "India"
            ? billingInfo.stateCode || getIndianStateCode(billingInfo.state || "") || ""
            : "",
        zipCode: billingInfo.zipCode || "",
        country,
        gstin: billingInfo.gstin || "",
      });
    }
  }, [billingInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.country) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = { ...formData };
      if (payload.country === "India") {
        payload.stateCode = payload.stateCode || getIndianStateCode(payload.state) || "";
      } else {
        payload.stateCode = "";
      }
      await saveMutation.mutateAsync(payload);
      toast({
        title: "Success!",
        description: "Your billing information has been securely saved.",
      });
      refetch();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to save billing information",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[550px] p-0 overflow-hidden border-none bg-zinc-50 dark:bg-zinc-950 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl">
        <div className="relative w-full h-full overflow-y-auto sm:overflow-visible max-h-[90vh] scrollbar-modal rounded-[1.5rem] sm:rounded-[2.5rem]">
          {/* Animated Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:scale-90 sm:origin-top transition-transform duration-200">
            {/* Header */}
            <div className="p-6 sm:p-6 !pt-4 !pb-0">
              <div className="flex items-start justify-between gap-4 w-full">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Compliance Required
                    </span>
                  </div>
                  <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Billing Details
                  </DialogTitle>
                  <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400 max-w-[340px]">
                    We need your information to generate valid tax invoices for your purchases.
                  </DialogDescription>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-6 pt-2 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name <span className="text-red-500">*</span></Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-11 h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Billing Email <span className="text-red-500">*</span></Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-11 h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Phone Number <span className="text-red-500">*</span></Label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="+91 98765 43210"
                      className="pl-11 h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9+\-\s]/g, "") })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Street Address <span className="text-red-500">*</span></Label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                  <textarea
                    id="address"
                    placeholder="123 Street, Building, Area"
                    className="w-full min-h-[60px] sm:min-h-[70px] pl-11 pr-4 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">City <span className="text-red-500">*</span></Label>
                  <Input
                    id="city"
                    placeholder="New Delhi"
                    className="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    {formData.country === "India" ? "State" : "State / Province"} <span className="text-red-500">*</span>
                  </Label>
                  {formData.country === "India" ? (
                    <Combobox
                      value={formData.state}
                      onValueChange={(val) => {
                        const entry = INDIAN_STATES.find((s) => s.name === val);
                        setFormData({
                          ...formData,
                          state: val,
                          stateCode: entry ? entry.numericCode : "",
                        });
                      }}
                      options={INDIAN_STATES.map((s) => ({
                        value: s.name,
                        label: `${s.name} (${s.alphaCode} / ${s.numericCode})`,
                        keywords: `${s.name} ${s.alphaCode} ${s.numericCode}`,
                      }))}
                      placeholder="Select"
                      searchPlaceholder="Search states..."
                      emptyText="No state found."
                      groupHeading="States"
                      triggerClassName="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                      contentClassName="rounded-xl border-zinc-200 dark:border-zinc-800"
                    />
                  ) : selectedCountryIso &&
                    statesLoadedFor === selectedCountryIso &&
                    stateOptions.length > 0 ? (
                    <Combobox
                      value={formData.state}
                      onValueChange={(val) =>
                        setFormData({ ...formData, state: val, stateCode: "" })
                      }
                      options={stateOptions.map((s) => ({ value: s.name, label: s.name }))}
                      placeholder="Select State / Province"
                      searchPlaceholder="Search states..."
                      emptyText="No state found."
                      groupHeading="States / Provinces"
                      triggerClassName="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                      contentClassName="rounded-xl border-zinc-200 dark:border-zinc-800"
                    />
                  ) : (
                    <Input
                      id="state"
                      placeholder={
                        statesLoadedFor === null && selectedCountryIso
                          ? "Loading states..."
                          : "State / Province"
                      }
                      disabled={statesLoadedFor === null && selectedCountryIso !== null}
                      className="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    {formData.country === "India" ? "PIN Code" : "ZIP Code"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder={formData.country === "India" ? "110058" : "ZIP Code"}
                    className="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Country <span className="text-red-500">*</span></Label>
                  <Combobox
                    value={formData.country}
                    onValueChange={(val) =>
                      setFormData({ ...formData, country: val, state: "", stateCode: "" })
                    }
                    options={countries.map((c) => ({ value: c.name, label: c.name }))}
                    placeholder="Select country"
                    searchPlaceholder="Search countries..."
                    emptyText="No country found."
                    groupHeading="Countries"
                    triggerClassName="h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50"
                    contentClassName="rounded-xl border-zinc-200 dark:border-zinc-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstin" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    {formData.country === "India" ? "GSTIN (Optional)" : "Tax/VAT ID"}
                  </Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="gstin"
                      placeholder={formData.country === "India" ? "22AAAAA0000A1Z5" : "Optional"}
                      className="pl-11 h-12 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.gstin}
                      onChange={(e) => {
                        const val = e.target.value;
                        const updated = { ...formData, gstin: val };
                        if (val.length >= 2 && !updated.state) {
                          const result = getIndianStateFromGstin(val);
                          if (result) {
                            updated.state = result.name;
                            updated.stateCode = result.stateCode;
                          }
                        }
                        setFormData(updated);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] font-medium leading-tight">
                    Information is encrypted and securely stored for compliance.
                  </span>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    disabled={saveMutation.isPending}
                    className="flex-1 sm:flex-none rounded-xl h-11 sm:h-12 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 sm:flex-none group bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-xl px-8 h-11 sm:h-12 font-semibold shadow-lg transition-all"
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Save Details</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
