**CoagCompanion** is a personal health monitoring application for tracking Warfarin anticoagulation therapy. It helps users monitor INR (International Normalized Ratio) levels, warfarin dosages, K intake in diet and provides intelligent dose suggestions based on historical data and medical community calculation formulas.

---

## Core Principles

**IMPORTANT**: Whenever you write code, it MUST follow SOLID design principles and healthcare data standards. Never write code that violates these principles.

**Non-Negotiable Standards**:
- TypeScript strict mode (no `any`, explicit return types)
- Security-first: Input validation, XSS prevention, healthcare data privacy
- HIPAA-aware: User data isolation via Row Level Security (RLS)
- Performance targets: Lighthouse ≥90, LCP ≤2.5s, bundle size monitoring
- Separation of concerns: UI, business logic, data access, authentication
- Medical accuracy: INR validation (0.5-10.0), warfarin dose (integers only), date constraints

**Philosophy**:
- Quality over speed
- Production-ready code from day one
- User privacy and data security paramount
- Future-proof architecture (scalable to multi-user clinic use)
- Accessibility-first (healthcare compliance)

---

## Development Workflow
1. Write comprehensive tests for all new functionality
2. Write code following standards
3. Compile code and run all tests before committing
4. Write detailed commit messages explaining the changes and rationale
5. Code review: Check functionality, tests, security, performance
   **Code Review Checklist**:
   - [ ] TypeScript strict mode compliance
   - [ ] Security: Input validation, RLS policies, no secrets in code
   - [ ] Performance: No unnecessary re-renders, memoization where needed
   - [ ] Accessibility: ARIA labels, keyboard navigation
   - [ ] Medical accuracy: INR/dose validation, correct calculations
   - [ ] Error handling: User-friendly messages, error boundaries
6. Push to GitHub: `git push` (with SSH key: `~/.ssh/id_ed25519`)
7. Netlify auto-deploys from `master` branch
8. Check deploy logs if build fails
9. Test production build

---

## Architecture Overview

### Tech Stack

- **Framework**: Next.js 16.0.4 (App Router)
- **Language**: TypeScript 5.9.3 (strict mode)
- **Styling**: Tailwind CSS 3.4.1
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (Email/Password + GitHub OAuth)
- **Hosting**: Netlify (auto-deploy from GitHub)
- **State Management**: React Hooks (useState, useEffect, useMemo, useCallback)
- **Charts**: Recharts 3.5.0
- **Forms**: React Hook Form 7.66.1 + Zod 4.1.13 validation
- **Animations**: Framer Motion 12.23.24
- **Notifications**: React Hot Toast 2.6.0
- **Testing**: Manual (future: Jest, Playwright)

### Project Structure

```
CoagCompanion/
├── app/                          # Next.js App Router pages
│   ├── auth/callback/           # OAuth callback handler (public)
│   ├── dashboard/               # Dashboard page (protected)
│   ├── logs/                    # Logs management page (protected)
│   ├── login/                   # Login page (public)
│   ├── signup/                  # Signup page (public)
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page (public/sample data)
│   └── globals.css              # Global styles + Tailwind directives
│
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx        # Email/password + GitHub OAuth login
│   │   ├── SignupForm.tsx       # User registration form
│   │   ├── UserMenu.tsx         # User dropdown menu (logout, settings)
│   │   └── MigrationPrompt.tsx  # localStorage → Supabase migration UI
│   │
│   ├── charts/                  # Data visualization components
│   │   ├── INRChart.tsx         # INR over time line chart
│   │   ├── DoseChart.tsx        # Warfarin dose bar chart
│   │   ├── INRDoseCorrelation.tsx # Combined INR + dose visualization
│   │   ├── TimeInRange.tsx      # INR time in therapeutic range (TTR)
│   │   └── INRVariability.tsx   # INR variability metrics (SD, CV)
│   │
│   ├── forms/
│   │   └── LogForm.tsx          # Add/Edit log entry form (React Hook Form + Zod)
│   │
│   └── ui/                      # Reusable UI primitives
│       ├── Button.tsx           # Primary, secondary, danger variants
│       ├── Card.tsx             # Container with shadow/border
│       ├── Modal.tsx            # Dialog for forms/confirmations
│       ├── Disclaimer.tsx       # Medical disclaimer banner
│       ├── ThemeToggle.tsx      # Light/dark mode switcher
│       └── DoseSuggestionCard.tsx # AI dose suggestion display
│
├── lib/                         # Business logic and utilities
│   ├── supabase/               # Supabase client configuration
│   │   ├── client.ts           # Browser client (client components)
│   │   └── server.ts           # Server client (server components, middleware)
│   │
│   ├── supabase-storage.ts     # Database operations layer (CRUD for logs/settings)
│   ├── storage.ts              # Legacy localStorage (deprecated, migration only)
│   ├── sample-data.ts          # Demo data for non-authenticated users
│   ├── migrate-to-supabase.ts  # Migration utilities (localStorage → Supabase)
│   ├── database.types.ts       # TypeScript types generated from Supabase schema
│   ├── schemas.ts              # Zod validation schemas (Log, Settings)
│   ├── types.ts                # Application-wide TypeScript types
│   ├── utils.ts                # Utility functions (date formatting, calculations)
│   ├── dose-algorithm.ts       # Intelligent warfarin dose suggestion algorithm
│   ├── linear-regression.ts    # Linear regression for INR prediction
│   └── toml-parser.ts          # Seed data parser (TOML → JSON)
│
├── middleware.ts               # Auth middleware (route protection)
├── env.ts                      # Environment variable loader (Next.js 13+ compatible)
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration (dark mode, colors)
├── supabase-schema.sql         # Database schema + RLS policies
├── .env.local                  # Local environment variables (gitignored)
└── .env.example                # Example environment variables template
```

---

## Key Features

### 1. Authentication & User Management
- **Email/Password**: Secure signup and login via Supabase Auth
- **GitHub OAuth**: One-click social authentication
- **Protected Routes**: Dashboard, logs require authentication (middleware-enforced)
- **Row Level Security**: Users can only access their own data (enforced at database level)
- **Automatic Migration**: Seamless localStorage → Supabase data transfer for existing users

### 2. Data Tracking (Health Metrics)
- **INR Levels**:
  - Lab INR (venous blood test)
  - Home INR (CoaguChek fingerstick device)
  - Validation: 0.5-10.0 range (enforced via Zod)
- **Warfarin Dose**: Daily dosage tracking (integers only, 1-100mg)
- **Injections**: Fraxiparine/Heparin bridging therapy notes (free text)
- **Vitamin K Intake**: 4-category tracking (None/Low/Medium/High/Very High)
- **Comments**: Free-text notes for each entry (max 500 chars)
- **Date Constraints**: Cannot log future dates, ISO 8601 format

### 3. Analytics & Visualization
- **INR Trends**: Time-series line chart with therapeutic range overlay
- **Warfarin Dose Correlation**: Combined INR + dose chart to identify patterns
- **Time in Therapeutic Range (TTR)**: Percentage of time INR is within target (2.0-3.0)
- **INR Variability Analysis**: Standard deviation and coefficient of variation
- **Linear Regression**: Predict next INR based on historical trend
- **Intelligent Dose Suggestions**: Algorithm suggests dose adjustments based on INR trends

### 4. Sample Data Mode
- **Non-Authenticated Experience**: Demo data visible without signup
- **Real Historical Data**: Seed data from September-November 2025
- **Seamless Transition**: Automatic switch to user data after login
- **Read-Only**: Sample data cannot be modified

---

## Database Schema

### Tables

#### `logs` - INR and Warfarin Dosage Entries
```sql
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  date TIMESTAMP NOT NULL,
  lab_inr DECIMAL(3,1),              -- 0.5-10.0
  home_inr DECIMAL(3,1),             -- 0.5-10.0
  warfarin_dose INTEGER,             -- 1-100 (mg)
  injections TEXT,                   -- Free text (nullable)
  comment TEXT,                      -- Max 500 chars (nullable)
  vitamin_k_intake TEXT,             -- Enum: none/low/medium/high/very_high
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_logs_user_date ON logs(user_id, date DESC);
```

#### `settings` - User Preferences
```sql
CREATE TABLE settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users,
  target_inr_min DECIMAL(3,1) DEFAULT 2.0,
  target_inr_max DECIMAL(3,1) DEFAULT 3.0,
  inr_test_time TEXT DEFAULT '10:00',
  dose_time TEXT DEFAULT '13:00',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Code Standards

### Component Standards

**File Limits**:
- ≤300 lines per file
- ≤50 lines per function
- ≤4 parameters per function
- ≤3 levels of nesting

### Separation of Concerns

**Layer Responsibilities**:
- **`app/`**: Pages, layouts, routing (minimal logic)
- **`components/`**: UI presentation (receive props, emit events)
- **`lib/`**: Business logic, calculations, data access
- **`types/`**: TypeScript definitions (types, interfaces, enums)

**Data Flow**:
```
User Interaction (UI)
  ↓
Event Handler (Component)
  ↓
Business Logic (lib/)
  ↓
Data Access Layer (supabase-storage.ts)
  ↓
Supabase (Database)
```

### Security Standards

**Input Validation (Zod Schemas)**:
```typescript
// lib/schemas.ts
export const LogSchema = z.object({
  date: z.string().refine(val => new Date(val) <= new Date(), {
    message: "Cannot log future dates"
  }),
  lab_inr: z.number().min(0.5).max(10.0).nullable(),
  home_inr: z.number().min(0.5).max(10.0).nullable(),
  warfarin_dose: z.number().int().min(1).max(100).nullable(),
  injections: z.string().max(200).nullable(),
  comment: z.string().max(500).nullable(),
  vitamin_k_intake: z.enum(['none', 'low', 'medium', 'high', 'very_high']).nullable(),
});
```

**Security Checklist**:
- ✅ **Validate all user inputs** with Zod schemas
- ✅ **Prevent XSS**: Sanitize free-text fields (comments, injections)
- ✅ **SQL Injection**: Use Supabase client (parameterized queries)
- ✅ **Row Level Security**: Enforce at database level, not app level
- ✅ **Environment Variables**: Never commit secrets, use `.env.local`
- ✅ **HTTPS Only**: Netlify enforces HTTPS, never downgrade
- ✅ **Session Management**: Supabase handles token refresh automatically
- ✅ **Rate Limiting**: (Future) Add rate limiting to API routes

**Never**:
- ❌ Expose `SUPABASE_SERVICE_ROLE_KEY` (admin access)
- ❌ Trust client-side validation alone (always validate server-side)
- ❌ Store sensitive data in localStorage (use Supabase database)
- ❌ Use `dangerouslySetInnerHTML` without sanitization

### Performance Standards

**Targets**:
- **Lighthouse Score**: ≥90 (all categories)
- **LCP (Largest Contentful Paint)**: ≤2.5s
- **FID (First Input Delay)**: ≤100ms
- **CLS (Cumulative Layout Shift)**: ≤0.1
- **Bundle Size**: Monitor, aim for ≤300KB initial load

**Optimization Techniques**:
- ✅ **Memoization**: Use `useMemo` for expensive calculations
- ✅ **Code Splitting**: Dynamic imports for large libraries (e.g., Recharts)
- ✅ **Image Optimization**: Use Next.js `<Image>` component
- ✅ **Font Optimization**: Next.js font optimization (next/font)
- ✅ **Tree Shaking**: Import only what you need (e.g., `import { format } from 'date-fns'`)
- ✅ **Lazy Loading**: Load charts only when visible (future: IntersectionObserver)

### Error Handling

**Error Boundaries**:
- Add to `app/layout.tsx` for global error catching
- Component-level boundaries for critical features (charts, forms)

**Fallbacks**:
- Empty states for no data (e.g., "No logs yet. Add your first entry!")
- Loading states for async operations (spinner, skeleton)
- Error states for failed requests (retry button, helpful message)

## Environment Variables

### Required for Production (Netlify)

```env
NEXT_PUBLIC_SUPABASE_URL=https://bpgkksjksbkkglcxxooi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Quality Gates

### Pre-Commit Checklist
- [ ] **TypeScript**: `npm run build` passes with zero errors
- [ ] **Linting**: `npm run lint` passes with zero warnings
- [ ] **Manual Testing**: Tested feature in browser (light + dark mode)
- [ ] **Responsive Design**: Tested on mobile, tablet, desktop viewports
- [ ] **Authentication**: Tested with authenticated and non-authenticated states

### Pre-Deployment Checklist
- [ ] **Build**: Production build succeeds (`npm run build`)
- [ ] **Environment Variables**: Netlify env vars are correct
- [ ] **Database Schema**: Supabase schema is up-to-date
- [ ] **RLS Policies**: Tested data isolation between users
- [ ] **Performance**: Lighthouse score ≥90
- [ ] **Security**: No secrets in code, input validation working

### Feature Completeness Checklist
- [ ] **Functionality**: Feature works as intended (happy path)
- [ ] **Error Handling**: Edge cases handled (empty state, errors, loading)
- [ ] **Validation**: Form validation working (Zod schemas)
- [ ] **UI/UX**: Responsive, dark mode support
- [ ] **Data Persistence**: Data saves to Supabase and persists after refresh
- [ ] **Security**: Input sanitized, RLS policies enforced

## Authentication Flow

### Email/Password Signup
1. User fills form → `SignupForm.tsx`
2. Validates input (Zod schema): Email format, password ≥6 chars
3. Calls `supabase.auth.signUp({ email, password })`
4. User created in `auth.users` table
5. Database trigger auto-creates settings row
6. Redirect to dashboard

### GitHub OAuth
1. User clicks "Sign in with GitHub" → `LoginForm.tsx`
2. Redirects to GitHub authorization page
3. User approves, GitHub redirects to Supabase callback:
   `https://bpgkksjksbkkglcxxooi.supabase.co/auth/v1/callback`
4. Supabase creates session, redirects to `https://coagcompanion.netlify.app/auth/callback`
5. App callback handler processes session, redirects to dashboard

### Protected Routes (Middleware)
1. User requests protected route (e.g., `/dashboard`)
2. `middleware.ts` checks for active session via `supabase.auth.getUser()`
3. If authenticated: Allow access
4. If not authenticated: Redirect to `/login?redirect=/dashboard`
5. After login: Redirect back to original destination

---

## Known Issues & Solutions

### Issue: "Invalid API key" error
**Symptoms**: Supabase client throws auth errors
**Solution**:
1. Check Netlify env vars are set correctly:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Ensure deploy completed after adding env vars (redeploy if needed)
3. Hard refresh browser (Ctrl+Shift+R) or use incognito mode

### Issue: GitHub OAuth redirects to localhost
**Symptoms**: After GitHub auth, redirected to `http://localhost:3000`
**Solution**:
1. Go to [GitHub OAuth App Settings](https://github.com/settings/developers)
2. Update "Homepage URL" to `https://coagcompanion.netlify.app`
3. Update "Authorization callback URL" to Supabase callback URL

### Issue: "process is not defined" in browser
**Symptoms**: Console error when accessing environment variables
**Solution**:
- ❌ Don't use: `process.env.NEXT_PUBLIC_SUPABASE_URL`
- ✅ Use: `import { env } from '@/env'` then `env.NEXT_PUBLIC_SUPABASE_URL`

### Issue: Build fails with env var errors
**Symptoms**: Netlify build fails with "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution**:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Trigger manual deploy or push new commit

### Issue: Dark mode not persisting
**Symptoms**: Dark mode resets on page refresh
**Solution**: Check `ThemeToggle.tsx` saves preference to localStorage:
```typescript
localStorage.setItem('theme', isDark ? 'dark' : 'light');
```

---

## Testing Strategy

### Manual Testing Checklist

**Authentication**:
- [ ] Email/password signup works
- [ ] Email/password login works
- [ ] GitHub OAuth login works
- [ ] Protected routes redirect to login when not authenticated
- [ ] Logout works (session cleared, redirected to home)

**Data Management**:
- [ ] Add new log entry (all fields)
- [ ] Add log entry (only required fields)
- [ ] Edit existing log entry
- [ ] Delete log entry (with confirmation)
- [ ] Data persists after page refresh
- [ ] Data isolated between users (test with 2 accounts)

**Charts & Analytics**:
- [ ] INR chart displays correctly
- [ ] Dose chart displays correctly
- [ ] Time in range (TTR) calculates correctly
- [ ] Charts handle empty data gracefully
- [ ] Charts responsive on mobile

**UI/UX**:
- [ ] Dark mode toggle works
- [ ] Dark mode persists after refresh
- [ ] Responsive design on mobile (375px width)
- [ ] Responsive design on tablet (768px width)
- [ ] Responsive design on desktop (1440px width)
- [ ] Navigation menu works on all screen sizes

**Migration**:
- [ ] Migration prompt shows for localStorage data
- [ ] Migration transfers all logs
- [ ] Migration transfers settings
- [ ] Migration success message shows
- [ ] localStorage cleared after successful migration

**Sample Data**:
- [ ] Sample data visible when not logged in
- [ ] Sample data is read-only
- [ ] Sample data switches to user data after login

**Forms & Validation**:
- [ ] Form validation works (Zod schemas)
- [ ] Optional fields accept null/undefined
- [ ] Error messages user-friendly
- [ ] Success toasts appear on save
- [ ] Date picker prevents future dates

### Future Testing (Automated)

**Unit Tests** (Jest + @testing-library/react):
- Business logic: `lib/dose-algorithm.ts`, `lib/utils.ts`
- Validation: `lib/schemas.ts`
- Components: `components/ui/Button.tsx`, `components/forms/LogForm.tsx`

**Integration Tests** (Playwright):
- E2E user flows: Signup → Add log → View chart → Logout
- Authentication flows: GitHub OAuth, email/password
- Data persistence: Add log → Refresh → Verify data

**Coverage Target**: ≥80% overall, 100% for `lib/` (business logic)

---

## Resources

### Project Links
- **Production URL**: https://coagcompanion.netlify.app
- **GitHub Repo**: https://github.com/kolesarp1/CoagCompanion
- **Netlify Dashboard**: https://app.netlify.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/bpgkksjksbkkglcxxooi

### Healthcare Standards
- **INR Reference**: https://www.ncbi.nlm.nih.gov/books/NBK507707/
- **Warfarin Dosing**: https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.107.185132

---

## Important Notes

### Security
1. **Never commit secrets**: `.env.local` is in `.gitignore` - keep it that way
2. **RLS is critical**: Always test database policies to ensure data isolation
3. **Validate inputs**: Use Zod schemas for all user inputs (medical data accuracy)
4. **Service role key**: NEVER expose `SUPABASE_SERVICE_ROLE_KEY` (admin bypass)

### Medical Data
1. **INR Range**: 0.5-10.0 (physiologically valid range)
2. **Warfarin Doses**: Integers only (1-100mg)
3. **Date Constraints**: Cannot log future dates (medical accuracy)
4. **Disclaimer**: Always show medical disclaimer (not a substitute for medical advice)

### Data Formats
1. **Dates**: ISO 8601 strings in database (`2025-11-29T10:00:00Z`)
2. **Dates in forms**: JavaScript `Date` objects
3. **INR**: DECIMAL(3,1) - one decimal place (e.g., 2.5, not 2.53)
4. **Vitamin K**: Enum (none/low/medium/high/very_high)

### Sample Data
1. **Read-Only**: Sample data cannot be modified (demo purposes only)
2. **Seed Source**: Real historical data from September-November 2025
3. **Automatic Switch**: User data loads after authentication

## Version History

### v1.0.0 (2025-11-27)
- ✅ Initial release with Supabase authentication
- ✅ Email/password + GitHub OAuth
- ✅ Protected routes with middleware
- ✅ Row Level Security (RLS) policies
- ✅ User-specific data isolation
- ✅ localStorage → Supabase migration
- ✅ Sample data for demo users
- ✅ INR and dose tracking
- ✅ Charts and analytics (TTR, variability)
- ✅ Intelligent dose suggestions
- ✅ Dark mode support
- ✅ Responsive design (mobile-first)
- ✅ Form validation (React Hook Form + Zod)
- ✅ Environment variable loader for Next.js 13+
- ✅ Medical disclaimer

---

**Last Updated**: 2025-11-29
**Maintained By**: kolesarp1@gmail.com