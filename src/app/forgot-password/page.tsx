"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tent, Mail, ShieldAlert, CheckCircle, ArrowLeft } from "lucide-react";
import { newsletterSchema, type NewsletterInput } from "@/lib/validators";
import { resetPasswordAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema), // Use email-only schema
  });

  const onSubmit = async (data: NewsletterInput) => {
    setErrorMessage(null);
    const result = await resetPasswordAction(data.email, window.location.origin);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden bg-background">
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-panel border border-border/80 rounded-2xl p-8 shadow-xl relative z-10 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-md">
            <Tent className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">Reset Password</h1>
          <p className="text-xs text-muted-foreground max-w-[280px]">
            Enter your registered email and we&apos;ll send you a password recovery link.
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2.5 text-xs text-destructive font-medium leading-relaxed">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          /* Success message */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Recovery Link Sent!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-2">
                We&apos;ve dispatched a recovery link to <strong className="text-foreground">{getValues("email")}</strong>. Check your inbox and follow the instructions to set a new password.
              </p>
            </div>
            <div className="pt-4 border-t border-border/30">
              <Link href="/login">
                <Button variant="primary" className="w-full justify-center">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Form request */
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

            <Button type="submit" variant="primary" className="w-full justify-center mt-2" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Link href="/login" className="flex items-center justify-center text-xs text-muted-foreground hover:text-foreground font-semibold py-2">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Return to Login
            </Link>
          </form>
        )}

      </div>
    </div>
  );
}
