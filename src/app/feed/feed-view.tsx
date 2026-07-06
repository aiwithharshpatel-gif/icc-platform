"use client";

import * as React from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  Image as ImageIcon,
  Type,
  HelpCircle,
  BarChart3,
  Plus,
  X,
  Bell,
  ChevronDown,
  ChevronUp,
  Reply,
  MoreHorizontal,
  Trash2,
  Flame,
  TrendingUp,
  Users,
  MapPin,
  Camera,
  Sparkles,
  Check,
  Clock,
  Search,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ======================================================
   TYPE DEFINITIONS
   ====================================================== */

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface CommentReply {
  id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  likes_count: number;
  created_at: string;
}

interface Comment {
  id: string;
  author_name: string;
  author_avatar: string | null;
  content: string;
  likes_count: number;
  created_at: string;
  replies: CommentReply[];
}

interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  type: "text" | "photo" | "question" | "poll";
  content: string;
  photos: string[];
  poll_options: PollOption[];
  poll_total_votes: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  tags: string[];
  created_at: string;
  comments?: Comment[];
}

interface Notification {
  id: string;
  type: "like" | "comment" | "reply" | "follow" | "mention" | "poll_result";
  actor_name: string;
  actor_avatar: string | null;
  post_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface FeedViewProps {
  initialPosts: Post[];
  notifications: Notification[];
  userId: string | null;
}

/* ======================================================
   HELPERS
   ====================================================== */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const TYPE_CONFIG = {
  text: { icon: Type, label: "Story", color: "text-blue-500", bg: "bg-blue-500/10" },
  photo: { icon: Camera, label: "Photo", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  question: { icon: HelpCircle, label: "Question", color: "text-amber-500", bg: "bg-amber-500/10" },
  poll: { icon: BarChart3, label: "Poll", color: "text-purple-500", bg: "bg-purple-500/10" },
};

const NOTIFICATION_ICONS: Record<string, { icon: typeof Heart; color: string }> = {
  like: { icon: Heart, color: "text-rose-500" },
  comment: { icon: MessageCircle, color: "text-blue-500" },
  reply: { icon: Reply, color: "text-emerald-500" },
  follow: { icon: Users, color: "text-purple-500" },
  mention: { icon: Sparkles, color: "text-amber-500" },
  poll_result: { icon: BarChart3, color: "text-cyan-500" },
};

/* ======================================================
   AVATAR COMPONENT
   ====================================================== */

function Avatar({ name, avatar, size = "md" }: { name: string; avatar: string | null; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-7 w-7 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  if (avatar) {
    return <img src={avatar} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-border`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary/80 to-emerald-600 flex items-center justify-center text-white font-bold ring-2 ring-border`}>
      {getInitials(name)}
    </div>
  );
}

/* ======================================================
   POST COMPOSER
   ====================================================== */

function PostComposer({ onPost }: { onPost: (post: Post) => void }) {
  const [activeTab, setActiveTab] = React.useState<"text" | "photo" | "question" | "poll">("text");
  const [content, setContent] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [pollOptions, setPollOptions] = React.useState(["", ""]);
  const [isPosting, setIsPosting] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const tabs = [
    { key: "text" as const, icon: Type, label: "Story" },
    { key: "photo" as const, icon: ImageIcon, label: "Photo" },
    { key: "question" as const, icon: HelpCircle, label: "Question" },
    { key: "poll" as const, icon: BarChart3, label: "Poll" },
  ];

  function addPhoto() {
    if (photoUrl.trim() && photos.length < 4) {
      setPhotos([...photos, photoUrl.trim()]);
      setPhotoUrl("");
    }
  }

  function addPollOption() {
    if (pollOptions.length < 6) setPollOptions([...pollOptions, ""]);
  }

  function removePollOption(idx: number) {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== idx));
  }

  async function handlePost() {
    if (!content.trim()) return;
    setIsPosting(true);

    const newPost: Post = {
      id: `fp-local-${Date.now()}`,
      author_id: "local-user",
      author_name: "You",
      author_avatar: null,
      type: activeTab,
      content,
      photos: activeTab === "photo" ? photos : [],
      poll_options: activeTab === "poll"
        ? pollOptions.filter((o) => o.trim()).map((text, i) => ({ id: `opt-new-${i}`, text, votes: 0 }))
        : [],
      poll_total_votes: 0,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      tags: [],
      created_at: new Date().toISOString(),
      comments: [],
    };

    // Simulate server action delay
    await new Promise((r) => setTimeout(r, 600));
    onPost(newPost);

    setContent("");
    setPhotos([]);
    setPhotoUrl("");
    setPollOptions(["", ""]);
    setIsPosting(false);
    setIsFocused(false);
  }

  const placeholders: Record<string, string> = {
    text: "Share a trail story with the tribe...",
    photo: "Describe your camp photo...",
    question: "Ask the camping community a question...",
    poll: "What are we voting on today?",
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-md bg-card">
      <div className="p-4 pb-0">
        {/* Tab Bar */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg mb-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex-1 justify-center ${
                activeTab === tab.key
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex gap-3 items-start">
          <Avatar name="You" avatar={null} />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholders[activeTab]}
            rows={isFocused ? 3 : 1}
            className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-foreground placeholder:text-muted-foreground/60 py-2 transition-all"
          />
        </div>

        {/* Photo Input */}
        {activeTab === "photo" && isFocused && (
          <div className="mt-2 space-y-2 animate-fade-in">
            <div className="flex gap-2">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 px-3 py-1.5 text-xs bg-muted/50 rounded-lg border border-border/50 outline-none focus:border-primary/50 text-foreground"
                onKeyDown={(e) => e.key === "Enter" && addPhoto()}
              />
              <Button variant="outline" size="sm" onClick={addPhoto} className="text-xs h-7 px-2">
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            {photos.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {photos.map((p, i) => (
                  <div key={i} className="relative group">
                    <img src={p} alt="" className="h-16 w-16 rounded-lg object-cover border border-border/50" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Poll Options */}
        {activeTab === "poll" && isFocused && (
          <div className="mt-2 space-y-2 animate-fade-in">
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const copy = [...pollOptions];
                    copy[i] = e.target.value;
                    setPollOptions(copy);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 px-3 py-1.5 text-xs bg-muted/50 rounded-lg border border-border/50 outline-none focus:border-primary/50 text-foreground"
                />
                {pollOptions.length > 2 && (
                  <button onClick={() => removePollOption(i)} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
            {pollOptions.length < 6 && (
              <button onClick={addPollOption} className="text-xs text-primary hover:underline font-medium flex items-center gap-1">
                <Plus className="h-3 w-3" /> Add option
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {(isFocused || content.trim()) && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-border/30 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-accent" />
            <span>Share with the tribe</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="text-xs h-8 px-4 gap-1.5"
          >
            {isPosting ? (
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Posting...
              </span>
            ) : (
              <>
                <Send className="h-3 w-3" /> Post
              </>
            )}
          </Button>
        </div>
      )}
    </Card>
  );
}

/* ======================================================
   POLL WIDGET
   ====================================================== */

function PollWidget({
  options: initialOptions,
  totalVotes: initialTotal,
}: {
  options: PollOption[];
  totalVotes: number;
}) {
  const [options, setOptions] = React.useState(initialOptions);
  const [totalVotes, setTotalVotes] = React.useState(initialTotal);
  const [votedOptionId, setVotedOptionId] = React.useState<string | null>(null);
  const [animating, setAnimating] = React.useState(false);

  function handleVote(optionId: string) {
    if (votedOptionId) return;
    setVotedOptionId(optionId);
    setAnimating(true);

    const updated = options.map((o) =>
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    );
    setOptions(updated);
    setTotalVotes(totalVotes + 1);

    setTimeout(() => setAnimating(false), 600);
  }

  const maxVotes = Math.max(...options.map((o) => o.votes));

  return (
    <div className="space-y-2 mt-3">
      {options.map((option) => {
        const pct = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
        const isVoted = votedOptionId === option.id;
        const isWinning = option.votes === maxVotes && totalVotes > 0;

        return (
          <button
            key={option.id}
            onClick={() => handleVote(option.id)}
            disabled={!!votedOptionId}
            className={`w-full relative overflow-hidden rounded-lg border text-left transition-all group ${
              votedOptionId
                ? isVoted
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/30 bg-muted/20"
                : "border-border/50 bg-card hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            }`}
          >
            {/* Background bar */}
            {votedOptionId && (
              <div
                className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out rounded-lg ${
                  isWinning ? "bg-primary/15" : "bg-muted/40"
                }`}
                style={{ width: animating ? "0%" : `${pct}%` }}
              />
            )}

            <div className="relative flex items-center justify-between px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                {votedOptionId ? (
                  isVoted ? (
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-border/50 flex-shrink-0" />
                  )
                ) : (
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-border/50 group-hover:border-primary/50 transition-colors flex-shrink-0" />
                )}
                <span className={`text-sm ${isVoted ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                  {option.text}
                </span>
              </div>
              {votedOptionId && (
                <span className={`text-xs font-bold flex-shrink-0 ${isWinning ? "text-primary" : "text-muted-foreground"}`}>
                  {pct}%
                </span>
              )}
            </div>
          </button>
        );
      })}
      <p className="text-[10px] text-muted-foreground text-center pt-1">
        {totalVotes} vote{totalVotes !== 1 ? "s" : ""} {votedOptionId ? "• You voted" : "• Tap to vote"}
      </p>
    </div>
  );
}

/* ======================================================
   COMMENT SECTION
   ====================================================== */

function CommentSection({ postId, initialComments }: { postId: string; initialComments: Comment[] }) {
  const [comments, setComments] = React.useState(initialComments);
  const [newComment, setNewComment] = React.useState("");
  const [replyingTo, setReplyingTo] = React.useState<string | null>(null);
  const [replyText, setReplyText] = React.useState("");
  const [likedComments, setLikedComments] = React.useState<Set<string>>(new Set());

  function handleAddComment() {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `fc-new-${Date.now()}`,
      author_name: "You",
      author_avatar: null,
      content: newComment.trim(),
      likes_count: 0,
      created_at: new Date().toISOString(),
      replies: [],
    };
    setComments([...comments, c]);
    setNewComment("");
  }

  function handleAddReply(commentId: string) {
    if (!replyText.trim()) return;
    const reply: CommentReply = {
      id: `fcr-new-${Date.now()}`,
      author_name: "You",
      author_avatar: null,
      content: replyText.trim(),
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    setComments(
      comments.map((c) =>
        c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
      )
    );
    setReplyText("");
    setReplyingTo(null);
  }

  function toggleLikeComment(commentId: string) {
    const next = new Set(likedComments);
    if (next.has(commentId)) next.delete(commentId);
    else next.add(commentId);
    setLikedComments(next);
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="group/comment">
          <div className="flex gap-2.5">
            <Avatar name={comment.author_name} avatar={comment.author_avatar} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="bg-muted/40 rounded-xl rounded-tl-sm px-3 py-2">
                <p className="text-xs font-semibold text-foreground">{comment.author_name}</p>
                <p className="text-xs text-foreground/80 mt-0.5 break-words">{comment.content}</p>
              </div>
              <div className="flex items-center gap-3 mt-1 px-1">
                <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
                <button
                  onClick={() => toggleLikeComment(comment.id)}
                  className={`text-[10px] font-semibold transition-colors ${
                    likedComments.has(comment.id) ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
                  }`}
                >
                  {likedComments.has(comment.id) ? "Liked" : "Like"} ({comment.likes_count + (likedComments.has(comment.id) ? 1 : 0)})
                </button>
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                >
                  Reply
                </button>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-border/30 pl-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-2">
                      <Avatar name={reply.author_name} avatar={reply.author_avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/30 rounded-xl rounded-tl-sm px-3 py-2">
                          <p className="text-[11px] font-semibold text-foreground">{reply.author_name}</p>
                          <p className="text-[11px] text-foreground/80 break-words">{reply.content}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-0.5 px-1 block">{timeAgo(reply.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="flex gap-2 mt-2 ml-4 items-center">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Reply to ${comment.author_name}...`}
                    className="flex-1 px-3 py-1.5 text-xs bg-muted/30 rounded-full border border-border/40 outline-none focus:border-primary/50 text-foreground"
                    onKeyDown={(e) => e.key === "Enter" && handleAddReply(comment.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleAddReply(comment.id)}
                    className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Send className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* New Comment Input */}
      <div className="flex gap-2 items-center pt-1">
        <Avatar name="You" avatar={null} size="sm" />
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-3 py-2 text-xs bg-muted/30 rounded-full border border-border/40 outline-none focus:border-primary/50 text-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
          />
          <button
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   POST CARD
   ====================================================== */

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes_count);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [shareToast, setShareToast] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [photoIdx, setPhotoIdx] = React.useState(0);

  const typeConf = TYPE_CONFIG[post.type];
  const isLong = post.content.length > 280;
  const displayContent = isLong && !expanded ? post.content.slice(0, 280) + "..." : post.content;

  function handleLike() {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/feed#${post.id}`);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  }

  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card group" id={post.id}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-0">
        <div className="flex items-center gap-3">
          <Avatar name={post.author_name} avatar={post.author_avatar} />
          <div>
            <p className="text-sm font-semibold text-foreground leading-tight">{post.author_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="h-2.5 w-2.5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
              <span className="text-muted-foreground/40">·</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${typeConf.color} flex items-center gap-0.5`}>
                <typeConf.icon className="h-2.5 w-2.5" />
                {typeConf.label}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
              <button className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted/50 flex items-center gap-2 text-muted-foreground">
                <Bookmark className="h-3 w-3" /> Save post
              </button>
              <button className="w-full px-3 py-1.5 text-xs text-left hover:bg-muted/50 flex items-center gap-2 text-destructive">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="px-4 pt-3 pb-0">
        {/* Question highlight */}
        {post.type === "question" && (
          <div className="flex items-start gap-2 mb-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <HelpCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Community Question</p>
          </div>
        )}

        {/* Text content */}
        <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {displayContent}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-primary text-xs font-semibold hover:underline ml-1"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Photos */}
        {post.type === "photo" && post.photos.length > 0 && (
          <div className="mt-3 -mx-4">
            <div className="relative">
              <img
                src={post.photos[photoIdx]}
                alt="Camp photo"
                className="w-full h-72 object-cover cursor-pointer"
                onClick={() => setPhotoIdx((photoIdx + 1) % post.photos.length)}
              />
              {post.photos.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPhotoIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === photoIdx ? "w-5 bg-white" : "w-1.5 bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
              {post.photos.length > 1 && (
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-black/40 text-white border-white/20 text-[10px]">
                    {photoIdx + 1}/{post.photos.length}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Poll */}
        {post.type === "poll" && post.poll_options.length > 0 && (
          <PollWidget options={post.poll_options} totalVotes={post.poll_total_votes} />
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] text-primary font-medium hover:underline cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>

      {/* Stats Bar */}
      <div className="flex items-center justify-between px-4 py-2 mt-2 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          {likesCount > 0 && (
            <>
              <span className="h-4 w-4 rounded-full bg-rose-500 flex items-center justify-center">
                <Heart className="h-2.5 w-2.5 text-white fill-white" />
              </span>
              <span>{likesCount}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {post.comments_count > 0 && <span>{post.comments_count + (post.comments?.length || 0)} comments</span>}
          {post.shares_count > 0 && <span>{post.shares_count} shares</span>}
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center border-t border-border/30 px-2">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
            liked
              ? "text-rose-500"
              : "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5"
          }`}
        >
          <Heart className={`h-4 w-4 transition-transform ${liked ? "fill-rose-500 scale-110" : ""}`} />
          <span>{liked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-blue-500 hover:bg-blue-500/5 rounded-lg transition-all"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/5 rounded-lg transition-all relative"
        >
          <Share2 className="h-4 w-4" />
          <span>{shareToast ? "Copied!" : "Share"}</span>
        </button>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg transition-all ${
            bookmarked
              ? "text-accent"
              : "text-muted-foreground hover:text-accent hover:bg-accent/5"
          }`}
        >
          <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-accent" : ""}`} />
          <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 py-3 border-t border-border/30 bg-muted/10 animate-fade-in">
          <CommentSection postId={post.id} initialComments={post.comments || []} />
        </div>
      )}
    </Card>
  );
}

/* ======================================================
   SKELETON LOADER
   ====================================================== */

function PostSkeleton() {
  return (
    <Card className="overflow-hidden border-border/30 bg-card">
      <div className="p-4 space-y-3 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted" />
          <div className="space-y-1.5">
            <div className="h-3 w-28 bg-muted rounded" />
            <div className="h-2 w-16 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-4/5 bg-muted rounded" />
          <div className="h-3 w-3/5 bg-muted rounded" />
        </div>
        <div className="h-44 bg-muted rounded-lg" />
        <div className="flex gap-4">
          <div className="h-8 w-20 bg-muted rounded" />
          <div className="h-8 w-20 bg-muted rounded" />
          <div className="h-8 w-20 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

/* ======================================================
   NOTIFICATIONS PANEL
   ====================================================== */

function NotificationsPanel({ notifications }: { notifications: Notification[] }) {
  const [notifs, setNotifs] = React.useState(notifications);
  const unreadCount = notifs.filter((n) => !n.is_read).length;

  function markRead(id: string) {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  function markAllRead() {
    setNotifs(notifs.map((n) => ({ ...n, is_read: true })));
  }

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden sticky top-24">
      <div className="p-3 border-b border-border/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[10px] text-primary font-semibold hover:underline">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {notifs.map((notif) => {
          const conf = NOTIFICATION_ICONS[notif.type] || NOTIFICATION_ICONS.like;
          const NotifIcon = conf.icon;
          return (
            <button
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`w-full flex items-start gap-2.5 p-3 text-left hover:bg-muted/30 transition-colors border-b border-border/10 ${
                !notif.is_read ? "bg-primary/3" : ""
              }`}
            >
              <div className={`mt-0.5 h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                !notif.is_read ? "bg-primary/10" : "bg-muted/50"
              }`}>
                <NotifIcon className={`h-3.5 w-3.5 ${conf.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs leading-relaxed ${!notif.is_read ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  <span className="font-semibold">{notif.actor_name}</span>{" "}
                  {notif.message}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{timeAgo(notif.created_at)}</p>
              </div>
              {!notif.is_read && (
                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

/* ======================================================
   TRENDING TAGS WIDGET
   ====================================================== */

function TrendingTags() {
  const tags = [
    { tag: "monsoon", count: 234 },
    { tag: "himachal", count: 189 },
    { tag: "solo-trek", count: 156 },
    { tag: "gear-review", count: 142 },
    { tag: "astrophotography", count: 98 },
    { tag: "uttarakhand", count: 87 },
    { tag: "budget-camping", count: 76 },
    { tag: "wildlife", count: 64 },
  ];

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-border/30 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-accent" />
        <span className="text-sm font-bold text-foreground">Trending on Campfire</span>
      </div>
      <div className="p-2">
        {tags.map((t, i) => (
          <button
            key={t.tag}
            className="w-full flex items-center justify-between px-2.5 py-2 hover:bg-muted/30 rounded-lg transition-colors text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground w-4">{i + 1}</span>
              <span className="text-xs font-semibold text-primary group-hover:underline">#{t.tag}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{t.count} posts</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/* ======================================================
   SUGGESTED MEMBERS WIDGET
   ====================================================== */

function SuggestedMembers() {
  const members = [
    { name: "Ravi Teja", title: "Mountain Photographer", followers: 1240 },
    { name: "Ananya Roy", title: "Ultralight Backpacker", followers: 890 },
    { name: "Kabir Das", title: "Trek Leader, Ladakh", followers: 2100 },
  ];

  const [following, setFollowing] = React.useState<Set<string>>(new Set());

  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="p-3 border-b border-border/30 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground">Campers to Follow</span>
      </div>
      <div className="p-2 space-y-1">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/30 transition-colors">
            <Avatar name={m.name} avatar={null} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{m.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{m.title}</p>
            </div>
            <Button
              variant={following.has(m.name) ? "outline" : "primary"}
              size="sm"
              className="text-[10px] h-7 px-2.5"
              onClick={() => {
                const next = new Set(following);
                if (next.has(m.name)) next.delete(m.name);
                else next.add(m.name);
                setFollowing(next);
              }}
            >
              {following.has(m.name) ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ======================================================
   MOBILE NOTIFICATION BELL
   ====================================================== */

function MobileNotifBell({ notifications }: { notifications: Notification[] }) {
  const [open, setOpen] = React.useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="lg:hidden fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(!open)}
        className="h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Bottom Sheet */}
      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl z-50 max-h-[70vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="p-4 border-b border-border/30 flex items-center justify-between sticky top-0 bg-card">
              <span className="text-sm font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Notifications
              </span>
              <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted/50">
                <X className="h-4 w-4" />
              </button>
            </div>
            <NotificationsPanel notifications={notifications} />
          </div>
        </>
      )}
    </div>
  );
}

/* ======================================================
   MAIN FEED VIEW
   ====================================================== */

export default function FeedView({ initialPosts, notifications, userId }: FeedViewProps) {
  const [posts, setPosts] = React.useState(initialPosts);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [filter, setFilter] = React.useState<"all" | "text" | "photo" | "question" | "poll">("all");
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  const loadCountRef = React.useRef(0);

  // Infinite scroll via IntersectionObserver
  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loading]);

  function loadMore() {
    if (loadCountRef.current >= 3) {
      setHasMore(false);
      return;
    }
    setLoading(true);
    loadCountRef.current += 1;

    // Simulate loading more posts (recycle with offset timestamps)
    setTimeout(() => {
      const recycled = initialPosts.slice(0, 3).map((p, i) => ({
        ...p,
        id: `${p.id}-more-${loadCountRef.current}-${i}`,
        created_at: new Date(
          new Date(p.created_at).getTime() - loadCountRef.current * 86400000
        ).toISOString(),
        likes_count: Math.floor(p.likes_count * 0.7),
        comments_count: Math.floor(p.comments_count * 0.5),
      }));
      setPosts((prev) => [...prev, ...recycled]);
      setLoading(false);
      if (loadCountRef.current >= 3) setHasMore(false);
    }, 1200);
  }

  function handleNewPost(post: Post) {
    setPosts([post, ...posts]);
  }

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.type === filter);

  const filterTabs = [
    { key: "all" as const, label: "All Posts" },
    { key: "text" as const, label: "Stories" },
    { key: "photo" as const, label: "Photos" },
    { key: "question" as const, label: "Questions" },
    { key: "poll" as const, label: "Polls" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Hero Banner */}
      <div className="max-w-5xl mx-auto px-4 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-emerald-700 to-emerald-900 p-8 text-primary-foreground">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-6 w-6 text-accent" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Campfire</h1>
            </div>
            <p className="text-sm text-primary-foreground/80 max-w-lg">
              Stories from the trail, questions from the camp, and connections that last beyond the trek.
              Share your wilderness moments with the tribe. 🏕️
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_260px] gap-6">
          {/* ====== LEFT SIDEBAR ====== */}
          <aside className="hidden lg:block space-y-4">
            {/* Quick Nav */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-border/30">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Nav</span>
              </div>
              <div className="p-2 space-y-0.5">
                {[
                  { icon: Flame, label: "Campfire Feed", href: "/feed" },
                  { icon: MapPin, label: "Campsites", href: "/campsites" },
                  { icon: Users, label: "Members", href: "/members" },
                  { icon: Sparkles, label: "Events", href: "/events" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </a>
                ))}
              </div>
            </Card>

            {/* Filter By Type */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="p-3 border-b border-border/30">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter Posts</span>
              </div>
              <div className="p-2 space-y-0.5">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      filter === tab.key
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                    }`}
                  >
                    {tab.key !== "all" && (() => {
                      const Icon = TYPE_CONFIG[tab.key].icon;
                      return <Icon className={`h-3.5 w-3.5 ${TYPE_CONFIG[tab.key].color}`} />;
                    })()}
                    {tab.key === "all" && <Flame className="h-3.5 w-3.5" />}
                    {tab.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* User Mini Profile */}
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <div className="p-4 text-center">
                <Avatar name="You" avatar={null} size="lg" />
                <p className="text-sm font-semibold text-foreground mt-2">Trail Camper</p>
                <p className="text-[10px] text-muted-foreground">Member since 2026</p>
                <div className="flex justify-center gap-4 mt-3 text-center">
                  <div>
                    <p className="text-sm font-bold text-foreground">12</p>
                    <p className="text-[10px] text-muted-foreground">Posts</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">89</p>
                    <p className="text-[10px] text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">34</p>
                    <p className="text-[10px] text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* ====== CENTER FEED ====== */}
          <div className="space-y-4 min-w-0">
            {/* Mobile Filter Bar */}
            <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    filter === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Post Composer */}
            <PostComposer onPost={handleNewPost} />

            {/* Posts */}
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                <PostSkeleton />
                <PostSkeleton />
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            {hasMore && <div ref={sentinelRef} className="h-4" />}

            {/* End of Feed */}
            {!hasMore && (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <Flame className="h-8 w-8 text-accent mx-auto mb-3 opacity-50" />
                <p className="text-sm font-semibold text-muted-foreground">You&apos;ve reached the end of the trail</p>
                <p className="text-xs text-muted-foreground mt-1">Check back later for new stories from the tribe 🏕️</p>
              </div>
            )}
          </div>

          {/* ====== RIGHT SIDEBAR ====== */}
          <aside className="hidden lg:block space-y-4">
            <NotificationsPanel notifications={notifications} />
            <TrendingTags />
            <SuggestedMembers />
          </aside>
        </div>
      </div>

      {/* Mobile Notification Bell */}
      <MobileNotifBell notifications={notifications} />
    </div>
  );
}
