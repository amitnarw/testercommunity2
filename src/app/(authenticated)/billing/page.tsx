
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PointsPackage } from "@/lib/types";
import { pointsPackages, professionalPathFeatures } from "@/lib/data";
import { BackButton } from "@/components/back-button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: "easeOut", duration: 0.5 } },
};

const PointsPackageCard = ({ plan, isPopular }: { plan: PointsPackage, isPopular: boolean }) => {
    return (
        <motion.div variants={itemVariants} className="h-full">
            <Card className={cn(
                "flex flex-col rounded-3xl h-full transition-all duration-300 group relative overflow-hidden",
                isPopular 
                    ? "border-2 border-primary shadow-2xl shadow-primary/20 bg-card" 
                    : "border-border/50 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-card"
            )}>
                 {isPopular && (
                    <Badge variant="default" className="absolute top-4 right-4">Popular</Badge>
                )}
                <CardHeader className="pt-10 text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="pt-1">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center space-y-6">
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">₹{plan.price.toLocaleString('en-IN')}</span>
                        <span className="text-muted-foreground">/ one-time</span>
                    </div>
                    <div className="text-center bg-primary/10 text-primary font-bold py-2 px-4 rounded-full">
                        {plan.points} {plan.points > 1 ? 'Packages' : 'Package'} Included
                    </div>
                </CardContent>
                <CardFooter className="p-6">
                    <Button className="w-full text-lg py-6 font-bold group-hover:bg-primary/90">
                        Purchase Now <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default function BillingPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <motion.div 
                initial="hidden" 
                animate="visible" 
                variants={containerVariants} 
                className="space-y-20"
            >
                <motion.div variants={itemVariants}>
                    <BackButton href="/dashboard" />
                    <div className="text-center max-w-3xl mx-auto mt-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">Purchase Packages</h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Add professional testing packages to your account. Each package allows you to submit one app for a full, managed testing cycle.
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <Card className="p-4 rounded-lg flex items-center justify-center gap-3">
                        <span className="font-semibold text-muted-foreground">Current Balance:</span>
                        <span className="font-bold text-lg text-primary">3 Packages</span>
                    </Card>
                     <Card className="p-4 rounded-lg flex items-center justify-center gap-3">
                        <span className="font-semibold text-muted-foreground">Community Points:</span>
                        <span className="font-bold text-lg text-primary">1,250 Points</span>
                    </Card>
                    <Button variant="outline" className="h-full rounded-lg">
                        View Transaction History
                    </Button>
                </motion.div>

                <motion.section variants={containerVariants} className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                        {pointsPackages.map(plan => (
                            <PointsPackageCard key={plan.name} plan={plan} isPopular={plan.name === 'Accelerator'}/>
                        ))}
                    </div>
                </motion.section>

                <motion.section variants={itemVariants} className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">What's Included in Every Package?</h2>
                        <p className="text-muted-foreground mt-2">Every professional testing package comes with our full suite of features to ensure a successful launch.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {professionalPathFeatures.map((feature, index) => (
                            <motion.div key={index} variants={itemVariants} className="flex items-center gap-3 p-4 rounded-lg bg-card">
                                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
}

