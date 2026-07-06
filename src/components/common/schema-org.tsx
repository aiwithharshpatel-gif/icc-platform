import * as React from "react";

export function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    "name": "Indian Camping Community (ICC)",
    "description": "India's largest network for outdoor enthusiasts. Discover verified campsites, participate in community group treks, and explore the Indian wilderness responsibly.",
    "url": "https://indiancampingcommunity.in",
    "logo": "https://indiancampingcommunity.in/favicon.ico",
    "sameAs": [
      "https://www.instagram.com/indiancampingcommunity",
      "https://twitter.com/icc_camping"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Rishikesh",
      "addressRegion": "Uttarakhand",
      "addressCountry": "IN"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
