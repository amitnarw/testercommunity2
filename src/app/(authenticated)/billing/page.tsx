"use client";

import React from "react";
import { motion } from "framer-motion";
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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useBillingHistory,
  useCreateOrder,
  usePaymentConfig,
  useVerifyPayment,
} from "@/hooks/useBilling";
import { useGetUserWallet, usePricingData } from "@/hooks/useUser";
import { Accordion } from "@/components/ui/accordion";
import FaqItem from "@/components/faq-item";
import {
  ProfessionalPlanCard,
  EnterprisePlanCard,
} from "@/components/pricing-cards";
import Script from "next/script";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

// --- Components ---

const CreditBalanceCard = ({
  isLoading,
  credits,
}: {
  isLoading: boolean;
  credits: number;
}) => {
  const scrollToHistory = () => {
    const element = document.getElementById("billing-history");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      className="relative flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 group text-primary-foreground"
    >
      <div className="flex items-center gap-6 relative z-10 rounded-3xl bg-gradient-to-br from-primary to-blue-700 p-3 sm:p-6 w-full sm:w-8/12">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-inner">
          <Box className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-medium text-white/90">
            Available Credits
          </h2>
          <div className="flex items-baseline gap-2">
            {isLoading ? (
              <Skeleton className="h-10 w-24 bg-white/20" />
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-white tracking-tighter">
                {credits}
              </span>
            )}
            <span className="text-white/80 font-medium">Packages</span>
          </div>
        </div>
      </div>

      <Button
        variant="secondary"
        className="hover:opacity-90 rounded-3xl px-6 bg-white text-primary hover:bg-white/90 w-full sm:w-4/12 h-auto sm:h-32 text-sm sm:text-lg shadow-xl"
        onClick={scrollToHistory}
      >
        <span>View Usage History</span>
      </Button>
    </motion.div>
  );
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
              <div className="text-right">
                <p className="font-bold text-foreground">
                  ₹{t.amount.toLocaleString("en-IN")}
                </p>
                <Badge
                  variant="secondary"
                  className={cn(
                    "mt-1 border-0",
                    t.status === "Paid" || t.status === "PAID"
                      ? "bg-green-500/10 text-green-600 hover:bg-green-500/20 dark:text-green-400"
                      : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20",
                  )}
                >
                  {t.status}
                </Badge>
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

const FAQSection = () => {
  const faqs = [
    {
      q: "How do the credits work?",
      a: "Each credit corresponds to one comprehensive testing cycle for your application. One credit is verified against one specific version of your app.",
    },
    {
      q: "Can I upgrade later?",
      a: "Absolutely. You can purchase additional packages at any time. Your credits never expire as long as your account is active.",
    },
    {
      q: "Is there a refund policy?",
      a: "We offer a 100% satisfaction guarantee. If you're not happy with the testing results from your first package, contact our support team within 14 days.",
    },
    {
      q: "Enterprise agreements?",
      a: "Yes! For high-volume needs, we offer custom enterprise plans with volume discounts and dedicated account management. Contact sales for details.",
    },
    {
      q: "Payment methods?",
      a: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and wire transfers for enterprise invoices.",
    },
  ];

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
          <FaqItem key={i} index={i} question={faq.q} answer={faq.a} />
        ))}
      </Accordion>
    </motion.div>
  );
};

// --- Main Page ---

export default function BillingPage() {
  const { data: pricingData, isPending: pricingIsPending } = usePricingData();
  const {
    data: walletData,
    isPending: walletIsPending,
    refetch: refetchWallet,
  } = useGetUserWallet();
  const { refetch: refetchHistory } = useBillingHistory();
  const { data: paymentConfig } = usePaymentConfig();

  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    if (!paymentConfig?.isConfigured) {
      toast({
        title: "Payment Service Unavailable",
        description:
          "Payment system is currently not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Create Order
      const order = await createOrderMutation.mutateAsync(planId);

      // 2. Initialize Razorpay
      if (!window.Razorpay) {
        toast({
          title: "System Error",
          description: "Payment SDK failed to load. Please refresh the page.",
          variant: "destructive",
        });
        return;
      }

      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "Tester Community",
        description: `Purchase ${order.planName}`,
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          // 3. Verify Payment
          try {
            const result = await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (result.success) {
              toast({
                title: "Purchase Successful",
                description: `You have successfully purchased ${result.packagesAwarded} packages!`,
              });
              refetchWallet();
              refetchHistory();
            }
          } catch (err) {
            console.error("Verification error:", err);
            toast({
              title: "Verification Failed",
              description:
                "Payment was successful but verification failed. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          // name: user?.name,
          // email: user?.email,
          // contact: user?.phone
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
        toast({
          title: "Payment Failed",
          description:
            response.error.description ||
            "Something went wrong with the payment.",
          variant: "destructive",
        });
      });

      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isProcessing =
    createOrderMutation.isPending || verifyPaymentMutation.isPending;

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
          backHref="/wallet"
          className="w-1/2 px-4 md:px-6"
        />
        <div className="relative z-10 container mx-auto px-4 md:px-6 py-8 space-y-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-16 lg:space-y-24"
          >
            <section className="mx-auto w-full">
              <CreditBalanceCard
                isLoading={walletIsPending}
                credits={walletData?.totalPackages || 0}
              />
            </section>

            <section className="relative">
              <div className="text-center mb-12 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 mb-4">
                  Simple, Transparent{" "}
                  <span className="text-primary italic">Pricing</span>
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

            {/* Section 4: FAQ */}
            <section className="pb-16 pt-8 border-t border-border">
              <FAQSection />
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
}
