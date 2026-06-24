# IMPLEMENTATION PLAN — UNIVERSAL ADMIN + CREATIVE DIRECTION

**Date** : 2026-06-24  
**Project** : Portfolio Stane-Junior (https://github.com/Stane316/Portfolio-Stane-Junior)  
**Current State** : Evolution 2026 completed + partial admin + cinematic Hero started  
**Objective** : Transform the site into a **fully dynamic, professional, immersive, cinematic experience** where **all media (image + video)** are managed via a secure admin dashboard — without touching code.

---

## 0. RÈGLE ABSOLUE N°1 — PRE-IMPLEMENTATION VERIFICATION (ALWAYS)

Before **every** step:
1. Workspace root = **only** `/home/user/portfolio/` + `/home/user/uploads/`
2. `git fetch origin` + `git status -sb`
3. `git rev-parse HEAD` == `git rev-parse origin/main`
4. If not synced → list files + give exact git commands
5. Deliver **complete files** only (no patches)

---

## PHASE 1 — FOUNDATION (Supabase + Storage + Auth)

**Goal**: Professional, scalable media infrastructure.

### 1.1 Supabase Storage Setup
- Create bucket: `media` (public)
- Recommended folders:
  ```
  media/
  ├── hero/
  ├── about/
  ├── vision/
  ├── projects/
  ├── gallery/
  └── general/
  ```

### 1.2 Database Tables
Create / extend:

**`site_config`** (already exists — extend)
- key (text, unique)
- value_fr, value_en, value_generic
- type (text) — 'text' | 'image' | 'video' | 'url'

**`media_items`** (new)
```sql
CREATE TABLE media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  type text NOT NULL,                    -- 'image' | 'video'
  url text,
  storage_path text,
  alt_fr text,
  alt_en text,
  section text,                          -- 'hero', 'about', 'vision', etc.
  active boolean DEFAULT true,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### 1.3 Auth
- Use existing Supabase Auth
- Protect `/admin/*` routes
- Add admin role check (if not already)

### 1.4 RLS Policies (critical)
- Public read on `media_items` + `site_config`
- Admin full access (via service role or auth.uid() check)

---

## PHASE 2 — UNIVERSAL MEDIA SYSTEM (Core)

**Goal**: Every media zone can accept **image OR video** dynamically.

### 2.1 Backend / Hooks
- Update `useSupabaseData.ts` to return unified media config
- Create `useMedia.ts` hook (or extend existing)
- Add helper: `getMedia(key, fallbackType?)`

### 2.2 Universal FileUpload Component
**File**: `src/admin/components/FileUpload.tsx` (already partially done — complete it)

Requirements:
- Accept `image/*,video/*`
- Auto-detect type on upload
- Preview: `<img>` or `<video controls>`
- Drag & drop + click
- Max size per type (image 15MB, video 60MB)
- Return `{ url, type }`

### 2.3 AdminContent Overhaul
**File**: `src/admin/components/AdminContent.tsx`

Tabs / Sections to support:
- Hero (image + video)
- About (photo)
- Vision (image/video)
- Projects (fallback + per-project)
- Gallery / Reels (future)

Each zone uses the new `FileUpload`.

Add:
- "Type" badge (IMAGE / VIDEO)
- Delete button
- Alt text fields (FR/EN)

---

## PHASE 3 — CREATIVE DIRECTION (Cinematic Experience)

**Goal**: The site must feel like an **Awwwards-level immersive experience** — not a template.

### 3.1 Hero — The Scene (Priority 1)

**File**: `src/components/sections/Hero.tsx`

Must implement:
- **5 visual layers**:
  1. Background media (video or image — dynamic)
  2. Grain + noise overlay
  3. Atmospheric light / glow
  4. Monumental typography (asymmetric, editorial)
  5. Micro-interactions + subtle parallax

- Fullscreen cinematic
- Organic breathing motion (not mechanical)
- Support video autoplay muted loop
- Film grain effect
- Premium typography scale

### 3.2 Key Sections (Creative Treatment)

| Section     | Creative Goal                          | Media Support     |
|-------------|----------------------------------------|-------------------|
| About       | Intimate portrait + depth              | Image             |
| Journey     | Timeline as "scenes"                   | Optional images   |
| Skills      | Dense, sophisticated cards             | None              |
| Projects    | Editorial showcase                     | Image/Video       |
| Vision      | Dreamy / forward-looking               | Image/Video       |
| Footer      | Minimal but textured                   | None              |

**Rules**:
- No generic cards
- Add texture, grain, light
- Use asymmetry where possible
- Scroll must feel like a choreography

### 3.3 Global Creative Enhancements
- Add subtle noise to main background
- Custom cursor (premium)
- Scroll-triggered micro-animations (GSAP or Framer)
- Better typography hierarchy

---

## PHASE 4 — LIVE SYNC + FALLBACKS + PERFORMANCE

### 4.1 Real-time Updates
- Use Supabase Realtime on `site_config` and `media_items`
- Or rely on refetch on admin save (current system)

### 4.2 Intelligent Fallbacks
- Create `getMediaWithFallback(key, type)`
- If no media → elegant placeholder or default
- Never break the layout

### 4.3 Performance
- `next/image` or optimized `<img>` with sizes
- Video: `preload="metadata"`, lazy
- Lazy load sections (already partially done)

---

## PHASE 5 — DOCUMENTATION (Mandatory)

Create folder: `portfolio/docs/`

**Required files** (as per prompt):

- `01_SUPABASE_SETUP.md`
- `02_STORAGE_SETUP.md`
- `03_DATABASE_SETUP.md`
- `04_AUTH_SETUP.md`
- `05_ENV_VARIABLES.md`
- `06_ADMIN_SYSTEM.md`
- `07_MEDIA_UPLOAD_SYSTEM.md`
- `08_STORAGE_POLICIES.md`
- `09_DEPLOYMENT.md`
- `10_TROUBLESHOOTING.md`
- `IMPLEMENTATION_ORDER.md` (this file will be updated)

Each doc must be **step-by-step** (where to click, exact SQL, etc.).

---

## PHASE 6 — FINAL POLISH & TESTING

- Mobile-first audit (all creative features)
- Accessibility (alt, aria, contrast)
- Lighthouse > 90
- Test image + video upload flow end-to-end
- Test fallback behavior
- Admin UX review (very simple for client)

---

## DETAILED ORDER OF IMPLEMENTATION (Recommended)

1. **Phase 1.1–1.3** — Supabase buckets + tables + policies (manual in Supabase dashboard)
2. **Update useSupabaseData** + create media helper
3. **Complete FileUpload.tsx** (universal image/video)
4. **Rewrite AdminContent.tsx** (full media management)
5. **Rewrite Hero.tsx** (cinematic + video support)
6. **Creative treatment** on Vision + Projects
7. **Add realtime / improved fallbacks**
8. **Create all docs/**
9. **Testing + mobile audit**
10. **Final commit + push**

---

## STACK & TOOLS (Respect existing)

- **Keep**: React + TypeScript + Tailwind + Framer Motion + Supabase
- **Add if needed**: 
  - `react-dropzone` (better drag)
  - `lucide-react` or keep inline SVGs
- **Do NOT** introduce Next.js unless migration is approved

---

## SUCCESS CRITERIA

At the end the client must be able to:
- Log into `/admin`
- Upload/replace/delete **image or video** in Hero, About, Vision, etc.
- See changes live on the public site immediately
- Feel the site is **premium, cinematic, unique** — not a template

---

**Next Action**: Confirm this plan or ask to start with a specific phase.

I am ready to execute **Phase 1** or any chosen phase with full files.