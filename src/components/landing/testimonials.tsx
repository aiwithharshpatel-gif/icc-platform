import * as React from "react";
import { Star, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Solo Backpacker",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "Joining the Gokarna beach trek as a solo female traveler was the best decision. The organizers were highly professional, the safety sweeps were strict, and I met an amazing community of lifelong friends.",
      avatar: "PS",
    },
    {
      name: "Kabir Sen",
      role: "Weekend Trekker",
      location: "Delhi NCR",
      rating: 5,
      text: "The peer-to-peer gear sharing features saved me thousands! I rented a premium double-layered alpine tent and a high-quality sleeping bag directly from a local member in Kasol. Seamless experience.",
      avatar: "KS",
    },
    {
      name: "Vikram Malhotra",
      role: "Family Camper",
      location: "Bangalore, Karnataka",
      rating: 5,
      text: "Every campsite marked as 'Verified' on ICC undergoes actual safety audits. We took our kids to the Riverfront camp in Rishikesh and the sanitation was flawless. Highly recommend the platform!",
      avatar: "VM",
    },
  ];

  return (
    <section className="py-24 bg-muted/20 border-t border-border/50 relative overflow-hidden">
      {/* Background visual spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Camper Stories</h2>
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-5">
            Loved by India&apos;s Outdoor Community
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Discover how seasoned trekkers, weekend backpackers, and families are exploring the Indian wilderness safely and responsibly with ICC.
          </p>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <Card
              key={index}
              hoverEffect
              className="border border-border/60 hover:border-primary/20 dark:hover:border-primary/45 bg-card/70 dark:bg-card/30 flex flex-col justify-between"
            >
              <CardContent className="pt-8 flex flex-col justify-between h-full space-y-6">
                {/* Stars and Text */}
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500 stroke-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90 italic leading-relaxed">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                {/* Camper Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-border/30">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {item.role} &bull; {item.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
