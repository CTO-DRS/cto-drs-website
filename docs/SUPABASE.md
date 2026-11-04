# Supabase accounts + admin panel (static site)

The site talks to Supabase directly from the browser. There is no server; data is
protected by Row Level Security (`supabase/schema.sql` + `supabase/migration-002.sql`).

## Build-time env vars

| Variable | Required | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | the project's **anon / publishable** key (never `service_role`) |
| `NEXT_PUBLIC_SUPABASE_GOOGLE` | no | `1` to show "Continue with Google" (enable the Google provider first) |
| `NEXT_PUBLIC_SITE_URL` | no | defaults to `https://cto-drs.com` (used for auth redirect links) |

If the URL or key is missing the build falls back to the previous static behaviour
(old local login screens, contact form → WhatsApp only).

Build:

```bash
NEXT_PUBLIC_SUPABASE_URL=… NEXT_PUBLIC_SUPABASE_ANON_KEY=… bash scripts/build-static.sh
```

## Supabase dashboard setup

1. SQL Editor → run `supabase/schema.sql`, then `supabase/migration-002.sql`.
2. Authentication → Sign In / Providers → Email: keep **Confirm email ON**
   (admin is granted to the owner emails only after confirmation).
3. Authentication → URL Configuration
   - Site URL: `https://cto-drs.com`
   - Redirect URLs: `https://cto-drs.com/**` (covers `/`, `/#/account`, `/#/reset`)
4. Optional Google: Providers → Google (client id/secret from Google Cloud,
   authorized redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`),
   then build with `NEXT_PUBLIC_SUPABASE_GOOGLE=1`.

Auth uses the PKCE flow, so links come back as `https://cto-drs.com/?code=…#/route`
and must be opened in the same browser that requested them.

## Routes

- `#/login` (and `#/login/forgot`), `#/register`, `#/reset`
- `#/account` — profile, my bookings (create / cancel), my messages
- `#/dashboard` — admin panel (role read from `profiles`; non-admins see "not authorized")
