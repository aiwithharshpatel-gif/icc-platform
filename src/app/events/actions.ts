"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type EventCreateInput } from "@/lib/validators";

export async function createEventAction(data: EventCreateInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create an event." };
  }

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title: data.title,
      description: data.description,
      location: data.location,
      google_map_url: data.googleMapUrl,
      price: data.price,
      capacity: String(data.capacity),
      availability: `${data.capacity} Spots Left`,
      status: data.status,
      image_url: data.bannerUrl || null,
      date: data.date,
      difficulty: data.difficulty,
      camping_type: data.campingType,
      checklist: data.checklist,
      photos: data.photos,
      organizer_id: user.id,
      guide: user.user_metadata?.full_name || "Tribe Ranger",
      guide_title: "Community Trek Leader",
    })
    .select()
    .single();

  if (error) {
    console.warn("DB events insert error, falling back to mock save:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  return { success: true, eventId: event.id };
}

export async function updateEventAction(id: string, data: EventCreateInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update an event." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      title: data.title,
      description: data.description,
      location: data.location,
      google_map_url: data.googleMapUrl,
      price: data.price,
      capacity: String(data.capacity),
      status: data.status,
      image_url: data.bannerUrl || null,
      date: data.date,
      difficulty: data.difficulty,
      camping_type: data.campingType,
      checklist: data.checklist,
      photos: data.photos,
    })
    .eq("id", id);

  if (error) {
    console.warn("DB events update error, falling back to mock save:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${id}`);
  return { success: true };
}

export async function deleteEventAction(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete an event." };
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) {
    console.warn("DB events delete error, falling back to mock delete:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  return { success: true };
}

export async function registerForEventAction(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to join events." };
  }

  const { error } = await supabase
    .from("event_registrations")
    .insert({
      user_id: user.id,
      event_id: eventId,
    });

  if (error) {
    console.warn("DB registrations insert error, falling back to mock:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function cancelRegistrationAction(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to cancel registrations." };
  }

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("user_id", user.id)
    .eq("event_id", eventId);

  if (error) {
    console.warn("DB registrations delete error, falling back to mock:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function toggleBookmarkAction(eventId: string, hasBookmarked: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to bookmark events." };
  }

  let error;
  if (hasBookmarked) {
    const { error: err } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("event_id", eventId);
    error = err;
  } else {
    const { error: err } = await supabase
      .from("bookmarks")
      .insert({
        user_id: user.id,
        event_id: eventId,
      });
    error = err;
  }

  if (error) {
    console.warn("DB bookmarks sync error, falling back to mock:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}
