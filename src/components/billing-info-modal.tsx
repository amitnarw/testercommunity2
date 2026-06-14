"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  User,
  Mail,
  MapPin,
  Globe,
  Building2,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Info,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBillingInfo, useBillingInfoSave } from "@/hooks/useBilling";
import { toast } from "@/hooks/use-toast";

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
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    gstin: "",
  });

  useEffect(() => {
    if (billingInfo) {
      setFormData({
        name: billingInfo.name || "",
        email: billingInfo.email || "",
        address: billingInfo.address || "",
        city: billingInfo.city || "",
        state: billingInfo.state || "",
        zipCode: billingInfo.zipCode || "",
        country: billingInfo.country || "India",
        gstin: billingInfo.gstin || "",
      });
    }
  }, [billingInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address || !formData.country) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields to proceed.",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveMutation.mutateAsync(formData);
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
        <div className="relative w-full h-full overflow-y-auto max-h-[90vh] scrollbar-modal rounded-[1.5rem] sm:rounded-[2.5rem]">
          {/* Animated Background Gradient */}
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col">
            {/* Header */}
            <div className="p-6 sm:p-8 !pb-0">
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
                <DialogClose className="absolute right-5 top-5 rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                </DialogClose>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 pt-2 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="pl-11 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Billing Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-11 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Street Address</Label>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">City</Label>
                  <Input
                    id="city"
                    placeholder="New Delhi"
                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    {formData.country === "India" ? "State" : "State / Province"}
                  </Label>
                  {formData.country === "India" ? (
                    <Select
                      value={formData.state}
                      onValueChange={(val) => setFormData({ ...formData, state: val })}
                    >
                      <SelectTrigger id="state" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 max-h-[200px]">
                        <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                        <SelectItem value="Assam">Assam</SelectItem>
                        <SelectItem value="Bihar">Bihar</SelectItem>
                        <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Goa">Goa</SelectItem>
                        <SelectItem value="Gujarat">Gujarat</SelectItem>
                        <SelectItem value="Haryana">Haryana</SelectItem>
                        <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                        <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="Jammu and Kashmir">Jammu and Kashmir</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Kerala">Kerala</SelectItem>
                        <SelectItem value="Ladakh">Ladakh</SelectItem>
                        <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Manipur">Manipur</SelectItem>
                        <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="Mizoram">Mizoram</SelectItem>
                        <SelectItem value="Nagaland">Nagaland</SelectItem>
                        <SelectItem value="Odisha">Odisha</SelectItem>
                        <SelectItem value="Punjab">Punjab</SelectItem>
                        <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="Sikkim">Sikkim</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="Telangana">Telangana</SelectItem>
                        <SelectItem value="Tripura">Tripura</SelectItem>
                        <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="West Bengal">West Bengal</SelectItem>
                        <SelectItem value="Chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="Puducherry">Puducherry</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="state"
                      placeholder="State / Province"
                      className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">
                    {formData.country === "India" ? "PIN Code" : "ZIP Code"}
                  </Label>
                  <Input
                    id="zipCode"
                    placeholder={formData.country === "India" ? "110058" : "ZIP Code"}
                    className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-zinc-400 ml-1">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(val) => setFormData({ ...formData, country: val })}
                  >
                    <SelectTrigger id="country" className="h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <SelectValue placeholder="Select" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-zinc-200 dark:border-zinc-800 max-h-[200px]">
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="USA">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Australia">Australia</SelectItem>
                      <SelectItem value="Afghanistan">Afghanistan</SelectItem>
                      <SelectItem value="Algeria">Algeria</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Austria">Austria</SelectItem>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="Belgium">Belgium</SelectItem>
                      <SelectItem value="Brazil">Brazil</SelectItem>
                      <SelectItem value="Cambodia">Cambodia</SelectItem>
                      <SelectItem value="Chile">Chile</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Colombia">Colombia</SelectItem>
                      <SelectItem value="Czech Republic">Czech Republic</SelectItem>
                      <SelectItem value="Denmark">Denmark</SelectItem>
                      <SelectItem value="Egypt">Egypt</SelectItem>
                      <SelectItem value="Ethiopia">Ethiopia</SelectItem>
                      <SelectItem value="Finland">Finland</SelectItem>
                      <SelectItem value="France">France</SelectItem>
                      <SelectItem value="Germany">Germany</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Greece">Greece</SelectItem>
                      <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                      <SelectItem value="Hungary">Hungary</SelectItem>
                      <SelectItem value="Indonesia">Indonesia</SelectItem>
                      <SelectItem value="Iran">Iran</SelectItem>
                      <SelectItem value="Iraq">Iraq</SelectItem>
                      <SelectItem value="Ireland">Ireland</SelectItem>
                      <SelectItem value="Israel">Israel</SelectItem>
                      <SelectItem value="Italy">Italy</SelectItem>
                      <SelectItem value="Japan">Japan</SelectItem>
                      <SelectItem value="Jordan">Jordan</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="Kuwait">Kuwait</SelectItem>
                      <SelectItem value="Lebanon">Lebanon</SelectItem>
                      <SelectItem value="Malaysia">Malaysia</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                      <SelectItem value="Morocco">Morocco</SelectItem>
                      <SelectItem value="Myanmar">Myanmar</SelectItem>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="Netherlands">Netherlands</SelectItem>
                      <SelectItem value="New Zealand">New Zealand</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Norway">Norway</SelectItem>
                      <SelectItem value="Oman">Oman</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="Peru">Peru</SelectItem>
                      <SelectItem value="Philippines">Philippines</SelectItem>
                      <SelectItem value="Poland">Poland</SelectItem>
                      <SelectItem value="Portugal">Portugal</SelectItem>
                      <SelectItem value="Qatar">Qatar</SelectItem>
                      <SelectItem value="Romania">Romania</SelectItem>
                      <SelectItem value="Russia">Russia</SelectItem>
                      <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
                      <SelectItem value="Singapore">Singapore</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="South Korea">South Korea</SelectItem>
                      <SelectItem value="Spain">Spain</SelectItem>
                      <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                      <SelectItem value="Sweden">Sweden</SelectItem>
                      <SelectItem value="Switzerland">Switzerland</SelectItem>
                      <SelectItem value="Taiwan">Taiwan</SelectItem>
                      <SelectItem value="Thailand">Thailand</SelectItem>
                      <SelectItem value="Turkey">Turkey</SelectItem>
                      <SelectItem value="UAE">UAE</SelectItem>
                      <SelectItem value="Uganda">Uganda</SelectItem>
                      <SelectItem value="Ukraine">Ukraine</SelectItem>
                      <SelectItem value="Uruguay">Uruguay</SelectItem>
                      <SelectItem value="Venezuela">Venezuela</SelectItem>
                      <SelectItem value="Vietnam">Vietnam</SelectItem>
                      <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                    </SelectContent>
                  </Select>
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
                      className="pl-11 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 focus:ring-primary/20 transition-all"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
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
