"use client";

import * as React from "react";
import Link from "next/link";
import { CloudLightning, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Proactively log the error to console or error reporter
    console.error("Application rendering fault captured:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 glass-panel p-8 rounded-2xl border border-destructive/20 shadow-md">
        
        {/* Storm/Error icon */}
        <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center animate-bounce">
          <CloudLightning className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tight">Storm on the Trail</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A temporary connection storm blew in, disrupting the path. We&apos;ve logged the incident and our guides are investigating.
          </p>
        </div>

        {/* Action button triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Button
            onClick={() => reset()}
            variant="primary"
            className="w-full sm:w-1/2 justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Climbing Again
          </Button>
          <Link href="/" className="w-full sm:w-1/2">
            <Button
              variant="outline"
              className="w-full justify-center"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Basecamp
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
            Incident Hash: {error.digest}
          </p>
        )}

      </div>
    </div>
  );
}
