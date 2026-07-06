"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Flame,
  ArrowLeft,
  Bookmark,
  Share2,
  CheckCircle,
  Users,
  Compass,
  Trophy,
  AlertTriangle,
  User,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  Lock,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  registerForEventAction,
  cancelRegistrationAction,
  toggleBookmarkAction,
  deleteEventAction,
  updateEventAction,
} from "@/app/events/actions";

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
  status: string;
  image_url: string | null;
  description: string | null;
  difficulty: "Easy" | "Moderate" | "Challenging";
  camping_type: string;
  checklist: string[];
  photos: string[];
  organizer_id: string | null;
}

interface EventDetailsViewProps {
  event: Event;
  isJoined: boolean;
  isBookmarked: boolean;
  spotsRemaining: number;
  userId: string | null;
}

export function EventDetailsView({
  event,
  isJoined,
  isBookmarked,
  spotsRemaining,
  userId,
}: EventDetailsViewProps) {
  const router = useRouter();
  const [joinedState, setJoinedState] = React.useState(isJoined);
  const [spotsRemainingState, setSpotsRemainingState] = React.useState(spotsRemaining);
  const [bookmarkState, setBookmarkState] = React.useState(isBookmarked);
  const [statusState, setStatusState] = React.useState(event.status);

  const [isPending, setIsPending] = React.useState(false);
  const [shareSuccess, setShareSuccess] = React.useState(false);
  const [checklistChecked, setChecklistChecked] = React.useState<Record<string, boolean>>({});

  const isOrganizer = userId !== null && event.organizer_id === userId;

  // Sync state from localStorage overrides
  React.useEffect(() => {
    // Check local joins
    const localJoins = JSON.parse(localStorage.getItem("icc_local_joins") || "[]");
    const localUnjoins = JSON.parse(localStorage.getItem("icc_local_unjoins") || "[]");

    if (localJoins.includes(event.id)) {
      setJoinedState(true);
      if (!isJoined) {
        setSpotsRemainingState(Math.max(0, spotsRemaining - 1));
      }
    } else if (localUnjoins.includes(event.id)) {
      setJoinedState(false);
      if (isJoined) {
        setSpotsRemainingState(spotsRemaining + 1);
      }
    }

    // Check local bookmarks
    const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
    const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");

    if (localBookmarks.includes(event.id)) {
      setBookmarkState(true);
    } else if (localUnbookmarks.includes(event.id)) {
      setBookmarkState(false);
    }

    // Check custom local event edits or status changes
    const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
    const found = localEvents.find((le: any) => le.id === event.id);
    if (found) {
      setStatusState(found.status);
    }
  }, [event.id, isJoined, isBookmarked, spotsRemaining]);

  const handleJoinToggle = async () => {
    if (!userId) {
      alert("Please log in to join community events.");
      return;
    }

    setIsPending(true);
    const nextJoined = !joinedState;

    // Optimistic UI updates
    setJoinedState(nextJoined);
    setSpotsRemainingState((prev) => (nextJoined ? Math.max(0, prev - 1) : prev + 1));

    try {
      const action = nextJoined ? registerForEventAction : cancelRegistrationAction;
      const result = await action(event.id);

      // Local storage fallback for local mock environment
      if (result?.isFallbackNeeded || !result?.success) {
        if (nextJoined) {
          const localJoins = JSON.parse(localStorage.getItem("icc_local_joins") || "[]");
          if (!localJoins.includes(event.id)) {
            localStorage.setItem("icc_local_joins", JSON.stringify([...localJoins, event.id]));
          }
          const localUnjoins = JSON.parse(localStorage.getItem("icc_local_unjoins") || "[]");
          localStorage.setItem("icc_local_unjoins", JSON.stringify(localUnjoins.filter((id: string) => id !== event.id)));
        } else {
          const localUnjoins = JSON.parse(localStorage.getItem("icc_local_unjoins") || "[]");
          if (!localUnjoins.includes(event.id)) {
            localStorage.setItem("icc_local_unjoins", JSON.stringify([...localUnjoins, event.id]));
          }
          const localJoins = JSON.parse(localStorage.getItem("icc_local_joins") || "[]");
          localStorage.setItem("icc_local_joins", JSON.stringify(localJoins.filter((id: string) => id !== event.id)));
        }
      }
    } catch (err) {
      console.error("Join action failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!userId) {
      alert("Please log in to bookmark events.");
      return;
    }

    const nextBookmarked = !bookmarkState;
    setBookmarkState(nextBookmarked);

    try {
      const result = await toggleBookmarkAction(event.id, bookmarkState);

      if (result?.isFallbackNeeded || !result?.success) {
        if (nextBookmarked) {
          const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
          if (!localBookmarks.includes(event.id)) {
            localStorage.setItem("icc_local_bookmarks", JSON.stringify([...localBookmarks, event.id]));
          }
          const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");
          localStorage.setItem("icc_local_unbookmarks", JSON.stringify(localUnbookmarks.filter((id: string) => id !== event.id)));
        } else {
          const localUnbookmarks = JSON.parse(localStorage.getItem("icc_local_unbookmarks") || "[]");
          if (!localUnbookmarks.includes(event.id)) {
            localStorage.setItem("icc_local_unbookmarks", JSON.stringify([...localUnbookmarks, event.id]));
          }
          const localBookmarks = JSON.parse(localStorage.getItem("icc_local_bookmarks") || "[]");
          localStorage.setItem("icc_local_bookmarks", JSON.stringify(localBookmarks.filter((id: string) => id !== event.id)));
        }
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action is permanent.")) {
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteEventAction(event.id);
      
      // Fallback local storage deletion
      if (result?.isFallbackNeeded || !result?.success) {
        const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
        const updated = localEvents.filter((le: any) => le.id !== event.id);
        localStorage.setItem("icc_local_events", JSON.stringify(updated));
      }
      
      router.push("/events");
      router.refresh();
    } catch (err) {
      console.error("Deletion failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const handleStatusChange = async (newStatus: "Published" | "Cancelled" | "Draft") => {
    setIsPending(true);
    setStatusState(newStatus);

    try {
      const result = await updateEventAction(event.id, {
        title: event.title,
        description: event.description || "",
        location: event.location,
        googleMapUrl: event.google_map_url,
        price: event.price,
        capacity: event.capacity,
        difficulty: event.difficulty,
        campingType: event.camping_type,
        date: event.date,
        bannerUrl: event.image_url || "",
        photos: event.photos,
        checklist: event.checklist,
        status: newStatus,
      });

      if (result?.isFallbackNeeded || !result?.success) {
        const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
        const updated = localEvents.map((le: any) => {
          if (le.id === event.id) {
            return { ...le, status: newStatus };
          }
          return le;
        });
        localStorage.setItem("icc_local_events", JSON.stringify(updated));
      }
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const toggleChecklistItem = (item: string) => {
    setChecklistChecked((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const getDifficultyDetails = (diff: string) => {
    switch (diff) {
      case "Challenging":
        return { color: "accent" as const, title: "Challenging" };
      case "Moderate":
        return { color: "success" as const, title: "Moderate" };
      default:
        return { color: "secondary" as const, title: "Easy" };
    }
  };

  const diff = getDifficultyDetails(event.difficulty);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Return link */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Treks
        </Link>
      </div>

      {/* Main Cover Photo Banner */}
      <div className="max-w-5xl mx-auto w-full h-56 sm:h-80 rounded-2xl overflow-hidden bg-muted relative mb-8 border border-border/40 shadow-sm">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-indigo-950 flex items-center justify-center">
            <span className="text-white/20 font-black text-3xl tracking-widest uppercase font-display">Tribe Adventures</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Left Column: Details & Checklist */}
        <div className="lg:col-span-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider">
                {event.camping_type} Terrain
              </Badge>
              <Badge variant={diff.color} className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider">
                {diff.title}
              </Badge>
              {statusState !== "Published" && (
                <Badge variant="outline" className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider flex items-center gap-1 border-amber-500/30 text-amber-500 bg-amber-500/5">
                  <AlertTriangle className="h-3 w-3" />
                  {statusState}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{event.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-primary" />
                {event.date}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-primary" />
                {event.location}
              </span>
            </div>
          </div>

          {/* Organizer Controls panel (if matches user) */}
          {isOrganizer && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Lock className="h-4 w-4" />
                  <span>Organizer Controls</span>
                </div>
                 <div className="flex flex-wrap gap-2">
                  <Link href={`/events/${event.id}/edit`}>
                    <Button variant="outline" size="sm" className="font-bold text-[10px] flex items-center gap-1">
                      <Edit3 className="h-3 w-3" /> Edit
                    </Button>
                  </Link>
                  <Link href={`/events/${event.id}/edit?duplicate=true`}>
                    <Button variant="outline" size="sm" className="font-bold text-[10px] flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Duplicate
                    </Button>
                  </Link>
                  {statusState === "Draft" ? (
                    <Button
                      onClick={() => handleStatusChange("Published")}
                      disabled={isPending}
                      variant="primary"
                      size="sm"
                      className="font-bold text-[10px]"
                    >
                      Publish
                    </Button>
                  ) : (
                    statusState !== "Cancelled" && (
                      <Button
                        onClick={() => handleStatusChange("Cancelled")}
                        disabled={isPending}
                        variant="outline"
                        size="sm"
                        className="font-bold text-[10px] text-destructive hover:bg-destructive/10"
                      >
                        Cancel Event
                      </Button>
                    )
                  )}
                  <Button
                    onClick={handleDelete}
                    disabled={isPending}
                    variant="outline"
                    size="sm"
                    className="font-bold text-[10px] border-destructive/20 text-destructive hover:bg-destructive/15"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Compass className="h-4 w-4 text-primary" />
                Trek Description
              </h3>
              <p className="text-sm leading-relaxed text-foreground font-sans whitespace-pre-line bg-muted/10 p-4 rounded-xl border border-border/40">
                {event.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          {/* Packing checklist */}
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" />
                Wilderness packing checklist
              </h3>
              <p className="text-[11px] text-muted-foreground mb-4">
                Prepare your backpack. Check items off as you pack them to ensure you don't leave essentials behind:
              </p>
              {event.checklist && event.checklist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.checklist.map((item, idx) => {
                    const isChecked = checklistChecked[item] || false;
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleChecklistItem(item)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                          isChecked
                            ? "bg-emerald-500/5 border-emerald-500/25 text-foreground"
                            : "bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20"
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                        }`}>
                          {isChecked && <CheckCircle className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${isChecked ? "line-through opacity-80" : ""}`}>
                          {item}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-1">No custom checklist items specified.</p>
              )}
            </CardContent>
          </Card>

          {/* Photos gallery */}
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">
                Scenery & Photos
              </h3>
              {event.photos && event.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {event.photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40 bg-muted">
                      <img src={url} alt={`Scenery ${idx + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic py-1">No event scenery photos uploaded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Actions Sidebar & Organizer Profile */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          
          {/* Join Event Ticket Card */}
          <Card glass className="border-border/60">
            <CardContent className="pt-6 space-y-6">
              
              {/* Event Price */}
              <div className="text-center pb-4 border-b border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Trek Fee / Camper</p>
                <p className="text-3xl font-black mt-1 text-foreground">₹{event.price}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Includes permissions, camp guide, and breakfast</p>
              </div>

              {/* Status and spots remaining */}
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Capacity</span>
                  <span className="font-bold text-foreground">{event.capacity} Campers</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Availability</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] ${spotsRemainingState > 0 ? "text-emerald-500" : "text-destructive"}`}>
                    {spotsRemainingState > 0 ? `${spotsRemainingState} Spots Left` : "Filled"}
                  </span>
                </div>
              </div>

              {/* Join / Cancel CTA button */}
              {statusState === "Cancelled" ? (
                <Button disabled className="w-full font-bold text-xs uppercase" variant="outline">
                  Trek Cancelled
                </Button>
              ) : (
                userId && (
                  <Button
                    onClick={handleJoinToggle}
                    disabled={isPending || (spotsRemainingState <= 0 && !joinedState)}
                    variant={joinedState ? "outline" : "primary"}
                    className="w-full font-bold text-xs uppercase shadow-sm"
                  >
                    {joinedState ? "Cancel My Slot" : "Join This Trek"}
                  </Button>
                )
              )}

              {!userId && (
                <p className="text-[10px] text-muted-foreground text-center italic">
                  Log in to join this community trek.
                </p>
              )}

              {/* Bookmark & Share Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={handleBookmarkToggle}
                  variant={bookmarkState ? "outline" : "outline"}
                  size="sm"
                  className={`font-semibold text-xs flex items-center justify-center gap-1.5 ${
                    bookmarkState ? "border-primary/30 bg-primary/5 text-primary" : ""
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${bookmarkState ? "fill-current" : ""}`} />
                  {bookmarkState ? "Bookmarked" : "Bookmark"}
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="font-semibold text-xs flex items-center justify-center gap-1.5 relative"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                  {shareSuccess && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[9px] px-1.5 py-0.5 rounded font-bold whitespace-nowrap flex items-center gap-1 shadow-sm">
                      <CheckCircle className="h-3 w-3 text-emerald-500" /> Link Copied
                    </span>
                  )}
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* Organizer Ranger Info Card */}
          <Card className="border-border/60">
            <CardContent className="pt-6">
              <h4 className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-4">Adventures Guide</h4>
              
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-muted overflow-hidden shrink-0 border border-primary/20 flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-foreground">{event.guide}</h5>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{event.guide_title}</p>
                </div>
              </div>

              {event.organizer_id && (
                <Link href={`/members/${event.organizer_id}`} className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>View Guide Profile</span>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </Link>
              )}

              {event.google_map_url && (
                <a
                  href={event.google_map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block"
                >
                  <Button variant="outline" size="sm" className="w-full text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>View Map Location</span>
                    <MapPin className="h-3 w-3" />
                  </Button>
                </a>
              )}
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
