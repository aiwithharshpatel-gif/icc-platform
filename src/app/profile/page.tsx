import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "./profile-view";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch PostgreSQL profile
  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Consolidate profile fields with safe user metadata fallbacks
  const profile = {
    name: dbProfile?.name || user.user_metadata?.full_name || "",
    avatarUrl: dbProfile?.avatar_url || user.user_metadata?.avatar_url || "",
    coverPhotoUrl: dbProfile?.cover_photo_url || user.user_metadata?.cover_photo_url || "",
    city: dbProfile?.city || user.user_metadata?.city || "",
    state: dbProfile?.state || user.user_metadata?.state || "",
    phone: dbProfile?.phone || user.user_metadata?.phone || "",
    instagram: dbProfile?.instagram || user.user_metadata?.instagram || "",
    twitter: dbProfile?.twitter || user.user_metadata?.twitter || "",
    github: dbProfile?.github || user.user_metadata?.github || "",
    website: dbProfile?.website || user.user_metadata?.website || "",
    campingExperience: (dbProfile?.camping_experience || user.user_metadata?.camping_experience || "Beginner") as "Beginner" | "Intermediate" | "Expert",
    vehicle: (dbProfile?.vehicle || user.user_metadata?.vehicle || "None") as "None" | "Two-Wheeler" | "Four-Wheeler" | "RV/Camper",
    bio: dbProfile?.bio || user.user_metadata?.bio || "",
    gallery: dbProfile?.gallery || user.user_metadata?.gallery || [],
    achievements: dbProfile?.achievements || user.user_metadata?.achievements || [],
    tripsJoined: dbProfile?.trips_joined !== undefined ? Number(dbProfile.trips_joined) : (user.user_metadata?.trips_joined !== undefined ? Number(user.user_metadata.trips_joined) : 0),
    eventsOrganized: dbProfile?.events_organized !== undefined ? Number(dbProfile.events_organized) : (user.user_metadata?.events_organized !== undefined ? Number(user.user_metadata.events_organized) : 0),
  };

  return <ProfileView initialProfile={profile} email={user.email || ""} />;
}
