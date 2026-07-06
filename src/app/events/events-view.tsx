"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  Plus,
  Search,
  Flame,
  Compass,
  ArrowRight,
  Share2,
  CheckCircle,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleBookmarkAction } from "@/app/events/actions";

interface Event {
  id: string;
  title: string;
  location: string;
  google_map_url: string;
  date: string;
  price: number;
  guide: string;
  guide_title: string;
  capacity: number;
  availability: string;
  status: string;
  image_url: string | null;
  description: string | null;
  difficulty: "Easy" | "Moderate" | "Challenging";
  camping_type: string;
  checklist: string[];
  photos: string[];
  organizer_id: string | null;
}

interface EventsViewProps {
  initialEvents: Event[];
  userBookmarks: string[];
  userRegistrations: string[];
  userId: string | null;
}

export function EventsView({
  initialEvents,
  userBookmarks,
  userRegistrations,
  userId,
}: EventsViewProps) {
  const [events, setEvents] = React.useState<Event[]>(initialEvents);
  const [search, setSearch] = React.useState("");
  const [campingType, setCampingType] = React.useState("All");
  const [difficulty, setDifficulty] = React.useState("All");
  const [filterMode, setFilterMode] = React.useState<"All" | "Bookmarked" | "Joined" | "Organized">("All");

  const [bookmarks, setBookmarks] = React.useState<string[]>(userBookmarks);
  const [registrations, setRegistrations] = React.useState<string[]>(userRegistrations);
  const [shareSuccess, setShareSuccess] = React.useState<string | null>(null);

  // Sync state with localStorage local overrides for mock runs
  React.useEffect(() => {
    // Load local custom events
    const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
    if (localEvents.length > 0) {
      // Merge with initialEvents, filtering out duplicates
      const merged = [...initialEvents];
      localEvents.forEach((le: Event) => {
        const index = merged.findIndex((e) => e.id === le.id);
        if (index > -1) {
          merged[index] = le; // update
        } else {
          merged.unshift(le); // add to top
        }
      });
      setEvents(merged);
    }

    // Load local bookmarks
    const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
    const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");
    let activeBookmarks = [...userBookmarks];
    localBookmarks.forEach((id: string) => {
      if (!activeBookmarks.includes(id)) activeBookmarks.push(id);
    });
    activeBookmarks = activeBookmarks.filter((id) => !localUnbookmarks.includes(id));
    setBookmarks(activeBookmarks);

    // Load local registrations
    const localJoins = JSON.parse(localStorage.getItem("icc_local_joins") || "[]");
    const localUnjoins = JSON.parse(localStorage.getItem("icc_local_unjoins") || "[]");
    let activeRegistrations = [...userRegistrations];
    localJoins.forEach((id: string) => {
      if (!activeRegistrations.includes(id)) activeRegistrations.push(id);
    });
    activeRegistrations = activeRegistrations.filter((id) => !localUnjoins.includes(id));
    setRegistrations(activeRegistrations);
  }, [initialEvents, userBookmarks, userRegistrations]);

  const handleBookmarkToggle = async (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      alert("Please log in to bookmark events.");
      return;
    }

    const isBookmarked = bookmarks.includes(eventId);
    const nextBookmarks = isBookmarked
      ? bookmarks.filter((id) => id !== eventId)
      : [...bookmarks, eventId];

    setBookmarks(nextBookmarks);

    try {
      const result = await toggleBookmarkAction(eventId, isBookmarked);

      if (result?.isFallbackNeeded || !result?.success) {
        if (!isBookmarked) {
          const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
          if (!localBookmarks.includes(eventId)) {
            localStorage.setItem("icc_local_bookmarks", JSON.stringify([...localBookmarks, eventId]));
          }
          // Remove from local unbookmarks
          const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");
          localStorage.setItem("icc_local_unbookmarks", JSON.stringify(localUnbookmarks.filter((id: string) => id !== eventId)));
        } else {
          const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");
          if (!localUnbookmarks.includes(eventId)) {
            localStorage.setItem("icc_local_unbookmarks", JSON.stringify([...localUnbookmarks, eventId]));
          }
          // Remove from local bookmarks
          const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
          localStorage.setItem("icc_local_bookmarks", JSON.stringify(localBookmarks.filter((id: string) => id !== eventId)));
        }
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  const handleShare = (e: React.MouseEvent, eventId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/events/${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(eventId);
    setTimeout(() => setShareSuccess(null), 3000);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Challenging":
        return "accent" as const;
      case "Moderate":
        return "success" as const;
      default:
        return "secondary" as const;
    }
  };

  // Compile unique camping types
  const campingTypes = ["All", ...Array.from(new Set(events.map((e) => e.camping_type)))];

  // Apply filters
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      ev.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCampingType =
      campingType === "All" || ev.camping_type.toLowerCase() === campingType.toLowerCase();

    const matchesDifficulty =
      difficulty === "All" || ev.difficulty.toLowerCase() === difficulty.toLowerCase();

    let matchesFilterMode = true;
    if (filterMode === "Bookmarked") {
      matchesFilterMode = bookmarks.includes(ev.id);
    } else if (filterMode === "Joined") {
      matchesFilterMode = registrations.includes(ev.id);
    } else if (filterMode === "Organized") {
      matchesFilterMode = ev.organizer_id === userId;
    }

    // Only show published events to normal members, but organizers can see their drafts/cancelled ones too!
    const matchesStatus =
      ev.status === "Published" || ev.organizer_id === userId;

    return matchesSearch && matchesCampingType && matchesDifficulty && matchesFilterMode && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Page Title */}
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 font-display">
            Community Treks & Events
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Join group hikes, stargazing camps, and cleanups. Meet travel buddies, learn outdoor safety, and scale summits with expert local rangers.
          </p>
        </div>
        {userId && (
          <Link href="/events/create" className="shrink-0">
            <Button variant="primary" className="font-bold text-xs flex items-center gap-1.5 shadow-md">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        )}
      </div>

      {/* Filter and Search Panel */}
      <div className="glass-panel border border-border/80 rounded-xl p-5 mb-10 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location, title..."
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Directory Filter Modes */}
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
            <button
              onClick={() => setFilterMode("All")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                filterMode === "All"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All Treks
            </button>
            {userId && (
              <>
                <button
                  onClick={() => setFilterMode("Bookmarked")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    filterMode === "Bookmarked"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Bookmarks ({bookmarks.length})
                </button>
                <button
                  onClick={() => setFilterMode("Joined")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    filterMode === "Joined"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Joined ({registrations.length})
                </button>
                <button
                  onClick={() => setFilterMode("Organized")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    filterMode === "Organized"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  My Events
                </button>
              </>
            )}
          </div>
        </div>

        {/* Categories / Advanced filters */}
        <div className="flex flex-wrap items-center justify-between border-t border-border/30 pt-3 gap-3">
          {/* Camping Type tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              Terrain:
            </span>
            {campingTypes.map((type) => (
              <button
                key={type}
                onClick={() => setCampingType(type)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                  campingType.toLowerCase() === type.toLowerCase()
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-muted/50 text-muted-foreground border border-border/40 hover:bg-muted"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Difficulty filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Difficulty:</span>
            <select
              className="bg-background border border-border rounded-lg text-[10px] font-bold py-1 px-2 focus:outline-none"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid listing */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const isBookmarked = bookmarks.includes(event.id);
            const isJoined = registrations.includes(event.id);
            return (
              <Card
                key={event.id}
                hoverEffect
                className="overflow-hidden flex flex-col h-full bg-card border-border/50 shadow-sm relative"
              >
                {/* Header image */}
                <div className="relative h-52 w-full overflow-hidden bg-muted">
                  <img
                    src={event.image_url || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                  
                  {/* Difficulty Badge */}
                  <Badge
                    variant={getDifficultyColor(event.difficulty)}
                    className="absolute top-4 left-4 text-[9px] font-bold uppercase tracking-wider shadow-md"
                  >
                    {event.difficulty}
                  </Badge>

                  {/* Bookmark Button */}
                  {userId && (
                    <button
                      onClick={(e) => handleBookmarkToggle(e, event.id)}
                      className={`absolute top-4 right-4 p-2 rounded-xl border backdrop-blur-md transition-all ${
                        isBookmarked
                          ? "bg-primary border-primary text-primary-foreground shadow-md scale-105"
                          : "bg-black/40 border-white/20 text-white hover:bg-black/60"
                      }`}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark event"}
                    >
                      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                    </button>
                  )}

                  {/* Date Badge */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                    <Calendar className="h-4 w-4 text-accent fill-accent" />
                    <span>{event.date}</span>
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold mb-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <CardTitle className="text-lg font-bold tracking-tight text-foreground line-clamp-1">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex-grow space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[50px] font-sans">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border/30 text-xs">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider leading-none">Guide</p>
                      <p className="font-semibold text-foreground mt-1 line-clamp-1">{event.guide}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider leading-none">Status</p>
                      <Badge variant={event.status === "Published" ? "success" : "secondary"} className="text-[8px] py-0 px-1.5 uppercase mt-0.5">
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>

                {/* Footer / CTA */}
                <CardFooter className="pt-3 border-t border-border/30 bg-muted/10 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[9px] text-muted-foreground leading-none">Price / person</p>
                    <p className="text-lg font-extrabold text-foreground mt-1">₹{event.price}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Share */}
                    <button
                      onClick={(e) => handleShare(e, event.id)}
                      className="p-2 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground relative"
                      title="Share link"
                    >
                      <Share2 className="h-4 w-4" />
                      {shareSuccess === event.id && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap flex items-center gap-1 shadow-sm">
                          <CheckCircle className="h-3 w-3 text-emerald-500" /> Copied!
                        </span>
                      )}
                    </button>
                    {/* Explore */}
                    <Link href={`/events/${event.id}`}>
                      <Button variant={isJoined ? "outline" : "primary"} size="sm" className="font-bold text-xs flex items-center gap-1">
                        <span>{isJoined ? "Joined" : "Explore"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl max-w-md mx-auto">
          <Compass className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-bold">No treks found</h3>
          <p className="text-sm text-muted-foreground mt-2 px-6">
            We couldn't find any events matching your selected search query or filters.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearch("");
              setCampingType("All");
              setDifficulty("All");
              setFilterMode("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
