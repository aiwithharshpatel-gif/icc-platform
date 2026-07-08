"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  MapPin,
  Phone,
  Globe,
  Flame,
  Car,
  Info,
  LogOut,
  Edit2,
  Check,
  ShieldCheck,
  CheckCircle,
  X,
  Link as LinkIcon,
  Image as ImageIcon,
  Trophy,
  Compass,
  Camera,
  Plus,
  Trash2,
  Tent,
} from "lucide-react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
import { profileUpdateSchema, type ProfileUpdateInput } from "@/lib/validators";
import { updateProfileAction, signOutAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/ui/file-uploader";

interface ProfileViewProps {
  initialProfile: ProfileUpdateInput;
  email: string;
}

const availableAchievements = [
  { id: "monsoon", title: "Monsoon Master", description: "Completed 5+ treks in peak monsoon season.", icon: "🌧️" },
  { id: "eco", title: "Eco-Warrior", description: "Participated in 3+ mountain cleanups.", icon: "🌱" },
  { id: "safety", title: "First Responder", description: "Wilderness first-aid certified ranger.", icon: "🩹" },
  { id: "summit", title: "Summit Climber", description: "Scales passes above 12,000 feet.", icon: "🏔️" },
  { id: "camp", title: "Camp Veteran", description: "Logged 20+ nights under canvas.", icon: "⛺" },
];

export function ProfileView({ initialProfile, email }: ProfileViewProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<ProfileUpdateInput>(initialProfile);
  const [newGalleryImage, setNewGalleryImage] = React.useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialProfile,
  });

  const avatarUrlValue = watch("avatarUrl");
  const coverPhotoUrlValue = watch("coverPhotoUrl");
  const galleryValue = watch("gallery") || [];
  const achievementsValue = watch("achievements") || [];

  const handleAddGalleryImage = (url: string) => {
    if (!url) return;
    setValue("gallery", [...galleryValue, url], { shouldValidate: true });
    setNewGalleryImage("");
  };

  const handleRemoveGalleryImage = (index: number) => {
    setValue("gallery", galleryValue.filter((_, idx) => idx !== index), { shouldValidate: true });
  };

  const handleToggleAchievement = (title: string) => {
    if (achievementsValue.includes(title)) {
      setValue("achievements", achievementsValue.filter((t) => t !== title), { shouldValidate: true });
    } else {
      setValue("achievements", [...achievementsValue, title], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: ProfileUpdateInput) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const result = await updateProfileAction(data);

    if (result?.error) {
      setErrorMessage(result.error);
    } else {
      setProfile(data);
      setSuccessMessage("Your profile has been successfully updated!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const handleCancel = () => {
    reset(profile);
    setIsEditing(false);
    setErrorMessage(null);
  };

  // Setup experience details
  const getExperienceDetails = (level: string): {
    title: string;
    color: "default" | "secondary" | "accent" | "outline" | "success";
    description: string;
  } => {
    switch (level) {
      case "Expert":
        return {
          title: "Mountain Guide",
          color: "accent",
          description: "Organizes expeditions, guides rookies, and masters off-trail routes.",
        };
      case "Intermediate":
        return {
          title: "Wild Trekker",
          color: "success",
          description: "Comfortable pitching multi-season tents, understands high altitude trekking.",
        };
      default:
        return {
          title: "Camp Greenhorn",
          color: "secondary",
          description: "Exploring the wilderness, joining community-led beginner trips.",
        };
    }
  };

  const exp = getExperienceDetails(profile.campingExperience);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Success banner */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl mb-6 flex items-start gap-3 text-xs text-emerald-800 dark:text-emerald-400 font-medium max-w-5xl mx-auto animate-fade-in shadow-sm">
          <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error banner */}
      {errorMessage && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6 flex items-start gap-3 text-xs text-destructive font-medium max-w-5xl mx-auto animate-fade-in shadow-sm">
          <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-destructive" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Cover Photo Banner */}
      <div className="max-w-5xl mx-auto w-full h-48 sm:h-72 rounded-2xl overflow-hidden bg-muted relative mb-8 group border border-border/40 shadow-sm">
        {profile.coverPhotoUrl ? (
          <img src={profile.coverPhotoUrl} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 flex items-center justify-center">
            <span className="text-white/15 font-black text-2xl sm:text-4xl tracking-widest uppercase font-display select-none">Indian Camping Community</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Left column: User Overview Badge */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <Card glass className="border-border/60">
            <CardContent className="pt-8 text-center flex flex-col items-center">
              {/* Profile image placeholder */}
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md bg-muted flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <h2 className="text-xl font-bold mt-4 tracking-tight">{profile.name}</h2>
              <p className="text-xs text-muted-foreground">{email}</p>

              {/* Camper badge */}
              <div className="mt-4 flex flex-col items-center">
                <Badge variant={exp.color} className="text-[10px] py-1 px-3 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <Flame className="h-3 w-3 fill-current" />
                  {exp.title}
                </Badge>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed px-4">
                  {exp.description}
                </p>
              </div>

              {/* Metadata tags */}
              <div className="w-full border-t border-border/40 mt-6 pt-4 space-y-3 text-xs text-left">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {profile.city}, {profile.state}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                
                {/* Social links */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/20 mt-2">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`}</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <TwitterIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.twitter.startsWith("@") ? profile.twitter : `@${profile.twitter}`}</span>
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <GithubIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.github}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{profile.website.replace(/(^\w+:|^)\/\//, "")}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t border-border/20">
                  <Car className="h-4 w-4 text-primary shrink-0" />
                  <span>Vehicle: <strong className="text-foreground">{profile.vehicle}</strong></span>
                </div>
              </div>

              {/* Sign out */}
              <form action={signOutAction} className="w-full mt-6 pt-4 border-t border-border/40">
                <Button type="submit" variant="ghost" className="w-full justify-center text-xs text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Details and edits */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/60">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">Camper Profile Details</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your details for camping registrations.</p>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-xs font-semibold">
                  <Edit2 className="h-3.5 w-3.5 mr-1.5" />
                  Edit Profile
                </Button>
              )}
            </CardHeader>

            <CardContent className="pt-6">
              {!isEditing ? (
                /* Profile view mode */
                <div className="space-y-6 text-sm">
                  {/* Bio */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="h-4 w-4 text-primary" />
                      About Me
                    </h4>
                    <p className="text-foreground bg-muted/20 p-4 rounded-xl border border-border/40 leading-relaxed font-sans">
                      {profile.bio || "No biography provided yet. Add one to introduce yourself to the community!"}
                    </p>
                  </div>

                  {/* Stats panel */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/30">
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Trips Joined</p>
                      <p className="text-2xl font-extrabold mt-1 text-primary">{profile.tripsJoined || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Events Org.</p>
                      <p className="text-2xl font-extrabold mt-1 text-primary">{profile.eventsOrganized || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Followers</p>
                      <p className="text-2xl font-extrabold mt-1 text-primary">0</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Following</p>
                      <p className="text-2xl font-extrabold mt-1 text-primary">0</p>
                    </div>
                  </div>

                  {/* Achievements Section */}
                  <div className="pt-4 border-t border-border/30">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Trophy className="h-4 w-4 text-amber-500" />
                      Community Achievements
                    </h4>
                    {profile.achievements && profile.achievements.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {availableAchievements.filter(a => profile.achievements.includes(a.title)).map((ach) => (
                          <div key={ach.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                            <span className="text-2xl">{ach.icon}</span>
                            <div>
                              <p className="text-xs font-bold text-foreground">{ach.title}</p>
                              <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{ach.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-2 italic">No badges earned or selected yet.</p>
                    )}
                  </div>

                  {/* Gallery Section */}
                  <div className="pt-4 border-t border-border/30">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <ImageIcon className="h-4 w-4 text-primary" />
                      Wilderness Gallery
                    </h4>
                    {profile.gallery && profile.gallery.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {profile.gallery.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40 bg-muted">
                            <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-355 group-hover:scale-105" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-2 italic">Gallery is empty. Upload some epic photos from your trails!</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Profile edit mode */
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  
                  {/* Cover Photo Upload */}
                  <div className="space-y-1.5 border-b border-border/30 pb-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Camera className="h-4 w-4" /> Cover Photo Banner
                    </label>
                    <FileUploader
                      bucketName="cover_photos"
                      value={coverPhotoUrlValue}
                      onUploadComplete={(url) => setValue("coverPhotoUrl", url, { shouldValidate: true })}
                    />
                    {errors.coverPhotoUrl && <p className="text-xs text-destructive">{errors.coverPhotoUrl.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("name")}
                      />
                      {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("phone")}
                      />
                      {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
                    </div>

                    {/* City */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("city")}
                      />
                      {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                    </div>

                    {/* State */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State</label>
                      <input
                        type="text"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("state")}
                      />
                      {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                    </div>

                    {/* Avatar Upload */}
                    <div className="space-y-1.5 sm:col-span-2 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Profile Picture</label>
                      <FileUploader
                        bucketName="avatars"
                        value={avatarUrlValue}
                        onUploadComplete={(url) => setValue("avatarUrl", url, { shouldValidate: true })}
                      />
                      {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
                    </div>

                    {/* Instagram */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Instagram Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("instagram")}
                      />
                      {errors.instagram && <p className="text-xs text-destructive">{errors.instagram.message}</p>}
                    </div>

                    {/* Twitter */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Twitter Handle</label>
                      <input
                        type="text"
                        placeholder="@username"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("twitter")}
                      />
                      {errors.twitter && <p className="text-xs text-destructive">{errors.twitter.message}</p>}
                    </div>

                    {/* GitHub */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">GitHub Username</label>
                      <input
                        type="text"
                        placeholder="username"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("github")}
                      />
                      {errors.github && <p className="text-xs text-destructive">{errors.github.message}</p>}
                    </div>

                    {/* Website */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Personal Website</label>
                      <input
                        type="text"
                        placeholder="https://example.com"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("website")}
                      />
                      {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                    </div>

                    {/* Experience selection */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Camping Experience</label>
                      <select
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                        disabled={isSubmitting}
                        {...register("campingExperience")}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      {errors.campingExperience && <p className="text-xs text-destructive">{errors.campingExperience.message}</p>}
                    </div>

                    {/* Vehicle selection */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vehicle Type</label>
                      <select
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
                        disabled={isSubmitting}
                        {...register("vehicle")}
                      >
                        <option value="None">None</option>
                        <option value="Two-Wheeler">Two-Wheeler</option>
                        <option value="Four-Wheeler">Four-Wheeler</option>
                        <option value="RV/Camper">RV/Camper</option>
                      </select>
                      {errors.vehicle && <p className="text-xs text-destructive">{errors.vehicle.message}</p>}
                    </div>

                    {/* Trips Joined */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trips Joined</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("tripsJoined", { valueAsNumber: true })}
                      />
                      {errors.tripsJoined && <p className="text-xs text-destructive">{errors.tripsJoined.message}</p>}
                    </div>

                    {/* Events Organized */}
                    <div className="space-y-1.5 border-t border-border/20 pt-3">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Events Organized</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                        {...register("eventsOrganized", { valueAsNumber: true })}
                      />
                      {errors.eventsOrganized && <p className="text-xs text-destructive">{errors.eventsOrganized.message}</p>}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5 border-t border-border/20 pt-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Biography</label>
                    <textarea
                      rows={3}
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      disabled={isSubmitting}
                      {...register("bio")}
                    />
                    {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
                  </div>

                  {/* Achievements checklist in Edit Mode */}
                  <div className="space-y-2 border-t border-border/30 pt-4 mt-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-amber-500" /> Community Achievements
                    </label>
                    <p className="text-[10px] text-muted-foreground">Select the badges you have earned or want to feature on your profile:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {availableAchievements.map((ach) => {
                        const isChecked = achievementsValue.includes(ach.title);
                        return (
                          <button
                            type="button"
                            key={ach.id}
                            onClick={() => handleToggleAchievement(ach.title)}
                            className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                              isChecked
                                ? "bg-primary/5 border-primary shadow-sm"
                                : "bg-muted/10 border-border/50 hover:bg-muted/20"
                            }`}
                          >
                            <span className="text-2xl mt-0.5">{ach.icon}</span>
                            <div>
                              <p className="text-xs font-bold">{ach.title}</p>
                              <p className="text-[9px] text-muted-foreground mt-0.5 leading-normal">{ach.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Gallery Manager in Edit Mode */}
                  <div className="space-y-3 border-t border-border/30 pt-4 mt-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4" /> Manage Gallery ({galleryValue.length})
                    </label>
                    
                    {/* Add new image section */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste an image URL here..."
                        className="flex-grow bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        value={newGalleryImage}
                        onChange={(e) => setNewGalleryImage(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="font-bold flex items-center gap-1.5 shrink-0"
                        onClick={() => {
                          if (newGalleryImage.trim()) {
                            handleAddGalleryImage(newGalleryImage.trim());
                          }
                        }}
                      >
                        <Plus className="h-4 w-4" /> Add URL
                      </Button>
                    </div>
                    
                    {/* File Upload to Gallery */}
                    <div className="mt-1.5">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Or upload directly:</p>
                      <FileUploader
                        bucketName="gallery"
                        onUploadComplete={(url) => {
                          if (url) {
                            handleAddGalleryImage(url);
                          }
                        }}
                      />
                    </div>

                    {/* Display/Delete current gallery images */}
                    {galleryValue.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                        {galleryValue.map((url: string, index: number) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border/60 group">
                            <img src={url} alt="Gallery thumbnail" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/80"
                              onClick={() => handleRemoveGalleryImage(index)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-3 border-t border-border/30">
                    <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                      <Check className="h-4 w-4 mr-1" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
