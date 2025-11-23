
"use client";

import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { SiteLogo } from "@/components/icons";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BackButton } from "@/components/back-button";
import Image from "next/image";
import { BackgroundBeams } from "@/components/background-beams";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Please enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .optional(),
});

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
  <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

export default function RegisterPage() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const { handleSubmit } = form;

  const processForm: SubmitHandler<any> = (data) => {
    console.log("Account data:", data);
    // In a real app, you would handle user creation and then navigate.
    router.push('/register/profile-setup');
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="absolute top-4 right-4 flex items-center gap-4">
          <BackButton href="/" />
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

        <div className="w-full max-w-md">
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(processForm)}
              className="overflow-hidden relative"
            >
              <div className="bg-card border rounded-2xl p-6 shadow-lg">
                <div className="mb-8 text-center">
                  <h2 className="font-bold tracking-tight text-3xl">
                    Create an Account
                  </h2>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Let's get started with your 14-day free trial.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl py-6 text-base"
                  >
                    <GoogleIcon className="mr-3" />
                    Sign up with Google
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 border-t"></div>
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="flex-1 border-t"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 pt-5">
                  <div className="flex justify-end">
                    <Button type="submit">
                      Create Account & Continue{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
        <BackgroundBeams />
        <div className="relative z-10 flex flex-col items-center">
          <SiteLogo className="h-20 w-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Join the Community
          </h1>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Start your journey to building flawless apps with a global community
            of testers.
          </p>
        </div>
      </div>
    </div>
  );
}
