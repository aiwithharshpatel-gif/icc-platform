/* eslint-disable react-hooks/purity, react-hooks/immutability */
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tent, Mail, Lock, ShieldAlert, CheckCircle, ArrowRight } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validators";
import { loginAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Check URL query parameters for feedback messages
  React.useEffect(() => {
    const error = searchParams.get("error");
    const verified = searchParams.get("verified");
    if (error || verified === "true") {
      requestAnimationFrame(() => {
        if (error) setErrorMessage(error);
        if (verified === "true") {
          setSuccessMessage("Your email has been successfully verified! You can now log in.");
        }
      });
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await loginAction(data);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      const nextPath = searchParams.get("next") || "/profile";
      router.push(nextPath);
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabaseClient = createClient();
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${searchParams.get("next") || "/profile"}`,
        },
      });
      if (error) setErrorMessage(error.message);
    } catch {
      setErrorMessage("An unexpected error occurred during Google Sign-in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-background">
      {/* Dynamic spot lighting */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-border/80 rounded-2xl p-8 shadow-xl relative z-10 space-y-6">
        {/* Brand Info */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <Tent className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">Welcome to Basecamp</h1>
          <p className="text-xs text-muted-foreground max-w-[280px]">
            Log in to your Indian Camping Community account to access campsites and registrations.
          </p>
        </div>

        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2.5 text-xs text-destructive font-medium leading-relaxed">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-400 font-medium leading-relaxed">
            <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive font-medium pl-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
              <Link href="/forgot-password" className="text-xs text-primary font-semibold hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-xs text-destructive font-medium pl-1">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
        </form>

        {/* Separator */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-border/80"></div>
          <span className="flex-shrink mx-4 text-muted-foreground text-[10px] uppercase font-bold tracking-widest">or continue with</span>
          <div className="flex-grow border-t border-border/80"></div>
        </div>

        {/* Social Authentication */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-border bg-card text-foreground hover:bg-muted py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
        >
          {/* Custom inline Google SVG logo */}
          <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.49 3.77v3.12h4.01c2.34-2.16 3.69-5.32 3.69-8.74z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.12c-1.12.75-2.54 1.19-3.95 1.19-3.05 0-5.63-2.06-6.55-4.83H1.31v3.22A12 12 0 0 0 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.45 14.33a7.14 7.14 0 0 1 0-4.56V6.55H1.31a12 12 0 0 0 0 10.9L5.45 14.3z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.92 11.92 0 0 0 12 0 12 12 0 0 0 1.31 6.55L5.45 9.77c.92-2.77 3.5-4.83 6.55-4.83z"
            />
          </svg>
          Google
        </button>

        {/* Footnote */}
        <p className="text-center text-xs text-muted-foreground">
          New to the community?{" "}
          <Link href="/register" className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
            Create account
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
