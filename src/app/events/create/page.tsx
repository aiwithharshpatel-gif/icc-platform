"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Flame,
  Plus,
  Trash2,
  Image as ImageIcon,
  Compass,
  Link as LinkIcon,
} from "lucide-react";
import { eventCreateSchema, type EventCreateInput } from "@/lib/validators";
import { createEventAction } from "@/app/events/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/ui/file-uploader";

const fallbackEvents = [
  {
    id: "ev-1",
    title: "Monsoon Valley Trek",
    location: "Bhimashankar, Maharashtra",
    google_map_url: "https://maps.google.com/?q=Bhimashankar+Wildlife+Sanctuary",
    date: "July 18 - 19, 2026",
    price: 2400,
    guide: "Rohan Deshmukh",
    guide_title: "Certified Wilderness Guide",
    capacity: 15,
    availability: "10 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    description: "Trek through misty green routes, scaling waterfalls and dense forests of Bhimashankar. Perfect weekend getaway during peak Maharashtra monsoon.",
    difficulty: "Moderate" as const,
    camping_type: "Forest",
    checklist: ["Raincoat/Poncho", "Trekking Shoes", "Water Bottle 2L", "Dry-fit clothes"],
    photos: [
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-3",
  },
  {
    id: "ev-2",
    title: "Starry Nights over Hampta",
    location: "Manali, Himachal Pradesh",
    google_map_url: "https://maps.google.com/?q=Hampta+Pass",
    date: "Aug 02 - 07, 2026",
    price: 9500,
    guide: "Amit Thakur",
    guide_title: "Himalayan Search & Rescue Officer",
    capacity: 10,
    availability: "6 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    description: "A high-altitude transition trek crossing the lush green valleys of Kullu into the desert landscapes of Lahaul. Stargazing at Balu ka Ghera included.",
    difficulty: "Challenging" as const,
    camping_type: "Mountain",
    checklist: ["Warm Jacket (-5C)", "Thermals", "Headlamp", "Sunscreen SPF 50", "Trekking Pole"],
    photos: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-1",
  },
  {
    id: "ev-3",
    title: "Coastal Camping & Kayaking",
    location: "Gokarna, Karnataka",
    google_map_url: "https://maps.google.com/?q=Paradise+Beach+Gokarna",
    date: "Aug 15 - 17, 2026",
    price: 3200,
    guide: "Sneha Hegde",
    guide_title: "Kayaking Instructor & Naturalist",
    capacity: 20,
    availability: "20 Spots Left",
    status: "Published",
    image_url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
    description: "Pitch tents on secluded beaches. Spend days kayaking through mangrove creeks and night bio-luminescence spotting.",
    difficulty: "Easy" as const,
    camping_type: "Coastal",
    checklist: ["Waterproof Bag", "Quick-dry Shorts", "Slippers/Sandals", "Sunglasses", "Mosquito Repellent"],
    photos: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=600&q=80"
    ],
    organizer_id: "m-2",
  },
];

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicate");

  const [checklist, setChecklist] = React.useState<string[]>([]);
  const [checklistInput, setChecklistInput] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [photosInput, setPhotosInput] = React.useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      googleMapUrl: "",
      price: 1500,
      capacity: 15,
      difficulty: "Easy",
      campingType: "Mountain",
      date: "",
      bannerUrl: "",
      photos: [],
      checklist: [],
      status: "Published",
    },
  });

  // Prefill details if duplicating an event
  React.useEffect(() => {
    if (duplicateId) {
      // Check local storage events first
      const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
      let original = localEvents.find((e: { id: string }) => e.id === duplicateId);
      
      if (!original) {
        original = fallbackEvents.find((e) => e.id === duplicateId);
      }

      if (original) {
        reset({
          title: `Copy of ${original.title}`,
          description: original.description || "",
          location: original.location,
          googleMapUrl: original.google_map_url || "",
          price: Number(original.price),
          capacity: Number(original.capacity),
          difficulty: original.difficulty,
          campingType: original.camping_type,
          date: original.date,
          bannerUrl: original.image_url || "",
          photos: original.photos || [],
          checklist: original.checklist || [],
          status: "Draft", // default duplicated to draft
        });
        setChecklist(original.checklist || []);
        setPhotos(original.photos || []);
      }
    }
  }, [duplicateId, reset]);

  const bannerUrlValue = watch("bannerUrl");

  const addChecklistItem = () => {
    if (checklistInput.trim()) {
      const updated = [...checklist, checklistInput.trim()];
      setChecklist(updated);
      setValue("checklist", updated, { shouldValidate: true });
      setChecklistInput("");
    }
  };

  const removeChecklistItem = (idx: number) => {
    const updated = checklist.filter((_, i) => i !== idx);
    setChecklist(updated);
    setValue("checklist", updated, { shouldValidate: true });
  };

  const addPhotoUrl = () => {
    if (photosInput.trim()) {
      const updated = [...photos, photosInput.trim()];
      setPhotos(updated);
      setValue("photos", updated, { shouldValidate: true });
      setPhotosInput("");
    }
  };

  const removePhotoUrl = (idx: number) => {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    setValue("photos", updated, { shouldValidate: true });
  };

  const handleSave = async (formData: EventCreateInput, type: "Draft" | "Published") => {
    const finalData = { ...formData, status: type };
    
    try {
      const result = await createEventAction(finalData);

      // Local storage fallback for local mock environment
      if (result?.isFallbackNeeded || !result?.success) {
        const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
        const newMockEvent = {
          id: `ev-mock-${Math.floor(1000 + Math.random() * 9000)}`,
          title: finalData.title,
          description: finalData.description,
          location: finalData.location,
          google_map_url: finalData.googleMapUrl,
          date: finalData.date,
          price: finalData.price,
          guide: "Community Trek Ranger",
          guide_title: "Wilderness Organiser",
          capacity: finalData.capacity,
          availability: `${finalData.capacity} Spots Left`,
          status: finalData.status,
          image_url: finalData.bannerUrl || null,
          difficulty: finalData.difficulty,
          camping_type: finalData.campingType,
          checklist: finalData.checklist,
          photos: finalData.photos,
          organizer_id: "m-3", // default to a mock organizer ID
        };
        
        localStorage.setItem("icc_local_events", JSON.stringify([newMockEvent, ...localEvents]));
      }

      router.push("/events");
      router.refresh();
    } catch (err) {
      console.error("Event creation failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
      
      {/* Return link */}
      <div className="mb-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Cancel and Back
        </button>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-extrabold tracking-tight font-display">
            {duplicateId ? "Duplicate Trek Event" : "Organize New Trek Event"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Event Title</label>
              <input
                type="text"
                placeholder="e.g., Harishchandragad Night Trek"
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trek Description</label>
              <textarea
                rows={4}
                placeholder="Provide itinerary, meeting point, guidelines..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-sans"
                disabled={isSubmitting}
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Calendar className="h-4 w-4 text-primary" /> Date</label>
                <input
                  type="text"
                  placeholder="e.g., July 18 - 19, 2026"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("date")}
                />
                {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> Location</label>
                <input
                  type="text"
                  placeholder="e.g., Igatpuri, Maharashtra"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("location")}
                />
                {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Trek Fee (₹)</label>
                <input
                  type="number"
                  placeholder="1500"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>

              {/* Capacity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Camper Capacity</label>
                <input
                  type="number"
                  placeholder="20"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("capacity", { valueAsNumber: true })}
                />
                {errors.capacity && <p className="text-xs text-destructive">{errors.capacity.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Flame className="h-4 w-4 text-primary" /> Difficulty</label>
                <select
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("difficulty")}
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
                {errors.difficulty && <p className="text-xs text-destructive">{errors.difficulty.message}</p>}
              </div>

              {/* Camping Type / Terrain */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1"><Compass className="h-4 w-4 text-primary" /> Terrain Type</label>
                <input
                  type="text"
                  placeholder="e.g., Riverside, Mountain, Coastal"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                  {...register("campingType")}
                />
                {errors.campingType && <p className="text-xs text-destructive">{errors.campingType.message}</p>}
              </div>
            </div>

            {/* Google Map URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><LinkIcon className="h-4 w-4 text-primary" /> Google Maps Link</label>
              <input
                type="text"
                placeholder="https://maps.google.com/?q=..."
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
                {...register("googleMapUrl")}
              />
              {errors.googleMapUrl && <p className="text-xs text-destructive">{errors.googleMapUrl.message}</p>}
            </div>

            {/* Banner Image */}
            <div className="space-y-3.5 border-t border-border/20 pt-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"><ImageIcon className="h-4 w-4 text-primary" /> Cover Banner Image</label>
              <FileUploader
                value={bannerUrlValue}
                onUploadComplete={(url) => setValue("bannerUrl", url, { shouldValidate: true })}
              />
              {errors.bannerUrl && <p className="text-xs text-destructive">{errors.bannerUrl.message}</p>}
            </div>

            {/* Checklist adder */}
            <div className="space-y-3 border-t border-border/20 pt-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Required Checklist Items</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add item, e.g., Trekking Shoes"
                  className="flex-grow bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={checklistInput}
                  onChange={(e) => setChecklistInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addChecklistItem();
                    }
                  }}
                />
                <Button type="button" onClick={addChecklistItem} variant="outline" size="sm" className="font-bold flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>
              
              {checklist.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {checklist.map((item, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] font-medium py-1 px-2.5 flex items-center gap-1">
                      <span>{item}</span>
                      <button type="button" onClick={() => removeChecklistItem(idx)} className="text-muted-foreground hover:text-foreground">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Scenery Photos gallery adder */}
            <div className="space-y-3 border-t border-border/20 pt-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Scenery Gallery URLs</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste photo URL"
                  className="flex-grow bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  value={photosInput}
                  onChange={(e) => setPhotosInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPhotoUrl();
                    }
                  }}
                />
                <Button type="button" onClick={addPhotoUrl} variant="outline" size="sm" className="font-bold flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40">
                      <img src={url} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePhotoUrl(idx)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white rounded-lg hover:bg-black/80 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/20">
              <Button
                type="button"
                onClick={handleSubmit((data) => handleSave(data, "Draft"))}
                disabled={isSubmitting}
                variant="outline"
                className="font-bold text-xs"
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                onClick={handleSubmit((data) => handleSave(data, "Published"))}
                disabled={isSubmitting}
                variant="primary"
                className="font-bold text-xs"
              >
                Publish Event
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
