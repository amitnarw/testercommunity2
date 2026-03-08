"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Star, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PricingResponse } from "@/lib/types";

export const itemVariants = {
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

export const ProfessionalPlanCard = ({
  plan,
  actionButton,
}: {
  plan: PricingResponse;
  actionButton: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative flex flex-col p-8 sm:p-10 rounded-3xl h-full transition-all duration-300 bg-primary text-primary-foreground shadow-2xl shadow-primary/30"
    >
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-6 right-6 opacity-20 rotate-12">
        <Star className="w-24 h-24 fill-current text-white" />
      </div>

      <div className="mb-8 relative z-10 flex-col flex h-full">
        <div>
          <Badge className="bg-white text-primary hover:bg-white/90 border-0 mb-3 px-4 py-1.5 uppercase tracking-widest text-xs font-bold w-fit shadow-md">
            {plan.name}
          </Badge>
          <div className="mt-4 flex items-baseline">
            <span className="text-5xl font-bold tracking-tight">
              ₹{plan.price.toLocaleString("en-IN")}
            </span>
            <span className="ml-2 text-sm font-medium text-primary-foreground/80">
              / one-time
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/90">
            Includes {plan.package} full testing{" "}
            {plan.package > 1 ? "cycles" : "cycle"}
          </p>
        </div>

        <div className="flex-1 space-y-4 my-8 relative z-10">
          {plan.features?.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-white/20">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-primary-foreground/90">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto relative z-10">
          <div className="flex justify-center w-full">{actionButton}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const EnterprisePlanCard = ({
  actionButton,
}: {
  actionButton: React.ReactNode;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative flex flex-col rounded-3xl h-full transition-all duration-300 shadow-xl overflow-hidden p-[2px] bg-gradient-to-br from-[#8364E8] to-[#D397FA] group"
    >
      <div className="flex flex-col h-full bg-card rounded-[22px] p-8 sm:p-10 relative z-10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 bg-[#8364E8]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-56 h-56 bg-[#D397FA]/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />

        <div className="mb-8 relative z-10">
          <Badge className="bg-gradient-to-r from-[#8364E8] to-[#D397FA] text-white hover:opacity-90 border-0 mb-3 px-4 py-1.5 uppercase tracking-widest text-xs font-bold w-fit shadow-md">
            Enterprise
          </Badge>
          <div className="mt-4 flex items-baseline">
            <span className="text-5xl font-bold tracking-tight text-[#8364E8]">
              Custom
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-medium">
            Unlimited Testing Cycles
          </p>
        </div>

        <div className="flex-1 space-y-4 mb-8 relative z-10">
          {[
            "Everything in Professional",
            "Volume Discounts",
            "Dedicated Account Manager",
            "Custom Integrations",
            "Priority Support & SLA",
            "Custom Reporting",
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-muted-foreground"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 bg-[#8364E8]/10">
                <ShieldCheck className="w-4 h-4 text-[#8364E8]" />
              </div>
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto relative z-10">
          <div className="flex justify-center w-full">{actionButton}</div>
        </div>
      </div>
    </motion.div>
  );
};
