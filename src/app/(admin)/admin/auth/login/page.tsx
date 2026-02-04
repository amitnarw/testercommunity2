"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { BackButton } from "@/components/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useAdminLogin } from "@/hooks/useAdmin";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

const LoginForm = ({
  role,
}: {
  role: "Super Admin" | "Admin" | "Moderator";
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState(
    `${role.toLowerCase().replace(" ", "")}@gmail.com`,
  );
  const [password, setPassword] = React.useState("Admin@123Password");
  const [rememberMe, setRememberMe] = React.useState(false);

  const { data: session, isPending: isSessionPending } =
    authClient.useSession();

  const { mutate: login, isPending } = useAdminLogin({
    onSuccess: async (data) => {
      await new Promise((r) => setTimeout(r, 50));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${role}!`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Please check your credentials.",
      });
    },
  });

  React.useEffect(() => {
    if (isSessionPending || !session) return;

    router.replace("/admin/dashboard");
  }, [session, isSessionPending, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password, role, rememberMe });
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleLogin}
      className="space-y-3 md:space-y-4"
    >
      <div className="space-y-1">
        <Label
          htmlFor={`${role}-email`}
          className="text-xs font-bold text-foreground/80 ml-1"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id={`${role}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-9 h-10 bg-background border-input focus:ring-1 focus:ring-primary/40 rounded-xl text-sm"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label
          htmlFor={`${role}-password`}
          className="text-xs font-bold text-foreground/80 ml-1"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id={`${role}-password`}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-9 pr-10 h-10 bg-background border-input focus:ring-1 focus:ring-primary/40 rounded-xl text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between px-1 mb-1">
        <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer group">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-3 w-3 rounded border-input accent-primary"
          />
          <span>Keep me signed in</span>
        </label>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98] group text-sm"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Verifying...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2 w-full">
            Sign In
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        )}
      </Button>
    </motion.form>
  );
};

export default function AdminLoginPage() {
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    const body = document.querySelector("body");
    if (body) {
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = "auto";
      };
    }
  }, []);

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col p-4 md:p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-primary/5 blur-[80px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[80px] -z-10 rounded-full" />

      {/* Top Bar Navigation - Minimal height */}
      <header className="flex justify-between items-center shrink-0 h-10">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <BackButton href="/" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="rounded-lg h-8 w-8 hover:bg-muted/50"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </motion.div>
      </header>

      {/* Main Content Area - Optimized to fit without scrolling */}
      <main className="flex-1 flex flex-col items-center justify-center -mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[380px] space-y-4 md:space-y-6"
        >
          {/* Header Section - Compact */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3.5 bg-muted/50 rounded-2xl mb-3 border border-border/30">
              <Logo size="sm" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Admin Portal
            </h1>
            <p className="text-xs font-medium text-muted-foreground mt-1">
              Secure gateway for inTesters administration
            </p>
          </div>

          {/* Card - Optimized Padding */}
          <div className="bg-card border border-border/60 rounded-[2rem] p-6 shadow-xl shadow-primary/5">
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-muted/40 p-1 rounded-xl mb-6 border border-border/10">
                <TabsTrigger
                  value="super-admin"
                  className="rounded-lg text-[10px] font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Super
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-lg text-[10px] font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Admin
                </TabsTrigger>
                <TabsTrigger
                  value="moderator"
                  className="rounded-lg text-[10px] font-bold data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all"
                >
                  Mod
                </TabsTrigger>
              </TabsList>

              <TabsContent value="super-admin" className="mt-0 outline-none">
                <LoginForm role="Super Admin" />
              </TabsContent>
              <TabsContent value="admin" className="mt-0 outline-none">
                <LoginForm role="Admin" />
              </TabsContent>
              <TabsContent value="moderator" className="mt-0 outline-none">
                <LoginForm role="Moderator" />
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer Info - Combined/Compact */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] bg-muted/40 px-3 py-1.5 rounded-full border border-border/30">
              <Shield className="h-3 w-3 text-primary" />
              Secure Access Protocol
            </div>

            <div className="flex justify-center gap-4 text-[10px] font-bold text-muted-foreground/60">
              <p className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                Online
              </p>
              <p>v2.4.0</p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Minimal Footer */}
      <footer className="shrink-0 h-6 flex justify-center text-[9px] font-medium text-muted-foreground/50">
        <p>&copy; 2026 iTesters Community</p>
      </footer>
    </div>
  );
}
