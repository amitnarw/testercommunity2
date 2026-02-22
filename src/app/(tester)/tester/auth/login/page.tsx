"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/back-button";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { cn } from "@/lib/utils";
import { ChangeEvent, useEffect, useState } from "react";
import { z } from "zod";
import Image from "next/image";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  useTesterLogin,
  useGoogleTesterLogin,
  useResendEmailVerification,
} from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserProfileData } from "@/hooks/useUser";
import dynamic from "next/dynamic";
const NotVerifiedDialog = dynamic(
  () =>
    import("@/components/unauthenticated/not-verified-dialog").then(
      (mod) => mod.NotVerifiedDialog,
    ),
  { ssr: false },
);
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { ROUTES } from "@/lib/routes";

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

const TesterLoginForm = () => {
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
  const [showNotVerifiedDialog, setShowNotVerifiedDialog] = useState(false);

  const { mutate, isPending, isSuccess, isError, error } = useTesterLogin({
    onSuccess: async () => {
      await new Promise((r) => setTimeout(r, 50));
      userProfileDataRefetch();
    },
    onError: (err: any) => {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        setShowNotVerifiedDialog(true);
      }
    },
  });

  const { mutate: googleLoginMutate, isPending: googleLoginIsPending } =
    useGoogleTesterLogin({
      onSuccess: async () => {
        await new Promise((r) => setTimeout(r, 50));
        userProfileDataRefetch();
      },
    });

  const {
    data: userProfileData,
    isSuccess: userProfileIsSuccess,
    refetch: userProfileDataRefetch,
    isFetching: userProfileisFetching,
  } = useUserProfileData();

  useEffect(() => {
    if (!userProfileIsSuccess || userProfileisFetching || !userProfileData)
      return;

    router.replace(ROUTES.TESTER.DASHBOARD);
  }, [userProfileIsSuccess, userProfileisFetching, userProfileData, router]);

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

  const handleGoogleLogin = () => {
    googleLoginMutate();
  };

  const {
    mutate: resendMutate,
    isPending: resendIsPending,
    isSuccess: resendIsSuccess,
    isError: resendIsError,
    error: resendError,
  } = useResendEmailVerification({
    onSuccess: async () => {
      await new Promise((r) => setTimeout(r, 500));
      setShowNotVerifiedDialog(false);
      toast({
        title: "Verification Email Sent",
        description:
          "A new verification link has been sent to your email address.",
      });
    },
  });

  const handleResendVerification = async () => {
    const result = signinSchema.safeParse(loginValues);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    const data = result.data;
    resendMutate({ email: data?.email });
  };

  return (
    <>
      <NotVerifiedDialog
        open={showNotVerifiedDialog}
        onOpenChange={setShowNotVerifiedDialog}
        onResend={handleResendVerification}
        resendIsPending={resendIsPending}
        resendIsSuccess={resendIsSuccess}
        resendIsError={resendIsError}
      />
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl py-2 sm:py-6 text-sm sm:text-base"
          onClick={handleGoogleLogin}
          disabled={googleLoginIsPending}
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
            Tester Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="pro.tester@example.com"
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
              type="button"
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
              type="submit"
              isLoading={isPending}
              isSuccess={isSuccess}
              isError={isError}
              className="text-sm sm:text-base"
            >
              Log In
            </LoadingButton>
          </div>
        </div>

        {(isError || resendIsError) && !isPending && (
          <div className="absolute bottom-4 sm:bottom-6 bg-red-500 dark:bg-red-500/40 p-4 rounded-xl border-l-4 border-red-300 dark:border-red-500">
            <p className="italic text-sm text-white">
              {error?.message || resendError?.message}
            </p>
          </div>
        )}
      </form>
    </>
  );
};

export default function ProfessionalLoginPage() {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (session?.session?.id && (session as any)?.role?.name === "tester") {
      router.push(ROUTES.TESTER.DASHBOARD);
    }
  }, [session, isPending, router]);

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
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Professional Tester Login
            </h2>
            <p className="text-muted-foreground mt-2">
              Not a pro tester yet?{" "}
              <Link
                href={ROUTES.TESTER.AUTH.REGISTER}
                className="text-primary hover:underline"
              >
                Register here
              </Link>
              .
            </p>
          </div>
          <TesterLoginForm />
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-background">
        <InteractiveGridPattern
          className={cn(
            "[mask-image:radial-gradient(700px_circle_at_center,rgba(255,255,255,0.6),transparent)]",
            "transform -skew-y-12",
          )}
          width={30}
          height={30}
          squares={[30, 30]}
          squaresClassName="hover:fill-gray-100"
        />
        <div className="relative z-10 flex flex-col items-center">
          <Logo className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome Back, Professional
          </h1>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Access your professional dashboard and continue testing high-impact
            applications.
          </p>
        </div>
      </div>
    </div>
  );
}
