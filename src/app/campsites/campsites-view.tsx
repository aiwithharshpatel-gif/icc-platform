"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Star,
  MapPin,
  Search,
  SlidersHorizontal,
  Tent,
  CheckCircle2,
  Calendar,
  Users,
  CheckCircle,
  ShieldAlert,
  X,
  Droplet,
  Compass,
  Car,
  Wifi,
  ChevronLeft,
  ChevronRight,
  Send,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { campsiteBookingSchema, type CampsiteBookingInput } from "@/lib/validators";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface Campsite {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews_count: number;
  terrain: string;
  tags: string[];
  image_url: string | null;
  description: string | null;
  amenities: string[];
  gallery: string[];
  map_url: string;
  latitude: number;
  longitude: number;
  has_water: boolean;
  has_washroom: boolean;
  has_parking: boolean;
  network_details: string;
  difficulty: "Beginner" | "Intermediate" | "Challenging";
  best_season: string;
  nearby_attractions: string[];
  reviews: Review[];
  altitude: number;
  state: string;
}

interface BookingReceipt extends CampsiteBookingInput {
  campsiteTitle: string;
  pricePerNight: number;
  totalNights: number;
  serviceFee: number;
  totalAmount: number;
  bookingId: string;
}

function generateBookingId() {
  return `ICC-CAMP-${Math.floor(100000 + Math.random() * 900000)}`;
}

interface CampsitesViewProps {
  initialCampsites: Campsite[];
}

export function CampsitesView({ initialCampsites }: CampsitesViewProps) {
  const [campsites, setCampsites] = React.useState<Campsite[]>(initialCampsites);
  const [searchState, setSearchState] = React.useState("");
  const [stateFilter, setStateFilter] = React.useState("");
  const [terrainFilter, setTerrainFilter] = React.useState("All");
  const [altitudeRange, setAltitudeRange] = React.useState(2000); // max altitude slider

  const [selectedCampsite, setSelectedCampsite] = React.useState<Campsite | null>(null);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [bookingDetails, setBookingDetails] = React.useState<BookingReceipt | null>(null);

  // Review submission state
  const [reviewName, setReviewName] = React.useState("");
  const [reviewComment, setReviewComment] = React.useState("");
  const [reviewRating, setReviewRating] = React.useState(5);

  // Map panning & zoom simulator states
  const [zoomLevel, setZoomLevel] = React.useState(1);
  const [panX, setPanX] = React.useState(0);
  const [panY, setPanY] = React.useState(0);

  // India bounding coordinates for map plotting
  const minLat = 8;
  const maxLat = 36;
  const minLng = 68;
  const maxLng = 98;

  const getXY = (lat: number, lng: number) => {
    // Latitude (Y coordinate: top is maxLat, bottom is minLat)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    // Longitude (X coordinate: left is minLng, right is maxLng)
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<CampsiteBookingInput>({
    resolver: zodResolver(campsiteBookingSchema),
    defaultValues: {
      checkIn: getTodayString(),
      checkOut: getTomorrowString(),
      guests: 1,
      campsiteId: "",
    },
  });

  const handleOpenDetails = (campsite: Campsite) => {
    setSelectedCampsite(campsite);
    setActiveImageIndex(0);
    setIsSuccess(false);
    reset({
      checkIn: getTodayString(),
      checkOut: getTomorrowString(),
      guests: 1,
      campsiteId: campsite.id,
    });
  };

  const handleClose = () => {
    setSelectedCampsite(null);
    setIsSuccess(false);
  };

  const onBookingSubmit = async (data: CampsiteBookingInput) => {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    if (checkOutDate <= checkInDate) {
      setError("checkOut", {
        type: "manual",
        message: "Check-out date must be after check-in date.",
      });
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));

    const totalNights = Math.max(
      1,
      Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const basePrice = totalNights * (selectedCampsite?.price || 0);
    const serviceFee = 150 * data.guests;
    const totalAmount = basePrice + serviceFee;

    setBookingDetails({
      ...data,
      campsiteTitle: selectedCampsite?.title || "",
      pricePerNight: selectedCampsite?.price || 0,
      totalNights,
      serviceFee,
      totalAmount,
      bookingId: generateBookingId(),
    });
    setIsSuccess(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampsite || !reviewName.trim() || !reviewComment.trim()) return;

    const newReview: Review = {
      id: `rev-add-${Date.now()}`,
      name: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    const updatedReviews = [newReview, ...selectedCampsite.reviews];
    const newRating = Number(
      ((selectedCampsite.rating * selectedCampsite.reviews_count + reviewRating) /
        (selectedCampsite.reviews_count + 1)).toFixed(1)
    );

    const updatedCampsites = campsites.map((cs) => {
      if (cs.id === selectedCampsite.id) {
        return {
          ...cs,
          reviews: updatedReviews,
          reviews_count: cs.reviews_count + 1,
          rating: newRating,
        };
      }
      return cs;
    });

    setCampsites(updatedCampsites);
    setSelectedCampsite({
      ...selectedCampsite,
      reviews: updatedReviews,
      reviews_count: selectedCampsite.reviews_count + 1,
      rating: newRating,
    });

    // Reset review inputs
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  // Compile list of unique states
  const uniqueStates = Array.from(new Set(campsites.map((c) => c.state)));

  // Filter campsites
  const filteredCampsites = campsites.filter((cs) => {
    const matchesSearch =
      cs.title.toLowerCase().includes(searchState.toLowerCase()) ||
      cs.location.toLowerCase().includes(searchState.toLowerCase()) ||
      cs.description?.toLowerCase().includes(searchState.toLowerCase());

    const matchesState =
      !stateFilter || cs.state.toLowerCase() === stateFilter.toLowerCase();

    const matchesTerrain =
      terrainFilter === "All" || cs.terrain.toLowerCase() === terrainFilter.toLowerCase();

    const matchesAltitude = cs.altitude <= altitudeRange;

    return matchesSearch && matchesState && matchesTerrain && matchesAltitude;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Title */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display mb-3">
          Explore Vetted Campsites
        </h1>
        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Book riverside escapes, alpine meadows, ridge camps, and coastal sanctuaries. Verify amenities, check network signals, and reserve slots securely.
        </p>
      </div>

      {/* Main split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Search, Filters & Cards Directory */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Filters card */}
          <div className="glass-panel border border-border/70 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Keywords Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search name or features..."
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={searchState}
                  onChange={(e) => setSearchState(e.target.value)}
                />
              </div>

              {/* State Filter */}
              <div className="relative">
                <select
                  className="w-full bg-background border border-border rounded-lg text-xs py-2 px-3 focus:outline-none"
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                >
                  <option value="">All Regions / States</option>
                  {uniqueStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Altitude & Terrain filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-border/30 pt-3.5 gap-4">
              {/* Terrain categories */}
              <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                {["All", "Riverside", "Forest", "Lake", "Mountains"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTerrainFilter(type)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                      terrainFilter === type
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-muted/50 text-muted-foreground border border-border/40 hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Altitude slider */}
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Max Altitude:</span>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  className="w-24 sm:w-32 accent-primary cursor-pointer"
                  value={altitudeRange}
                  onChange={(e) => setAltitudeRange(Number(e.target.value))}
                />
                <span className="text-xs font-bold text-foreground w-14 text-right shrink-0">{altitudeRange}m</span>
              </div>
            </div>

          </div>

          {/* Campsite cards */}
          {filteredCampsites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filteredCampsites.map((campsite) => {
                const isSelected = selectedCampsite?.id === campsite.id;
                return (
                  <Card
                    key={campsite.id}
                    hoverEffect
                    onClick={() => handleOpenDetails(campsite)}
                    className={`overflow-hidden flex flex-col h-full bg-card border-border/50 shadow-sm cursor-pointer transition-all ${
                      isSelected ? "ring-2 ring-primary border-primary" : ""
                    }`}
                  >
                    {/* Banner Image */}
                    <div className="relative h-44 w-full bg-muted overflow-hidden">
                      <img src={campsite.image_url || ""} alt={campsite.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      
                      {/* Price Badge */}
                      <Badge variant="accent" className="absolute top-3 left-3 text-[10px] font-bold py-0.5 px-2">
                        ₹{campsite.price} / Night
                      </Badge>

                      {/* Terrain Badge */}
                      <Badge variant="outline" className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider bg-black/40 text-white border-white/20">
                        {campsite.terrain}
                      </Badge>

                      {/* Location string */}
                      <div className="absolute bottom-3 left-3 text-white text-[11px] font-semibold flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-accent" />
                        <span className="line-clamp-1">{campsite.location}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardHeader className="pb-1 pt-4">
                      <CardTitle className="text-base font-bold text-foreground line-clamp-1">
                        {campsite.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow space-y-3.5">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[36px]">
                        {campsite.description}
                      </p>

                      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-border/30">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{campsite.rating}</span>
                          <span className="text-[10px] text-muted-foreground font-normal">({campsite.reviews_count} reviews)</span>
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground">
                          {campsite.altitude}m Elevation
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-2 pb-4 bg-muted/10 border-t border-border/30 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        {campsite.has_water && <span title="Water available"><Droplet className="h-3.5 w-3.5 text-primary" /></span>}
                        {campsite.has_washroom && <span title="Washroom available"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /></span>}
                        {campsite.has_parking && <span title="Parking available"><Car className="h-3.5 w-3.5 text-primary" /></span>}
                        {campsite.network_details.toLowerCase().includes("good") && <span title="Good Network"><Wifi className="h-3.5 w-3.5 text-emerald-500" /></span>}
                      </div>
                      <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider flex items-center gap-0.5">
                        Reserve Slot &rarr;
                      </span>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <Tent className="h-10 w-10 text-muted-foreground mx-auto mb-3 animate-bounce" />
              <h4 className="text-base font-bold">No campsites found</h4>
              <p className="text-xs text-muted-foreground mt-2 px-6">
                Try clearing search keywords or broadening the altitude range.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => {
                  setSearchState("");
                  setStateFilter("");
                  setTerrainFilter("All");
                  setAltitudeRange(2000);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

        </div>

        {/* Right Side: Interactive Map Pane */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
          <Card className="border-border/60 overflow-hidden shadow-sm">
            
            {/* Map Header */}
            <CardHeader className="bg-muted/10 border-b border-border/30 pb-3 pt-4 flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Navigation className="h-4 w-4 text-primary" />
                  ICC Interactive Map Grid
                </CardTitle>
                <p className="text-[10px] text-muted-foreground">Plotting coordinates for top campsites in India</p>
              </div>

              {/* Map controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Zoom In"
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(1);
                    setPanX(0);
                    setPanY(0);
                  }}
                  className="p-1.5 border border-border rounded-lg bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-[9px] font-bold"
                  title="Reset View"
                >
                  Reset
                </button>
              </div>
            </CardHeader>

            {/* Map Canvas wrapper */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-indigo-950/80 via-slate-900 to-indigo-900 overflow-hidden select-none border-b border-border/30">
              
              {/* Geographic grid coordinates simulation */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border-r border-b border-white" />
                ))}
              </div>

              {/* India simulated layout contours */}
              <svg className="absolute inset-0 w-full h-full opacity-10 text-white pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <path d="M50 5 C55 10, 65 15, 68 25 C70 30, 80 32, 85 45 C87 50, 80 55, 78 65 C76 75, 72 80, 52 95 C45 90, 48 80, 40 75 C30 70, 25 60, 22 55 C18 45, 12 35, 18 25 C25 20, 35 15, 50 5 Z" strokeWidth="0.5" />
              </svg>

              {/* Map Container subject to Zoom and Panning */}
              <div
                className="absolute inset-0 transition-transform duration-300 origin-center"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                }}
              >
                {/* Plots */}
                {filteredCampsites.map((c) => {
                  const pos = getXY(c.latitude, c.longitude);
                  const isSelected = selectedCampsite?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      className="absolute group z-10"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {/* Marker point */}
                      <button
                        onClick={() => handleOpenDetails(c)}
                        className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground scale-125 ring-4 ring-primary/20 shadow-md z-20 animate-pulse"
                            : "bg-background border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-110 shadow"
                        }`}
                        title={c.title}
                      >
                        <Tent className="h-3 w-3" />
                      </button>

                      {/* Tooltip on hover */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 bg-black/95 text-white text-[9px] py-1.5 px-2.5 rounded-lg border border-white/10 shadow-lg scale-0 group-hover:scale-100 transition-all origin-bottom pointer-events-none w-32 text-center z-30">
                        <p className="font-extrabold line-clamp-1">{c.title}</p>
                        <p className="text-[8px] text-muted-foreground mt-0.5">{c.location}</p>
                        <p className="text-primary mt-1 font-bold">₹{c.price}/night</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pan Navigation Controls overlay */}
              <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20 bg-background/85 border border-border/80 backdrop-blur-md rounded-xl p-1.5">
                <div className="flex justify-center">
                  <button onClick={() => setPanY((y) => y + 20)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-[10px] font-bold">▲</button>
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => setPanX((x) => x + 20)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-[10px] font-bold">◀</button>
                  <button onClick={() => setPanX((x) => x - 20)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-[10px] font-bold">▶</button>
                </div>
                <div className="flex justify-center">
                  <button onClick={() => setPanY((y) => y - 20)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground text-[10px] font-bold">▼</button>
                </div>
              </div>

              {/* Map legend */}
              <div className="absolute bottom-3 left-3 bg-black/60 border border-white/10 backdrop-blur-sm rounded-lg p-2 text-[9px] text-white space-y-1.5 z-20">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span>Selected Campsite</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-background border border-primary" />
                  <span>Other Locations</span>
                </div>
              </div>

            </div>

          </Card>
        </div>

      </div>

      {/* Selected Campsite Details Drawer / Panel Overlay */}
      {selectedCampsite && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border/80 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl relative flex flex-col">
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-background/80 hover:bg-muted border border-border text-muted-foreground hover:text-foreground z-10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              
              {/* Left Column: Details, Attractions & Gallery */}
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 overflow-y-auto">
                
                {/* Title and terrain details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider">
                      {selectedCampsite.terrain} Terrain
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] py-0.5 px-2 font-bold uppercase tracking-wider">
                      {selectedCampsite.difficulty} Difficulty
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">{selectedCampsite.title}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedCampsite.location} (Lat: {selectedCampsite.latitude}, Lng: {selectedCampsite.longitude})
                  </p>
                </div>

                {/* Gallery Slider */}
                {selectedCampsite.gallery && selectedCampsite.gallery.length > 0 && (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border/40">
                      <img
                        src={selectedCampsite.gallery[activeImageIndex]}
                        alt={`Slide ${activeImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {selectedCampsite.gallery.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev === 0 ? selectedCampsite.gallery.length - 1 : prev - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setActiveImageIndex((prev) => (prev === selectedCampsite.gallery.length - 1 ? 0 : prev + 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnails */}
                    {selectedCampsite.gallery.length > 1 && (
                      <div className="flex gap-2">
                        {selectedCampsite.gallery.map((url, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImageIndex(i)}
                            className={`h-11 w-16 rounded-md overflow-hidden border transition-all ${
                              i === activeImageIndex ? "ring-2 ring-primary border-primary scale-105" : "border-border opacity-70"
                            }`}
                          >
                            <img src={url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">About Campsite</h4>
                  <p className="text-xs leading-relaxed text-foreground bg-muted/10 p-4 rounded-xl border border-border/40 font-sans">
                    {selectedCampsite.description}
                  </p>
                </div>

                {/* Detailed Amenities indicators */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Droplet className={`h-4 w-4 shrink-0 ${selectedCampsite.has_water ? "text-primary" : "text-muted-foreground/45"}`} />
                    <span>Water Source: <strong className="text-foreground">{selectedCampsite.has_water ? "Yes (Spring/Tap)" : "Carry Own"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className={`h-4 w-4 shrink-0 ${selectedCampsite.has_washroom ? "text-emerald-500" : "text-muted-foreground/45"}`} />
                    <span>Washroom: <strong className="text-foreground">{selectedCampsite.has_washroom ? "Available (Dry/Wet)" : "Forest Pit"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Car className={`h-4 w-4 shrink-0 ${selectedCampsite.has_parking ? "text-primary" : "text-muted-foreground/45"}`} />
                    <span>Road Access/Parking: <strong className="text-foreground">{selectedCampsite.has_parking ? "Yes" : "No (Trek-in only)"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wifi className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Mobile Signal: <strong className="text-foreground">{selectedCampsite.network_details}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-b border-border/20 pb-4">
                  <div>
                    <span className="text-muted-foreground">Best Season: </span>
                    <strong className="text-foreground">{selectedCampsite.best_season}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Altitude: </span>
                    <strong className="text-foreground">{selectedCampsite.altitude} Meters</strong>
                  </div>
                </div>

                {/* Nearby Attractions */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nearby Attractions</h4>
                  <ul className="list-disc pl-5 text-xs text-muted-foreground leading-relaxed space-y-1">
                    {selectedCampsite.nearby_attractions.map((att, idx) => (
                      <li key={idx} className="text-foreground">{att}</li>
                    ))}
                  </ul>
                </div>

                {/* Reviews listing & review submission */}
                <div className="space-y-4 pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Camper Reviews ({selectedCampsite.reviews_count})</h4>
                  
                  {/* Submission form */}
                  <form onSubmit={handleAddReview} className="space-y-3 bg-muted/15 p-4 rounded-xl border border-border/40">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Add My Review</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name"
                        required
                        className="bg-background border border-border rounded-lg text-xs py-1.5 px-3 focus:outline-none"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                      />
                      <select
                        className="bg-background border border-border rounded-lg text-xs py-1.5 px-2 focus:outline-none"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(Number(e.target.value))}
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Share your camping experience..."
                        required
                        className="flex-grow bg-background border border-border rounded-lg text-xs py-1.5 px-3 focus:outline-none"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <Button type="submit" variant="primary" size="sm" className="font-bold text-[10px] flex items-center gap-1">
                        <Send className="h-3 w-3" /> Post
                      </Button>
                    </div>
                  </form>

                  {/* Reviews lists */}
                  {selectedCampsite.reviews && selectedCampsite.reviews.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      {selectedCampsite.reviews.map((rev) => (
                        <div key={rev.id} className="p-3 bg-muted/5 border border-border/30 rounded-xl space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-bold text-foreground">{rev.name}</span>
                            <span className="text-[10px] text-muted-foreground">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground font-sans">{rev.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic py-1">No reviews yet. Be the first to leave one!</p>
                  )}
                </div>

              </div>

              {/* Right Column: Dynamic Price Booking Form */}
              <div className="lg:col-span-5 p-6 sm:p-8 bg-muted/10 border-l border-border/30 flex flex-col justify-start">
                
                <div className="text-center pb-5 border-b border-border/30 mb-6">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-none">Base Booking Rate</p>
                  <p className="text-3xl font-black mt-2 text-foreground">₹{selectedCampsite.price}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Per night / tent unit</p>
                </div>

                {!isSuccess ? (
                  <form onSubmit={handleSubmit(onBookingSubmit)} className="space-y-5">
                    
                    {/* Check In Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" /> Check-In Date
                      </label>
                      <input
                        type="date"
                        min={getTodayString()}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        disabled={isSubmitting}
                        {...register("checkIn")}
                      />
                      {errors.checkIn && <p className="text-xs text-destructive">{errors.checkIn.message}</p>}
                    </div>

                    {/* Check Out Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-primary" /> Check-Out Date
                      </label>
                      <input
                        type="date"
                        min={getTomorrowString()}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        disabled={isSubmitting}
                        {...register("checkOut")}
                      />
                      {errors.checkOut && <p className="text-xs text-destructive">{errors.checkOut.message}</p>}
                    </div>

                    {/* Guests count */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-primary" /> Campers Count
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        disabled={isSubmitting}
                        {...register("guests", { valueAsNumber: true })}
                      />
                      {errors.guests && <p className="text-xs text-destructive">{errors.guests.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="primary"
                      className="w-full font-bold text-xs uppercase tracking-wider py-3 shadow-md mt-2"
                    >
                      {isSubmitting ? "Calculating..." : "Reserve Wilderness Slot"}
                    </Button>

                  </form>
                ) : (
                  /* Booking success receipt screen */
                  <div className="space-y-6 animate-fade-in text-xs">
                    
                    <div className="text-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/25">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Wilderness Reserved!</h4>
                      <p className="text-[10px] text-muted-foreground">Booking ID: <strong className="text-foreground">{bookingDetails?.bookingId}</strong></p>
                    </div>

                    <div className="border border-border/80 rounded-xl overflow-hidden">
                      <div className="bg-muted/10 p-3.5 border-b border-border/30">
                        <p className="font-bold text-foreground text-center line-clamp-1">{bookingDetails?.campsiteTitle}</p>
                      </div>
                      <div className="p-3.5 space-y-2.5">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Check-In:</span>
                          <span className="font-semibold text-foreground">{bookingDetails?.checkIn}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Check-Out:</span>
                          <span className="font-semibold text-foreground">{bookingDetails?.checkOut}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Camper count:</span>
                          <span className="font-semibold text-foreground">{bookingDetails?.guests} Guests</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Nights stayed:</span>
                          <span className="font-semibold text-foreground">{bookingDetails?.totalNights} Nights</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground border-t border-border/20 pt-2">
                          <span>Base Accommodation:</span>
                          <span className="font-semibold text-foreground">₹{Number(bookingDetails?.pricePerNight) * Number(bookingDetails?.totalNights)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Conservation & Service Fee:</span>
                          <span className="font-semibold text-foreground">₹{bookingDetails?.serviceFee}</span>
                        </div>
                        <div className="flex justify-between text-foreground border-t border-border/30 pt-2 text-sm font-black">
                          <span>Total Paid:</span>
                          <span>₹{bookingDetails?.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setIsSuccess(false)}
                      variant="outline"
                      size="sm"
                      className="w-full font-bold text-xs"
                    >
                      Book Another Visit
                    </Button>
                  </div>
                )}

                {/* Google map link embed mock */}
                {selectedCampsite.map_url && (
                  <div className="mt-8 pt-6 border-t border-border/30 space-y-3.5">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Route Navigation</p>
                    <a
                      href={selectedCampsite.map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      Open Google Maps Link
                      <Navigation className="h-3 w-3" />
                    </a>
                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
