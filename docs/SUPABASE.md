# Supabase accounts + admin panel (static site)

The site talks to Supabase directly from the browser. There is no server; data is
protected by Row Level Security (`supabase/schema.sql` + `supabase/migration-002.sql`).

## Build-time env vars

| Variable | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | the project's **anon / publishable** key (never `service_role`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | no | Google OAuth **Web** client ID (public, not a secret). Shows "Continue with Google" when set *and* Supabase is configured |
| `NEXT_PUBLIC_SITE_URL` | no | defaults to `https://cto-drs.com` (used for auth redirect links) |

If the URL or key is missing the build falls back to the previous static behaviour
(old local login screens, contact form → WhatsApp only).

Build:

```bash
NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… \
NEXT_PUBLIC_GOOGLE_CLIENT_ID=….apps.googleusercontent.com bash scripts/build-static.sh
```

## Supabase dashboard setup

1. SQL Editor → run `supabase/schema.sql`, then `supabase/migration-002.sql`.
2. Authentication → Sign In / Providers → Email: keep **Confirm email ON**
   (admin is granted to the owner emails only after confirmation).
3. Authentication → URL Configuration
   - Site URL: `https://cto-drs.com`
   - Redirect URLs: `https://cto-drs.com/**` (covers `/`, `/#/account`, `/#/reset`)
4. Optional Google — see "Continue with Google" below.

Auth uses the PKCE flow, so links come back as `https://cto-drs.com/?code=…#/route`
and must be opened in the same browser that requested them.

## Continue with Google (ID-token flow)

The Supabase Google provider is configured with a **client ID only (no client
secret)**, so `signInWithOAuth` (server-side code exchange) cannot be used. The site
uses **Google Identity Services** in the browser instead and hands the ID token to
Supabase:

1. `https://accounts.google.com/gsi/client` is loaded on demand, only on the
   login / register screens (`src/components/auth/google-id-button.tsx`).
2. A random raw nonce is generated; its **SHA-256 hex** hash is passed to
   `google.accounts.id.initialize({ nonce })`, and the official button is drawn with
   `google.accounts.id.renderButton` (locale follows the site language, `ar`/`en`).
3. Google returns a signed ID token (`credential`) whose `nonce` claim is the hash.
4. `supabase.auth.signInWithIdToken({ provider: 'google', token: credential, nonce: rawNonce })`
   — Supabase hashes the raw nonce and checks it against the token. A fresh nonce is
   generated after every failed attempt.
5. On success the user goes to `#/account` (or `#/dashboard` if `profiles.role = 'admin'`).
   New Google users get a `profiles` row from the existing `handle_new_user` trigger.

Setup:

- **Google Cloud → APIs & Services → Credentials → OAuth client ID (Web application)**
  - Authorized JavaScript origins: `https://cto-drs.com` (add `http://localhost:3000`
    / `http://localhost` for local testing). No redirect URI is needed for this flow.
  - OAuth consent screen published (or test users added).
- **Supabase → Authentication → Sign In / Providers → Google**: enable it and put the
  same Web client ID in *Client IDs* (comma-separated if you have several, e.g. Android/iOS).
  Leave *Client Secret* empty. Keep "Skip nonce checks" **off**.
- Build with `NEXT_PUBLIC_GOOGLE_CLIENT_ID=<web client id>`. The client ID is public;
  never commit `.env*` files or any secret.

Errors (script blocked, wrong audience / provider disabled, nonce or token problems)
are shown as translated messages (`t.auth.google*` in `src/i18n/ar.ts` / `en.ts`).
If the site ever adds a Content-Security-Policy, allow `https://accounts.google.com`
in `script-src`, `frame-src`, `connect-src` and `style-src`
(`https://accounts.google.com/gsi/style`).

## Routes

- `#/login` (and `#/login/forgot`), `#/register`, `#/reset`
- `#/account` — profile, my bookings (create / cancel), my messages
- `#/dashboard` — admin panel (role read from `profiles`; non-admins see "not authorized")
