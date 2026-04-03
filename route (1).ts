# AutoList Dashboard — Environment Variables
# Copy this to .env.local and fill in your values

# Supabase — get from supabase.com > your project > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe — get from dashboard.stripe.com > Developers > API keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs — create in Stripe dashboard
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_DEALERSHIP_MONTHLY_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://autolist.thresholddigital.com
