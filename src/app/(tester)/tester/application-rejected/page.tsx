"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, LogOut, HelpCircle, Mail, ArrowLeft, MessageSquare } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ApplicationRejectedPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { setTheme, theme } = useTheme();

  const sessionData = session as unknown as {
    ban_reason?: string;
    user?: { name?: string; email?: string };
  };
  const rejectionReason = sessionData?.ban_reason || null;
  const userName = sessionData?.user?.name || "Tester";
  const userEmail = sessionData?.user?.email || "";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.TESTER.AUTH.LOGIN);
        },
      },
    });
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6 bg-gray-100/50 dark:bg-zinc-900/50">

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex items-center gap-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg z-10"
      >
        <Card className="relative z-10 w-full bg-white/60 dark:bg-black/60 shadow-2xl shadow-primary/10 dark:shadow-primary/10 border border-white/10 dark:border-black/20 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {/* Header with animated icon */}
            <div className="relative flex flex-col items-center pt-8 pb-4 px-5 sm:pt-10 sm:pb-6 sm:px-8">
              {/* Decorative gradient blob */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-red-500/5 rounded-full blur-3xl opacity-60" />
              </div>

              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  type: "spring",
                  stiffness: 250,
                  damping: 15,
                }}
                className="relative mb-5"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full bg-red-500/10 ring-4 ring-red-500/20"
                />
                <div className="relative w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center ring-4 ring-red-500/20">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-br from-red-500 to-red-600 bg-clip-text text-transparent"
              >
                Application Rejected
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-muted-foreground text-sm mt-2 text-center max-w-xs"
              >
                We appreciate your interest, <span className="font-medium text-foreground">{userName}</span>.
                Unfortunately, your tester application was not approved at this time.
              </motion.p>
            </div>

            {/* Rejection reason */}
            {rejectionReason && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="px-5 sm:px-8 pb-4 sm:pb-6"
              >
                <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                        Reason from admin
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <Separator className="mx-5 sm:mx-8" />

            {/* Next steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="px-5 sm:px-8 py-4 sm:py-6"
            >
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Think this is a mistake?</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reach out to our support team with your account details. We&apos;ll review your application again.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Contact us</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Email{" "}
                      <span className="font-medium text-foreground">
                        {userEmail}
                      </span>{" "}
                      is linked to this account. Support will reference it.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <Separator className="mx-5 sm:mx-8" />

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="px-5 sm:px-8 py-4 sm:py-6 flex flex-col gap-3"
            >
              <Button
                className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white"
                asChild
              >
                <Link href={ROUTES.PUBLIC.SUPPORT}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl"
                asChild
              >
                <Link href={ROUTES.TESTER.AUTH.LOGIN}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-xl text-muted-foreground"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
