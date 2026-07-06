import * as React from "react";
import Link from "next/link";
import { Compass, Home, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Decorative campfire amber backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10 glass-panel p-8 rounded-2xl border border-border/60 shadow-md">
        
        {/* Glowing Fire Emblem */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-accent/10 text-accent flex items-center justify-center fire-glow animate-pulse-slow">
          <Flame className="h-10 w-10 text-accent fill-accent animate-bounce" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Off the Trail (404)</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Looks like you&apos;ve wandered into uncharted terrain. There are no campsites or trails recorded at these coordinates. Let&apos;s get you back to the warmth of the community campfire.
          </p>
        </div>

        {/* Directory links */}
        <div className="grid grid-cols-1 gap-3 pt-2 text-sm">
          <Link href="/" className="w-full">
            <Button variant="primary" className="w-full justify-center">
              <Home className="h-4 w-4 mr-2" />
              Return to Basecamp
            </Button>
          </Link>
          <div className="flex gap-3">
            <Link href="/campsites" className="w-full">
              <Button variant="outline" className="w-full justify-center">
                <Compass className="h-4 w-4 mr-2" />
                Find Campsites
              </Button>
            </Link>
            <Link href="/events" className="w-full">
              <Button variant="outline" className="w-full justify-center">
                <Compass className="h-4 w-4 mr-2 text-accent" />
                Join Events
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Indian Camping Community &bull; Safe exploration rules apply.
        </p>

      </div>
    </div>
  );
}
