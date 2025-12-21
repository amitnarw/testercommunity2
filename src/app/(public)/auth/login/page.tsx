"use client";

import { SiteLogo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { LoadingButton } from "@/components/ui/loading-button";
import { useLoginUser } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserProfileData, useUserProfileInitial } from "@/hooks/useUser";

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
  <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

const signinSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email.")
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed.",
    }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const LoginForm = () => {
  const router = useRouter();
  const [loginValues, setLoginValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<{
    email?: string[] | undefined;
    password?: string[] | undefined;
  }>();
  const [showPassword, setShowPassword] = useState(false);
  const [checkUserProfileData, setCheckUserProfileData] = useState(false);

  const { mutate, isPending, isSuccess, isError, error } = useLoginUser({
    onSuccess: () => {
      setCheckUserProfileData(true);
    },
  });

  const {
    data: userProfileData,
    isPending: userProfileIsPending,
    isSuccess: userProfileIsSuccess,
  } = useUserProfileData({
    enabled: checkUserProfileData,
  });

  useEffect(() => {
    console.log(1111);
    if (
      userProfileIsSuccess &&
      userProfileData &&
      !userProfileIsPending &&
      userProfileData.initial
    ) {
      console.log(2222);
      router.push("/profile/profile-setup");
    } else if (
      userProfileIsSuccess &&
      userProfileData &&
      !userProfileIsPending &&
      !userProfileData.initial
    ) {
      console.log(3333);
      router.push("/dashboard");
    }
  }, [userProfileIsSuccess, userProfileData, userProfileIsPending, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginValues((prev) => ({ ...prev, [name]: value }));

    const field = name as keyof typeof signinSchema.shape;

    const fieldResult = signinSchema.shape[field].safeParse(value);

    setErrors((prev) => ({
      ...prev,
      [name]: fieldResult.success
        ? undefined
        : fieldResult.error.errors.map((e) => e.message),
    }));
  };

  const handleLogin = () => {
    const result = signinSchema.safeParse(loginValues);

    if (!result.success) {
      console.log(result.error.flatten().fieldErrors);
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const data = result.data;
    mutate({
      email: data?.email,
      password: data?.password,
      rememberMe: loginValues?.rememberMe,
    });
  };

  return (
    <div className="space-y-6">
      <Button
        variant="outline"
        className="w-full rounded-xl py-2 sm:py-6 text-sm sm:text-base"
      >
        <GoogleIcon className="mr-3" />
        Log in with Google
      </Button>
      <div className="flex items-center gap-4">
        <Separator className="flex-1 bg-border/50" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1 bg-border/50" />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm">
          Email
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={loginValues?.email ?? ""}
          onChange={handleChange}
        />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors?.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={loginValues?.password ?? ""}
            onChange={handleChange}
          />
          <button
            className="text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>

        {errors?.password && (
          <p className="text-red-500 text-sm">{errors?.password}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          id="rememberMe"
          className="rounded-[5px]"
          defaultChecked
          checked={loginValues?.rememberMe}
          onCheckedChange={(checked) => {
            setLoginValues((prev) => ({
              ...prev,
              rememberMe: !!checked,
            }));
          }}
        />
        <Label htmlFor="rememberMe" className="text-muted-foreground">
          Remember me
        </Label>
      </div>

      <div className="mt-8 pt-5">
        <div className="flex justify-end">
          <LoadingButton
            isLoading={isPending}
            isSuccess={isSuccess}
            isError={isError}
            className="text-sm sm:text-base"
            onClick={handleLogin}
          >
            Log In
          </LoadingButton>
        </div>
      </div>

      {isError && !isPending && (
        <div className="absolute bottom-4 sm:bottom-6 bg-red-500 dark:bg-red-500/40 p-4 rounded-xl border-l-4 border-red-300 dark:border-red-500">
          <p className="italic text-sm text-white">{error?.message}</p>
        </div>
      )}
    </div>
  );
};

export default function LoginPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      <div className="relative w-full h-screen flex flex-col items-center justify-center p-6 bg-background">
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
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="font-bold tracking-tight text-2xl sm:text-3xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
              Log in to your account
            </h2>
            <p className="text-muted-foreground mt-2">
              Or{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                create a new account
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
        <BackgroundBeams />
        <div className="relative z-10 flex flex-col items-center">
          <SiteLogo className="h-20 w-auto mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Log in to continue your journey of building flawless apps.
          </p>
        </div>
      </div>
    </div>
  );
}
