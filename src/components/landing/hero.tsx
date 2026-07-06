import * as React from "react";
import Link from "next/link";
import { Compass, Flame, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Visual spotlights and ambient lighting */}
      <div className="absolute top-0 right-1/10 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/5 left-1/10 w-80 h-80 bg-accent/20 dark:bg-accent/15 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Floating badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border border-border/80 text-xs font-semibold text-primary mb-6 shadow-sm">
          <Flame className="h-4 w-4 text-accent animate-pulse-slow" />
          <span>India&apos;s Largest Outdoor Network</span>
        </div>

        {/* Main Headings */}
        <h1 className="animate-slide-up text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.15] mb-6">
          Explore the <span className="gradient-text-forest">Wilds of India</span>,
          <br className="hidden sm:inline" />
          Connect with the <span className="gradient-text-amber">Active Tribe</span>.
        </h1>

        {/* Subtitle */}
        <p className="animate-slide-up text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
          Discover verified campsites, join community-led treks, share camping gear, and create memories under starry Indian skies. From Kasol to Wayanad.
        </p>

        {/* CTAs */}
        <div className="animate-slide-up flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/events" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto group">
              Join Next Camp
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/campsites" className="w-full sm:w-auto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto border border-border">
              <Compass className="h-5 w-5 mr-2 text-primary" />
              Explore Sites
            </Button>
          </Link>
        </div>

        {/* Features micro-row */}
        <div className="animate-fade-in grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 mt-16 pt-8 border-t border-border/50 max-w-3xl w-full text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-950/30 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">100% Verified Campsites</h4>
              <p className="text-xs text-muted-foreground">Inspected safety & sanitation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100/50 dark:bg-emerald-950/30 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Diverse Environments</h4>
              <p className="text-xs text-muted-foreground">Forest, riverways, desert & peak</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100/50 dark:bg-amber-950/30 text-accent">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">Tribe Support</h4>
              <p className="text-xs text-muted-foreground">Gear rental & offline guides</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
