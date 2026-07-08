import * as React from "react";
import Link from "next/link";
import { Star, MapPin, Tent, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CampsiteProp {
  id: string;
  title: string;
  location: string;
  price: string | number;
  rating: number;
  reviews_count?: number;
  reviewsCount?: number;
  tags: string[];
  image_url?: string;
  image?: string;
  description: string;
}

export function CampsitesPreview({ initialCampsites }: { initialCampsites?: CampsiteProp[] }) {
  const fallbackCampsites = [
    {
      id: "c1",
      title: "Camp Roxx",
      location: "Kangojodi, Himachal Pradesh",
      price: "₹2,200",
      rating: 4.8,
      reviewsCount: 248,
      tags: ["Forest", "Adventure", "Zip-lining"],
      image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80",
      description: "Nestled inside a private 1,700-acre pine forest near Nahan. Features alpine cabin tents, nature trails, rock climbing, and zip-lining over pure mountain streams."
    },
    {
      id: "c2",
      title: "Winds Desert Camp",
      location: "Sam Sand Dunes, Jaisalmer",
      price: "₹4,500",
      rating: 4.9,
      reviewsCount: 312,
      tags: ["Desert", "Cultural Show", "Camel Safari"],
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
      description: "Experience royal Rajasthani hospitality at Kanoi near Sam Sand Dunes. Luxury Swiss tents with attached bathrooms, camel safaris, and evening folk performances under Thar's starry skies."
    },
    {
      id: "c3",
      title: "Pawna Lake Camping",
      location: "Thakursai, Lonavala",
      price: "₹1,500",
      rating: 4.7,
      reviewsCount: 512,
      tags: ["Lakeside", "Bonfire & DJ", "Kayaking"],
      image: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80",
      description: "Relax by the calm waters of Pawna Lake in Thakursai. Offers dome tents, delicious local Maharashtrian barbecue, acoustic music nights, and scenic views of Tikona Fort."
    },
  ];

  const displayCampsites = initialCampsites && initialCampsites.length > 0
    ? initialCampsites.map((item) => ({
        id: item.id,
        title: item.title,
        location: item.location,
        price: typeof item.price === "number" ? `₹${item.price.toLocaleString()}` : item.price,
        rating: Number(item.rating || 5.0),
        reviewsCount: Number(item.reviewsCount || item.reviews_count || 0),
        tags: item.tags || [],
        image: item.image_url || item.image || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80",
        description: item.description || "Enjoy fully set up dome tents, fire pits, pristine washrooms, and local hikes guided by our community campsite operators."
      }))
    : fallbackCampsites;

  return (
    <section id="campsites" className="py-24 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Featured Sites</h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Top Rated Campsites of the Month
            </p>
          </div>
          <Link href="/campsites">
            <Button variant="outline" className="group">
              View All Campsites
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCampsites.map((site) => (
            <Card
              key={site.id}
              hoverEffect
              className="overflow-hidden flex flex-col h-full bg-card/40 dark:bg-card/20 border-border/60"
            >
              {/* Image Container with overlay details */}
              <div className="relative h-56 w-full overflow-hidden bg-muted group">
                <img
                   src={site.image}
                  alt={site.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                <Badge variant="accent" className="absolute top-4 right-4 text-xs font-bold shadow-md">
                  {site.price} / night
                </Badge>
              </div>

              {/* Card Body */}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{site.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-500 stroke-amber-500" />
                    <span>{site.rating}</span>
                    <span className="text-muted-foreground font-normal">({site.reviewsCount})</span>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">{site.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {site.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] font-semibold tracking-wider uppercase">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {site.description}
                </p>
              </CardContent>

              <CardFooter className="pt-2 border-t border-border/30 bg-muted/10">
                <Link href={`/campsites#${site.id}`} className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-between hover:bg-primary hover:text-primary-foreground group">
                    <span className="flex items-center text-xs font-semibold">
                      <Tent className="h-4 w-4 mr-2" />
                      View Details
                    </span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
