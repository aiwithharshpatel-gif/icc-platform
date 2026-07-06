"use client";

import * as React from "react";
import Link from "next/link";
import { Search, MapPin, SlidersHorizontal, Flame, Users, User, Compass, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Member {
  id: string;
  name: string;
  avatar_url: string;
  cover_photo_url: string;
  city: string;
  state: string;
  camping_experience: string;
  bio: string;
  trips_joined: number;
  events_organized: number;
  followerCount: number;
  followingCount: number;
}

interface MembersViewProps {
  initialMembers: Member[];
}

export function MembersView({ initialMembers }: MembersViewProps) {
  const [search, setSearch] = React.useState("");
  const [experience, setExperience] = React.useState("All");

  const experiences = ["All", "Beginner", "Intermediate", "Expert"];

  // Filter members based on search queries and experience levels
  const filteredMembers = initialMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.city.toLowerCase().includes(search.toLowerCase()) ||
      member.state.toLowerCase().includes(search.toLowerCase()) ||
      member.bio.toLowerCase().includes(search.toLowerCase());

    const matchesExperience =
      experience === "All" || member.camping_experience.toLowerCase() === experience.toLowerCase();

    return matchesSearch && matchesExperience;
  });

  const getExperienceDetails = (level: string) => {
    switch (level) {
      case "Expert":
        return { title: "Mountain Guide", color: "accent" as const };
      case "Intermediate":
        return { title: "Wild Trekker", color: "success" as const };
      default:
        return { title: "Camp Greenhorn", color: "secondary" as const };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Directory Title */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 font-display">
          Meet the Tribe
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Connect with India's largest network of campers, certified mountain guides, and trekking enthusiasts. Share stories, rent gear, and plan your next escape.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel border border-border/80 rounded-xl p-5 mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members by name, city or bio..."
            className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full lg:w-auto items-center justify-start lg:justify-center">
          <span className="text-xs font-bold text-muted-foreground mr-1 uppercase tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Experience:
          </span>
          {experiences.map((exp) => (
            <button
              key={exp}
              onClick={() => setExperience(exp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                experience === exp
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member) => {
            const expDetails = getExperienceDetails(member.camping_experience);
            return (
              <Card
                key={member.id}
                hoverEffect
                className="overflow-hidden flex flex-col h-full bg-card border-border/50 shadow-sm relative group"
              >
                {/* Cover Banner Mock */}
                <div className="h-28 w-full bg-muted overflow-hidden relative border-b border-border/20">
                  {member.cover_photo_url ? (
                    <img src={member.cover_photo_url} alt="Cover Photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-indigo-950" />
                  )}
                  <Badge variant={expDetails.color} className="absolute top-3 right-3 text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider">
                    {expDetails.title}
                  </Badge>
                </div>

                {/* Avatar positioning */}
                <div className="px-6 relative -mt-10 flex justify-between items-end">
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-background shadow-md bg-muted flex items-center justify-center">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <CardContent className="pt-3 flex-grow flex flex-col px-6">
                  <h3 className="font-bold text-lg leading-tight tracking-tight text-foreground">{member.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold mt-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{member.city}, {member.state}</span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mt-3 line-clamp-2 min-h-[32px] font-sans">
                    {member.bio || "No biography provided. Just a wild wanderer exploring India's trails."}
                  </p>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 border-t border-border/30 pt-3 mt-4 text-center text-xs">
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Trips</p>
                      <p className="font-bold text-foreground mt-0.5">{member.trips_joined}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Followers</p>
                      <p className="font-bold text-foreground mt-0.5">{member.followerCount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Events</p>
                      <p className="font-bold text-foreground mt-0.5">{member.events_organized}</p>
                    </div>
                  </div>
                </CardContent>

                {/* Card CTA */}
                <div className="p-4 border-t border-border/30 bg-muted/10">
                  <Link href={`/members/${member.id}`} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-between font-bold text-xs">
                      <span>View Profile</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl max-w-md mx-auto">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-bold">No members found</h3>
          <p className="text-sm text-muted-foreground mt-2 px-6">
            We couldn't find any community members matching "{search}".
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearch("");
              setExperience("All");
            }}
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}
