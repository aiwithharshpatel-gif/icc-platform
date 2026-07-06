This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase Live Integration Guide

To connect the application to a live Supabase database instance:

### 1. Set Up Environment Variables
Create or edit your `.env.local` file in the root folder:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

*Note: If `NEXT_PUBLIC_SUPABASE_URL` is set to the default mock url (`https://mock-project.supabase.co`) or left unset, the project automatically runs in local offline Mock Sandbox Mode.*

### 2. Apply Schema Migrations
Deploy the schema migrations to your live Supabase database. You can do this in two ways:
- **Option A (SQL Editor):** Open the Supabase Dashboard, navigate to the **SQL Editor**, and execute the SQL migration scripts sequentially from `supabase/migrations/` (files `1` through `6`).
- **Option B (Supabase CLI):** Link your project and run:
  ```bash
  npx supabase db push
  ```

### 3. Seed Database Tables
Once the tables are created:
1. Start your local server (`npm run dev`) and sign up/in at `/login`.
2. Visit the **Admin Dashboard** (`/admin`), click **DB Settings** in the sidebar, and press **Seed Default Campsites & Events**.
3. The server action will instantly populate your tables with the default community trek leaders, campsites, and starting events!

