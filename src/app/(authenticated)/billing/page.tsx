"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/routes";
import {
  Check,
  Zap,
  FileText,
  Box,
  ShieldCheck,
  Star,
  FileClock,
} from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Skeleton } from "@/components/ui/skeleton";
import { FeedbackModal } from "@/components/feedback-modal";
import { BillingInfoModal } from "@/components/billing-info-modal";
import { ComplianceModal } from "@/components/compliance-modal";

import {
  useBillingHistory,
  useCreateOrder,
  usePaymentConfig,
} from "@/hooks/useBilling";
import { useGetUserWallet, usePricingData, useUserData, useRegionalPricing } from "@/hooks/useUser";
import { Accordion } from "@/components/ui/accordion";
import FaqItem from "@/components/faq-item";
import { getPublicFaqs } from "@/lib/apiCalls";
import type { Faq } from "@/lib/types";
import {
  ProfessionalPlanCard,
  EnterprisePlanCard,
} from "@/components/pricing-cards";
import Script from "next/script";
import { Loader2 } from "lucide-react";

type FeedbackModalState = {
  open: boolean;
  status: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

// --- Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const TransactionHistory = () => {
  const { data: transactions, isPending } = useBillingHistory();

  return (
    <motion.div
      id="billing-history"
      variants={itemVariants}
      className="rounded-3xl bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Billing History</h3>
            <p className="text-sm text-muted-foreground">
              View your past invoices
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-2 max-h-[400px] overflow-y-auto">
        {isPending ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : transactions && transactions.length > 0 ? (
          transactions.map((t, i) => (
            <div
              key={t.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 group cursor-pointer",
                i !== transactions.length - 1 && "mb-1",
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.plan}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(t.date), "MMM dd, yyyy")} •{" "}
                    {t.razorpayOrderId}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <p className="font-bold text-foreground">
                  {t.currency === "INR" ? "₹" : t.currency}
                  {t.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "border-0",
                    t.status === "Paid" || t.status === "PAID"
                      ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                      : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
                  )}
                >
                  {t.status}
                </Badge>
                {t.invoiceId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                    asChild
                  >
                    <Link href={`/invoice/${t.invoiceId}`}>
                      View Invoice
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
            <FileClock className="w-8 h-8 mb-2 opacity-50" />
            <p>No transaction history found</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FAQSection = ({ faqs }: { faqs: Faq[] }) => {
  return (
    <motion.div variants={itemVariants} className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground text-lg">
          Everything you need to know about our billing and packages.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {faqs.map((faq, i) => (
          <FaqItem key={faq.id} index={i} question={faq.title} answer={faq.description} />
        ))}
      </Accordion>
    </motion.div>
  );
};

// --- Main Page ---

export default function BillingPage() {
  const { data: pricingData, isPending: pricingIsPending } = usePricingData();
  const { data: regionalPricing } = useRegionalPricing();
  const {
    data: walletData,
    isPending: walletIsPending,
    refetch: refetchWallet,
  } = useGetUserWallet();
  const { refetch: refetchHistory } = useBillingHistory();
  const { data: paymentConfig } = usePaymentConfig();
  const { data: userData } = useUserData();

  const createOrderMutation = useCreateOrder();

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    open: false,
    status: "info",
    title: "",
  });

  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingFaqs, setBillingFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    getPublicFaqs("billing").then(setBillingFaqs).catch(() => setBillingFaqs([]));
  }, []);

  const handleSubscribe = async (planId: string) => {
    if (!paymentConfig?.isConfigured) {
      setFeedbackModal({
        open: true,
        status: "warning",
        title: "Payment Service Unavailable",
        description:
          "Payment system is currently not configured. Please contact support.",
        primaryAction: {
          label: "Close",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        },
      });
      return;
    }

    try {
      // 1. Create Order
      const order = await createOrderMutation.mutateAsync({ planId });

      // 2. Initialize Razorpay
      if (!window.Razorpay) {
        setFeedbackModal({
          open: true,
          status: "error",
          title: "System Error",
          description: "Payment SDK failed to load. Please refresh the page.",
          primaryAction: {
            label: "Refresh Page",
            onClick: () => window.location.reload(),
          },
        });
        return;
      }

      const logoUrl = paymentConfig?.image ? (paymentConfig.image.startsWith('http') ? paymentConfig.image : `${window.location.origin}${paymentConfig.image}`) : undefined;

      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: paymentConfig?.name || "inTesters",
        description: `Purchase ${order.planName}`,
        image: logoUrl,
        order_id: order.razorpayOrderId,
        handler: function (response: any) {
          window.location.href = `/billing/processing?orderId=${response.razorpay_order_id}`;
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: {
          color: paymentConfig.theme?.color || "#7c3aed",
        },
        modal: {
          ondismiss: function () {
            // Handle dismissal if needed
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on("payment.failed", function (response: any) {
        setFeedbackModal({
          open: true,
          status: "error",
          title: "Payment Failed",
          description:
            response.error.description ||
            "Something went wrong with the payment.",
          primaryAction: {
            label: "Try Again",
            onClick: () => handleSubscribe(planId),
          },
          secondaryAction: {
            label: "Contact Support",
            onClick: () =>
              window.open(
                "mailto:intesters@nexmail.in?subject=Billing%20Issue%20-%20Payment%20Failed",
                "_blank",
              ),
          },
        });
      });

      razorpayInstance.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      
      if (error.billingInfoMissing) {
        setSelectedPlanId(planId);
        setIsComplianceModalOpen(true);
        return;
      }

      setFeedbackModal({
        open: true,
        status: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment. Please try again.",
        primaryAction: {
          label: "Try Again",
          onClick: () => handleSubscribe(planId),
        },
        secondaryAction: {
          label: "Close",
          onClick: () => setFeedbackModal((prev) => ({ ...prev, open: false })),
        },
      });
    }
  };

  const isProcessing =
    createOrderMutation.isPending;

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div
        data-loc="BillingPage"
        className="min-h-screen w-full relative text-foreground transition-colors duration-300 max-w-5xl mx-auto"
      >
        <PageHeader
          title="Billing"
          backHref={ROUTES.AUTHENTICATED.WALLET}
          className="w-1/2 px-4 md:px-6"
        />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 space-y-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16 lg:space-y-24"
          >

            <section className="relative">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                  Simple, Transparent{" "}
                  <span className="text-primary">Pricing</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the package that suits your testing needs. No hidden
                  fees, just pure quality assurance.
                </p>
              </div>

              {pricingIsPending ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Skeleton className="h-[520px] w-full rounded-3xl bg-muted" />
                  <Skeleton className="h-[520px] w-full rounded-3xl bg-muted" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  {pricingData?.map((plan) => (
                    <ProfessionalPlanCard
                      key={plan.id}
                      plan={plan}
                      regionalPricing={regionalPricing}
                      actionButton={
                        <HoverBorderGradient
                          containerClassName="w-full"
                          className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold cursor-pointer"
                          onClick={() => handleSubscribe(plan.id)}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Zap className="w-4 h-4 mr-2 fill-current" />
                          )}
                          <span className="font-semibold">
                            {isProcessing ? "Processing..." : "Get Started"}
                          </span>
                        </HoverBorderGradient>
                      }
                    />
                  ))}
                  <EnterprisePlanCard
                    actionButton={
                      <Button
                        size="lg"
                        className="w-full relative z-10 rounded-full bg-gradient-to-r from-[#8364E8] to-[#D397FA] text-white hover:opacity-90 font-bold px-10 h-14 text-lg shadow-xl border-0"
                      >
                        Contact Sales
                      </Button>
                    }
                  />
                </div>
              )}
            </section>

            {/* Section 3: History */}
            <section className="mx-auto w-full">
              <TransactionHistory />
            </section>

            {/* Section 3.5: Support */}
            <section className="mx-auto w-full">
              <motion.div
                variants={itemVariants}
                className="rounded-2xl bg-gradient-to-br from-card to-primary/5 border border-border p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Need help with billing?</h3>
                      <p className="text-sm text-muted-foreground">
                        Our support team is here to assist you with any issues.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      window.open(
                        "mailto:intesters@nexmail.in?subject=Billing%20Support%20Request",
                        "_blank",
                      )
                    }
                    className="rounded-full"
                  >
                    Contact Support
                  </Button>
                </div>
              </motion.div>
            </section>

            {/* Section 4: FAQ */}
            <section className="pb-16 pt-8 border-t border-border">
              <FAQSection faqs={billingFaqs} />
            </section>
          </motion.div>
        </div>
      </div>

      <ComplianceModal
        open={isComplianceModalOpen}
        onOpenChange={setIsComplianceModalOpen}
        onContinue={() => {
          setIsComplianceModalOpen(false);
          setIsBillingModalOpen(true);
        }}
      />

      <BillingInfoModal
        open={isBillingModalOpen}
        onOpenChange={setIsBillingModalOpen}
        onSuccess={() => {
          if (selectedPlanId) {
            handleSubscribe(selectedPlanId);
            setSelectedPlanId(null);
          }
        }}
      />

      <FeedbackModal
        open={feedbackModal.open}
        onOpenChange={(open) => setFeedbackModal((prev) => ({ ...prev, open }))}
        status={feedbackModal.status}
        title={feedbackModal.title}
        description={feedbackModal.description}
        primaryAction={feedbackModal.primaryAction}
        secondaryAction={feedbackModal.secondaryAction}
      />
    </>
  );
}
