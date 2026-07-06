"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tent, Mail, Lock, User, MapPin, Phone, Globe, Flame, Car, Info, ShieldAlert, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validators";
import { signUpAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { FileUploader } from "@/components/ui/file-uploader";

export default function RegisterPage() {
  const [step, setStep] = React.useState(1);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      avatarUrl: "",
      instagram: "",
      campingExperience: "Beginner",
      vehicle: "None",
      bio: "",
    },
  });

  const avatarUrlValue = watch("avatarUrl");

  const nextStep = async () => {
    // Validate Step 1 fields (email, password) before transitioning
    const isValid = await trigger(["email", "password"]);
    if (isValid) {
      setStep(2);
      setErrorMessage(null);
    }
  };

  const prevStep = () => {
    setStep(1);
  };

  const onSubmit = async (data: RegisterInput) => {
    setErrorMessage(null);
    
    // Call server sign up action
    const result = await signUpAction(data, window.location.origin);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      // Seed mock users list in localStorage so login can find this user
      const mockUser = {
        id: "mock-user-" + Math.random().toString(36).substr(2, 9),
        email: data.email,
        user_metadata: {
          full_name: data.name,
          city: data.city,
          state: data.state,
          phone: data.phone,
          camping_experience: data.campingExperience,
          vehicle: data.vehicle,
          bio: data.bio,
        }
      };
      const existingUsers = JSON.parse(localStorage.getItem("icc_mock_users") || "[]");
      existingUsers.push(mockUser);
      localStorage.setItem("icc_mock_users", JSON.stringify(existingUsers));

      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-16 px-4 relative overflow-hidden bg-background">
      {/* Visual spotlights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full glass-panel border border-border/80 rounded-2xl p-8 shadow-xl relative z-10 space-y-6">
        {/* Logo & title */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-11 w-11 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Tent className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight mt-3">Join the Tribe</h1>
          <p className="text-xs text-muted-foreground max-w-[320px]">
            {isSuccess
              ? "Verify your account"
              : step === 1
              ? "Step 1: Set up your basecamp credentials"
              : "Step 2: Complete your camper profile"}
          </p>
        </div>

        {/* Status progress bar */}
        {!isSuccess && (
          <div className="flex items-center justify-between gap-2 max-w-xs mx-auto">
            <div className={`h-1.5 flex-grow rounded-full transition-colors duration-300 ${step >= 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`h-1.5 flex-grow rounded-full transition-colors duration-300 ${step === 2 ? "bg-primary" : "bg-muted"}`} />
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-2.5 text-xs text-destructive font-medium leading-relaxed">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {isSuccess ? (
          /* Verification Success state */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">Verification Email Sent!</h3>
              <p className="text-xs text-muted-foreground leading-relaxed px-4">
                We&apos;ve sent a verification link to <strong className="text-foreground">{getValues("email")}</strong>. Please click the link in your email to confirm your account and log in.
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
          /* Multi-step registration forms */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Step 1: Credentials */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive font-medium pl-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password (min. 6 characters)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      {...register("password")}
                    />
                  </div>
                  {errors.password && <p className="text-xs text-destructive font-medium pl-1">{errors.password.message}</p>}
                </div>

                <Button type="button" variant="primary" className="w-full justify-between mt-6 group" onClick={nextStep}>
                  <span>Continue details</span>
                  <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step 2: Profile details */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive font-medium pl-1">{errors.name.message}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive font-medium pl-1">{errors.phone.message}</p>}
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Mumbai"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register("city")}
                      />
                    </div>
                    {errors.city && <p className="text-xs text-destructive font-medium pl-1">{errors.city.message}</p>}
                  </div>

                  {/* State */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Maharashtra"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register("state")}
                      />
                    </div>
                    {errors.state && <p className="text-xs text-destructive font-medium pl-1">{errors.state.message}</p>}
                  </div>

                  {/* Avatar Upload */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile Picture (optional)</label>
                    <FileUploader
                      bucketName="avatars"
                      value={avatarUrlValue}
                      onUploadComplete={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
                    />
                    {errors.avatarUrl && <p className="text-xs text-destructive font-medium pl-1">{errors.avatarUrl.message}</p>}
                  </div>

                  {/* Instagram */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instagram Handle</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="@camper_tribe"
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        {...register("instagram")}
                      />
                    </div>
                    {errors.instagram && <p className="text-xs text-destructive font-medium pl-1">{errors.instagram.message}</p>}
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Camping Experience</label>
                    <div className="relative">
                      <Flame className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <select
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                        {...register("campingExperience")}
                      >
                        <option value="Beginner">Beginner (1-2 camps)</option>
                        <option value="Intermediate">Intermediate (3-10 camps)</option>
                        <option value="Expert">Expert (10+ camps / Wild guides)</option>
                      </select>
                    </div>
                    {errors.campingExperience && <p className="text-xs text-destructive font-medium pl-1">{errors.campingExperience.message}</p>}
                  </div>

                  {/* Vehicle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Vehicle Type</label>
                    <div className="relative">
                      <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                      <select
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                        {...register("vehicle")}
                      >
                        <option value="None">No vehicle (use public transport)</option>
                        <option value="Two-Wheeler">Bike / Two-Wheeler</option>
                        <option value="Four-Wheeler">Car / SUV (Four-Wheeler)</option>
                        <option value="RV/Camper">Caravan / RV / Campervan</option>
                      </select>
                    </div>
                    {errors.vehicle && <p className="text-xs text-destructive font-medium pl-1">{errors.vehicle.message}</p>}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Short Bio (min. 5 chars)</label>
                  <div className="relative">
                    <Info className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <textarea
                      placeholder="Share a little bit about your love for the outdoors, preferred terrains, or favorite camping gear..."
                      rows={3}
                      className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      {...register("bio")}
                    />
                  </div>
                  {errors.bio && <p className="text-xs text-destructive font-medium pl-1">{errors.bio.message}</p>}
                </div>

                {/* Back / Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t border-border/30 mt-6">
                  <Button type="button" variant="outline" className="w-1/2 justify-center" onClick={prevStep} disabled={isSubmitting}>
                    <ArrowLeft className="h-4.5 w-4.5 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="w-1/2 justify-center" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </div>
            )}

          </form>
        )}

        {/* Redirect footnote */}
        {!isSuccess && (
          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in instead
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
