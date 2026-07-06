import { createClient } from "@/lib/supabase/server";
import { EventsView } from "./events-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ICC Community Trekking & Events | Join the Tribe Outdoors",
  description:
    "Discover and participate in group treks, stargazing nights, beach camping, and high-altitude climbs organized by local wilderness rangers in India.",
  keywords: ["trekking events India", "group hiking", "co-campers India", "stargazing Manali"],
};

export default async function EventsPage() {
  const supabase = await createClient();

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch events from PostgreSQL
  const { data: dbEvents } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch event registrations
  const { data: dbRegistrations } = await supabase
    .from("event_registrations")
    .select("*");

  // Fetch user bookmarks
  let userBookmarks: string[] = [];
  if (user) {
    const { data: dbBookmarks } = await supabase
      .from("bookmarks")
      .select("event_id")
      .eq("user_id", user.id);

    if (dbBookmarks) {
      userBookmarks = dbBookmarks.map((b: any) => b.event_id);
    }
  }

  // Fetch user registrations
  let userRegistrations: string[] = [];
  if (user && dbRegistrations) {
    userRegistrations = dbRegistrations
      .filter((r: any) => r.user_id === user.id)
      .map((r: any) => r.event_id);
  }

  // Compile registrations count per event
  const registrationCounts: Record<string, number> = {};
  if (dbRegistrations) {
    dbRegistrations.forEach((r: any) => {
      registrationCounts[r.event_id] = (registrationCounts[r.event_id] || 0) + 1;
    });
  }

  // Pre-configured mock events as high-quality seed fallbacks if database table is empty or offline
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

  // Map database events to typed formats
  const events = dbEvents && dbEvents.length > 0
    ? dbEvents.map((item: any) => {
        const capacityNum = isNaN(Number(item.capacity)) ? 20 : Number(item.capacity);
        const registeredCount = registrationCounts[item.id] || 0;
        const spotsRemaining = Math.max(0, capacityNum - registeredCount);
        
        return {
          id: item.id,
          title: item.title,
          location: item.location,
          google_map_url: item.google_map_url || "",
          date: item.date,
          price: Number(item.price),
          guide: item.guide,
          guide_title: item.guide_title,
          capacity: capacityNum,
          availability: spotsRemaining > 0 ? `${spotsRemaining} Spots Left` : "Filled",
          status: item.status || "Published",
          image_url: item.image_url,
          description: item.description,
          difficulty: (item.difficulty || "Easy") as "Easy" | "Moderate" | "Challenging",
          camping_type: item.camping_type || "Mountain",
          checklist: item.checklist || [],
          photos: item.photos || [],
          organizer_id: item.organizer_id || null,
        };
      })
    : fallbackEvents;

  return (
    <EventsView
      initialEvents={events}
      userBookmarks={userBookmarks}
      userRegistrations={userRegistrations}
      userId={user?.id || null}
    />
  );
}
