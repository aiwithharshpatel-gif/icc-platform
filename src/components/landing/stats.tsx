import * as React from "react";
import { Users, Tent, MapPin, Trash2 } from "lucide-react";

export function Stats() {
  const statsList = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      value: "15,000+",
      label: "Active Campers",
      subtext: "Himalayas to Western Ghats",
    },
    {
      icon: <Tent className="h-6 w-6 text-accent" />,
      value: "250+",
      label: "Verified Sites",
      subtext: "Strict safety inspected",
    },
    {
      icon: <MapPin className="h-6 w-6 text-emerald-500" />,
      value: "1,200+",
      label: "Completed Treks",
      subtext: "Zero major incidents",
    },
    {
      icon: <Trash2 className="h-6 w-6 text-teal-500" />,
      value: "8.5 Tons",
      label: "Trash Collected",
      subtext: "Sustainable cleanup drives",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-primary/5 dark:bg-primary/2">
      {/* Decorative gradients */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statsList.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-2xl glass-panel border border-border/45 shadow-sm hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="p-3 rounded-full bg-background border border-border flex items-center justify-center mb-4 shadow-sm">
                {stat.icon}
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight gradient-text-forest">
                {stat.value}
              </span>
              <span className="text-base font-bold text-foreground mt-2">{stat.label}</span>
              <span className="text-xs text-muted-foreground mt-1 max-w-[150px]">{stat.subtext}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
