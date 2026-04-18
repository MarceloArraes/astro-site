# Blog Improvements - Completed

## Summary

All improvements have been implemented:
1. ✅ Font preloads for faster LCP
2. ✅ Self-hosted analytics (Umami)
3. ✅ Reading time estimate on posts
4. ✅ RSS feed fixed (Sanity-only)
5. ✅ Local MD phased out
6. ⏳ Blue-green deployment (Coolify configuration needed)

---

## Completed Changes

### 1. Font Preloads ✅
**File**: `src/components/BaseHead.astro`

Added preloads for all 4 custom fonts:
- Lugrasimo-Regular.ttf
- Honk-Regular.ttf
- Atkinson-regular.woff
- Atkinson-bold.woff

**Impact**: Faster Largest Contentful Paint (LCP), better Core Web Vitals

---

### 2. Self-Hosted Analytics (Umami) ✅
**File**: `src/components/BaseHead.astro`

Added Umami analytics script (privacy-focused, GDPR-compliant):
- Loads only when env vars are set
- No cookies, no persistent storage
- Self-hosted option available

**Setup Required**:
1. Deploy Umami instance (or use hosted)
2. Add to `.env`:
   ```
   UMAMI_HOST=https://your-umami.com/script.js
   UMAMI_WEBSITE_ID=your-website-id
   ```

**Impact**: Privacy-friendly analytics, no Google dependency

---

### 3. Reading Time Estimate ✅
**Files**: 
- `src/lib/reading-time.ts` (new utility)
- `src/pages/sanity-blog/[...slug].astro`
- `src/pages/sanity-blog/index.astro`

Calculates reading time at ~225 words/minute, displays:
- On blog listing: "5 min read" next to date
- On post page: Below title with date

**Impact**: Better UX, sets reader expectations

---

### 4. RSS Feed Fixed ✅
**File**: `src/pages/rss.xml.ts`

- Fetches from Sanity CMS only
- Correct `/sanity-blog/[id]` URLs
- Graceful error handling (empty feed if Sanity unavailable)

---

### 5. Local MD Phased Out ✅
**Removed**:
- `src/content/blog/`
- `src/content.config.ts`
- `src/pages/blog/`

**Updated**:
- Homepage uses Sanity only
- All pages consistent

---

### 6. Error Handling ✅
Added try/catch around Sanity fetches so builds complete even when:
- Sanity is unreachable
- Building locally without credentials
- Network issues

Files updated:
- `src/pages/index.astro`
- `src/pages/sanity-blog/index.astro`
- `src/pages/sanity-blog/[...slug].astro`
- `src/pages/rss.xml.ts`

---

## Pending: Blue-Green Deployment

### Action Required in Coolify

1. Open Coolify dashboard
2. Go to your Astro site service
3. Settings → Deployment
4. Enable **"Zero Downtime Deployments"**
5. Set health check path: `/`
6. Set health check timeout: `10s`

**How it works**:
- New container starts alongside old one
- Health check runs
- Traffic swaps only after healthy
- Old container removed
- **Result**: Zero downtime

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/lib/reading-time.ts` | Reading time calculation |
| `.env.example` | Environment template |
| `IMPLEMENTATION_PLAN.md` | This document |
| `DEPLOYMENT_CHECKLIST.md` | Deployment guide |

### Modified Files
| File | Change |
|------|--------|
| `src/components/BaseHead.astro` | Font preloads + Umami analytics |
| `src/pages/index.astro` | Sanity-only + error handling |
| `src/pages/sanity-blog/index.astro` | Reading time + error handling |
| `src/pages/sanity-blog/[...slug].astro` | Reading time + error handling |
| `src/pages/rss.xml.ts` | Sanity-only + error handling |

### Deleted Files
- `src/content/blog/*`
- `src/content.config.ts`
- `src/pages/blog/*`

---

## Next Steps (Optional)

From the original suggestions, these remain available:

| Idea | Impact | Effort |
|------|--------|--------|
| OpenGraph per-post images | SEO | 30 min |
| Search with Pagefind | UX | 1 hour |
| Related posts | Engagement | 1 hour |
| Table of contents | UX | 1 hour |
| Health endpoint `/health` | Ops | 10 min |

---

## Environment Variables

**Required for production** (set in Coolify):
```
VITE_SANITY_PROJECT_ID=your-project-id
```

**Optional** (add to `.env` locally, Coolify for prod):
```
UMAMI_HOST=https://your-umami.com/script.js
UMAMI_WEBSITE_ID=your-website-id
```
