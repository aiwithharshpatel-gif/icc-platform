"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ===================================================
// POST ACTIONS
// ===================================================

export async function createPostAction(data: {
  type: "text" | "photo" | "question" | "poll";
  content: string;
  photos?: string[];
  pollOptions?: { id: string; text: string; votes: number }[];
  tags?: string[];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to post." };
  }

  const { data: post, error } = await supabase
    .from("feed_posts")
    .insert({
      author_id: user.id,
      author_name: user.user_metadata?.full_name || "Trail Camper",
      author_avatar: user.user_metadata?.avatar_url || null,
      type: data.type,
      content: data.content,
      photos: data.photos || [],
      poll_options: data.pollOptions || [],
      poll_total_votes: 0,
      tags: data.tags || [],
    })
    .select()
    .single();

  if (error) {
    console.warn("DB feed_posts insert error:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/feed");
  return { success: true, postId: post.id };
}

export async function deletePostAction(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("feed_posts")
    .delete()
    .eq("id", postId)
    .eq("author_id", user.id);

  if (error) {
    console.warn("DB delete post error:", error.message);
    return { success: false };
  }

  revalidatePath("/feed");
  return { success: true };
}

// ===================================================
// LIKE ACTIONS
// ===================================================

export async function likePostAction(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check if already liked
  const { data: existing } = await supabase
    .from("feed_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single();

  if (existing) {
    // Unlike
    await supabase.from("feed_likes").delete().eq("id", existing.id);
    try { await supabase.rpc("decrement_post_likes", { p_id: postId }); } catch { /* RPC may not exist */ }
    revalidatePath("/feed");
    return { success: true, liked: false };
  } else {
    // Like
    await supabase.from("feed_likes").insert({ user_id: user.id, post_id: postId });
    try { await supabase.rpc("increment_post_likes", { p_id: postId }); } catch { /* RPC may not exist */ }
    revalidatePath("/feed");
    return { success: true, liked: true };
  }
}

export async function likeCommentAction(commentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("feed_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("comment_id", commentId)
    .single();

  if (existing) {
    await supabase.from("feed_likes").delete().eq("id", existing.id);
    return { success: true, liked: false };
  } else {
    await supabase.from("feed_likes").insert({ user_id: user.id, comment_id: commentId });
    return { success: true, liked: true };
  }
}

// ===================================================
// COMMENT ACTIONS
// ===================================================

export async function addCommentAction(data: {
  postId: string;
  content: string;
  parentCommentId?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase.from("feed_comments").insert({
    post_id: data.postId,
    parent_comment_id: data.parentCommentId || null,
    author_id: user.id,
    author_name: user.user_metadata?.full_name || "Trail Camper",
    author_avatar: user.user_metadata?.avatar_url || null,
    content: data.content,
  });

  if (error) {
    console.warn("DB comment insert error:", error.message);
    return { success: false, isFallbackNeeded: true };
  }

  revalidatePath("/feed");
  return { success: true };
}

// ===================================================
// POLL ACTIONS
// ===================================================

export async function votePollAction(postId: string, optionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  // Check existing vote
  const { data: existing } = await supabase
    .from("feed_poll_votes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    return { error: "Already voted", success: false };
  }

  const { error } = await supabase
    .from("feed_poll_votes")
    .insert({ post_id: postId, user_id: user.id, option_id: optionId });

  if (error) {
    console.warn("DB poll vote error:", error.message);
    return { success: false };
  }

  revalidatePath("/feed");
  return { success: true };
}

// ===================================================
// SHARE ACTION
// ===================================================

export async function sharePostAction(postId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("feed_posts")
    .update({ shares_count: 1 }) // Will be handled via increment in real app
    .eq("id", postId);

  if (error) {
    console.warn("DB share increment error:", error.message);
  }

  return { success: true };
}

// ===================================================
// NOTIFICATION ACTIONS
// ===================================================

export async function markNotificationReadAction(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  await supabase
    .from("feed_notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  return { success: true };
}
