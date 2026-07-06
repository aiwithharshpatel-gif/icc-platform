"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type LoginInput, type RegisterInput, type ProfileUpdateInput } from "@/lib/validators";

export async function loginAction(data: LoginInput) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signUpAction(data: RegisterInput, origin: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: data.name,
        avatar_url: data.avatarUrl,
        city: data.city,
        state: data.state,
        phone: data.phone,
        instagram: data.instagram,
        camping_experience: data.campingExperience,
        vehicle: data.vehicle,
        bio: data.bio,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPasswordAction(email: string, origin: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/profile`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateProfileAction(data: ProfileUpdateInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update your profile." };
  }

  // Update Postgres profile table (RLS policy allows updates matching user id)
  const { error: dbError } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      avatar_url: data.avatarUrl,
      cover_photo_url: data.coverPhotoUrl,
      city: data.city,
      state: data.state,
      phone: data.phone,
      instagram: data.instagram,
      twitter: data.twitter,
      github: data.github,
      website: data.website,
      camping_experience: data.campingExperience,
      vehicle: data.vehicle,
      bio: data.bio,
      gallery: data.gallery,
      achievements: data.achievements,
      trips_joined: data.tripsJoined,
      events_organized: data.eventsOrganized,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  // Fallback to updating auth metadata if profiles table is not fully set up in client db
  if (dbError) {
    console.warn("DB profiles table update error, updating user metadata instead:", dbError.message);
    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: data.name,
        avatar_url: data.avatarUrl,
        cover_photo_url: data.coverPhotoUrl,
        city: data.city,
        state: data.state,
        phone: data.phone,
        instagram: data.instagram,
        twitter: data.twitter,
        github: data.github,
        website: data.website,
        camping_experience: data.campingExperience,
        vehicle: data.vehicle,
        bio: data.bio,
        gallery: data.gallery,
        achievements: data.achievements,
        trips_joined: data.tripsJoined,
        events_organized: data.eventsOrganized,
      },
    });

    if (authError) {
      return { error: authError.message };
    }
  }

  revalidatePath("/profile");
  revalidatePath(`/members/${user.id}`);
  return { success: true };
}

export async function followUserAction(followingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to follow users." };
  }

  if (user.id === followingId) {
    return { error: "You cannot follow yourself." };
  }

  // Insert follow row
  const { error } = await supabase
    .from("follows")
    .insert({
      follower_id: user.id,
      following_id: followingId,
    });

  if (error) {
    console.warn("DB follows insert error, using localStorage fallback in client component:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath(`/members/${followingId}`);
  revalidatePath("/profile");
  return { success: true };
}

export async function unfollowUserAction(followingId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to unfollow users." };
  }

  // Delete follow row
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", user.id)
    .eq("following_id", followingId);

  if (error) {
    console.warn("DB follows delete error, using localStorage fallback in client component:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath(`/members/${followingId}`);
  revalidatePath("/profile");
  return { success: true };
}
