---
name: create-nextjs-route
description: Generates a new Next.js App Router route with standard boilerplate.
---

# Create Next.js Route Skill

This skill outlines how to create a new page or API route in our Next.js project following standard App Router conventions.

## Context

We use the Next.js App Router (`app/` directory). Every route should have consistent styling (Tailwind CSS) and error handling.

## Steps to Execute

1. **Determine Route Path:** Identify the URL path needed (e.g., `/dashboard/workouts` maps to `apps/<project-name>/app/dashboard/workouts`).
2. **Create the Route Directory:**
   ```bash
   mkdir -p apps/<project-name>/app/<route-path>
   ```
3. **For Pages (`page.tsx`):**
   - Create `page.tsx`.
   - Use standard React server component structure by default.
   - Add strong TypeScript typing for `params` and `searchParams`.
   - Apply Tailwind CSS for all styling.
4. **For API Routes (`route.ts`):**
   - Create `route.ts`.
   - Export named functions for HTTP methods (e.g., `export async function GET(req: Request) {}`).
   - Add appropriate Try/Catch blocks for error handling.
5. **Add Metadata/Loading/Error (Optional but Recommended):**
   - Create `loading.tsx` for Suspense boundaries.
   - Create `error.tsx` using `"use client"` for error boundaries.
   - Export standard `metadata` or `generateMetadata` in `page.tsx` for SEO.
