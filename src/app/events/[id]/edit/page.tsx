import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditEventForm } from "./edit-event-form";

interface EditPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ duplicate?: string }>;
}

const fallbackEvents = [
  {
    id: "ev-1",
    title: "Monsoon Valley Trek",
    location: "Bhimashankar, Maharashtra",
    google_map_url: "https://maps.google.com/?q=Bhimashankar+Wildlife+Sanctuary",
    date: "July 18 - 19, 2026",
    price: 2400,
    guide: "Rohan Deshmukh",
    guide_title: "Certified Wilderness Guide",
    capacity: 15,
    availability: "10 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    description: "Trek through misty green routes, scaling waterfalls and dense forests of Bhimashankar. Perfect weekend getaway during peak Maharashtra monsoon.",
    difficulty: "Moderate" as const,
    camping_type: "Forest",
    checklist: ["Raincoat/Poncho", "Trekking Shoes", "Water Bottle 2L", "Dry-fit clothes"],
    photos: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-3",
  },
  {
    id: "ev-2",
    title: "Starry Nights over Hampta",
    location: "Manali, Himachal Pradesh",
    google_map_url: "https://maps.google.com/?q=Hampta+Pass",
    date: "Aug 02 - 07, 2026",
    price: 9500,
    guide: "Amit Thakur",
    guide_title: "Himalayan Search & Rescue Officer",
    capacity: 10,
    availability: "6 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "A high-altitude transition trek crossing the lush green valleys of Kullu into the desert landscapes of Lahaul. Stargazing at Balu ka Ghera included.",
    difficulty: "Challenging" as const,
    camping_type: "Mountain",
    checklist: ["Warm Jacket (-5C)", "Thermals", "Headlamp", "Sunscreen SPF 50", "Trekking Pole"],
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-1",
  },
  {
    id: "ev-3",
    title: "Coastal Camping & Kayaking",
    location: "Gokarna, Karnataka",
    google_map_url: "https://maps.google.com/?q=Paradise+Beach+Gokarna",
    date: "Aug 15 - 17, 2026",
    price: 3200,
    guide: "Sneha Hegde",
    guide_title: "Kayaking Instructor & Naturalist",
    capacity: 20,
    availability: "20 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    description: "Pitch tents on secluded beaches. Spend days kayaking through mangrove creeks and night bio-luminescence spotting.",
    difficulty: "Easy" as const,
    camping_type: "Coastal",
    checklist: ["Waterproof Bag", "Quick-dry Shorts", "Slippers/Sandals", "Sunglasses", "Mosquito Repellent"],
    photos: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-2",
  },
];

export default async function EditEventPage({ params, searchParams }: EditPageProps) {
  const { id } = await params;
  const { duplicate } = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirectTo=/events/${id}/edit`);
  }

  // If duplicating, redirect to the create route with ?duplicate=id
  if (duplicate === "true") {
    redirect(`/events/create?duplicate=${id}`);
  }

  // Fetch event
  const { data: dbEvent } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  const fallback = fallbackEvents.find((e) => e.id === id);

  if (!dbEvent && !fallback) {
    redirect("/events");
  }

  const event = dbEvent
    ? {
        id: dbEvent.id,
        title: dbEvent.title,
        description: dbEvent.description || "",
        location: dbEvent.location,
        google_map_url: dbEvent.google_map_url || "",
        date: dbEvent.date,
        price: Number(dbEvent.price),
        capacity: Number(dbEvent.capacity || 20),
        status: dbEvent.status || "Published",
        image_url: dbEvent.image_url || "",
        difficulty: (dbEvent.difficulty || "Easy") as "Easy" | "Moderate" | "Challenging",
        camping_type: dbEvent.camping_type || "Mountain",
        checklist: dbEvent.checklist || [],
        photos: dbEvent.photos || [],
        organizer_id: dbEvent.organizer_id || null,
        guide: dbEvent.guide || "Tribe Ranger",
        guide_title: dbEvent.guide_title || "Community Trek Leader",
      }
    : {
        id: fallback!.id,
        title: fallback!.title,
        description: fallback!.description,
        location: fallback!.location,
        google_map_url: fallback!.google_map_url,
        date: fallback!.date,
        price: fallback!.price,
        capacity: fallback!.capacity,
        status: fallback!.status,
        image_url: fallback!.image_url,
        difficulty: fallback!.difficulty,
        camping_type: fallback!.camping_type,
        checklist: fallback!.checklist,
        photos: fallback!.photos,
        organizer_id: fallback!.organizer_id,
        guide: fallback!.guide,
        guide_title: fallback!.guide_title,
      };

  return <EditEventForm event={event} />;
}
