import { createClient } from "@/lib/supabase/server";
import { CampsitesView } from "./campsites-view";
import type { Metadata } from "next";

interface DBCampsiteReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface DBCampsite {
  id: string;
  title: string;
  location: string;
  price: string | number;
  rating?: string | number;
  reviews_count?: string | number;
  terrain: string;
  tags?: string[];
  image_url: string;
  description: string;
  amenities?: string[];
  gallery?: string[];
  map_url?: string;
  latitude?: number;
  longitude?: number;
  has_water?: boolean;
  has_washroom?: boolean;
  has_parking?: boolean;
  network_details?: string;
  difficulty?: string;
  best_season?: string;
  nearby_attractions?: string[];
  reviews?: DBCampsiteReview[];
  altitude?: number;
  state?: string;
}

export const metadata: Metadata = {
  title: "ICC Campsite Directory | Explore & Reserve Wilderness Spots",
  description:
    "Browse vetted campsites across India. Search by state, altitude range, and terrain type (Riverside, Forest, Mountains, Lakes). View real-time availability and amenities.",
  keywords: ["campsites India", "riverside camp Rishikesh", "alpine camping Kasol", "Pawna lake Lonavala"],
};

export default async function CampsitesPage() {
  const supabase = await createClient();

  // Load campsites dynamically from PostgreSQL
  const { data: dbCampsites } = await supabase
    .from("campsites")
    .select("*")
    .order("rating", { ascending: false });

  // Fallbacks mapping all required columns
  const fallbackCampsites = [
    {
      id: "cs-1",
      title: "Riverfront Meadows",
      location: "Rishikesh, Uttarakhand",
      price: 1500,
      rating: 4.9,
      reviews_count: 88,
      terrain: "Riverside",
      tags: ["Riverside", "Beach Access", "Rafting", "WiFi"],
      image_url: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=80",
      description: "Nestled directly beside the sacred Ganga, this campsite offers quiet private sand-beach access, dome tents with air-beds, and bonfire woodfire dinners under the stars.",
      amenities: ["Clean Washrooms", "Campfires Allowed", "Mobile Network", "Hot Showers"],
      gallery: [
        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Rishikesh",
      latitude: 30.13,
      longitude: 78.32,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Good (Jio / Airtel)",
      difficulty: "Beginner" as const,
      best_season: "Oct - May",
      nearby_attractions: ["Neer Garh Waterfall", "Laxman Jhula", "Beatles Ashram"],
      reviews: [
        { id: "rev-11", name: "Aarav Mehta", rating: 5, comment: "Fabulous sound of the river at night. Extremely clean bathrooms!", date: "2026-06-12" },
        { id: "rev-12", name: "Sneha G.", rating: 4, comment: "Great location. Rafting pickup point is very close.", date: "2026-05-30" }
      ],
      altitude: 370,
      state: "Uttarakhand",
    },
    {
      id: "cs-2",
      title: "Pine Woods Sanctuary",
      location: "Kasol, Himachal Pradesh",
      price: 1200,
      rating: 4.8,
      reviews_count: 124,
      terrain: "Forest",
      tags: ["Forest", "Alpine", "Valley View", "Pet Friendly"],
      image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      description: "Camp under towering pines in the Parvati Valley. Close to the Kheerganga hiking base camp, featuring cozy double-layered canvas tents and a local cafe.",
      amenities: ["Cafe Access", "Pet Friendly", "Trek Guides Available", "Charging Sockets"],
      gallery: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Kasol",
      latitude: 32.01,
      longitude: 77.31,
      has_water: true,
      has_washroom: true,
      has_parking: false,
      network_details: "Spotty (Airtel only)",
      difficulty: "Intermediate" as const,
      best_season: "Apr - Nov",
      nearby_attractions: ["Kheerganga Trek", "Chalal Village", "Manikaran Sahib Hot Springs"],
      reviews: [
        { id: "rev-21", name: "Isha Sharma", rating: 5, comment: "Incredible camp under the pine tree shadow. Extremely peacefull.", date: "2026-06-25" },
        { id: "rev-22", name: "Rahul K.", rating: 4, comment: "Staff is helpful. Bring warm clothes as it gets cold at night.", date: "2026-06-14" }
      ],
      altitude: 1580,
      state: "Himachal Pradesh",
    },
    {
      id: "cs-3",
      title: "Sahyadri Ridge Camp",
      location: "Lonavala, Maharashtra",
      price: 1800,
      rating: 4.7,
      reviews_count: 65,
      terrain: "Mountains",
      tags: ["Mountain Ridge", "Monsoon Hike", "Stargazing"],
      image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
      description: "Experience panoramic ridge views of the Western Ghats. Perfect for monsoon mist sightings, weekend stargazing sessions, and quick weekend escapes.",
      amenities: ["First-Aid Station", "Stargazing Telescopes", "Vehicle Parking", "Kitchenette"],
      gallery: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Lonavala",
      latitude: 18.75,
      longitude: 73.40,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Excellent (All Networks)",
      difficulty: "Beginner" as const,
      best_season: "Jun - Mar",
      nearby_attractions: ["Tikona Fort", "Pawna Lake Dam", "Karla Buddhist Caves"],
      reviews: [
        { id: "rev-31", name: "Vikram Patil", rating: 5, comment: "Monsoon mist views are unmatched. Food was local and delicious.", date: "2026-06-20" }
      ],
      altitude: 620,
      state: "Maharashtra",
    },
    {
      id: "cs-4",
      title: "Anayirangal Lake Camp",
      location: "Munnar, Kerala",
      price: 2000,
      rating: 4.9,
      reviews_count: 42,
      terrain: "Lake",
      tags: ["Lakeside", "Tea Gardens", "Boating", "Bird Watching"],
      image_url: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=800&q=80",
      description: "Situated overlooking the Anayirangal Lake, this campsite is surrounded by lush green tea gardens. Perfect for peaceful stargazing and bird watching.",
      amenities: ["Attached Washrooms", "Boating Access", "Power Outlets", "Campfire Gear"],
      gallery: [
        "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Munnar",
      latitude: 10.02,
      longitude: 77.16,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Moderate (Jio only)",
      difficulty: "Beginner" as const,
      best_season: "Sep - May",
      nearby_attractions: ["Anayirangal Dam", "Kolukkumalai Tea Estate", "Lockhart Gap Viewpoint"],
      reviews: [
        { id: "rev-41", name: "Meera Nair", rating: 5, comment: "Beautiful location surrounded by tea valleys. Absolute serene experience.", date: "2026-06-18" }
      ],
      altitude: 1600,
      state: "Kerala",
    }
  ];

  // Map database campsites to match directory attributes
  const campsites = dbCampsites && dbCampsites.length > 0
    ? dbCampsites.map((item: DBCampsite) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        price: Number(item.price),
        rating: Number(item.rating || 5.0),
        reviews_count: Number(item.reviews_count || 0),
        terrain: item.terrain,
        tags: item.tags || [],
        image_url: item.image_url,
        description: item.description,
        amenities: item.amenities || [],
        gallery: item.gallery || [item.image_url].filter(Boolean),
        map_url: item.map_url || "",
        latitude: Number(item.latitude || 20.0),
        longitude: Number(item.longitude || 75.0),
        has_water: item.has_water !== false,
        has_washroom: item.has_washroom !== false,
        has_parking: item.has_parking !== false,
        network_details: item.network_details || "Available",
        difficulty: (item.difficulty || "Beginner") as "Beginner" | "Intermediate" | "Challenging",
        best_season: item.best_season || "Oct - May",
        nearby_attractions: item.nearby_attractions || [],
        reviews: item.reviews || [],
        altitude: Number(item.altitude || 500),
        state: item.state || "Maharashtra",
      }))
    : fallbackCampsites;

  return <CampsitesView initialCampsites={campsites} />;
}
