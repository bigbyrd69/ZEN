# Zen — Journaling & Micro‑Vlog Platform

A minimal **Next.js 14+** journaling platform with:
- Private vs World post visibility
- Markdown entries with optional image/video media
- World reader mode with SEO-friendly slug routes
- Supabase RLS for privacy-first access control

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Supabase (Postgres + Auth + Storage/RLS)
- Optional Cloudinary for media compression/transform delivery

## 1) Prerequisites
- Node.js 20+
- npm, pnpm, or yarn
- A Supabase project

## 2) Clone and Install
```bash
git clone <your-repo-url>
cd ZEN
npm install
```

## 3) Environment Variables
Create `.env.local` in repo root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

> The current code uses `@supabase/supabase-js` directly in the app routes/components, so these two vars are required.

## 4) Database Setup (Supabase SQL)
Open Supabase SQL Editor and run:

```sql
-- file: supabase/policies.sql
```

This creates:
- `public.posts`
- `public.comments`
- RLS policies for owner/private + world/public access

### Policy behavior summary
- Posts are readable when:
  - `is_public = true`, **or**
  - `auth.uid() = user_id`
- Comments can be inserted only for public/world posts.

## 5) Run Locally
```bash
npm run dev
```
Open: `http://localhost:3000`

## 6) Main Routes
- Timeline: `/`
- World reader post: `/world/[slug]`

## 7) Styling/Fonts (required for intended look)
The components use `font-playfair` and `font-inter` utility classes. Ensure your Tailwind setup defines these classes (for example via CSS variables or theme extension).

Example Tailwind theme extension:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
} satisfies Config;
```

Also load fonts in your root layout (e.g. `app/layout.tsx`) using `next/font/google` or your preferred method.

## 8) Media Notes (Image/Video)
- Images are rendered with `next/image` and `quality={75}`.
- Video URLs with extensions like `.mp4`, `.webm`, `.mov`, `.m4v` are rendered in a minimal HTML5 player.
- If using external media domains (Cloudinary, Supabase Storage CDN, etc.), add them in `next.config.js` under `images.remotePatterns`.

Example:

```js
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "YOUR_PROJECT.supabase.co" },
    ],
  },
};

module.exports = nextConfig;
```

## 9) Recommended Free Deployment Toolkit
- **Vercel**: host the Next.js app
- **Supabase**: auth + database
- **Cloudinary**: media optimization/transformation

## 10) Production Checklist
- [ ] Add auth flow (sign in/sign up) and pass user context when inserting posts/comments
- [ ] Ensure `slug` uniqueness strategy for similar titles
- [ ] Add markdown rendering/sanitization for reader mode
- [ ] Hook progress bar to real scroll progress
- [ ] Add comment composer + moderation rules
- [ ] Configure OG image metadata for world posts

## 11) Useful Commands
```bash
npm run dev
npm run build
npm run start
npm run lint
```
