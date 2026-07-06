"use server";

import { createClient } from "@/lib/supabase/server";

const seedCampsites = [
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
    difficulty: "Beginner",
    best_season: "Oct - May",
    nearby_attractions: ["Neer Garh Waterfall", "Laxman Jhula", "Beatles Ashram"],
    reviews: [
      { id: "rev-11", name: "Aarav Mehta", rating: 5, comment: "Fabulous sound of the river at night. Extremely clean bathrooms!", date: "2026-06-12" },
      { id: "rev-12", name: "Sneha G.", rating: 4, comment: "Great location. Rafting pickup point is very close.", date: "2026-05-30" }
    ],
    altitude: 370,
    state: "Uttarakhand"
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
    difficulty: "Intermediate",
    best_season: "Apr - Nov",
    nearby_attractions: ["Kheerganga Trek", "Chalal Village", "Manikaran Sahib Hot Springs"],
    reviews: [
      { id: "rev-21", name: "Isha Sharma", rating: 5, comment: "Incredible camp under the pine tree shadow. Extremely peacefull.", date: "2026-06-25" },
      { id: "rev-22", name: "Rahul K.", rating: 4, comment: "Staff is helpful. Bring warm clothes as it gets cold at night.", date: "2026-06-14" }
    ],
    altitude: 1580,
    state: "Himachal Pradesh"
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
    difficulty: "Beginner",
    best_season: "Jun - Mar",
    nearby_attractions: ["Tikona Fort", "Pawna Lake Dam", "Karla Buddhist Caves"],
    reviews: [
      { id: "rev-31", name: "Vikram Patil", rating: 5, comment: "Monsoon mist views are unmatched. Food was local and delicious.", date: "2026-06-20" }
    ],
    altitude: 620,
    state: "Maharashtra"
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
    difficulty: "Beginner",
    best_season: "Sep - May",
    nearby_attractions: ["Anayirangal Dam", "Kolukkumalai Tea Estate", "Lockhart Gap Viewpoint"],
    reviews: [
      { id: "rev-41", name: "Meera Nair", rating: 5, comment: "Beautiful location surrounded by tea valleys. Absolute serene experience.", date: "2026-06-18" }
    ],
    altitude: 1600,
    state: "Kerala"
  }
];

const seedEvents = [
  {
    id: "ev-1",
    title: "Monsoon Valley Trek",
    location: "Bhimashankar, Maharashtra",
    google_map_url: "https://maps.google.com/?q=Bhimashankar+Wildlife+Sanctuary",
    date: "July 18 - 19, 2026",
    price: 2400,
    guide: "Rohan Deshmukh",
    guide_title: "Certified Wilderness Guide",
    capacity: "15",
    availability: "10 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    description: "Trek through misty green routes, scaling waterfalls and dense forests of Bhimashankar. Perfect weekend getaway during peak Maharashtra monsoon.",
    difficulty: "Moderate",
    camping_type: "Forest",
    checklist: ["Raincoat/Poncho", "Trekking Shoes", "Water Bottle 2L", "Dry-fit clothes"],
    photos: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: null
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
    capacity: "10",
    availability: "6 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "A high-altitude transition trek crossing the lush green valleys of Kullu into the desert landscapes of Lahaul. Stargazing at Balu ka Ghera included.",
    difficulty: "Challenging",
    camping_type: "Mountain",
    checklist: ["Warm Jacket (-5C)", "Thermals", "Headlamp", "Sunscreen SPF 50", "Trekking Pole"],
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: null
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
    capacity: "20",
    availability: "20 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    description: "Pitch tents on secluded beaches. Spend days kayaking through mangrove creeks and night bio-luminescence spotting.",
    difficulty: "Easy",
    camping_type: "Coastal",
    checklist: ["Waterproof Bag", "Quick-dry Shorts", "Slippers/Sandals", "Sunglasses", "Mosquito Repellent"],
    photos: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: null
  }
];

export async function seedDatabaseAction() {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      return { error: "Authentication required to seed database." };
    }

    // Verify role (admin or moderator) or email suffix/contains
    const { data: roleData } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    const role = roleData?.role || "member";
    const isMockAdmin = user.email?.includes("sameer") || user.email?.includes("admin");

    if (role !== "admin" && role !== "moderator" && !isMockAdmin) {
      return { error: "Access denied. Admin or Moderator role required." };
    }

    // Insert campsites
    const { error: campsiteErr } = await supabase
      .from("campsites")
      .upsert(seedCampsites, { onConflict: "id" });

    if (campsiteErr) {
      return { error: `Failed to seed campsites: ${campsiteErr.message}` };
    }

    // Insert events
    const { error: eventErr } = await supabase
      .from("events")
      .upsert(seedEvents, { onConflict: "id" });

    if (eventErr) {
      return { error: `Failed to seed events: ${eventErr.message}` };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred during database seeding." };
  }
}
