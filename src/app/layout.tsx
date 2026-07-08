import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import * as React from "react";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-provider";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { SchemaOrg } from "@/components/common/schema-org";
import { Analytics } from "@/components/common/analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Indian Camping Community (ICC) | Explore the Wild, Connect with the Community",
  description:
    "India's largest network for outdoor enthusiasts. Discover verified campsites, participate in community group treks, rent camping gear, and explore the Indian wilderness responsibly.",
  keywords: [
    "camping India",
    "trekking Himalayas",
    "group treks India",
    "verified campsites",
    "camp gear rental",
    "wilderness community",
  ],
  authors: [{ name: "ICC Community Architecture Team" }],
  openGraph: {
    title: "Indian Camping Community (ICC) | Explore the Outdoors",
    description:
      "Join the community. Discover verified campsites, group treks, and peer-to-peer camping gear rental across India.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#113f27" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <SchemaOrg />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <React.Suspense fallback={null}>
            <Analytics />
          </React.Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
