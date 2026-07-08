"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Tent, Search, User as UserIcon, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/common/global-search";
import { supabase } from "@/lib/supabase/client";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<string>("member");
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Fetch session user and role
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        const { data: roleData } = await supabase
          .from("admin_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();
        if (roleData?.role) {
          setRole(roleData.role);
        }
      }
    };
    fetchUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        supabase
          .from("admin_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data: rData }: { data: { role: string } | null }) => {
            if (rData?.role) setRole(rData.role);
          });
      } else {
        setUser(null);
        setRole("member");
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Campsites", href: "/campsites" },
    { label: "Events", href: "/events" },
    { label: "Members", href: "/members" },
    { label: "Campfire", href: "/feed" },
    { label: "About ICC", href: pathname === "/" ? "#about" : "/#about" },
    { label: "Features", href: pathname === "/" ? "#features" : "/#features" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        scrolled
          ? "glass-nav py-3 shadow-md"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-md">
              <Tent className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight flex items-center gap-1.5">
              <span className="gradient-text-forest font-extrabold font-display">ICC</span>
              <span className="hidden sm:inline-block text-xs font-semibold uppercase tracking-wider text-muted-foreground border-l border-border pl-2.5">
                Indian Camping
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group py-1"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="hidden md:flex items-center space-x-3.5">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none transition-colors border border-border/40 flex items-center gap-2 text-xs font-semibold px-3 h-9"
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline text-muted-foreground/60">Search...</span>
            </button>
            <ThemeToggle />
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/80 to-emerald-600 flex items-center justify-center text-white font-bold text-xs shadow-sm cursor-pointer border border-border"
                >
                  {user.user_metadata?.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "C"}
                </button>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                    <div className="absolute right-0 mt-2.5 w-48 bg-card border border-border/80 rounded-xl shadow-lg py-1.5 z-50 animate-scale-up">
                      <div className="px-3 py-1.5 border-b border-border/30 mb-1">
                        <p className="text-xs font-bold text-foreground truncate">{user.user_metadata?.full_name || "Camper"}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <UserIcon className="h-4 w-4" />
                        My Profile
                      </Link>
                      {(role === "admin" || role === "moderator") && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-border/30 my-1" />
                      <button
                        onClick={async () => {
                          setIsProfileOpen(false);
                          await supabase.auth.signOut();
                          router.push("/");
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors pr-1">
                  Log In
                </Link>
                <Link href="/register">
                  <Button variant="accent" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-none font-bold text-xs h-9">
                    Join Community
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu & Toggle */}
          <div className="flex items-center space-x-2.5 md:hidden">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none transition-colors"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-muted focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={cn(
          "md:hidden fixed inset-x-0 top-[65px] glass-panel border-t border-border shadow-lg transition-all duration-300 transform origin-top-left",
          isOpen ? "opacity-100 scale-y-100 visible" : "opacity-0 scale-y-95 invisible pointer-events-none"
        )}
      >
        <div className="px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-all"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-2.5">
            {user ? (
              <>
                <div className="px-3 py-1 bg-muted/20 rounded-lg mb-1 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[10px]">
                    {user.user_metadata?.full_name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "C"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{user.user_metadata?.full_name || "Camper"}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center text-xs h-10 gap-2">
                    <UserIcon className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                {(role === "admin" || role === "moderator") && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="accent" className="w-full justify-center text-xs h-10 gap-2 bg-emerald-800 hover:bg-emerald-950 text-white border-none font-bold">
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="w-full justify-center text-xs h-10 text-red-500 bg-red-500/10 hover:bg-red-500/20 font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full justify-center text-xs h-10">
                    Log In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                  <Button variant="accent" className="w-full justify-center text-xs h-10 bg-orange-500 hover:bg-orange-600 text-white border-none font-bold">
                    Join Community (Register)
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {isSearchOpen && <GlobalSearch onClose={() => setIsSearchOpen(false)} />}
    </header>
  );
}
