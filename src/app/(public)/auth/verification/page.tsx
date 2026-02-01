"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MailWarning, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SiteLogo } from "@/components/icons";
import Link from "next/link";
import LoadingIcon from "@/components/loadingIcon";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useEmailVerification } from "@/hooks/useAuth";

type VerificationStatus = "verifying" | "success" | "error";

function VerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, reset, isPending, isSuccess, isError, error } =
    useEmailVerification();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    reset();
    mutate({ token });
  }, [searchParams, router, mutate, reset]);

  useEffect(() => {
    if (isPending) {
      setStatus("verifying");
    }
    if (isSuccess) {
      setStatus("success");
    }
    if (isError) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error?.message : JSON.stringify(error),
      );
    }
  }, [isPending, isSuccess, isError, error]);

  const statusConfig = {
    verifying: {
      icon: <LoadingIcon />,
      title: "Verifying Your Email",
      description:
        "Please wait a moment while we confirm your email address. This shouldn't take long.",
      cta: null,
    },
    success: {
      icon: <CheckCircle className="h-16 w-16 text-green-500" />,
      title: "Verification Successful!",
      description:
        "Your email has been successfully verified. You can now log in to your account.",
      cta: (
        <Button asChild className="mt-8">
          <Link href="/auth/login">
            Proceed to Login <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      ),
    },
    error: {
      icon: <MailWarning className="h-16 w-16 text-destructive" />,
      title: "Verification Failed",
      description:
        errorMessage ||
        "We couldn't verify your email. The link may have expired or is invalid.",
      cta: (
        <div className="flex gap-4 mt-8">
          <Button asChild variant="outline">
            <Link href="/auth/register">Re-register</Link>
          </Button>
          <Button asChild>
            <Link href="/help">Contact Support</Link>
          </Button>
        </div>
      ),
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md z-10"
      >
        <Card className="relative z-10 w-full bg-white/60 dark:bg-black/60 shadow-2xl shadow-primary/10 dark:shadow-primary/10 border border-white/10 dark:border-black/20 rounded-2xl">
          <CardHeader className="text-center items-center p-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
            >
              {currentStatus.icon}
            </motion.div>
            <CardTitle className="font-bold tracking-tight text-2xl sm:text-3xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent mt-4">
              {currentStatus.title}
            </CardTitle>
            <CardDescription>{currentStatus.description}</CardDescription>
          </CardHeader>
          {currentStatus.cta && (
            <CardContent className="flex justify-center p-8 pt-0">
              {currentStatus.cta}
            </CardContent>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default function VerificationPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-6 bg-gray-100/50 dark:bg-zinc-900/50">
      <BackgroundBeams className="scale-150 sm:scale-100" />
      <div className="absolute top-4 right-4 flex items-center gap-4 z-20">
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
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <SiteLogo />
        </Link>
      </div>
      <Suspense fallback={<LoadingIcon />}>
        <VerificationContent />
      </Suspense>
    </div>
  );
}
