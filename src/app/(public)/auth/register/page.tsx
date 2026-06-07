"use client";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { Logo } from "@/components/logo";
import { useTheme } from "next-themes";
import { HomeButton } from "@/components/home-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRegisterUser, useGoogleLoginUser } from "@/hooks/useAuth";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { LoadingButton } from "@/components/ui/loading-button";
import { useState, useCallback, useEffect, ChangeEvent } from "react";
import { useUserProfileData } from "@/hooks/useUser";
import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { authClient } from "@/lib/auth-client";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z
    .string()
    .email("Please enter a valid email.")
    .refine((value) => value.toLowerCase().endsWith("@gmail.com"), {
      message: "Only Gmail addresses are allowed.",
    }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const GoogleIcon = (props: React.HTMLAttributes<HTMLImageElement>) => (
  <Image src="/google.svg" alt="Google" width={24} height={24} {...props} />
);

export default function RegisterPage() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [registerValues, setRegisterValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
  }>();

  const { mutate, isPending, isSuccess, isError, error } = useRegisterUser();

  const { mutate: googleLoginMutate, isPending: googleLoginIsPending } =
    useGoogleLoginUser();

  const {
    data: userProfileData,
    isSuccess: userProfileIsSuccess,
    refetch: userProfileDataRefetch,
    isFetching: userProfileisFetching,
  } = useUserProfileData();

  const { data: sessionData } = authClient.useSession();

  useEffect(() => {
    if (sessionData?.session) {
      userProfileDataRefetch();
    }
  }, [sessionData?.session, userProfileDataRefetch]);

  useEffect(() => {
    if (!userProfileIsSuccess || userProfileisFetching || !userProfileData)
      return;

    if (userProfileData.initial) {
      router.replace(ROUTES.AUTHENTICATED.PROFILE_SETUP);
    } else {
      router.replace(ROUTES.AUTHENTICATED.FREE_TESTING);
    }
  }, [userProfileIsSuccess, userProfileisFetching, userProfileData, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterValues((prev) => ({ ...prev, [name]: value }));

    const field = name as keyof typeof signupSchema.shape;
    const fieldResult = signupSchema.shape[field].safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldResult.success
        ? undefined
        : fieldResult.error.errors.map((e) => e.message),
    }));
  };

  const handleRegister = useCallback(() => {
    const result = signupSchema.safeParse(registerValues);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }
    mutate(result.data, {
      onSuccess: () => {
        router.push(ROUTES.AUTH.REGISTER_CHECK_EMAIL);
      },
    });
  }, [registerValues, mutate, router]);

  const handleGoogleLogin = () => {
    googleLoginMutate();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleRegister();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleRegister]);

  return (
    <div
      data-loc="RegisterPage"
      className="min-h-screen w-full lg:grid lg:grid-cols-2"
    >
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-2 sm:px-6 bg-background">
        <div className="absolute top-2 sm:top-4 right-4 flex items-center gap-4">
          <HomeButton href="/" />
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
          <div className="overflow-hidden relative">
            <div className="rounded-2xl px-2 sm:px-6 pt-10 pb-20">
              <div className="mb-8 text-center">
                <h2 className="font-bold tracking-tight text-2xl sm:text-3xl bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  Create an Account
                </h2>

                <p className="text-muted-foreground mt-2">
                  Or{" "}
                  <Link
                    href={ROUTES.AUTH.LOGIN}
                    className="text-primary hover:underline"
                  >
                    login to your account
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full rounded-xl py-2 sm:py-6 text-sm sm:text-base"
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoginIsPending}
                >
                  <GoogleIcon className="mr-3" />
                  {googleLoginIsPending ? "Connecting..." : "Sign up with Google"}
                </Button>
                <div className="flex items-center gap-4">
                  <div className="flex-1 border-t"></div>
                  <span className="text-xs text-muted-foreground">OR</span>
                  <div className="flex-1 border-t"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm">
                      First Name
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={registerValues.firstName}
                      onChange={handleChange}
                    />
                    {errors?.firstName && (
                      <p className="text-red-500 text-sm">{errors.firstName[0]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm">
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={registerValues.lastName}
                      onChange={handleChange}
                    />
                    {errors?.lastName && (
                      <p className="text-red-500 text-sm">{errors.lastName[0]}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={registerValues.email}
                    onChange={handleChange}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">{errors.email[0]}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={registerValues.password}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </Button>
                  </div>
                  {errors?.password && (
                    <p className="text-red-500 text-sm">{errors.password[0]}</p>
                  )}
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-end">
                  <LoadingButton
                    isLoading={isPending}
                    isSuccess={isSuccess}
                    isError={isError}
                    className="text-sm sm:text-base"
                    onClick={handleRegister}
                  >
                    Create Account
                  </LoadingButton>
                </div>
              </div>

              {isError && !isPending && (
                <div className="absolute bg-red-500 dark:bg-red-500/40 p-4 rounded-xl mt-2 border-l-4 border-red-300 dark:border-red-500">
                  <p className="italic text-sm text-white">
                    {error?.message}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
        <BackgroundBeams />
        <div className="relative z-10 flex flex-col items-center">
          <Logo className="w-20 h-20 mb-4" />
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
