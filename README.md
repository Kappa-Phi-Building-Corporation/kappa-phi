# Kappa Phi Building Corporation Website

A [Next.js](https://nextjs.org) app for kappa-phi.org, backed by [Supabase](https://supabase.com) (Postgres + Auth).

## Local Development

1. Copy `.env.local.example` to `.env.local` and fill in the values (see [Environment Variables](#environment-variables) below).
2. Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Variables

All required variables are documented in `.env.local.example`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (Settings → API) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (Settings → API) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — server-only, bypasses RLS |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used in email links and auth redirects |
| `RESEND_API_KEY` | API key for [Resend](https://resend.com) (transactional email) |
| `EMAIL_FROM` | Verified "from" address for outgoing emails |
| `ADMIN_EMAIL` | Default recipient for admin notifications |
| `PROPERTY_ISSUE_EMAIL` | Recipient for property issue reports (defaults to `ADMIN_EMAIL`) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key (CAPTCHA) — optional, hides widget if blank |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key — optional |

## Deploying to Vercel

### 1. Push the repo to GitHub

If the project isn't already on GitHub, create a repo and push this branch.

### 2. Import the project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repository.
2. Framework preset: **Next.js** (auto-detected). No changes needed to the build command (`next build`) or output directory.

### 3. Configure environment variables

In the Vercel project settings → **Environment Variables**, add every variable listed in `.env.local.example` (with real values from your `.env.local`), for both **Production** and **Preview** environments:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (mark as **Sensitive**)
- `NEXT_PUBLIC_SITE_URL` — set to your production domain, e.g. `https://www.kappa-phi.org`
- `RESEND_API_KEY` (mark as **Sensitive**)
- `EMAIL_FROM`
- `ADMIN_EMAIL`
- `PROPERTY_ISSUE_EMAIL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY` (mark as **Sensitive**)

### 4. Deploy

Trigger the first deploy. Vercel will run `npm run build` automatically.

### 5. Configure the custom domain

In Vercel → **Domains**, add `kappa-phi.org` / `www.kappa-phi.org` and follow the DNS instructions (CNAME or A record at your registrar).

### 6. Update Supabase for the production domain

In the Supabase dashboard → **Authentication → URL Configuration**:

- Set **Site URL** to your production domain (e.g. `https://www.kappa-phi.org`).
- Add the production domain (and any Vercel preview URL pattern, e.g. `https://*.vercel.app`, if you want preview deploys to support auth) to **Redirect URLs**.

Then redeploy (or update the env var) so `NEXT_PUBLIC_SITE_URL` matches the live domain — this value is used in email links sent via Resend.

### 7. Verify

- Visit the production URL and confirm the homepage loads.
- Test login/registration to confirm Supabase Auth redirects work correctly.
- Submit a form that sends email (e.g. property issue report, registration) to confirm Resend is configured correctly.
