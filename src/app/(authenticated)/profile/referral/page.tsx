"use client";

import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Gift,
  Share2,
  Users,
  CheckCircle,
  Clock,
  IndianRupee,
  UserPlus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const referralData = {
  referralCode: "PRO_DEV_77",
  totalReferrals: 12,
  successfulSignups: 8,
  totalEarnings: 4000,
  pendingRewards: 500,
  referralHistory: [
    {
      id: 1,
      user: {
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/150?u=alice",
      },
      date: "2024-08-15",
      status: "Completed",
      reward: "500 Pts",
    },
    {
      id: 2,
      user: { name: "Bob Williams", avatar: "https://i.pravatar.cc/150?u=bob" },
      date: "2024-08-12",
      status: "Pending",
      reward: "500 Pts",
    },
    {
      id: 3,
      user: {
        name: "Charlie Brown",
        avatar: "https://i.pravatar.cc/150?u=charlie",
      },
      date: "2024-08-10",
      status: "Completed",
      reward: "500 Pts",
    },
    {
      id: 4,
      user: {
        name: "Diana Miller",
        avatar: "https://i.pravatar.cc/150?u=diana",
      },
      date: "2024-08-05",
      status: "Completed",
      reward: "500 Pts",
    },
  ],
};

const referralSteps = [
  {
    icon: Share2,
    title: "Share Your Code",
    description:
      "Grab your unique referral code and share it with friends, colleagues, or anyone in your network who could benefit from inTesters. The more you share, the more you can earn.",
  },
  {
    icon: UserPlus,
    title: "Friend Signs Up",
    description:
      "Your friend uses your referral code when they sign up. This links their account to yours, ensuring you both get credit when the conditions are met.",
  },
  {
    icon: CheckCircle,
    title: "Friend Completes Profile",
    description:
      "To ensure our community is full of active and engaged members, the reward is triggered once your friend completes their initial profile setup survey.",
  },
  {
    icon: Gift,
    title: "You Both Get Rewarded",
    description:
      "Success! Once the profile survey is complete, bonus points are automatically added to both of your accounts. It's a win-win for everyone.",
  },
];

const Step = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.3, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [index % 2 === 0 ? -100 : 100, 0]
  );

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, x }}
      className="grid grid-cols-1 md:grid-cols-5 items-center gap-8 my-16"
    >
      <div
        className={cn(
          "md:col-span-2 flex justify-center",
          index % 2 === 0 ? "md:order-2" : "md:order-1"
        )}
      >
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
          <Icon className="w-20 h-20 text-primary z-10" />
        </div>
      </div>
      <div
        className={cn(
          "md:col-span-3",
          index % 2 === 0 ? "md:order-1" : "md:order-2"
        )}
      >
        <h4 className="font-bold text-2xl mb-2">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
};

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
          Refer & Earn
        </h1>
      </div>
      <div className="max-w-5xl mx-auto space-y-12">
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Referrals
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {referralData.totalReferrals}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Successful Signups
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {referralData.successfulSignups}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm rounded-xl border-0 bg-gradient-to-br from-primary to-primary/40 relative overflow-hidden flex flex-row sm:flex-col justify-between sm:justify-center relative">
              <IndianRupee className="h-4 w-4 text-white/10 sm:text-white/20 absolute right-3 top-4 scale-[3]" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {referralData.totalEarnings.toLocaleString()} Pts
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Rewards
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {referralData.pendingRewards.toLocaleString()} Pts
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <p className="text-sm sm:text-md text-muted-foreground text-center">
            Share your love for inTesters and get rewarded. For every friend who
            signs up and completes their profile survey, you'll both earn bonus
            points.
          </p>
          <Card className="shadow-2xl shadow-primary/10 border-dashed border-2">
            <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-semibold">
                  Your Unique Referral Code
                </h3>
                <p className="text-4xl font-bold tracking-widest text-primary my-2">
                  {referralData.referralCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  Share this code with your friends.
                </p>
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
          <h3 className="text-2xl font-bold mb-6 text-center">
            Referral History
          </h3>
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
                  {referralData.referralHistory.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage
                              src={referral.user.avatar}
                              alt={referral.user.name}
                            />
                            <AvatarFallback>
                              {referral.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {referral.user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {referral.date}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            referral.status === "Completed"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            referral.status === "Completed"
                              ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              : ""
                          }
                        >
                          {referral.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {referral.reward}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="py-12">
          <h3 className="text-3xl font-bold mb-16 text-center">How It Works</h3>
          <div className="space-y-12">
            {referralSteps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
