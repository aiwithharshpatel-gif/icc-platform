import * as React from "react";
import { ShieldCheck, Compass, Users, Map, Recycle, Flame } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Features() {
  const featureList = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />,
      title: "Verified Campsites",
      description: "Direct connection with inspected property owners. Zero hidden fees, verified hygiene ratings, and real photos.",
    },
    {
      icon: <Compass className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Community Group Treks",
      description: "Join treks curated by local guides. Safe for solo travelers, families, and complete beginners.",
    },
    {
      icon: <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
      title: "Peer-to-Peer Gear Sharing",
      description: "Don't buy expensive gear. Rent tents, sleeping bags, and lanterns from nearby verified community members.",
    },
    {
      icon: <Flame className="h-6 w-6 text-rose-600 dark:text-rose-400" />,
      title: "Safe Solo Camping",
      description: "Join verified co-camper groups. Women-only batches, direct SOS guides, and 24/7 onsite emergency aid.",
    },
    {
      icon: <Map className="h-6 w-6 text-sky-600 dark:text-sky-400" />,
      title: "Offline Trail Maps",
      description: "Download routes, water source spots, and rescue center directions before you climb out of network range.",
    },
    {
      icon: <Recycle className="h-6 w-6 text-teal-600 dark:text-teal-400" />,
      title: "Eco-Camping Projects",
      description: "Earn reward tokens by participating in mountain cleanup treks and planting indigenous trees.",
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-12 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Platform Features</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            Everything you need to step outside.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            ICC is designed to cover every detail of your journey. From booking verified sites to finding reliable gear and local guides, we have you covered.
          </p>
        </div>

        {/* Features 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureList.map((feature, index) => (
            <Card
              key={index}
              hoverEffect
              className="border border-border/50 hover:border-primary/20 dark:hover:border-primary/40 bg-card/60 dark:bg-card/30"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                <div className="p-3 rounded-xl bg-muted dark:bg-muted/10 shadow-sm flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg font-bold tracking-tight">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
