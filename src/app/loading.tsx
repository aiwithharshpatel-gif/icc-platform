import * as React from "react";
import { Tent } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Centered pulsing emblem */}
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-pulse">
          <Tent className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <div className="space-y-2 flex flex-col items-center">
          <div className="h-4 w-32 bg-muted rounded-md animate-pulse" />
          <div className="h-3 w-48 bg-muted/60 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Grid of cards skeleton representation */}
      <div className="mt-16 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 px-4 opacity-40">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-border rounded-xl p-5 space-y-4 bg-card">
            <div className="h-36 w-full bg-muted rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              <div className="h-3 w-full bg-muted rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
