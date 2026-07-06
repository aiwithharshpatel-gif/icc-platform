"use client";

import * as React from "react";
import {
  Search, X, Clock, Sparkles, MapPin, Calendar, User, ArrowRight,
  SlidersHorizontal, ChevronRight, Tent, Compass, Bookmark, Flame
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SearchResult {
  id: string;
  type: "campsite" | "event" | "member" | "trip";
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
  date?: string;
  rating?: number;
  tags?: string[];
}

const MOCK_DATABASE: SearchResult[] = [
  // Campsites
  {
    id: "c-1",
    type: "campsite",
    title: "Riverfront Meadows",
    subtitle: "Rishikesh, Uttarakhand • Camp fee: ₹1,500/night",
    href: "/campsites",
    meta: "Riverside Forest Lake. Water, washroom, parking available. Altitude: 600m. Best season: Oct to Apr.",
    rating: 4.8,
    tags: ["riverside", "rishikesh", "forest"],
  },
  {
    id: "c-2",
    type: "campsite",
    title: "Pine Woods Sanctuary",
    subtitle: "Kasol, Himachal Pradesh • Camp fee: ₹1,200/night",
    href: "/campsites",
    meta: "Pine forest camp by Parvati river. Altitude: 1,580m. Washroom, network, best season: Mar to Jun.",
    rating: 4.6,
    tags: ["kasol", "himachal", "forest"],
  },
  {
    id: "c-3",
    type: "campsite",
    title: "Alpine Ridge Camp",
    subtitle: "Manali, Himachal Pradesh • Camp fee: ₹2,200/night",
    href: "/campsites",
    meta: "Snowy peak mountain views. High altitude: 2,800m. Best season: May to Oct.",
    rating: 4.9,
    tags: ["mountain", "manali", "snowy"],
  },
  {
    id: "c-4",
    type: "campsite",
    title: "Desert Star Oasis",
    subtitle: "Jaisalmer, Rajasthan • Camp fee: ₹1,800/night",
    href: "/campsites",
    meta: "Sand dunes camp under night sky. Desert terrain, best season: Nov to Feb.",
    rating: 4.5,
    tags: ["desert", "sand-dunes", "jaisalmer"],
  },
  {
    id: "c-5",
    type: "campsite",
    title: "Coastal Breeze Camp",
    subtitle: "Gokarna, Karnataka • Camp fee: ₹900/night",
    href: "/campsites",
    meta: "Sandy beaches camp by Arabian sea. Coastal terrain, best season: Nov to Mar.",
    rating: 4.3,
    tags: ["beach", "gokarna", "coastal"],
  },
  {
    id: "c-6",
    type: "campsite",
    title: "Jungle Safari Base",
    subtitle: "Wayanad, Kerala • Camp fee: ₹1,600/night",
    href: "/campsites",
    meta: "Deep forest sanctuary camp. Wilderness terrain, best season: Oct to May.",
    rating: 4.7,
    tags: ["jungle", "forest", "wayanad"],
  },

  // Events
  {
    id: "e-1",
    type: "event",
    title: "Monsoon Valley Trek",
    subtitle: "Lonavala, Maharashtra • Guide: Sameer Joshi",
    href: "/events",
    meta: "Community group trek in Sahyadris. Difficulty: Moderate. Date: 15 Aug 2026.",
    date: "2026-08-15",
    tags: ["monsoon", "trekking", "lonavala"],
  },
  {
    id: "e-2",
    type: "event",
    title: "Stargazing Camp Spiti",
    subtitle: "Spiti Valley, Himachal Pradesh • Guide: Neha Sharma",
    href: "/events",
    meta: "High-altitude astrophotography camp. Difficulty: Challenging. Date: 20 Sep 2026.",
    date: "2026-09-20",
    tags: ["astrophotography", "spiti", "mountain"],
  },
  {
    id: "e-3",
    type: "event",
    title: "Kedarkantha Winter Summit",
    subtitle: "Sankri, Uttarakhand • Guide: Priya Mehra",
    href: "/events",
    meta: "Snow trekking summit expedition. Difficulty: Challenging. Date: 10 Dec 2026.",
    date: "2026-12-10",
    tags: ["snow", "winter", "kedarkantha"],
  },
  {
    id: "e-4",
    type: "event",
    title: "Desert Camping Jaisalmer",
    subtitle: "Jaisalmer, Rajasthan • Guide: Vikram Singh",
    href: "/events",
    meta: "Traditional folk music & desert night camping. Difficulty: Easy. Date: 05 Nov 2026.",
    date: "2026-11-05",
    tags: ["desert", "jaisalmer", "camel-safari"],
  },

  // Members
  {
    id: "m-1",
    type: "member",
    title: "Sameer Joshi",
    subtitle: "Mumbai, Maharashtra • Trek Leader & Admin",
    href: "/members/m-1",
    meta: "Expert camper. 24 trips joined. Bio: Outdoor enthusiast and Dhauladhar explorer.",
    tags: ["admin", "expert", "trek-leader"],
  },
  {
    id: "m-2",
    type: "member",
    title: "Priya Mehra",
    subtitle: "Delhi • Solo Mountaineer & Moderator",
    href: "/members/m-2",
    meta: "Expert mountaineer. 18 trips joined. Bio: Lover of Himalayas and high altitude winter camps.",
    tags: ["moderator", "expert", "mountaineer"],
  },
  {
    id: "m-4",
    type: "member",
    title: "Vikram Singh",
    subtitle: "Jaipur, Rajasthan • Desert Guide & Moderator",
    href: "/members/m-4",
    meta: "Expert desert camper. 31 trips joined. Bio: Helping explorers navigate sand dunes safety.",
    tags: ["desert-guide", "expert"],
  },
  {
    id: "m-5",
    type: "member",
    title: "Neha Sharma",
    subtitle: "Dehradun, Uttarakhand • Astrophotographer",
    href: "/members/m-5",
    meta: "Intermediate level. 9 trips joined. Bio: Capturing the cosmos from the darkest skies.",
    tags: ["astrophotography", "starry-sky"],
  },

  // Trips (Distinct expedition plans)
  {
    id: "t-1",
    type: "trip",
    title: "Hampta Pass Expedition",
    subtitle: "Manali to Spiti Crossing • July 2026",
    href: "/events",
    meta: "Kullu valley to barren Lahaul crossing. Snow pass at 14,100 ft. Managed by leader Sameer Joshi.",
    date: "2026-07-10",
    tags: ["hampta-pass", "expedition", "himachal"],
  },
  {
    id: "t-2",
    type: "trip",
    title: "Valley of Flowers Monsoon Trail",
    subtitle: "Joshimath, Uttarakhand • August 2026",
    href: "/events",
    meta: "UNESCO World Heritage site floral trek. Monsoon expedition, expert guides.",
    date: "2026-08-10",
    tags: ["valley-of-flowers", "monsoon", "flora"],
  },
];

const POPULAR_SEARCHES = [
  "Uttarakhand",
  "Sameer Joshi",
  "Monsoon",
  "Mountain",
  "Kasol",
];

interface GlobalSearchProps {
  onClose: () => void;
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "campsite" | "event" | "member" | "trip">("all");
  const [sortBy, setSortBy] = React.useState<"relevance" | "date" | "rating">("relevance");
  const [recents, setRecents] = React.useState<string[]>([]);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input on load
  React.useEffect(() => {
    inputRef.current?.focus();
    // Load recent searches
    const saved = localStorage.getItem("icc_recent_searches");
    if (saved) {
      try {
        setRecents(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }
  }, []);

  // Listen for escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function saveRecent(searchQuery: string) {
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim();
    const updated = [clean, ...recents.filter((r) => r !== clean)].slice(0, 5);
    setRecents(updated);
    localStorage.setItem("icc_recent_searches", JSON.stringify(updated));
  }

  function removeRecent(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    const updated = recents.filter((_, i) => i !== index);
    setRecents(updated);
    localStorage.setItem("icc_recent_searches", JSON.stringify(updated));
  }

  function handleSelectResult(result: SearchResult) {
    saveRecent(query || result.title);
    onClose();
  }

  // Filter & Search Logic
  const results = React.useMemo(() => {
    if (!query.trim()) return [];

    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);

    // Score relevance
    const scored = MOCK_DATABASE.map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const subtitleLower = item.subtitle.toLowerCase();
      const metaLower = item.meta?.toLowerCase() || "";
      const tagsString = item.tags?.join(" ").toLowerCase() || "";

      keywords.forEach((keyword) => {
        if (titleLower.includes(keyword)) score += 10;
        if (tagsString.includes(keyword)) score += 5;
        if (subtitleLower.includes(keyword)) score += 3;
        if (metaLower.includes(keyword)) score += 1;
      });

      return { item, score };
    })
      .filter((r) => r.score > 0)
      .map((r) => r.item);

    // Apply category filters
    const filtered = filter === "all" ? scored : scored.filter((r) => r.type === filter);

    // Apply sorting
    if (sortBy === "date") {
      return [...filtered].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    } else if (sortBy === "rating") {
      return [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [query, filter, sortBy]);

  const groupedResults = React.useMemo(() => {
    const groups: Record<string, SearchResult[]> = {
      campsite: [],
      event: [],
      member: [],
      trip: [],
    };
    results.forEach((r) => {
      groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  const totalResults = results.length;

  const TYPE_CONFIG = {
    campsite: { icon: Tent, badge: "Campsite", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
    event: { icon: Compass, badge: "Event", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
    member: { icon: User, badge: "Member", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
    trip: { icon: Flame, badge: "Trip", color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-start justify-center pt-20 px-4 transition-all duration-300"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="w-full max-w-2xl bg-card border border-border/80 shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-up fire-glow">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border/40 relative">
          <Search className="h-5 w-5 text-primary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campsites, events, leaders, or trail stories..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                saveRecent(query);
              }
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 bg-muted/40 rounded-lg transition-colors border border-border/30"
          >
            Esc
          </button>
        </div>

        {/* Filters and Sorting bar */}
        {query.trim() && (
          <div className="flex items-center justify-between px-4 py-2 bg-muted/20 border-b border-border/20 text-xs gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {(["all", "campsite", "event", "member", "trip"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-2.5 py-1 rounded-full font-semibold capitalize transition-colors ${
                    filter === t
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {t === "all" ? "All Results" : `${t}s`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-muted-foreground font-semibold outline-none cursor-pointer hover:text-foreground"
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="date">Sort: Date</option>
                <option value="rating">Sort: Rating</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Pane */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {!query.trim() ? (
            <div className="space-y-4">
              {/* Recent Searches */}
              {recents.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Recent Searches
                  </h4>
                  <div className="space-y-1">
                    {recents.map((item, index) => (
                      <button
                        key={item}
                        onClick={() => setQuery(item)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/40 rounded-lg text-xs text-foreground/80 font-medium text-left transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground/60" />
                          {item}
                        </span>
                        <X
                          className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-destructive transition-colors p-0.5"
                          onClick={(e) => removeRecent(e, index)}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-accent" /> Popular Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1.5 bg-muted/40 hover:bg-muted border border-border/50 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Search className="h-3 w-3" />
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {totalResults > 0 ? (
                <div className="space-y-4">
                  {(["campsite", "event", "member", "trip"] as const).map((type) => {
                    const list = groupedResults[type];
                    if (list.length === 0) return null;

                    return (
                      <div key={type} className="space-y-2">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/80 border-b border-border/10 pb-1 flex items-center gap-1.5">
                          {type === "campsite" && <Tent className="h-3.5 w-3.5 text-emerald-500" />}
                          {type === "event" && <Compass className="h-3.5 w-3.5 text-blue-500" />}
                          {type === "member" && <User className="h-3.5 w-3.5 text-amber-500" />}
                          {type === "trip" && <Flame className="h-3.5 w-3.5 text-purple-500" />}
                          {type}s ({list.length})
                        </h4>

                        <div className="space-y-1">
                          {list.map((result) => {
                            const conf = TYPE_CONFIG[result.type];
                            const Icon = conf.icon;
                            return (
                              <a
                                key={result.id}
                                href={result.href}
                                onClick={() => handleSelectResult(result)}
                                className="flex items-center justify-between p-3 bg-muted/10 hover:bg-muted/40 border border-border/30 rounded-xl transition-all group cursor-pointer"
                              >
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="h-8 w-8 rounded-lg bg-card border border-border/50 flex items-center justify-center flex-shrink-0 mt-0.5 text-primary">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-foreground leading-tight">{result.title}</p>
                                      <Badge variant="outline" className={`text-[8px] py-0 px-1.5 capitalize font-extrabold tracking-wider ${conf.color}`}>
                                        {conf.badge}
                                      </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground/80 mt-0.5 leading-tight truncate">{result.subtitle}</p>
                                    <p className="text-[10px] text-muted-foreground/60 mt-1 leading-normal break-words line-clamp-1">{result.meta}</p>
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-muted-foreground">No matches found for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-muted-foreground mt-1">Check spelling or search for popular topics</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-border/40 bg-muted/20 flex justify-between items-center text-[10px] text-muted-foreground">
          <span>Tip: Use ↑↓ and Enter to navigate</span>
          <span>ICC Unified Search v1.0</span>
        </div>
      </div>
    </div>
  );
}
