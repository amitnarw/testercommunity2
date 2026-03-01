"use client";

import React, { useState } from "react";
import { usePromoCodes } from "@/hooks/useBilling";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Ticket, Copy, Check, Info, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PromoCard = ({
  code,
  points,
  usedCount,
  maxUses,
}: {
  code: string;
  points: number;
  usedCount: number;
  maxUses: number | null;
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: "Promo code copied!",
      description: `${code} has been copied to your clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden group border-primary/20 bg-card/50 backdrop-blur-xl hover:border-primary/50 transition-all duration-300">
        <div className="absolute top-0 right-0 p-3">
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary border-primary/20"
          >
            <Sparkles className="w-3 h-3 mr-1" /> Active
          </Badge>
        </div>

        <CardHeader>
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
            <Ticket className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {code.toUpperCase()}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Get {points} points instantly on your next app submission.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="relative group/copy">
            <div
              onClick={copyToClipboard}
              className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-colors group-hover:border-primary/50"
            >
              <span className="font-mono text-xl font-bold tracking-[0.2em] text-primary">
                {code}
              </span>
              {copied ? (
                <Check className="w-5 h-5 text-green-500 animate-in zoom-in duration-300" />
              ) : (
                <Copy className="w-5 h-5 text-primary group-hover/copy:scale-110 transition-transform" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{usedCount} users already saved</span>
            </div>
            {maxUses && (
              <span className="text-xs">Limited to first {maxUses} uses</span>
            )}
          </div>

          <Button
            variant="outline"
            className="w-full border-primary/20 hover:bg-primary/5"
            onClick={copyToClipboard}
          >
            Copy Code
          </Button>
        </CardContent>

        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
      </Card>
    </motion.div>
  );
};

const PromoCardSkeleton = () => (
  <Card className="overflow-hidden border-border/50 bg-card/50">
    <CardHeader>
      <Skeleton className="w-12 h-12 rounded-2xl mb-4" />
      <Skeleton className="h-8 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="space-y-6">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <Skeleton className="h-10 w-full" />
    </CardContent>
  </Card>
);

export default function OffersPage() {
  const { data: promoCodes, isLoading, isError } = usePromoCodes();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Current <span className="text-primary italic">Offers</span> &
            Rewards
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Unlock special rewards and boost your points balance with our
            premium promo codes. Designed to help you launch your Android app
            faster.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <PromoCardSkeleton />
                </motion.div>
              ))
            ) : isError ? (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                  <Info className="w-8 h-8" />
                </div>
                <p className="text-muted-foreground">
                  Failed to load offers. Please try again later.
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : promoCodes && promoCodes.length > 0 ? (
              promoCodes.map((promo) => (
                <PromoCard
                  key={promo.id}
                  code={promo.code}
                  points={promo.fixedPoints}
                  usedCount={promo.usedCount}
                  maxUses={promo.maxUses}
                />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <Ticket className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xl font-medium">
                  No active offers at the moment.
                </p>
                <p className="text-muted-foreground">
                  Follow us on social media to stay updated on new releases!
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 max-w-3xl mx-auto text-center"
        >
          <div className="p-8 rounded-3xl bg-secondary/30 border border-border/50 backdrop-blur-sm relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-xl font-bold">How to use these codes?</h3>
              <p className="text-muted-foreground">
                Copy your preferred code and enter it in the "Promo Code" field
                during the app submission process. Bonus points will be credited
                to your account instantly upon validation.
              </p>
            </div>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
