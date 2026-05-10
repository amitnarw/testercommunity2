"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { createSupportTicket } from "@/lib/apiCalls";
import { toast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import { cn } from "@/lib/utils";

export default function NewTicketPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "GENERAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const ticket = await createSupportTicket(formData);
      setIsSuccess(true);
      toast({
        title: "Ticket Created",
        description: `Your ticket #${ticket.id} has been submitted.`,
      });
      setTimeout(() => {
        router.push("/support/tickets");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="text-center space-y-8 max-w-md"
        >
          <div className="relative mx-auto w-24 h-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="h-24 w-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center text-emerald-500 border border-emerald-500/20"
            >
              <CheckCircle2 className="h-12 w-12" />
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-emerald-500/20 rounded-[40px]"
            />
          </div>
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tight">Ticket Submitted!</h2>
            <p className="text-muted-foreground text-lg">
              We've received your request. Our support team will review it and get back to you within 24 hours.
            </p>
          </div>
          <Button
            onClick={() => router.push("/support/tickets")}
            className="rounded-2xl h-14 px-8 font-bold text-base shadow-xl shadow-primary/10"
          >
            Go to My Tickets
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container max-w-5xl py-12 px-4 mx-auto">
        <div className="sticky top-0 z-[50] pt-2 sm:pt-3 pb-10 w-1/2">
          <BackButton href="/support/tickets" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side: Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">Submit a <span className="text-primary italic">Ticket</span></h1>
              <p className="text-muted-foreground text-lg max-w-md">
                Please provide as much detail as possible so our technical team can assist you faster.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 sm:p-8 rounded-3xl border-none shadow-2xl shadow-primary/5 bg-card">
                <div className="space-y-8">
                  {/* Category Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      Issue Category
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) => setFormData({ ...formData, category: val })}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-muted/30 border-none text-base focus:ring-primary/20">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl p-2">
                        <SelectItem value="GENERAL" className="rounded-xl py-3 font-medium">General Inquiry</SelectItem>
                        <SelectItem value="TECHNICAL" className="rounded-xl py-3 font-medium">Technical Issue</SelectItem>
                        <SelectItem value="BILLING" className="rounded-xl py-3 font-medium">Billing & Payments</SelectItem>
                        <SelectItem value="BUG_REPORT" className="rounded-xl py-3 font-medium">Bug Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      Subject
                    </label>
                    <Input
                      required
                      placeholder="e.g., Cannot access my testing dashboard"
                      className="h-14 rounded-2xl bg-muted/30 border-none text-base focus:ring-primary/20"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      Detailed Description
                    </label>
                    <Textarea
                      required
                      placeholder="Please describe your issue in detail..."
                      className="min-h-[200px] rounded-[24px] bg-muted/30 border-none text-base focus:ring-primary/20 p-6 leading-relaxed"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-16 rounded-[24px] text-lg font-bold shadow-xl shadow-primary/20 transition-all duration-300 active:scale-95"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Send className="h-6 w-6" />
                        Submit Request
                      </div>
                    )}
                  </Button>
                </div>
              </Card>
            </form>
          </div>

          {/* Right Side: Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 rounded-[32px] bg-primary text-primary-foreground border-none shadow-2xl shadow-primary/20 relative overflow-hidden group">
              <ShieldCheck className="absolute -right-8 -bottom-8 h-48 w-48 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 space-y-4">
                <h3 className="text-2xl font-black tracking-tight">Priority Support</h3>
                <p className="text-primary-foreground/80 leading-relaxed font-medium">
                  Formal tickets are prioritized by our senior technical staff. We guarantee a response within 24 hours.
                </p>
              </div>
            </Card>

            <Card className="p-8 rounded-[32px] bg-card border-none shadow-xl space-y-6">
              <h3 className="text-xl font-black tracking-tight uppercase">Quick Tips</h3>
              <div className="space-y-4">
                {[
                  "Include app ID if reporting a bug",
                  "Attach screenshots via external links if needed",
                  "Be clear about the steps to reproduce issues",
                  "Check the Help Center before submitting"
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-black shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
