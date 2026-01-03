"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowRight,
  Trophy,
  Sparkles,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page-header";
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
import { motion } from "framer-motion";
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
    description: "Share your unique code with friends and colleagues.",
    color: "text-blue-500",
    bg: "bg-blue-500/20 backdrop-blur-xl",
  },
  {
    icon: UserPlus,
    title: "Friend Signs Up",
    description: "Your friend uses your code to create an account.",
    color: "text-purple-500",
    bg: "bg-purple-500/20 backdrop-blur-xl",
  },
  {
    icon: CheckCircle,
    title: "Complete Profile",
    description: "They complete their initial profile setup survey.",
    color: "text-green-500",
    bg: "bg-green-500/20 backdrop-blur-xl",
  },
  {
    icon: Gift,
    title: "Earn Rewards",
    description: "You both get bonus points automatically added.",
    color: "text-amber-500",
    bg: "bg-amber-500/20 backdrop-blur-xl",
  },
];

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  className?: string;
}) => (
  <Card
    className={cn(
      "relative overflow-hidden hover:shadow-xl duration-300 bg-card",
      className
    )}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
    </CardContent>
  </Card>
);

export default function ReferralPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Referral code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen text-foreground max-w-6xl mx-auto">
      <PageHeader
        title="Referrals"
        backHref="/profile"
        className="w-1/2 lg:w-full"
      />
      <section className="relative w-full overflow-hidden mb-12">
        <div className="relative z-10 px-4 md:px-6 py-16 flex flex-col items-center text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Refer & Earn Program
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-black dark:bg-white bg-clip-text text-transparent">
              Invite Friends. <br />
              <span className="text-primary">Earn Rewards.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Grow the community and get rewarded. Earn{" "}
              <span className="text-foreground font-semibold">500 points</span>{" "}
              for every friend who joins and completes their profile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full max-w-md relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col sm:flex-row items-center justify-between gap-4 sm:pl-6 sm:pr-2 py-2">
              <div className="flex flex-col items-center sm:items-start overflow-hidden">
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Your Code
                </span>
                <span className="text-xl md:text-2xl font-mono font-bold tracking-widest text-white truncate w-full">
                  {referralData.referralCode}
                </span>
              </div>
              <Button
                onClick={handleCopy}
                size="lg"
                className={cn(
                  "shrink-0 transition-all duration-300 sm:px-8 w-full sm:w-auto",
                  copied ? "bg-green-600 hover:bg-green-700" : ""
                )}
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Click to copy and share with your network
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-6 space-y-20 pb-20 relative z-10">
        {/* Stats Grid */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard
              title="Total Referrals"
              value={referralData.totalReferrals}
              icon={Users}
              trend="+2 this week"
            />
            <StatCard
              title="Successful Signups"
              value={referralData.successfulSignups}
              icon={CheckCircle}
              className="border-green-500/10"
            />
            <StatCard
              title="Total Earnings"
              value={`${referralData.totalEarnings.toLocaleString()} Pts`}
              icon={IndianRupee}
              className="bg-gradient-to-br from-primary to-primary/40 border-primary/20 text-white"
            />
            <StatCard
              title="Pending Rewards"
              value={`${referralData.pendingRewards.toLocaleString()} Pts`}
              icon={Clock}
            />
          </motion.div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Simple steps to start earning rewards today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10" />

            {referralSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={cn(
                    "w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 relative",
                    step.bg
                  )}
                >
                  <div className="absolute inset-0 rounded-full bg-inherit blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <step.icon className={cn("w-10 h-10", step.color)} />
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold shadow-sm">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed px-2">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Referrals Table */}
        <section className="bg-card rounded-3xl border border-white/5 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Referral History
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Track the status of your invites
              </p>
            </div>
            <Button variant="outline" size="sm" className="hidden md:flex">
              Download Report
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="pl-4 md:pl-8">User</TableHead>
                  <TableHead className="hidden md:table-cell text-right">
                    Date
                  </TableHead>
                  <TableHead className="text-right pr-4 md:pr-8">
                    Reward
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralData.referralHistory.map((referral) => (
                  <TableRow
                    key={referral.id}
                    className="hover:bg-white/5 border-white/5 transition-colors"
                  >
                    <TableCell className="font-medium pl-4 md:pl-8 py-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Avatar className="h-8 w-8 md:h-10 md:w-10 border-2 border-background shrink-0">
                          <AvatarImage
                            src={referral.user.avatar}
                            alt={referral.user.name}
                          />
                          <AvatarFallback>
                            {referral.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-semibold text-sm md:text-base truncate">
                            {referral.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground hidden md:block">
                            Joined via Invite
                          </div>
                          <div className="text-xs text-muted-foreground md:hidden mt-0.5">
                            {referral.date}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-right">
                      {referral.date}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary pr-4 md:pr-8 text-sm md:text-base whitespace-nowrap">
                      +{referral.reward}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-4 border-t border-white/5 text-center md:hidden">
            <Button variant="ghost" size="sm" className="w-full">
              View All History
            </Button>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl z-0" />
          <div className="relative z-10 p-6 md:p-16 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/20 text-primary mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to multiply your earnings?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
              There's no limit to how many friends you can invite. Start sharing
              your code today!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base h-12 px-8 shadow-lg shadow-primary/25"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Get Referral Code
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
