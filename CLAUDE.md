# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, Next.js core web vitals + TypeScript rules)
```

No test framework is configured.

## Architecture

**Next.js 16 App Router** application for event RSVP management (Nasty ENRG energy drink launch). TypeScript with strict mode, Tailwind CSS 4, Firebase Firestore backend, Postmark email service.

### Key Layers

- **`app/`** — Pages and API routes (App Router with `"use client"` components)
- **`app/components/`** — UI components: `RsvpForm.tsx` (main form), `modals/`, `ux/` (reusable inputs/buttons)
- **`app/api/sendEmail/route.tsx`** — POST endpoint for Postmark confirmation emails
- **`app/dashboard/page.tsx`** — Admin dashboard with CSV export of guest data
- **`lib/RsvpContext.tsx`** — React Context for global RSVP state (guest lists, pagination, overview stats)
- **`lib/useFetchFirebase.tsx`** — Custom hooks for Firestore real-time listeners with cursor-based pagination
- **`utils/`** — Small helpers: string formatting, user ID generation (SURNAME+4 digits)
- **`types.d.ts`** — Shared TypeScript types (`RsvpFormProps`, `FetchedDataProps`, `RsvpContextProp`, generic form input props)

### Data Flow

1. RSVP form collects guest info with conditional fields (Yes attendees get dietary/vaping/address/Ramadan fields)
2. Submission uses Firestore transactions to atomically update overview doc + add guest to `yes`/`no` subcollection
3. Duplicate detection via email query before write
4. "Yes" RSVPs trigger confirmation email through `/api/sendEmail` (Postmark template ID 43444769)
5. Dashboard reads data via real-time `onSnapshot` listeners

### Firestore Structure

Collection `energLaunch` → Document `rsvp` (overview counters) → Subcollections `yes` and `no` (individual guest records).

### State Management

React Context (`RsvpContext`) wraps the app via `Providers.tsx`. No external state library. Context holds RSVP overview, active form section, pagination cursors, and fetched guest lists.

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_FIREBASE_*` (6 Firebase config vars)
- `POSTMARK_API_KEY`, `POSTMARK_SERVER_WELCOME_KEY`

## Path Alias

`@/*` maps to project root (configured in `tsconfig.json`).
