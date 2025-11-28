# CoagCompanion - Claude Code Project Guide

## Project Overview

**CoagCompanion** is a personal health monitoring web application for tracking Warfarin anticoagulation therapy. It helps users monitor INR (International Normalized Ratio) levels, warfarin dosages, and provides intelligent dose suggestions based on historical data.

**Live URL**: https://coagcompanion.netlify.app
**Tech Stack**: Next.js 16 (App Router), TypeScript, Supabase, Tailwind CSS
**Deployment**: Netlify
**Version**: 1.0.0

---

## Architecture

### Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 3.4.1
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Email/Password + GitHub OAuth)
- **Hosting**: Netlify
- **State Management**: React Hooks (useState, useEffect)
- **Charts**: Recharts 3.5.0
- **Forms**: React Hook Form 7.66.1 + Zod 4.1.13
- **Animations**: Framer Motion 12.23.24
- **Notifications**: React Hot Toast 2.6.0

### Project Structure

```
CoagCompanion/
├── app/                          # Next.js App Router pages
│   ├── auth/callback/           # OAuth callback handler
│   ├── dashboard/               # Dashboard page (protected)
│   ├── logs/                    # Logs management page (protected)
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page (public/sample data)
│   └── globals.css              # Global styles
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx        # Email/password + GitHub login
│   │   ├── SignupForm.tsx       # User registration
│   │   ├── UserMenu.tsx         # User dropdown menu
│   │   └── MigrationPrompt.tsx  # localStorage → Supabase migration
│   ├── charts/                  # Data visualization components
│   │   ├── INRChart.tsx         # INR over time chart
│   │   ├── DoseChart.tsx        # Warfarin dose chart
│   │   ├── INRDoseCorrelation.tsx
│   │   ├── TimeInRange.tsx      # INR time in therapeutic range
│   │   └── INRVariability.tsx   # INR variability metrics
│   ├── forms/
│   │   └── LogForm.tsx          # Add/Edit log entry form
│   └── ui/                      # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       ├── Disclaimer.tsx
│       ├── ThemeToggle.tsx
│       └── DoseSuggestionCard.tsx
├── lib/
│   ├── supabase/               # Supabase client utilities
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server client
│   ├── supabase-storage.ts     # Database operations layer
│   ├── storage.ts              # Legacy localStorage (deprecated)
│   ├── sample-data.ts          # Demo data for non-auth users
│   ├── migrate-to-supabase.ts  # Migration utilities
│   ├── database.types.ts       # TypeScript types for DB
│   ├── schemas.ts              # Zod validation schemas
│   ├── types.ts                # TypeScript type definitions
│   ├── utils.ts                # Utility functions
│   ├── dose-algorithm.ts       # Dose suggestion algorithm
│   ├── linear-regression.ts    # INR prediction
│   └── toml-parser.ts          # Seed data parser
├── middleware.ts               # Auth middleware (route protection)
├── env.ts                      # Environment variables (Next.js 13+ compatible)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── supabase-schema.sql         # Database schema
└── .env.local                  # Local environment variables (gitignored)
```

---

## Key Features

### 1. Authentication & User Management
- Email/password authentication
- GitHub OAuth integration
- Protected routes (dashboard, logs require auth)
- User-specific data with Row Level Security
- Automatic data migration from localStorage

### 2. Data Tracking
- **INR Levels**: Lab INR and Home INR (CoaguCheck)
- **Warfarin Dose**: Daily dosage tracking (integers only)
- **Injections**: Fraxiparine/Heparin bridging therapy notes
- **Vitamin K Intake**: Low/Medium/High tracking
- **Comments**: Free-text notes for each entry

### 3. Analytics & Visualization
- INR trends over time
- Warfarin dose correlation
- Time in therapeutic range (TTR) calculation
- INR variability analysis
- Linear regression for INR prediction
- Intelligent dose suggestions

### 4. Sample Data
- Non-authenticated users see read-only demo data
- Real historical seed data (September-November 2025)
- Automatic switch to user data after login

---

## Database Schema

### Tables

**`logs`** - INR and dosage entries
```sql
- id (UUID, primary key)
- user_id (UUID, references auth.users)
- date (TIMESTAMP)
- lab_inr (DECIMAL 3,1, nullable)
- home_inr (DECIMAL 3,1, nullable)
- warfarin_dose (INTEGER, nullable)
- injections (TEXT, nullable)
- comment (TEXT, nullable)
- vitamin_k_intake (TEXT, nullable)
- created_at, updated_at (TIMESTAMP)
```

**`settings`** - User preferences
```sql
- user_id (UUID, primary key)
- target_inr_min (DECIMAL 3,1, default 2.0)
- target_inr_max (DECIMAL 3,1, default 3.0)
- inr_test_time (TEXT, default '10:00')
- dose_time (TEXT, default '13:00')
- notifications_enabled (BOOLEAN, default true)
- created_at, updated_at (TIMESTAMP)
```

### Row Level Security (RLS)
- Users can only view/edit/delete their own data
- Automatic settings creation for new users via trigger

---

## Environment Variables

**Required for Production (Netlify):**

```env
NEXT_PUBLIC_SUPABASE_URL=https://bpgkksjksbkkglcxxooi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Local Development:**
- Copy `.env.example` to `.env.local`
- Fill in your Supabase credentials
- Never commit `.env.local` (in .gitignore)

**Important**: Due to Next.js 13+ App Router changes, environment variables are accessed via `import { env } from '@/env'` instead of `process.env`.

---

## Development Workflow

### Setup
```bash
npm install
npm run dev          # Start dev server at http://localhost:3000
```

### Build & Deploy
```bash
npm run build        # Production build
npm run start        # Start production server locally
git push             # Auto-deploys to Netlify
```

### Database Setup
```bash
# Run in Supabase SQL Editor (one-time setup)
# Execute: supabase-schema.sql
```

---

## Coding Conventions

### TypeScript
- Strict mode enabled
- Explicit types for all function parameters and returns
- Use `type` for data shapes, `interface` for object contracts
- Avoid `any`, use `unknown` when type is truly unknown

### Components
- Use functional components with hooks
- Client components marked with `"use client"` directive
- Server components by default (no directive needed)
- Dynamic rendering for auth-dependent pages: `export const dynamic = 'force-dynamic'`

### Styling
- Tailwind CSS utility classes
- Dark mode support via `dark:` prefix
- Responsive design: mobile-first approach
- Color scheme: Blue (primary), Purple (accent), Red (danger), Green (success)

### Forms
- React Hook Form for form state
- Zod for validation schemas
- Toast notifications for user feedback
- Optional fields properly handle `null`/`undefined`

### Data Access
```typescript
// ✅ Correct (Next.js 13+)
import { env } from '@/env'
import { supabaseStorage } from '@/lib/supabase-storage'

// ❌ Deprecated
import { storage } from '@/lib/storage'  // Old localStorage
```

---

## Common Tasks

### Adding a New Protected Page
1. Create page in `app/your-page/page.tsx`
2. Add `"use client"` directive
3. Add `export const dynamic = 'force-dynamic'`
4. Update `middleware.ts` to protect the route
5. Add navigation link in `app/layout.tsx`

### Adding a New Database Table
1. Write SQL migration in `supabase-schema.sql`
2. Add TypeScript types in `lib/database.types.ts`
3. Update `lib/supabase-storage.ts` with CRUD operations
4. Add RLS policies for security

### Adding a New Chart
1. Create component in `components/charts/`
2. Use Recharts components (`LineChart`, `BarChart`, etc.)
3. Add to dashboard in `app/dashboard/page.tsx`
4. Ensure responsive design with Tailwind

### Deploying Changes
1. Commit changes: `git add -A && git commit -m "message"`
2. Push to GitHub: `git push`
3. Netlify auto-deploys from `master` branch
4. Check deploy logs if build fails

---

## Authentication Flow

### Email/Password Signup
1. User fills form → `SignupForm.tsx`
2. Calls `supabase.auth.signUp()`
3. User created in `auth.users` table
4. Trigger auto-creates settings row
5. Redirect to dashboard

### GitHub OAuth
1. User clicks GitHub button → `LoginForm.tsx`
2. Redirects to GitHub authorization
3. GitHub redirects to `https://bpgkksjksbkkglcxxooi.supabase.co/auth/v1/callback`
4. Supabase creates session, redirects to `/auth/callback`
5. App redirects to dashboard

### Protected Routes
- Middleware checks authentication in `middleware.ts`
- Unauthenticated users redirected to `/login?redirect=/original-path`
- After login, redirected back to original destination

---

## Data Migration

### localStorage → Supabase
1. User signs up/logs in
2. `MigrationPrompt.tsx` checks for localStorage data
3. Shows blue prompt card if data exists
4. User clicks "Migrate Data"
5. `migrate-to-supabase.ts` transfers all logs and settings
6. Success message shown

---

## Known Issues & Solutions

### Issue: "Invalid API key" error
**Solution**: Environment variables not loading. Check:
1. Netlify env vars are set correctly
2. Deploy has completed after adding vars
3. Hard refresh browser or use incognito mode

### Issue: GitHub OAuth redirects to localhost
**Solution**: Update GitHub OAuth App Homepage URL to production URL

### Issue: "process is not defined" in browser
**Solution**: Use `import { env } from '@/env'` instead of `process.env`

### Issue: Build fails with env var errors
**Solution**: Ensure Netlify has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Testing Checklist

- [ ] Email/password signup works
- [ ] GitHub OAuth login works
- [ ] Protected routes redirect to login
- [ ] Add/edit/delete log entries
- [ ] Data persists in Supabase
- [ ] Charts display correctly
- [ ] Dark mode toggle works
- [ ] Migration prompt shows for localStorage data
- [ ] Sample data visible when not logged in
- [ ] Form validation works (optional fields)
- [ ] Export/import JSON backup

---

## Resources

- **Supabase Dashboard**: https://supabase.com/dashboard/project/bpgkksjksbkkglcxxooi
- **Netlify Dashboard**: https://app.netlify.com
- **GitHub Repo**: https://github.com/kolesarp1/CoagCompanion
- **Production URL**: https://coagcompanion.netlify.app
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs

---

## Important Notes

1. **Security**: Never commit `.env.local` or expose `service_role` key
2. **RLS**: Always test database policies to ensure data isolation
3. **Warfarin Doses**: Must be integers (validation enforced)
4. **Date Format**: ISO 8601 strings in database, Date objects in forms
5. **Sample Data**: Read-only, always loads from seed data for non-auth users

---

## Version History

- **v1.0.0** (2025-11-27)
  - Initial release with Supabase authentication
  - User management and data migration
  - GitHub OAuth integration
  - Protected routes and RLS policies
  - Sample data for demo users
  - Fixed form validation for optional fields
  - Fixed environment variable loading for Next.js 13+

---

**Last Updated**: 2025-11-27
**Maintained By**: kolesarp1@gmail.com
