# Deployment Checklist

## Completed ✅

- [x] Font preloads (all 4 fonts)
- [x] Umami analytics integration
- [x] Reading time on blog posts
- [x] RSS feed fixed (Sanity-only)
- [x] Local MD phased out
- [x] Error handling for Sanity fetches

---

## Action Required: Enable Zero-Downtime in Coolify

1. Open Coolify dashboard
2. Go to your Astro site service
3. Settings → Deployment
4. Enable **"Zero Downtime Deployments"**
5. Set health check path: `/`
6. Set health check timeout: `10s`

---

## Action Required: Set Up Umami Analytics

### Option A: Self-Host Umami (Recommended for you)

Since you already use Coolify:

1. **Deploy Umami in Coolify**:
   - One-click template available
   - Or use Docker: `docker-compose.yml` with Umami + PostgreSQL

2. **Get your credentials**:
   - Add website in Umami dashboard
   - Copy the Website ID

3. **Add to Coolify environment variables**:
   ```
   UMAMI_HOST=https://umami.your-domain.com/script.js
   UMAMI_WEBSITE_ID=your-website-id
   ```

### Option B: Use Hosted Umami

- Sign up at [cloud.umami.is](https://cloud.umami.is)
- Free tier: 5K events/month
- Same env var setup

---

## Current Architecture

```
┌─────────────────────┐
│ Sanity CMS          │
│ (write posts here)  │
└──────────┬──────────┘
           │ webhook
           ▼
┌─────────────────────┐
│ GitHub Actions      │
│ repository_dispatch │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Build Docker Image  │
│ Push to GHCR        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Coolify             │
│ Zero-downtime swap  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Visitors            │
│ + Umami Analytics   │
└─────────────────────┘
```

---

## Environment Variables

**GitHub Secrets**:
| Variable | Purpose |
|----------|---------|
| `VITE_SANITY_PROJECT_ID` | Sanity config (build-time) |
| `COOLIFY_API_TOKEN` | Trigger deploys |
| `COOLIFY_DEPLOYMENT_HOOK` | Coolify webhook URL |

**Coolify Environment**:
| Variable | Purpose |
|----------|---------|
| `VITE_SANITY_PROJECT_ID` | Passed to Docker build |
| `UMAMI_HOST` | Umami script URL |
| `UMAMI_WEBSITE_ID` | Your site ID |

---

## Testing Locally

1. Copy `.env.example` to `.env`
2. Fill in your values:
   ```
   VITE_SANITY_PROJECT_ID=your-project-id
   UMAMI_HOST=https://your-umami.com/script.js
   UMAMI_WEBSITE_ID=your-id
   ```
3. Run `npm run dev`

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/BaseHead.astro` | Font preloads + Umami |
| `src/pages/index.astro` | Error handling |
| `src/pages/sanity-blog/index.astro` | Reading time + error handling |
| `src/pages/sanity-blog/[...slug].astro` | Reading time + error handling |
| `src/pages/rss.xml.ts` | Error handling |
| `src/lib/reading-time.ts` | New utility |
