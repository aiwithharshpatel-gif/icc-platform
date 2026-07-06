import * as React from "react";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { CampsitesPreview } from "@/components/landing/campsites-preview";
import { EventsPreview } from "@/components/landing/events-preview";

export default function Home() {
  return (
    <div className="relative">
      {/* Decorative page glow for premium aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <Hero />
      <Introduction />
      <Features />
      <Stats />
      <CampsitesPreview />
      <EventsPreview />
    </div>
  );
}
