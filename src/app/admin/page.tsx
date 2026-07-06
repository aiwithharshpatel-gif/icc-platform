import type { Metadata } from "next";
import AdminView from "./admin-view";

export const metadata: Metadata = {
  title: "ICC Admin Dashboard | Manage Platform",
  description: "Admin dashboard for managing ICC platform — members, events, campsites, posts, reports, and approvals.",
};

/* ============================================
   SEED DATA
   ============================================ */

function getSeedStats() {
  return {
    totalMembers: 1847,
    activeEvents: 23,
    totalCampsites: 42,
    feedPosts: 312,
    pendingReports: 7,
    pendingApprovals: 5,
    memberGrowth: [120, 145, 180, 210, 250, 310, 380, 450, 520, 610, 720, 847],
    eventRegistrations: [85, 120, 95, 145, 180, 210],
    dailyPosts: [8, 12, 5, 15, 20, 11, 7, 18, 22, 14, 9, 25, 30, 16, 12, 28, 19, 10, 24, 32, 15, 21, 18, 26, 13, 17, 29, 23, 20, 27],
    contentBreakdown: { text: 38, photo: 32, question: 18, poll: 12 },
  };
}

function getSeedMembers() {
  return [
    { id: "m-1", name: "Sameer Joshi", email: "sameer@icc.in", state: "Maharashtra", experience: "Expert", trips: 24, role: "admin", status: "active", joinDate: "2025-03-15", avatar: null },
    { id: "m-2", name: "Priya Mehra", email: "priya@icc.in", state: "Delhi", experience: "Expert", trips: 18, role: "moderator", status: "active", joinDate: "2025-05-20", avatar: null },
    { id: "m-3", name: "Arjun Nair", email: "arjun@icc.in", state: "Kerala", experience: "Intermediate", trips: 12, role: "member", status: "active", joinDate: "2025-07-10", avatar: null },
    { id: "m-4", name: "Vikram Singh", email: "vikram@icc.in", state: "Rajasthan", experience: "Expert", trips: 31, role: "moderator", status: "active", joinDate: "2025-02-08", avatar: null },
    { id: "m-5", name: "Neha Sharma", email: "neha@icc.in", state: "Uttarakhand", experience: "Intermediate", trips: 9, role: "member", status: "active", joinDate: "2025-09-01", avatar: null },
    { id: "m-6", name: "Deepa Rao", email: "deepa@icc.in", state: "Karnataka", experience: "Intermediate", trips: 7, role: "member", status: "active", joinDate: "2025-10-12", avatar: null },
    { id: "m-7", name: "Rahul Gupta", email: "rahul@icc.in", state: "Himachal Pradesh", experience: "Beginner", trips: 3, role: "member", status: "suspended", joinDate: "2026-01-05", avatar: null },
    { id: "m-8", name: "Ananya Roy", email: "ananya@icc.in", state: "West Bengal", experience: "Beginner", trips: 2, role: "member", status: "active", joinDate: "2026-03-18", avatar: null },
    { id: "m-9", name: "Kabir Das", email: "kabir@icc.in", state: "Ladakh", experience: "Expert", trips: 42, role: "admin", status: "active", joinDate: "2024-11-22", avatar: null },
    { id: "m-10", name: "Ravi Teja", email: "ravi@icc.in", state: "Andhra Pradesh", experience: "Intermediate", trips: 8, role: "member", status: "active", joinDate: "2026-02-14", avatar: null },
  ];
}

function getSeedEvents() {
  return [
    { id: "e-1", title: "Monsoon Valley Trek", organizer: "Sameer Joshi", date: "2026-08-15", location: "Lonavala, MH", capacity: 30, registrations: 24, status: "published" },
    { id: "e-2", title: "Stargazing Camp Spiti", organizer: "Neha Sharma", date: "2026-09-20", location: "Spiti, HP", capacity: 15, registrations: 15, status: "published" },
    { id: "e-3", title: "Western Ghats Monsoon Trail", organizer: "Deepa Rao", date: "2026-07-28", location: "Kudremukh, KA", capacity: 20, registrations: 8, status: "draft" },
    { id: "e-4", title: "Kedarkantha Winter Summit", organizer: "Priya Mehra", date: "2026-12-10", location: "Uttarakhand", capacity: 25, registrations: 18, status: "published" },
    { id: "e-5", title: "Desert Camping Jaisalmer", organizer: "Vikram Singh", date: "2026-11-05", location: "Jaisalmer, RJ", capacity: 40, registrations: 32, status: "published" },
    { id: "e-6", title: "Meghalaya Living Roots", organizer: "Arjun Nair", date: "2026-10-01", location: "Meghalaya", capacity: 12, registrations: 0, status: "pending" },
    { id: "e-7", title: "Hampta Pass Crossing", organizer: "Sameer Joshi", date: "2026-07-10", location: "Manali, HP", capacity: 20, registrations: 20, status: "completed" },
    { id: "e-8", title: "Cancelled: Roopkund Trek", organizer: "Kabir Das", date: "2026-08-01", location: "Uttarakhand", capacity: 15, registrations: 5, status: "cancelled" },
  ];
}

function getSeedCampsites() {
  return [
    { id: "c-1", name: "Riverfront Meadows", location: "Rishikesh", state: "Uttarakhand", price: 1500, rating: 4.8, reviews: 124, status: "active" },
    { id: "c-2", name: "Pine Woods Sanctuary", location: "Kasol", state: "Himachal Pradesh", price: 1200, rating: 4.6, reviews: 89, status: "active" },
    { id: "c-3", name: "Alpine Ridge Camp", location: "Manali", state: "Himachal Pradesh", price: 2200, rating: 4.9, reviews: 156, status: "featured" },
    { id: "c-4", name: "Desert Star Oasis", location: "Jaisalmer", state: "Rajasthan", price: 1800, rating: 4.5, reviews: 67, status: "active" },
    { id: "c-5", name: "Coastal Breeze Camp", location: "Gokarna", state: "Karnataka", price: 900, rating: 4.3, reviews: 45, status: "active" },
    { id: "c-6", name: "Jungle Safari Base", location: "Wayanad", state: "Kerala", price: 1600, rating: 4.7, reviews: 78, status: "pending" },
  ];
}

function getSeedPosts() {
  return [
    { id: "p-1", author: "Sameer Joshi", type: "photo", preview: "Golden hour at Triund Hill ☀️🏕️ The sunset painted...", likes: 47, comments: 8, reports: 0, status: "active" },
    { id: "p-2", author: "Priya Mehra", type: "text", preview: "Just completed my first solo trek to Kedarkantha!", likes: 89, comments: 15, reports: 0, status: "active" },
    { id: "p-3", author: "Arjun Nair", type: "question", preview: "Planning a monsoon camping trip to Coorg in August...", likes: 23, comments: 11, reports: 0, status: "active" },
    { id: "p-4", author: "Vikram Singh", type: "poll", preview: "Best monsoon trek destination in India?", likes: 56, comments: 22, reports: 0, status: "active" },
    { id: "p-5", author: "Rahul Gupta", type: "text", preview: "This platform is garbage, total waste of time and...", likes: 1, comments: 0, reports: 3, status: "flagged" },
    { id: "p-6", author: "Anonymous", type: "photo", preview: "Check out my camping gear collection for sale...", likes: 2, comments: 1, reports: 2, status: "flagged" },
  ];
}

function getSeedReports() {
  return [
    { id: "r-1", reporter: "Neha Sharma", contentType: "post", reason: "Spam / promotional content", targetPreview: "Check out my camping gear collection for sale...", status: "open", date: "2026-07-03T10:30:00Z" },
    { id: "r-2", reporter: "Deepa Rao", contentType: "post", reason: "Abusive language", targetPreview: "This platform is garbage, total waste of time...", status: "open", date: "2026-07-03T14:15:00Z" },
    { id: "r-3", reporter: "Arjun Nair", contentType: "comment", reason: "Misinformation", targetPreview: "You don't need permits for Roopkund anymore...", status: "reviewing", date: "2026-07-02T09:00:00Z" },
    { id: "r-4", reporter: "Sameer Joshi", contentType: "member", reason: "Fake profile / impersonation", targetPreview: "User: FakeTrekker99", status: "open", date: "2026-07-03T18:45:00Z" },
    { id: "r-5", reporter: "Vikram Singh", contentType: "event", reason: "Misleading pricing", targetPreview: "Free Himalayan Trek (hidden costs)", status: "resolved", date: "2026-06-28T12:00:00Z" },
  ];
}

function getSeedApprovals() {
  return [
    { id: "a-1", type: "event", title: "Meghalaya Living Roots Trek", preview: "3-day trek through living root bridges", submittedBy: "Arjun Nair", status: "pending", date: "2026-07-03T16:00:00Z" },
    { id: "a-2", type: "campsite", title: "Jungle Safari Base Camp", preview: "Premium campsite in Wayanad forest", submittedBy: "Deepa Rao", status: "pending", date: "2026-07-02T11:30:00Z" },
    { id: "a-3", type: "event", title: "Night Photography Workshop", preview: "Astrophotography camp at Spiti", submittedBy: "Neha Sharma", status: "pending", date: "2026-07-03T09:00:00Z" },
    { id: "a-4", type: "post", title: "Gear Comparison: Budget vs Premium", preview: "Detailed 5000-word review of trekking boots...", submittedBy: "Vikram Singh", status: "pending", date: "2026-07-01T14:00:00Z" },
    { id: "a-5", type: "campsite", title: "Lakeside Retreat Bhimtal", preview: "Eco-friendly campsite by Bhimtal lake", submittedBy: "Ravi Teja", status: "approved", date: "2026-06-30T08:00:00Z" },
  ];
}

function getSeedLogs() {
  const h = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
  return [
    { id: "l-1", admin: "Sameer Joshi", action: "Approved event 'Kedarkantha Winter Summit'", actionType: "approve", target: "Event", date: h(1) },
    { id: "l-2", admin: "Priya Mehra", action: "Suspended member 'Rahul Gupta' for spam", actionType: "suspend", target: "Member", date: h(3) },
    { id: "l-3", admin: "Sameer Joshi", action: "Created campsite 'Alpine Ridge Camp'", actionType: "create", target: "Campsite", date: h(6) },
    { id: "l-4", admin: "Kabir Das", action: "Rejected event 'Free Himalayan Trek'", actionType: "reject", target: "Event", date: h(12) },
    { id: "l-5", admin: "Priya Mehra", action: "Resolved report #r-5 (misleading pricing)", actionType: "update", target: "Report", date: h(18) },
    { id: "l-6", admin: "Sameer Joshi", action: "Updated role for Vikram Singh to Moderator", actionType: "update", target: "Role", date: h(24) },
    { id: "l-7", admin: "Kabir Das", action: "Deleted spam post by Anonymous", actionType: "delete", target: "Post", date: h(30) },
    { id: "l-8", admin: "Priya Mehra", action: "Approved campsite 'Lakeside Retreat Bhimtal'", actionType: "approve", target: "Campsite", date: h(48) },
    { id: "l-9", admin: "Sameer Joshi", action: "Restored member 'Ananya Roy' from suspension", actionType: "restore", target: "Member", date: h(60) },
    { id: "l-10", admin: "Kabir Das", action: "Created event 'Desert Camping Jaisalmer'", actionType: "create", target: "Event", date: h(72) },
  ];
}

export default function AdminPage() {
  return (
    <AdminView
      stats={getSeedStats()}
      members={getSeedMembers()}
      events={getSeedEvents()}
      campsites={getSeedCampsites()}
      posts={getSeedPosts()}
      reports={getSeedReports()}
      approvals={getSeedApprovals()}
      activityLogs={getSeedLogs()}
    />
  );
}
