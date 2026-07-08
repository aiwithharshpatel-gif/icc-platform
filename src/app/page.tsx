import * as React from "react";
import { Hero } from "@/components/landing/hero";
import { Introduction } from "@/components/landing/introduction";
import { Features } from "@/components/landing/features";
import { Stats } from "@/components/landing/stats";
import { CampsitesPreview } from "@/components/landing/campsites-preview";
import { EventsPreview } from "@/components/landing/events-preview";
import { Testimonials } from "@/components/landing/testimonials";
import { CtaBanner } from "@/components/landing/cta-banner";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data: dbCampsites } = await supabase
    .from("campsites")
    .select("*")
    .order("rating", { ascending: false })
    .limit(3);

  const { data: dbEvents } = await supabase
    .from("events")
    .select("*")
    .order("id", { ascending: true })
    .limit(3);

  return (
    <div className="relative">
      {/* Decorative page glow for premium aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <Hero />
      <Introduction />
      <Features />
      <Stats />
      <CampsitesPreview initialCampsites={dbCampsites || []} />
      <EventsPreview initialEvents={dbEvents || []} />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}
