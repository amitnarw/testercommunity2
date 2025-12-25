
'use client';

import { Button } from "@/components/ui/button";
import { Check, IndianRupee, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { professionalPathFeatures, pointsPackages } from "@/lib/data";
import { BackButton } from "@/components/back-button";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDashboardData } from "@/hooks/useUser";

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

export default function BillingPage() {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const {
        data: dashboardData,
    } = useDashboardData();

    return (
        <div className="bg-background text-foreground min-h-screen">
            <div className="container mx-auto px-4 md:px-6 py-12">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={containerVariants} 
                    className="space-y-16"
                >
                    <motion.div variants={itemVariants}>
                        <BackButton href="/dashboard" />
                        <div className="text-center max-w-3xl mx-auto mt-8">
                            <h1 className="text-4xl md:text-5xl font-bold">Purchase Professional Packages</h1>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Add test packages to your account for our managed, professional testing path. Your current balance is <span className="font-bold text-primary">{Number(dashboardData?.wallet) || 0} packages</span>.
                            </p>
                        </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants} className="max-w-6xl mx-auto">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm text-center">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-4 py-6 font-bold text-left text-base min-w-[200px]">Features</th>
                                        {pointsPackages.map((plan) => (
                                            <th key={plan.name} className="p-4 py-6 min-w-[200px] relative">
                                                {plan.name === 'Accelerator' && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>}
                                                <p className="text-lg font-bold">{plan.name}</p>
                                                <p className="text-xs text-muted-foreground">{plan.description}</p>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-4 text-left font-semibold">Packages Included</td>
                                        {pointsPackages.map((plan) => (
                                            <td key={plan.name} className="p-4 font-bold text-2xl text-primary">{plan.points}</td>
                                        ))}
                                    </tr>
                                    <tr className="border-b bg-secondary/30">
                                        <td className="p-4 text-left font-semibold">Total Price</td>
                                        {pointsPackages.map((plan) => (
                                            <td key={plan.name} className="p-4">
                                                <div className="text-3xl font-bold flex items-center justify-center">
                                                    <IndianRupee className="w-6 h-6 mr-1" />
                                                    {plan.price.toLocaleString('en-IN')}
                                                </div>
                                                <div className="text-xs text-muted-foreground">one-time payment</div>
                                            </td>
                                        ))}
                                    </tr>
                                     <tr className="border-b">
                                        <td className="p-4 text-left font-semibold">Price per Package</td>
                                        {pointsPackages.map((plan) => (
                                            <td key={plan.name} className="p-4">
                                                <div className="text-lg font-semibold flex items-center justify-center">
                                                    <IndianRupee className="w-4 h-4 mr-1 text-muted-foreground" />
                                                     {(plan.price / plan.points).toFixed(0)}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                    {professionalPathFeatures.map((feature, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-4 text-left">{feature}</td>
                                            {pointsPackages.map((plan) => (
                                                <td key={plan.name} className="p-4">
                                                    <Check className="mx-auto w-5 h-5 text-green-500" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        {pointsPackages.map((plan) => (
                                            <td key={plan.name} className="p-6">
                                                <Button asChild size="lg" className={cn(plan.name !== 'Accelerator' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80')}>
                                                    <Link href="#">Purchase</Link>
                                                </Button>
                                            </td>
                                        ))}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

