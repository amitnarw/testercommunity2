
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Share2, Users, CheckCircle, Clock, IndianRupee, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from 'framer-motion';

const referralData = {
    referralCode: "PRO_DEV_77",
    totalReferrals: 12,
    successfulSignups: 8,
    totalEarnings: 4000,
    pendingRewards: 500,
    referralHistory: [
        { id: 1, user: { name: "Alice Johnson", avatar: "https://i.pravatar.cc/150?u=alice" }, date: "2024-08-15", status: "Completed", reward: "500 Pts" },
        { id: 2, user: { name: "Bob Williams", avatar: "https://i.pravatar.cc/150?u=bob" }, date: "2024-08-12", status: "Pending", reward: "500 Pts" },
        { id: 3, user: { name: "Charlie Brown", avatar: "https://i.pravatar.cc/150?u=charlie" }, date: "2024-08-10", status: "Completed", reward: "500 Pts" },
        { id: 4, user: { name: "Diana Miller", avatar: "https://i.pravatar.cc/150?u=diana" }, date: "2024-08-05", status: "Completed", reward: "500 Pts" },
    ]
};

const referralSteps = [
    {
        icon: Share2,
        title: "1. Share Your Code",
        description: "Grab your unique referral code and share it with friends, colleagues, or anyone in your network who could benefit from inTesters. The more you share, the more you can earn.",
    },
    {
        icon: UserPlus,
        title: "2. Friend Signs Up",
        description: "Your friend uses your referral code when they sign up. This links their account to yours, ensuring you both get credit when the conditions are met.",
    },
    {
        icon: CheckCircle,
        title: "3. Friend Completes Profile",
        description: "To ensure our community is full of active and engaged members, the reward is triggered once your friend completes their initial profile setup survey.",
    },
    {
        icon: Gift,
        title: "4. You Both Get Rewarded",
        description: "Success! Once the profile survey is complete, bonus points are automatically added to both of your accounts. It's a win-win for everyone.",
    },
];

export default function ReferralPage() {
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(referralData.referralCode);
        toast({
            title: "Copied to Clipboard",
            description: `Your referral code "${referralData.referralCode}" has been copied.`,
        });
    };

    return (
        <div className="container mx-auto px-4 md:px-6 pb-12">
            <div className="flex flex-row gap-5 items-center sticky top-0 z-[50] py-2 pb-8 px-2 w-1/2 sm:w-full max-w-5xl sm:mx-auto">
                <BackButton href="/profile" />
                <h1 className="font-semibold tracking-tight text-xl sm:text-2xl bg-gradient-to-b from-primary to-primary/50 bg-clip-text text-transparent leading-0">
                    Referral Dashboard
                </h1>
            </div>
            <div className="max-w-5xl mx-auto space-y-12">

                <section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{referralData.totalReferrals}</div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Successful Signups</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{referralData.successfulSignups}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm rounded-xl border-0 bg-gradient-to-br from-primary to-primary/40 relative overflow-hidden flex flex-row sm:flex-col justify-between sm:justify-center relative">
                            <IndianRupee className="h-4 w-4 text-white/10 sm:text-white/20 absolute right-3 top-4 scale-[3]" />
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-white/80">Total Earnings</CardTitle>

                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">
                                    {referralData.totalEarnings.toLocaleString()} Pts
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{referralData.pendingRewards.toLocaleString()} Pts</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className='flex flex-col gap-2'>
                    <p className="text-sm sm:text-md text-muted-foreground text-center">Share your love for inTesters and get rewarded. For every friend who signs up and completes their profile survey, you'll both earn bonus points.</p>
                    <Card className="shadow-2xl shadow-primary/10 border-dashed border-2">
                        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <h3 className="text-lg font-semibold">Your Unique Referral Code</h3>
                                <p className="text-4xl font-bold tracking-widest text-primary my-2">{referralData.referralCode}</p>
                                <p className="text-xs text-muted-foreground">Share this code with your friends.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button onClick={handleCopy} variant="outline" size="lg">
                                    <Copy className="mr-2 h-4 w-4" /> Copy Code
                                </Button>
                                <Button size="lg">
                                    <Share2 className="mr-2 h-4 w-4" /> Share
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h3 className="text-2xl font-bold mb-6 text-center">Referral History</h3>
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Reward</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {referralData.referralHistory.map(referral => (
                                        <TableRow key={referral.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={referral.user.avatar} alt={referral.user.name} />
                                                        <AvatarFallback>{referral.user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{referral.user.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">{referral.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={referral.status === 'Completed' ? 'secondary' : 'outline'} className={referral.status === 'Completed' ? 'bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400' : ''}>
                                                    {referral.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">{referral.reward}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <h3 className="text-2xl font-bold mb-10 text-center">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {referralSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                    <step.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h4 className="font-bold text-lg mb-2">{step.title}</h4>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
