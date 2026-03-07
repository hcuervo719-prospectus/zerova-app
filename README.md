# Zerova

**Relational Intelligence assistant powered by Gottman science.**

Three adaptive modes: Safe Space · Coach · Daily Check-in  
Cumulative Relational Profile that learns your dynamic over time.  
16 languages. Built for the world.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (Auth + PostgreSQL)
- **AI:** Anthropic Claude API
- **Payments:** Paddle (subscription, 3-day trial)
- **Deploy:** Vercel
- **i18n:** next-intl (16 locales)

---

## Quick Start

```bash
npm install
cp .env.local.example .env.local
# Fill in your keys in .env.local
npm run dev
```

Open http://localhost:3000

---

## Environment Variables

See `.env.local.example` for all required variables.  
Add the same variables to Vercel → Settings → Environment Variables.

---

## Architecture

```
User message
    ↓
Layer 1: Mode Detection (fast Claude call)
    ↓ safe_space | coach | checkin
Layer 2: Profile Hydration (Supabase)
    ↓ relational profile + temporal context
Layer 3: Response Generation (Claude with full system prompt)
    ↓
Response + session tracking
```

---

## Deploy

1. Push to GitHub
2. Connect repo in Vercel
3. Add environment variables
4. Vercel deploys automatically on every push ✅

---

## Part of VividShift

Zerova is one of four apps in the VividShift ecosystem.  
© 2026 VividShift. All rights reserved.
