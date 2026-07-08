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
      title: "Camp Roxx",
      location: "Kangojodi, Himachal Pradesh",
      price: 2200,
      rating: 4.8,
      reviews_count: 248,
      terrain: "Forest",
      tags: ["Forest", "Adventure", "Zip-lining"],
      image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80",
      description: "Nestled inside a private 1,700-acre pine forest near Nahan. Features alpine cabin tents, nature trails, rock climbing, and zip-lining over pure mountain streams.",
      amenities: ["Cabin Tents", "Running Water", "First Aid", "Adventure Sports", "Bonfire Pit"],
      gallery: [
        "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Nahan",
      latitude: 30.62,
      longitude: 77.30,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Good (Jio / Airtel)",
      difficulty: "Beginner" as const,
      best_season: "Mar - Nov",
      nearby_attractions: ["Renuka Lake", "Jaitak Fort", "Suketi Fossil Park"],
      reviews: [
        { id: "rev-11", name: "Aarav Mehta", rating: 5, comment: "Fabulous pine forest setting. The zip-lining adventure was super fun!", date: "2026-06-12" },
        { id: "rev-12", name: "Sneha G.", rating: 4, comment: "Great weekend gateway. Tents are clean and staff is friendly.", date: "2026-05-30" }
      ],
      altitude: 1250,
      state: "Himachal Pradesh",
    },
    {
      id: "cs-2",
      title: "Winds Desert Camp",
      location: "Sam Sand Dunes, Jaisalmer",
      price: 4500,
      rating: 4.9,
      reviews_count: 312,
      terrain: "Desert",
      tags: ["Desert", "Cultural Show", "Camel Safari"],
      image_url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80",
      description: "Experience royal Rajasthani hospitality at Kanoi near Sam Sand Dunes. Luxury Swiss tents with attached bathrooms, camel safaris, and evening folk performances under Thar's starry skies.",
      amenities: ["Attached Bath", "Swiss Luxury Tents", "Rajasthani Buffet", "Cultural Show", "Stargazing"],
      gallery: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Sam+Sand+Dunes",
      latitude: 26.89,
      longitude: 70.70,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Moderate (Airtel & BSNL)",
      difficulty: "Beginner" as const,
      best_season: "Oct - Mar",
      nearby_attractions: ["Jaisalmer Fort", "Sam Desert Safari", "Kuldhara Abandoned Village"],
      reviews: [
        { id: "rev-21", name: "Isha Sharma", rating: 5, comment: "Beautiful luxury tents. The cultural dance session was the highlight of our trip.", date: "2026-06-25" },
        { id: "rev-22", name: "Rahul K.", rating: 4, comment: "Excellent desert hospitality. The stargazing here is breathtaking.", date: "2026-06-14" }
      ],
      altitude: 220,
      state: "Rajasthan",
    },
    {
      id: "cs-3",
      title: "Pawna Lake Camping",
      location: "Thakursai, Lonavala",
      price: 1500,
      rating: 4.7,
      reviews_count: 512,
      terrain: "Lakeside",
      tags: ["Lakeside", "Bonfire & DJ", "Kayaking"],
      image_url: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=800&q=80",
      description: "Relax by the calm waters of Pawna Lake in Thakursai. Offers dome tents, delicious local Maharashtrian barbecue, acoustic music nights, and scenic views of Tikona Fort.",
      amenities: ["Lakeside Tents", "Barbecue", "DJ Night", "Toilets", "Charging Points"],
      gallery: [
        "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Pawna+Lake",
      latitude: 18.72,
      longitude: 73.48,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Excellent (All Networks)",
      difficulty: "Beginner" as const,
      best_season: "Jun - Mar",
      nearby_attractions: ["Tikona Fort", "Lohagad Fort", "Kamshet Paragliding Point"],
      reviews: [
        { id: "rev-31", name: "Vikram Patil", rating: 5, comment: "Lakeside view is amazing. Tents are clean and the local food was great.", date: "2026-06-20" }
      ],
      altitude: 600,
      state: "Maharashtra",
    },
    {
      id: "cs-4",
      title: "Shivpuri Riverside Camp",
      location: "Shivpuri, Rishikesh",
      price: 1800,
      rating: 4.8,
      reviews_count: 420,
      terrain: "Riverside",
      tags: ["Riverside", "Rafting", "Bonfire"],
      image_url: "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=800&q=80",
      description: "Located on the sandy banks of the Ganges in Shivpuri. Wake up to the roar of river rapids, enjoy beach volleyball, and set off on world-class white water rafting expeditions.",
      amenities: ["Dome Tents", "Rafting Access", "Volleyball Court", "First Aid", "Clean Washrooms"],
      gallery: [
        "https://images.unsplash.com/photo-1496080174650-637e3f22fa03?auto=format&fit=crop&w=600&q=80"
      ],
      map_url: "https://maps.google.com/?q=Shivpuri+Rishikesh",
      latitude: 30.15,
      longitude: 78.39,
      has_water: true,
      has_washroom: true,
      has_parking: true,
      network_details: "Excellent (4G Connected)",
      difficulty: "Beginner" as const,
      best_season: "Oct - May",
      nearby_attractions: ["Neer Garh Waterfall", "Vashishta Cave", "Ram Jhula"],
      reviews: [
        { id: "rev-41", name: "Meera Nair", rating: 5, comment: "Perfect beach camp experience. The rafting from Shivpuri is a must try!", date: "2026-06-18" }
      ],
      altitude: 430,
      state: "Uttarakhand",
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
