# AutoList Dashboard

Facebook Marketplace listing tool for car dealers — built by Threshold Digital.

## Stack
- **Next.js 14** — React framework with App Router
- **Supabase** — Database, auth, row-level security
- **Stripe** — Subscription billing
- **Vercel** — Hosting (free tier works)

---

## Setup (one time, ~30 minutes)

### 1. Supabase
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your project URL and anon key from Settings → API
3. Go to SQL Editor → paste the contents of `supabase-schema.sql` → Run
4. Enable Email auth in Authentication → Providers

### 2. Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create two Products:
   - **AutoList Individual** — $59/month recurring → copy the Price ID
   - **AutoList Dealership** — $79/month recurring → copy the Price ID
3. Get your API keys from Developers → API Keys
4. Set up webhook: Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `customer.subscription.*`, `invoice.payment_failed`

### 3. Environment variables
```bash
cp .env.example .env.local
# Fill in all values
```

### 4. Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts, add env vars in Vercel dashboard
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

### 5. Run locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Chrome Extension Integration

The extension sends two types of requests to the dashboard:

**Validate license key** (on button click):
```
POST /api/auth/validate-key
{ "key": "abc123..." }
```

**Log a listing** (when FB page opens):
```
POST /api/listings
{ "license_key": "abc123...", "listing": { ...vehicle data } }
```

To enable this in the extension, add your dashboard URL to `background.js` and call these endpoints.

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing landing page |
| `/auth/login` | Login |
| `/auth/signup` | Signup with plan selection |
| `/dashboard/overview` | Stats + recent listings |
| `/dashboard/listings` | All listings with filters |
| `/dashboard/users` | Team management |
| `/dashboard/billing` | Subscription management |

---

## Pricing

| Plan | Price | Target |
|------|-------|--------|
| Individual | $59/mo | Solo salespeople |
| Dealership | $79/seat/mo | Dealer teams |

---

Built by [Threshold Digital](https://thresholddigital.com)
