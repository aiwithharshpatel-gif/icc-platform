import * as React from "react";
import Link from "next/link";
import { Calendar, User, Users, MapPin, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function EventsPreview() {
  const events = [
    {
      id: "ev-1",
      title: "Monsoon Valley Trek",
      location: "Bhimashankar, Maharashtra",
      date: "July 18 - 19, 2026",
      price: "₹2,400",
      guide: "Rohan Deshmukh",
      capacity: "15 Max",
      availability: "5 Spots Left",
      status: "accent",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "ev-2",
      title: "Starry Nights over Hampta",
      location: "Manali, Himachal Pradesh",
      date: "Aug 02 - 07, 2026",
      price: "₹9,500",
      guide: "Amit Thakur",
      capacity: "10 Max",
      availability: "Selling Fast",
      status: "success",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "ev-3",
      title: "Coastal Camping & Kayaking",
      location: "Gokarna, Karnataka",
      date: "Aug 15 - 17, 2026",
      price: "₹3,200",
      guide: "Sneha Hegde",
      capacity: "20 Max",
      availability: "Open",
      status: "default",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section id="events" className="py-24 bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Community Events</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Upcoming Wilderness Expeditions
            </p>
          </div>
          <Link href="/events">
            <Button variant="outline" className="group">
              View All Events
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              hoverEffect
              className="overflow-hidden flex flex-col h-full bg-card border-border/50"
            >
              {/* Event Image & Tags */}
              <div className="relative h-56 w-full overflow-hidden bg-muted group">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <Badge
                  variant={event.status as "default" | "secondary" | "accent" | "success"}
                  className="absolute top-4 right-4 text-xs shadow-md"
                >
                  {event.availability}
                </Badge>
                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
                  <Calendar className="h-4 w-4 text-accent fill-accent" />
                  <span>{event.date}</span>
                </div>
              </div>

              {/* Event Body */}
              <CardHeader className="pb-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold mb-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{event.location}</span>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">{event.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-grow space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  Join a group of like-minded outdoor explorers. Led by certified instructors. Gear support, permits, safety sweeps, and meals are included.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/30 text-xs">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground leading-none">Guide</p>
                      <p className="font-semibold text-foreground mt-0.5">{event.guide}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[10px] text-muted-foreground leading-none">Size</p>
                      <p className="font-semibold text-foreground mt-0.5">{event.capacity}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Booking Footer */}
              <CardFooter className="pt-4 border-t border-border/30 bg-muted/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground leading-none">Registration Fee</p>
                  <p className="text-lg font-extrabold text-foreground mt-1">{event.price}</p>
                </div>
                <Link href={`/events#book-${event.id}`}>
                  <Button variant="primary" size="sm">
                    Book Slot
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
