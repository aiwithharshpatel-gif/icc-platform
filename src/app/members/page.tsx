import { createClient } from "@/lib/supabase/server";
import { MembersView } from "./members-view";
import type { Metadata } from "next";

interface DBFollow {
  follower_id: string;
  following_id: string;
}

interface DBMember {
  id: string;
  name?: string;
  avatar_url?: string;
  cover_photo_url?: string;
  city?: string;
  state?: string;
  camping_experience?: string;
  bio?: string;
  instagram?: string;
  twitter?: string;
  github?: string;
  website?: string;
  gallery?: string[];
  achievements?: string[];
  trips_joined?: number | string;
  events_organized?: number | string;
}

export const metadata: Metadata = {
  title: "ICC Members Directory | Connect with Fellow Campers & Guides",
  description:
    "Browse and connect with verified guides, trek leaders, and outdoor enthusiasts in the Indian Camping Community. Find co-campers and follow their journeys.",
  keywords: ["campsites India", "outdoor community", "trek leaders", "campers network"],
};

export default async function MembersPage() {
  const supabase = await createClient();

  // Load members from PostgreSQL
  const { data: dbMembers } = await supabase
    .from("profiles")
    .select("*")
    .order("name", { ascending: true });

  // Load all follow connections to compute follower stats dynamically
  const { data: dbFollows } = await supabase
    .from("follows")
    .select("*");

  const followersMap: Record<string, number> = {};
  const followingMap: Record<string, number> = {};

  if (dbFollows) {
    dbFollows.forEach((f: DBFollow) => {
      followersMap[f.following_id] = (followersMap[f.following_id] || 0) + 1;
      followingMap[f.follower_id] = (followingMap[f.follower_id] || 0) + 1;
    });
  }

  // Pre-configured mock members as high-quality seed fallbacks if database table is empty or offline
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

  // Map database profiles to structured objects
  const members = dbMembers && dbMembers.length > 0
    ? dbMembers.map((m: DBMember) => ({
        id: m.id,
        name: m.name || "Anonymous Camper",
        avatar_url: m.avatar_url || "",
        cover_photo_url: m.cover_photo_url || "",
        city: m.city || "",
        state: m.state || "",
        camping_experience: m.camping_experience || "Beginner",
        bio: m.bio || "",
        instagram: m.instagram || "",
        twitter: m.twitter || "",
        github: m.github || "",
        website: m.website || "",
        gallery: m.gallery || [],
        achievements: m.achievements || [],
        trips_joined: Number(m.trips_joined || 0),
        events_organized: Number(m.events_organized || 0),
        followerCount: followersMap[m.id] || 0,
        followingCount: followingMap[m.id] || 0,
      }))
    : fallbackMembers;

  return <MembersView initialMembers={members} />;
}
