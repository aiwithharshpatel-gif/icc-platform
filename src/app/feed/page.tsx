import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import FeedView from "./feed-view";

export const metadata: Metadata = {
  title: "ICC Campfire Feed | Stories from the Trail",
  description:
    "Share trail stories, camp photos, gear reviews, and connect with fellow adventurers in the ICC Campfire — India's campiest social feed.",
  openGraph: {
    title: "ICC Campfire Feed | Stories from the Trail",
    description: "Share trail stories, photos, and connect with fellow campers.",
  },
};

// =============================================
// Seed Data — Rich demo posts
// =============================================
function getSeedPosts() {
  const now = new Date();
  const h = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString();

  return [
    {
      id: "fp-1",
      author_id: "m-1",
      author_name: "Sameer Joshi",
      author_avatar: null,
      type: "photo" as const,
      content:
        "Golden hour at Triund Hill ☀️🏕️ The sunset painted the entire Dhauladhar range in shades of amber and rose. This is why we camp. No filter needed.\n\n#triund #himachal #sunsetcamp #goldenhour",
      photos: [
        "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800",
        "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=800",
        "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800",
      ],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 47,
      comments_count: 8,
      shares_count: 12,
      tags: ["triund", "himachal", "sunset"],
      created_at: h(2),
      comments: [
        { id: "fc-1a", author_name: "Priya Mehra", author_avatar: null, content: "Absolutely breathtaking! Which campsite did you stay at? 🤩", likes_count: 5, created_at: h(1.5), replies: [
          { id: "fc-1a-r1", author_name: "Sameer Joshi", author_avatar: null, content: "Thanks Priya! It was the one right before the summit — about 200m from the chai stall. Best views from there!", likes_count: 2, created_at: h(1) },
        ]},
        { id: "fc-1b", author_name: "Arjun Nair", author_avatar: null, content: "The Dhauladhar range never disappoints. Were the trails crowded?", likes_count: 3, created_at: h(1.2), replies: [] },
      ],
    },
    {
      id: "fp-2",
      author_id: "m-2",
      author_name: "Priya Mehra",
      author_avatar: null,
      type: "text" as const,
      content:
        "Just completed my first solo trek to Kedarkantha! 🏔️ 5 days, 12,500 ft summit, -8°C at night. The snow trail from Juda ka Talab to the summit was the most challenging and rewarding thing I've ever done.\n\nKey learnings:\n• Layer up — merino base + fleece + shell saved my life\n• Start summit push at 4 AM for sunrise views\n• Carry extra socks — wet feet = misery\n• The locals make the BEST rajma chawal at base camp\n\nTo anyone on the fence about solo trekking — just go. The mountains are calling. 🌲",
      photos: [],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 89,
      comments_count: 15,
      shares_count: 23,
      tags: ["kedarkantha", "solo", "uttarakhand", "winter"],
      created_at: h(5),
      comments: [
        { id: "fc-2a", author_name: "Vikram Singh", author_avatar: null, content: "Legend! Solo at -8°C takes serious guts. What sleeping bag did you use?", likes_count: 7, created_at: h(4), replies: [
          { id: "fc-2a-r1", author_name: "Priya Mehra", author_avatar: null, content: "Decathlon Trek 900 rated to -18°C. Worth every penny. Still cozy at -8! 🧊", likes_count: 4, created_at: h(3.5) },
        ]},
        { id: "fc-2b", author_name: "Neha Sharma", author_avatar: null, content: "This is SO inspiring! Adding Kedarkantha to my 2026 bucket list ✨", likes_count: 3, created_at: h(3.8), replies: [] },
      ],
    },
    {
      id: "fp-3",
      author_id: "m-3",
      author_name: "Arjun Nair",
      author_avatar: null,
      type: "question" as const,
      content:
        "Fellow campers, need advice! 🤔 Planning a monsoon camping trip to Coorg in August. Has anyone camped there during peak monsoon? Worried about:\n\n1. Leech situation — how bad is it really?\n2. Are the waterfalls accessible or too dangerous?\n3. Best waterproof tent recommendations under ₹8000?\n\nAny tips from monsoon camping veterans would be amazing 🙏",
      photos: [],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 23,
      comments_count: 11,
      shares_count: 5,
      tags: ["coorg", "monsoon", "advice", "camping-tips"],
      created_at: h(8),
      comments: [
        { id: "fc-3a", author_name: "Deepa Rao", author_avatar: null, content: "Camped in Coorg last August! Leeches are real but manageable — wear gaiters and use salt. Abbey Falls is gorgeous but stay on marked trails. For tents, the Quechua MH100 is amazing for ₹6k!", likes_count: 12, created_at: h(7), replies: [
          { id: "fc-3a-r1", author_name: "Arjun Nair", author_avatar: null, content: "This is exactly what I needed! Thank you Deepa 🙌 Ordering the Quechua tonight!", likes_count: 1, created_at: h(6.5) },
        ]},
      ],
    },
    {
      id: "fp-4",
      author_id: "m-4",
      author_name: "Vikram Singh",
      author_avatar: null,
      type: "poll" as const,
      content:
        "🗳️ Best monsoon trek destination in India? Planning a community group trek for August — help us decide! Vote and drop your reasons in the comments 👇",
      photos: [],
      poll_options: [
        { id: "opt-1", text: "Valley of Flowers, Uttarakhand", votes: 34 },
        { id: "opt-2", text: "Dudhsagar Falls Trek, Goa", votes: 28 },
        { id: "opt-3", text: "Kudremukh, Karnataka", votes: 19 },
        { id: "opt-4", text: "Meghalaya Living Root Bridges", votes: 41 },
      ],
      poll_total_votes: 122,
      likes_count: 56,
      comments_count: 22,
      shares_count: 18,
      tags: ["poll", "monsoon", "group-trek", "community"],
      created_at: h(12),
      comments: [
        { id: "fc-4a", author_name: "Sameer Joshi", author_avatar: null, content: "Meghalaya all the way! The living root bridges in monsoon with waterfalls everywhere — it's like stepping into a fairy tale 🧚", likes_count: 9, created_at: h(11), replies: [] },
        { id: "fc-4b", author_name: "Neha Sharma", author_avatar: null, content: "Valley of Flowers is a once-in-a-lifetime experience during monsoon. 600+ species of wildflowers 🌸🌺", likes_count: 7, created_at: h(10.5), replies: [] },
      ],
    },
    {
      id: "fp-5",
      author_id: "m-5",
      author_name: "Neha Sharma",
      author_avatar: null,
      type: "photo" as const,
      content:
        "Milky Way over Spiti Valley 🌌✨ Shot at 14,000 ft from Langza village. 30-second exposure, no light pollution for miles. The monastery silhouette against the galaxy is just *chef's kiss*.\n\nGear: Sony A7III, Sigma 14mm f/1.8, Gitzo tripod\n\n#astrophotography #spiti #milkyway #nightsky",
      photos: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
        "https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=800",
      ],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 134,
      comments_count: 19,
      shares_count: 45,
      tags: ["spiti", "astrophotography", "milkyway", "nightsky"],
      created_at: h(18),
      comments: [
        { id: "fc-5a", author_name: "Vikram Singh", author_avatar: null, content: "This is wallpaper-worthy! 😍 How cold was it at 14,000 ft during the night shoot?", likes_count: 4, created_at: h(17), replies: [
          { id: "fc-5a-r1", author_name: "Neha Sharma", author_avatar: null, content: "Around -5°C! Had to wear two jackets and keep hand warmers in my gloves to operate the camera 🥶", likes_count: 3, created_at: h(16.5) },
        ]},
      ],
    },
    {
      id: "fp-6",
      author_id: "m-6",
      author_name: "Deepa Rao",
      author_avatar: null,
      type: "text" as const,
      content:
        "⚙️ GEAR REVIEW: Decathlon Forclaz Trek 500 Backpack (50L)\n\nAfter 6 treks and 200+ km on my back, here's my honest review:\n\n✅ Pros:\n• Incredible back ventilation — no swamp back even in humidity\n• Rain cover fits perfectly and is built-in\n• Hip belt distributes weight beautifully\n• Bottom compartment access is a game-changer\n• Price: ₹5,999 (unbeatable)\n\n❌ Cons:\n• Side pockets are a bit shallow for Nalgene bottles\n• No front mesh pocket\n• Straps squeak slightly when new\n\n🏆 Verdict: 8.5/10 — Best budget trekking pack in India. Punches way above its price.\n\nAMA about this pack in the comments! 👇",
      photos: [],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 67,
      comments_count: 14,
      shares_count: 31,
      tags: ["gear-review", "backpack", "decathlon", "budget"],
      created_at: h(24),
      comments: [
        { id: "fc-6a", author_name: "Arjun Nair", author_avatar: null, content: "Been eyeing this one! How does it handle in heavy rain? Does the rain cover stay put in strong wind?", likes_count: 5, created_at: h(23), replies: [] },
      ],
    },
    {
      id: "fp-7",
      author_id: "m-1",
      author_name: "Sameer Joshi",
      author_avatar: null,
      type: "question" as const,
      content:
        "🔥 Campfire cooking debate: Gas stove vs. Wood fire for multi-day treks?\n\nI've always used a Jetboil but I see many purists swear by wood fires (where allowed). What's the community's take? Pros and cons of each?",
      photos: [],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 31,
      comments_count: 18,
      shares_count: 7,
      tags: ["campfire", "cooking", "debate", "gear"],
      created_at: h(36),
      comments: [
        { id: "fc-7a", author_name: "Deepa Rao", author_avatar: null, content: "Gas stove for reliability and LNT principles. Wood fires are romantic but leave scars on the land. Plus, above treeline you have no wood option!", likes_count: 11, created_at: h(35), replies: [] },
      ],
    },
    {
      id: "fp-8",
      author_id: "m-2",
      author_name: "Priya Mehra",
      author_avatar: null,
      type: "text" as const,
      content:
        "🌧️ TRAIL REPORT: Hampta Pass (July 2026)\n\nJust got back from Hampta Pass trek organized by ICC!\n\n📍 Route: Manali → Jobra → Jwara → Balu ka Ghera → Hampta Pass → Chatru → Chandratal\n📏 Distance: 26 km over 5 days\n🏔️ Max altitude: 14,100 ft\n\nTrail conditions:\n• Day 1-2: Muddy but manageable\n• Day 3: River crossing at Balu ka Ghera was knee-deep! Guide ropes essential.\n• Day 4: Snow on the pass (yes, in July!). Microspikes recommended.\n• Day 5: Chandratal is ethereal. Camp by the lake if you can.\n\nHighlight: Seeing the landscape shift from green Kullu valley to barren Lahaul in just 2 days. Utterly surreal. 🏔️→🏜️",
      photos: [],
      poll_options: [],
      poll_total_votes: 0,
      likes_count: 78,
      comments_count: 9,
      shares_count: 16,
      tags: ["hampta-pass", "trail-report", "manali", "chandratal"],
      created_at: h(48),
      comments: [],
    },
  ];
}

function getSeedNotifications() {
  const now = new Date();
  const h = (hours: number) => new Date(now.getTime() - hours * 3600000).toISOString();

  return [
    { id: "fn-1", type: "like" as const, actor_name: "Vikram Singh", actor_avatar: null, post_id: "fp-1", message: "liked your photo post about Triund Hill", is_read: false, created_at: h(0.5) },
    { id: "fn-2", type: "comment" as const, actor_name: "Priya Mehra", actor_avatar: null, post_id: "fp-1", message: "commented: \"Absolutely breathtaking!\"", is_read: false, created_at: h(1) },
    { id: "fn-3", type: "reply" as const, actor_name: "Arjun Nair", actor_avatar: null, post_id: "fp-3", message: "replied to your question about monsoon camping", is_read: false, created_at: h(2) },
    { id: "fn-4", type: "like" as const, actor_name: "Deepa Rao", actor_avatar: null, post_id: "fp-2", message: "and 12 others liked your trail story", is_read: true, created_at: h(4) },
    { id: "fn-5", type: "mention" as const, actor_name: "Neha Sharma", actor_avatar: null, post_id: "fp-5", message: "mentioned you in a comment", is_read: true, created_at: h(8) },
    { id: "fn-6", type: "follow" as const, actor_name: "Sameer Joshi", actor_avatar: null, post_id: null, message: "started following you", is_read: true, created_at: h(12) },
  ];
}

export default async function FeedPage() {
  const supabase = await createClient();

  // Try fetching from DB
  const { data: dbPosts } = await supabase
    .from("feed_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id || null;

  // Use DB posts if available, otherwise fallback to seeds
  const posts = dbPosts && dbPosts.length > 0 ? dbPosts : getSeedPosts();

  // Try fetching notifications
  let notifications: ReturnType<typeof getSeedNotifications> = [];
  if (userId) {
    const { data: dbNotifs } = await supabase
      .from("feed_notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    notifications = dbNotifs && dbNotifs.length > 0 ? dbNotifs : getSeedNotifications();
  } else {
    notifications = getSeedNotifications();
  }

  return <FeedView initialPosts={posts} notifications={notifications} userId={userId} />;
}
