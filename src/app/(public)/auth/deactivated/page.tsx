"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Power, Mail, ArrowLeft, Home, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useCheckEmailStatus, useReactivateAccount, useToggleMyActiveStatus } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";

export default function DeactivatedPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DeactivatedPageContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
    </div>
  );
}

function DeactivatedPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const reason = searchParams.get("reason");

  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { data: status, isPending: statusPending } = useCheckEmailStatus(email);
  const queryClient = useQueryClient();

  const [password, setPassword] = useState("");
  const [reactivating, setReactivating] = useState(false);

  const sessionMatches = useMemo(
    () =>
      !!email &&
      !!session?.user?.email &&
      session.user.email.toLowerCase() === email.toLowerCase(),
    [session?.user?.email, email],
  );

  const { mutate: toggleStatus } = useToggleMyActiveStatus({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUserData"] });
      setReactivating(false);
      toast({
        title: "Account reactivated",
        description: "Welcome back!",
      });
      router.replace(ROUTES.AUTHENTICATED.DASHBOARD);
      router.refresh();
    },
    onError: (err: any) => {
      setReactivating(false);
      toast({
        title: "Error",
        description: err?.message ?? "Failed to reactivate account.",
        variant: "destructive",
      });
    },
  });

  const { mutate: reactivate } = useReactivateAccount({
    onSuccess: async () => {
      setReactivating(false);
      toast({
        title: "Account reactivated",
        description: "Your account has been reactivated. Logging you in...",
      });
      const signIn = await authClient.signIn.email({ email, password });
      if (signIn?.error) {
        router.replace(ROUTES.AUTH.LOGIN);
        return;
      }
      router.replace(ROUTES.AUTHENTICATED.DASHBOARD);
      router.refresh();
    },
    onError: (err: any) => {
      setReactivating(false);
      toast({
        title: "Error",
        description: err?.message ?? "Failed to reactivate account.",
        variant: "destructive",
      });
    },
  });

  const handleReactivateWithSession = () => {
    setReactivating(true);
    toggleStatus(true);
  };

  const handleReactivateWithPassword = () => {
    if (!email || !password) return;
    setReactivating(true);
    reactivate({ email, password });
  };

  const showHasSession =
    sessionPending ||
    (sessionMatches && (status?.isActive === false || statusPending));

  const showPasswordForm =
    !sessionPending &&
    !sessionMatches &&
    !statusPending &&
    status?.exists === true &&
    status?.authType === "EMAIL_PASSWORD" &&
    status?.isActive === false;

  const showGoogleSupport =
    !sessionPending &&
    !sessionMatches &&
    !statusPending &&
    status?.exists === true &&
    status?.authType === "GOOGLE" &&
    status?.isActive === false;

  const showUnknown =
    !sessionPending &&
    !sessionMatches &&
    !statusPending &&
    (!email ||
      status?.exists === false ||
      (status?.exists === true && status?.isActive === true));

  const message = reason || "Your account has been deactivated. You can reactivate it to regain access.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Power className="w-8 h-8 text-destructive" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Account Deactivated
          </h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            {message}
          </p>

          {showHasSession && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You still have an active session. Reactivate in one click to
                continue.
              </p>
              <Button
                className="w-full rounded-xl"
                disabled={reactivating || sessionPending}
                onClick={handleReactivateWithSession}
              >
                {reactivating ? "Reactivating..." : "Reactivate Now"}
              </Button>
            </div>
          )}

          {showPasswordForm && (
            <div className="text-left space-y-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deactivated-password">Password</Label>
                <Input
                  id="deactivated-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleReactivateWithPassword();
                  }}
                />
              </div>
              <Button
                className="w-full rounded-xl"
                disabled={reactivating || !password}
                onClick={handleReactivateWithPassword}
              >
                {reactivating ? "Reactivating..." : "Reactivate Account"}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Your data has been kept and will be restored when you
                reactivate.
              </p>
            </div>
          )}

          {showGoogleSupport && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This account uses Google sign-in, so it can&apos;t be
                reactivated with a password. Please contact support to
                reactivate your account.
              </p>
              <Button asChild className="w-full rounded-xl">
                <Link href="mailto:support@system.intesters.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </div>
          )}

          {showUnknown && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                If this doesn&apos;t look right, or if your account is already
                active, you can go back to the login page.
              </p>
              <Button asChild className="w-full rounded-xl">
                <Link href={ROUTES.AUTH.LOGIN}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          )}

          {(showHasSession || showPasswordForm || showGoogleSupport || showUnknown) && (
            <div className="flex gap-3 mt-4">
              <Button variant="outline" asChild className="flex-1 rounded-xl">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1 rounded-xl">
                <Link href={ROUTES.AUTH.LOGIN}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}