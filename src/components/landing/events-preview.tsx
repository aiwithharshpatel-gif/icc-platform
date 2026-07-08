import * as React from "react";
import Link from "next/link";
import { Calendar, User, Users, MapPin, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventProp {
  id: string;
  title: string;
  location: string;
  date: string;
  price: string | number;
  guide: string;
  guide_title?: string;
  capacity: string;
  availability: string;
  status?: string;
  image_url?: string;
  image?: string;
  description: string;
}

export function EventsPreview({ initialEvents }: { initialEvents?: EventProp[] }) {
  const fallbackEvents = [
    {
      id: "e1",
      title: "Monsoon Trek & Camp",
      location: "Harishchandragad, MH",
      date: "July 15-16, 2026",
      price: "₹2,200",
      guide: "Sameer Joshi",
      capacity: "25 Campers",
      availability: "8 Slots Left",
      status: "accent",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
      description: "Experience the monsoon beauty of Harishchandragad fort, camp above the clouds, and view the iconic Kokankada cliff."
    },
    {
      id: "e2",
      title: "High Altitude Expedition",
      location: "Hampta Pass, HP",
      date: "Aug 10-15, 2026",
      price: "₹9,500",
      guide: "Aryan Negi",
      capacity: "15 Campers",
      availability: "4 Slots Left",
      status: "success",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
      description: "Cross the lush green valleys of Kullu to the stark high-altitude deserts of Spiti Valley over the glorious Hampta Pass."
    },
    {
      id: "e3",
      title: "Beach Trek & Stargazing",
      location: "Gokarna, Karnataka",
      date: "Sept 04-06, 2026",
      price: "₹4,500",
      guide: "Priya Nair",
      capacity: "30 Campers",
      availability: "12 Slots Left",
      status: "default",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80",
      description: "A weekend coastal beach trek covering Om Beach, Half Moon Beach, and Paradise Beach, topped with astronomical stargazing sessions."
    },
  ];

  const displayEvents = initialEvents && initialEvents.length > 0
    ? initialEvents.map((item) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        date: item.date,
        price: typeof item.price === "number" ? `₹${item.price.toLocaleString()}` : item.price,
        guide: item.guide,
        capacity: item.capacity || "20 Campers",
        availability: item.availability || "Open",
        status: item.status || "default",
        image: item.image_url || item.image || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
        description: item.description
      }))
    : fallbackEvents;

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
          {displayEvents.map((event) => (
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
                  {event.description}
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
