import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 px-6 py-16 sm:px-12 sm:py-20 md:px-16 shadow-2xl border border-emerald-500/20">
          {/* Spotlight & decorative glows inside banner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Step Outside Today</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Explore the Wilderness?
            </h2>
            
            <p className="text-base sm:text-lg text-emerald-100/80 leading-relaxed max-w-2xl">
              Join over 15,000+ outdoor enthusiasts across India. Discover verified wilderness campsites, participate in group treks, and rent reliable camping equipment locally.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-base h-13 px-8 shadow-lg border-none w-full sm:w-auto group">
                  Join the Community
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/campsites" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="border-emerald-500/30 text-white hover:bg-white/10 font-bold text-base h-13 px-8 w-full sm:w-auto">
                  Find Campsites
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
