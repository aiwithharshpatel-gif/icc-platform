import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MemberProfileView } from "./member-profile-view";
import type { Metadata } from "next";

interface MemberProps {
  params: Promise<{ id: string }>;
}

const fallbackMembers = [
  {
    id: "m-1",
    name: "Sameer Joshi",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    cover_photo_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    city: "Pune",
    state: "Maharashtra",
    camping_experience: "Expert",
    bio: "Western Ghats Specialist & Wilderness Instructor. Love organizing monsoon valley treks and teaching outdoor survival skills to beginners.",
    instagram: "sameer_joshi_treks",
    twitter: "sameertreks",
    github: "sameer-outdoors",
    website: "https://sameerjoshi.com",
    gallery: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80"
    ],
    achievements: ["Monsoon Master", "First Responder", "Summit Climber"],
    trips_joined: 42,
    events_organized: 18,
    followerCount: 154,
    followingCount: 88,
  },
  {
    id: "m-2",
    name: "Sneha Hegde",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    cover_photo_url: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=800&q=80",
    city: "Gokarna",
    state: "Karnataka",
    camping_experience: "Expert",
    bio: "Kayaking Instructor & Naturalist. Pitching tents on secluded beaches is my therapy. Join me for bio-luminescence spotting and mangrove tours.",
    instagram: "sneha_hegde_wild",
    twitter: "",
    github: "",
    website: "",
    gallery: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
    ],
    achievements: ["First Responder", "Eco-Warrior"],
    trips_joined: 28,
    events_organized: 12,
    followerCount: 98,
    followingCount: 45,
  },
  {
    id: "m-3",
    name: "Rohan Deshmukh",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    cover_photo_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
    city: "Mumbai",
    state: "Maharashtra",
    camping_experience: "Intermediate",
    bio: "Outdoor enthusiast. Scaling waterfalls and exploring off-track routes is my passion. Certified first-aid lead.",
    instagram: "rohan_deshmukh_outdoors",
    twitter: "rohand_tweets",
    github: "rohan-code-wild",
    website: "",
    gallery: [],
    achievements: ["Monsoon Master", "Camp Veteran"],
    trips_joined: 19,
    events_organized: 4,
    followerCount: 64,
    followingCount: 52,
  },
  {
    id: "m-4",
    name: "Priya Nair",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    cover_photo_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
    city: "Bengaluru",
    state: "Karnataka",
    camping_experience: "Intermediate",
    bio: "Software developer by weekday, wild camper by weekend. Constantly searching for the perfect starry night and mountain peak.",
    instagram: "priya_stargazing",
    twitter: "",
    github: "priya-dev",
    website: "https://priyanair.dev",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
    ],
    achievements: ["Eco-Warrior", "Camp Veteran"],
    trips_joined: 15,
    events_organized: 2,
    followerCount: 76,
    followingCount: 94,
  }
];

export async function generateMetadata({ params }: MemberProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("name, bio")
    .eq("id", id)
    .single();

  const fallback = fallbackMembers.find((m) => m.id === id);
  const name = dbProfile?.name || fallback?.name || "Camper Profile";
  const bio = dbProfile?.bio || fallback?.bio || "Member of the Indian Camping Community.";

  return {
    title: `${name} | ICC Member Profile`,
    description: bio.slice(0, 155),
  };
}

export default async function MemberProfilePage({ params }: MemberProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If viewing own profile, redirect to `/profile` to allow edits
  if (user && user.id === id) {
    redirect("/profile");
  }

  // Load target member's profile
  const { data: dbProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  // Check if current user is following this member
  let isFollowing = false;
  if (user) {
    const { data: followRecord } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", id)
      .single();

    if (followRecord) {
      isFollowing = true;
    }
  }

  // Count followers and following
  const { data: followers } = await supabase
    .from("follows")
    .select("*")
    .eq("following_id", id);

  const { data: following } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", id);

  const followerCount = followers?.length || 0;
  const followingCount = following?.length || 0;

  const fallback = fallbackMembers.find((m) => m.id === id);

  if (!dbProfile && !fallback) {
    redirect("/members");
  }

  // Reconcile profile
  const profile = dbProfile
    ? {
        id: dbProfile.id,
        name: dbProfile.name || "Anonymous Camper",
        avatarUrl: dbProfile.avatar_url || "",
        coverPhotoUrl: dbProfile.cover_photo_url || "",
        city: dbProfile.city || "",
        state: dbProfile.state || "",
        phone: dbProfile.phone || "",
        instagram: dbProfile.instagram || "",
        twitter: dbProfile.twitter || "",
        github: dbProfile.github || "",
        website: dbProfile.website || "",
        campingExperience: dbProfile.camping_experience || "Beginner",
        vehicle: dbProfile.vehicle || "None",
        bio: dbProfile.bio || "",
        gallery: dbProfile.gallery || [],
        achievements: dbProfile.achievements || [],
        tripsJoined: Number(dbProfile.trips_joined || 0),
        eventsOrganized: Number(dbProfile.events_organized || 0),
      }
    : {
        id: fallback!.id,
        name: fallback!.name,
        avatarUrl: fallback!.avatar_url,
        coverPhotoUrl: fallback!.cover_photo_url,
        city: fallback!.city,
        state: fallback!.state,
        phone: "",
        instagram: fallback!.instagram,
        twitter: fallback!.twitter,
        github: fallback!.github,
        website: fallback!.website,
        campingExperience: fallback!.camping_experience as "Beginner" | "Intermediate" | "Expert",
        vehicle: "None" as const,
        bio: fallback!.bio,
        gallery: fallback!.gallery,
        achievements: fallback!.achievements,
        tripsJoined: fallback!.trips_joined,
        eventsOrganized: fallback!.events_organized,
      };

  const finalFollowerCount = dbProfile ? followerCount : (fallback!.followerCount + (isFollowing ? 1 : 0));
  const finalFollowingCount = dbProfile ? followingCount : fallback!.followingCount;

  return (
    <MemberProfileView
      profile={profile}
      isFollowing={isFollowing}
      followerCount={finalFollowerCount}
      followingCount={finalFollowingCount}
      currentUserId={user?.id || null}
    />
  );
}
