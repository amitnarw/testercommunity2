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
import type { PricingResponse } from "@/lib/types";
import {
  Accordion,
} from "@/components/ui/accordion";
import FaqItem from "@/components/faq-item";
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

const PricingCard = ({
  plan,
  isPopular,
  onSubscribe,
  isProcessing,
}: {
  plan: PricingResponse;
  isPopular: boolean;
  onSubscribe: (planId: string) => void;
  isProcessing: boolean;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: isPopular ? 1.05 : 1.02 }}
      className={cn(
        "relative flex flex-col p-6 sm:p-8 rounded-3xl h-full transition-all duration-300",
        isPopular
          ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
          : "bg-card text-card-foreground hover:shadow-xl"
      )}
    >
      {isPopular && (
        <>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-6 right-6 opacity-20 rotate-12">
            <Star className="w-24 h-24 fill-current text-white" />
          </div>
          <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
            <Badge className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/60 px-4 py-1.5 text-xs font-bold uppercase tracking-widest shadow-lg border-0">
              Most Popular
            </Badge>
          </div>
        </>
      )}

      <div className="mb-8 relative z-10">
        <h3
          className={cn(
            "text-xl font-medium",
            isPopular ? "text-white" : "text-foreground"
          )}
        >
          {plan.name}
        </h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-bold tracking-tight">
            ₹{plan.price.toLocaleString("en-IN")}
          </span>
          <span
            className={cn(
              "ml-2 text-sm font-medium",
              isPopular ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            / one-time
          </span>
        </div>
        <p
          className={cn(
            "mt-4 text-sm leading-relaxed",
            isPopular ? "text-primary-foreground/90" : "text-muted-foreground"
          )}
        >
          Get {plan.package} full testing{" "}
          {plan.package > 1 ? "cycles" : "cycle"} for your applications.
        </p>
      </div>

      <div className="flex-1 space-y-4 mb-8 relative z-10">
        {plan.features?.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <div
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                isPopular ? "bg-white/20" : "bg-primary/10"
              )}
            >
              <Check
                className={cn(
                  "w-3 h-3",
                  isPopular ? "text-white" : "text-primary"
                )}
              />
            </div>
            <span
              className={cn(
                "text-sm",
                isPopular
                  ? "text-primary-foreground/90"
                  : "text-muted-foreground"
              )}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto relative z-10">
        {isPopular ? (
          <div className="flex justify-center w-full">
            <HoverBorderGradient
              containerClassName="w-full"
              className="bg-white text-primary flex items-center justify-center space-x-2 w-full py-4 font-bold cursor-pointer"
              onClick={() => onSubscribe(plan.id)}
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
          </div>
        ) : (
          <Button
            onClick={() => onSubscribe(plan.id)}
            disabled={isProcessing}
            className="w-full py-6 rounded-full font-semibold text-base transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
            variant="outline"
          >
            {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isProcessing ? "Processing..." : "Choose Plan"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

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
        {/* <Button variant="outline" size="sm" className="hidden sm:flex">
          Download All
        </Button> */}
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
                i !== transactions.length - 1 && "mb-1"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t.plan}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(t.date), "MMM dd, yyyy")} • {t.razorpayOrderId}
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
                      : "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
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

const CustomPlanCard = () => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8364E8] to-[#D397FA] text-white p-8 md:p-12 flex flex-col items-center text-center gap-8 shadow-2xl group"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-900/20 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: 10, scale: 1.1 }}
        className="relative z-10 bg-white/20 p-5 rounded-3xl backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-white/40"
      >
        <ShieldCheck className="w-10 h-10 text-white" />
      </motion.div>

      {/* Text */}
      <div className="relative z-10 space-y-4 max-w-md">
        <h3 className="text-3xl font-bold tracking-tight">
          Need a Custom Plan?
        </h3>
        <p className="text-purple-50 text-lg leading-relaxed font-medium">
          Volume discounts, dedicated support, and custom integrations for
          high-growth teams.
        </p>
      </div>

      {/* Feature Pills */}
      <div className="relative z-10 flex flex-wrap justify-center gap-3">
        {["Enterprise SLA", "Dedicated Manager", "Custom Integrations"].map(
          (feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm px-4 py-1.5"
            >
              {feature}
            </Badge>
          )
        )}
      </div>

      {/* Button */}
      <Button
        size="lg"
        className="relative z-10 rounded-full bg-white text-purple-700 hover:bg-white/90 font-bold px-10 h-14 text-lg shadow-xl hover:shadow-2xl transition-all"
      >
        Contact Sales
      </Button>
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
  const { data: walletData, isPending: walletIsPending, refetch: refetchWallet } = useGetUserWallet();
  const { refetch: refetchHistory } = useBillingHistory();
  const { data: paymentConfig } = usePaymentConfig();

  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();
  const { toast } = useToast();

  const handleSubscribe = async (planId: string) => {
    if (!paymentConfig?.isConfigured) {
      toast({
        title: "Payment Service Unavailable",
        description: "Payment system is currently not configured. Please contact support.",
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
              description: "Payment was successful but verification failed. Please contact support.",
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
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);

      razorpayInstance.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description || "Something went wrong with the payment.",
          variant: "destructive",
        });
      });

      razorpayInstance.open();

    } catch (error) {
      console.error("Payment initiation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isProcessing = createOrderMutation.isPending || verifyPaymentMutation.isPending;

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <div
        data-loc="BillingPage"
        className="min-h-screen w-full relative text-foreground transition-colors duration-300 max-w-7xl mx-auto"
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
                  Simple, Transparent Pricing
                </h2>
                <p className="text-lg text-muted-foreground">
                  Choose the package that suits your testing needs. No hidden
                  fees, just pure quality assurance.
                </p>
              </div>

              {pricingIsPending ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-[500px] w-full rounded-3xl bg-muted"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                  {pricingData?.map((plan) => (
                    <PricingCard
                      key={plan.name}
                      plan={plan}
                      isPopular={plan.name === "Accelerator"}
                      onSubscribe={handleSubscribe}
                      isProcessing={isProcessing}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Section 3: History & Support */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto w-full">
              <TransactionHistory />

              <CustomPlanCard />
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
