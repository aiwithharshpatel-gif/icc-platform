import * as React from "react";
import { TreePine, ShieldAlert, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Introduction() {
  const pillars = [
    {
      icon: <TreePine className="h-8 w-8 text-primary" />,
      title: "Sustainable Coexistence",
      description:
        "We advocate for 'Leave No Trace' principles. Our community conducts regular cleanups, protects forest sanctuaries, and respects local ecosystems.",
    },
    {
      icon: <ShieldAlert className="h-8 w-8 text-accent" />,
      title: "Verified Outdoor Safety",
      description:
        "Every event organizer is verified and runs with strict first-aid safety measures. Campsites undergo seasonal standard hygiene & security audits.",
    },
    {
      icon: <HeartHandshake className="h-8 w-8 text-emerald-500" />,
      title: "Authentic Tribal Bonding",
      description:
        "From cooking together over a bonfire to setting up tents on stormy ridges, we cultivate a non-judgmental environment of sharing and collaboration.",
    },
  ];

  return (
    <section id="about" className="py-20 bg-muted/20 border-y border-border/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Our Mission</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            More than just booking camps. We build the Community.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The Indian Camping Community (ICC) was born out of a desire to unite India&apos;s scattered outdoor enthusiasts. We bridge the gap between remote campsite owners, experienced trek leaders, and greenhorn campers wanting to explore the outdoors responsibly.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <Card
              key={index}
              hoverEffect
              glass
              className="border border-border/60 hover:border-primary/20 dark:hover:border-primary/40"
            >
              <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
                <div className="p-3.5 rounded-2xl bg-muted/60 dark:bg-muted/10 shadow-inner flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold tracking-tight">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
