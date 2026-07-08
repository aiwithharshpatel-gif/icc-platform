"use client";

import * as React from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Globe,
  Flame,
  Car,
  Info,
  Link as LinkIcon,
  Image as ImageIcon,
  Trophy,
  Compass,
  Tent,
  ArrowLeft,
  UserPlus,
  UserMinus,
} from "lucide-react";

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);
import { followUserAction, unfollowUserAction } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  name: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  city: string;
  state: string;
  phone: string;
  instagram: string;
  twitter: string;
  github: string;
  website: string;
  campingExperience: string;
  vehicle: string;
  bio: string;
  gallery: string[];
  achievements: string[];
  tripsJoined: number;
  eventsOrganized: number;
}

interface MemberProfileViewProps {
  profile: Profile;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
  currentUserId: string | null;
}

const availableAchievements = [
  { id: "monsoon", title: "Monsoon Master", description: "Completed 5+ treks in peak monsoon season.", icon: "🌧️" },
  { id: "eco", title: "Eco-Warrior", description: "Participated in 3+ mountain cleanups.", icon: "🌱" },
  { id: "safety", title: "First Responder", description: "Wilderness first-aid certified ranger.", icon: "🩹" },
  { id: "summit", title: "Summit Climber", description: "Scales passes above 12,000 feet.", icon: "🏔️" },
  { id: "camp", title: "Camp Veteran", description: "Logged 20+ nights under canvas.", icon: "⛺" },
];

export function MemberProfileView({
  profile,
  isFollowing,
  followerCount,
  followingCount,
  currentUserId,
}: MemberProfileViewProps) {
  const [followingState, setFollowingState] = React.useState(isFollowing);
  const [followersCountState, setFollowersCountState] = React.useState(followerCount);
  const [isPending, setIsPending] = React.useState(false);

  // Sync state with localStorage local overrides for mock/development fallback
  React.useEffect(() => {
    const localFollows = JSON.parse(localStorage.getItem("icc_local_follows") || "[]");
    const localUnfollows = JSON.parse(localStorage.getItem("icc_local_unfollows") || "[]");

    requestAnimationFrame(() => {
      if (localFollows.includes(profile.id)) {
        setFollowingState(true);
        if (!isFollowing) {
          setFollowersCountState(followerCount + 1);
        }
      } else if (localUnfollows.includes(profile.id)) {
        setFollowingState(false);
        if (isFollowing) {
          setFollowersCountState(Math.max(0, followerCount - 1));
        }
      } else {
        setFollowingState(isFollowing);
        setFollowersCountState(followerCount);
      }
    });
  }, [profile.id, isFollowing, followerCount]);

  const handleFollowToggle = async () => {
    if (!currentUserId) {
      alert("Please log in to follow community members.");
      return;
    }

    setIsPending(true);
    const nextState = !followingState;

    // Optimistic UI updates
    setFollowingState(nextState);
    setFollowersCountState((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      const action = nextState ? followUserAction : unfollowUserAction;
      const result = await action(profile.id);

      // Database failed (mock runs), write local overrides to localStorage
      if (result?.isFallbackNeeded || !result?.success) {
        if (nextState) {
          const localFollows = JSON.parse(localStorage.getItem("icc_local_follows") || "[]");
          if (!localFollows.includes(profile.id)) {
            localStorage.setItem("icc_local_follows", JSON.stringify([...localFollows, profile.id]));
          }
          // Remove from unfollows list
          const localUnfollows = JSON.parse(localStorage.getItem("icc_local_unfollows") || "[]");
          localStorage.setItem("icc_local_unfollows", JSON.stringify(localUnfollows.filter((id: string) => id !== profile.id)));
        } else {
          const localUnfollows = JSON.parse(localStorage.getItem("icc_local_unfollows") || "[]");
          if (!localUnfollows.includes(profile.id)) {
            localStorage.setItem("icc_local_unfollows", JSON.stringify([...localUnfollows, profile.id]));
          }
          // Remove from follows list
          const localFollows = JSON.parse(localStorage.getItem("icc_local_follows") || "[]");
          localStorage.setItem("icc_local_follows", JSON.stringify(localFollows.filter((id: string) => id !== profile.id)));
        }
      }
    } catch (err) {
      console.error("Follow toggling action failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  const getExperienceDetails = (level: string) => {
    switch (level) {
      case "Expert":
        return {
          title: "Mountain Guide",
          color: "accent" as const,
          description: "Organizes expeditions, guides rookies, and masters off-trail routes.",
        };
      case "Intermediate":
        return {
          title: "Wild Trekker",
          color: "success" as const,
          description: "Comfortable pitching multi-season tents, understands high altitude trekking.",
        };
      default:
        return {
          title: "Camp Greenhorn",
          color: "secondary" as const,
          description: "Exploring the wilderness, joining community-led beginner trips.",
        };
    }
  };

  const exp = getExperienceDetails(profile.campingExperience);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Return back button */}
      <div className="max-w-5xl mx-auto mb-6">
        <Link href="/members" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Directory
        </Link>
      </div>

      {/* Cover Photo Banner */}
      <div className="max-w-5xl mx-auto w-full h-48 sm:h-72 rounded-2xl overflow-hidden bg-muted relative mb-8 group border border-border/40 shadow-sm">
        {profile.coverPhotoUrl ? (
          <img src={profile.coverPhotoUrl} alt="Cover Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-emerald-800 via-teal-900 to-indigo-950 flex items-center justify-center">
            <span className="text-white/15 font-black text-2xl sm:text-4xl tracking-widest uppercase font-display select-none">Indian Camping Community</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        
        {/* Left column: Overview Card */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <Card glass className="border-border/60">
            <CardContent className="pt-8 text-center flex flex-col items-center">
              
              {/* Profile Image */}
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20 shadow-md bg-muted flex items-center justify-center">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-muted-foreground" />
                )}
              </div>

              <h2 className="text-xl font-bold mt-4 tracking-tight">{profile.name}</h2>
              
              {/* Follow Toggle Button */}
              {currentUserId && (
                <Button
                  onClick={handleFollowToggle}
                  disabled={isPending}
                  variant={followingState ? "outline" : "primary"}
                  size="sm"
                  className="mt-4 font-bold text-xs flex items-center gap-1.5"
                >
                  {followingState ? (
                    <>
                      <UserMinus className="h-3.5 w-3.5" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      Follow Member
                    </>
                  )}
                </Button>
              )}

              {/* Camper Badge */}
              <div className="mt-5 flex flex-col items-center">
                <Badge variant={exp.color} className="text-[10px] py-1 px-3 uppercase tracking-wider font-extrabold flex items-center gap-1">
                  <Flame className="h-3 w-3 fill-current" />
                  {exp.title}
                </Badge>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed px-4">
                  {exp.description}
                </p>
              </div>

              {/* Metadata details */}
              <div className="w-full border-t border-border/40 mt-6 pt-4 space-y-3 text-xs text-left">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>
                    {profile.city}, {profile.state}
                  </span>
                </div>
                
                {/* Social Links */}
                <div className="flex flex-col gap-2 pt-2 border-t border-border/20 mt-2">
                  {profile.instagram && (
                    <a
                      href={`https://instagram.com/${profile.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.instagram.startsWith("@") ? profile.instagram : `@${profile.instagram}`}</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <TwitterIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.twitter.startsWith("@") ? profile.twitter : `@${profile.twitter}`}</span>
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <GithubIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>{profile.github}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{profile.website.replace(/(^\w+:|^)\/\//, "")}</span>
                    </a>
                  )}
                </div>

                {profile.vehicle && profile.vehicle !== "None" && (
                  <div className="flex items-center gap-2 text-muted-foreground pt-2 border-t border-border/20">
                    <Car className="h-4 w-4 text-primary shrink-0" />
                    <span>Vehicle: <strong className="text-foreground">{profile.vehicle}</strong></span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Bio, Stats, Achievements & Gallery */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-border/60">
            <CardContent className="pt-6">
              
              <div className="space-y-6 text-sm">
                {/* About Me */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-primary" />
                    About {profile.name.split(" ")[0]}
                  </h4>
                  <p className="text-foreground bg-muted/20 p-4 rounded-xl border border-border/40 leading-relaxed font-sans">
                    {profile.bio || "No biography provided yet."}
                  </p>
                </div>

                {/* Stats panel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/30">
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Trips Joined</p>
                    <p className="text-2xl font-extrabold mt-1 text-primary">{profile.tripsJoined || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Events Org.</p>
                    <p className="text-2xl font-extrabold mt-1 text-primary">{profile.eventsOrganized || 0}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Followers</p>
                    <p className="text-2xl font-extrabold mt-1 text-primary">{followersCountState}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/10 border border-border/40 text-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest text-[10px]">Following</p>
                    <p className="text-2xl font-extrabold mt-1 text-primary">{followingCount}</p>
                  </div>
                </div>

                {/* Achievements Section */}
                <div className="pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    Community Achievements
                  </h4>
                  {profile.achievements && profile.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {availableAchievements.filter(a => profile.achievements.includes(a.title)).map((ach) => (
                        <div key={ach.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/20 border border-border/40">
                          <span className="text-2xl">{ach.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-foreground">{ach.title}</p>
                            <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{ach.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-1 italic">No community achievements earned yet.</p>
                  )}
                </div>

                {/* Gallery Section */}
                <div className="pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Wilderness Gallery
                  </h4>
                  {profile.gallery && profile.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {profile.gallery.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40 bg-muted">
                          <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-355 group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-1 italic">Gallery is empty.</p>
                  )}
                </div>

              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
