"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tent, Mail, Send, Globe, Compass, MessageSquare, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema, type NewsletterInput } from "@/lib/validators";

export function Footer() {
  const pathname = usePathname();

  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
  });

  if (pathname?.startsWith("/admin")) return null;

  const onSubmit = async (data: NewsletterInput) => {
    // Simulate API registration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Newsletter subscription success:", data.email);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const footerLinks = [
    {
      title: "Discover",
      links: [
        { label: "Campsites", href: "/campsites" },
        { label: "Upcoming Treks", href: "/events" },
        { label: "Camping Equipment", href: "#" },
        { label: "Popular Trails", href: "#" },
      ],
    },
    {
      title: "Community",
      links: [
        { label: "About ICC", href: "#about" },
        { label: "Community Rules", href: "#" },
        { label: "Forum Discussion", href: "#" },
        { label: "Share Your Gear", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Camping Guides", href: "#" },
        { label: "Safety Protocols", href: "#" },
        { label: "Sponsorships", href: "#" },
        { label: "Support & Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border mt-20 relative overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info Column */}
          <div className="col-span-1 lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
                <Tent className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight flex items-center gap-1">
                <span className="gradient-text-forest font-extrabold font-display">ICC</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-l border-border pl-2.5">
                  Indian Camping
                </span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              India&apos;s premier network for outdoor lovers. Connecting campers, organizers, and environment-conscious wanderers from the Himalayas to the Western Ghats.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Web">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Explore">
                <Compass className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Community">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Contact">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Directory Links Columns */}
          <div className="col-span-1 lg:col-span-5 grid grid-cols-3 gap-4">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col space-y-4">
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter signup Column */}
          <div className="col-span-1 lg:col-span-3 flex flex-col space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Stay Updated</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get upcoming event notifications, trail status updates, and gear discounts sent directly to your inbox.
            </p>
            {isSubmitted ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-lg flex items-center space-x-2 text-emerald-800 dark:text-emerald-400">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span className="text-xs font-medium">Thank you! Welcome to the community.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-9 pr-10 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-50"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-muted text-primary disabled:opacity-50"
                    disabled={isSubmitting}
                    aria-label="Submit newsletter form"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive font-medium pl-1">{errors.email.message}</p>
                )}
              </form>
            )}
          </div>

        </div>

        {/* Legal bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Indian Camping Community. All rights reserved. Made for wanderers across India.
          </p>
          <div className="flex items-center space-x-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
