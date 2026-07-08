"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import { updateEventAction } from "@/app/events/actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileUploader } from "@/components/ui/file-uploader";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  google_map_url: string;
  date: string;
  price: number;
  capacity: number;
  status: string;
  image_url: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  camping_type: string;
  checklist: string[];
  photos: string[];
  organizer_id: string | null;
  guide: string;
  guide_title: string;
}

interface EditEventFormProps {
  event: Event;
}

export function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();

  const [checklist, setChecklist] = React.useState<string[]>(event.checklist);
  const [checklistInput, setChecklistInput] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>(event.photos);
  const [photosInput, setPhotosInput] = React.useState("");
  const [statusState, setStatusState] = React.useState(event.status);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      location: event.location,
      googleMapUrl: event.google_map_url,
      price: event.price,
      capacity: event.capacity,
      difficulty: event.difficulty,
      campingType: event.camping_type,
      date: event.date,
      bannerUrl: event.image_url,
      photos: event.photos,
      checklist: event.checklist,
      status: event.status as "Draft" | "Published" | "Cancelled",
    },
  });

  // Sync checklist, photos and status state from local storage overrides on mount if mock data exists
  React.useEffect(() => {
    const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
    const found = localEvents.find((e: { id: string; checklist?: unknown[]; photos?: unknown[]; status?: string }) => e.id === event.id);
    if (found) {
      setChecklist(found.checklist || []);
      setPhotos(found.photos || []);
      setStatusState(found.status);
      setValue("checklist", found.checklist || []);
      setValue("photos", found.photos || []);
    }
  }, [event.id, setValue]);

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

  const onSubmit = async (formData: EventCreateInput) => {
    const finalData = { ...formData, status: statusState as "Draft" | "Published" | "Cancelled" };
    
    try {
      const result = await updateEventAction(event.id, finalData);

      // Local storage fallback for local mock environment
      if (result?.isFallbackNeeded || !result?.success) {
        const localEvents = JSON.parse(localStorage.getItem("icc_local_events") || "[]");
        const foundIndex = localEvents.findIndex((le: { id: string }) => le.id === event.id);
        
        const updatedMockEvent = {
          id: event.id,
          title: finalData.title,
          description: finalData.description,
          location: finalData.location,
          google_map_url: finalData.googleMapUrl,
          date: finalData.date,
          price: finalData.price,
          guide: event.guide || "Community Trek Ranger",
          guide_title: event.guide_title || "Wilderness Organiser",
          capacity: finalData.capacity,
          availability: `${finalData.capacity} Spots Left`,
          status: finalData.status,
          image_url: finalData.bannerUrl || null,
          difficulty: finalData.difficulty,
          camping_type: finalData.campingType,
          checklist: finalData.checklist,
          photos: finalData.photos,
          organizer_id: event.organizer_id,
        };

        if (foundIndex > -1) {
          localEvents[foundIndex] = updatedMockEvent;
        } else {
          localEvents.unshift(updatedMockEvent);
        }
        
        localStorage.setItem("icc_local_events", JSON.stringify(localEvents));
      }

      router.push(`/events/${event.id}`);
      router.refresh();
    } catch (err) {
      console.error("Event update failed:", err);
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
            Edit Trek Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
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

            {/* Status selection explicitly in editing form */}
            <div className="space-y-1.5 border-t border-border/20 pt-4">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</label>
              <select
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={statusState}
                onChange={(e) => setStatusState(e.target.value as "Draft" | "Published" | "Cancelled")}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Form actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-border/20">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="font-bold text-xs"
              >
                Save Changes
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
