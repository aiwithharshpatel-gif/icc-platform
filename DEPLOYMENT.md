# ICC Production Deployment Guide

This guide describes how to deploy the Indian Camping Community (ICC) platform to production environments using Vercel, Docker, and self-hosted server deployments.

---

## 1. Environment Variables Configuration

Create a `.env.production` file or configure your cloud provider with the following variables:

```env
# Next.js Application Environment
NEXT_PUBLIC_SITE_URL=https://indiancampingcommunity.in
NODE_ENV=production

# Supabase Connection Variables
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-private-key
```

---

## 2. Database Migrations Setup

Apply all schema migrations sequentially using Supabase CLI or direct SQL injection in your Supabase project console:

1. `20260704120000_campsites_events_schema.sql` — Profiles, Campsites, and Events tables + Trigger syncs
2. `20260704130000_member_module_schema.sql` — Profiles columns expansions and Follow system
3. `20260704140000_event_management_schema.sql` — Events properties expansions and bookings
4. `20260704150000_campsites_directory_schema.sql` — Campsite directory reviews, latitude/longitude mapping
5. `20260704160000_social_feed_schema.sql` — Social feed (Campfire) posts, comments, likes, notifications
6. `20260704170000_admin_dashboard_schema.sql` — Admin panel audit logging, roles, approvals, and report controls

---

## 3. Deploying to Vercel (Recommended)

1. Connect your Github repository to Vercel.
2. Select **Next.js** framework preset.
3. Configure the **Environment Variables** in the Vercel project settings dashboard.
4. Click **Deploy**. Vercel will automatically compile the application, optimize images via Next.js Image Optimizer, and host it on its global CDN edge network.

---

## 4. Deploying via Docker (Self-Hosted)

### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"
CMD ["node", "server.js"]
```

### Run Container

```bash
# Build Docker image
docker build -t icc-platform:latest .

# Run Docker container
docker run -p 3000:3000 --env-file .env.production icc-platform:latest
```

---

## 5. Post-Deployment Verification

Ensure to run these validation tests post-deployment:
- Verify `/sitemap.xml` serves the XML sitemap correct links.
- Verify `/robots.txt` is accessible and lists the correct sitemap location.
- Verify `/manifest.json` loads correctly for PWA compatibility.
- Access `/admin` to verify that layout sidebar navigation renders properly.
