# Enable optional honest community counters (Cloudflare Worker + D1)

The GitHub Pages fan site is STATIC. Static files alone CANNOT reliably store and display genuine, shared page visits, download counts, or thumbs-up totals. This folder provides a deployable Cloudflare Worker + D1 database instead of pretending localStorage counters are global.

## Measures and limitations
- **Visits**: approximate unique random browser IDs per page per UTC day, not verified human users; uses SHA-256 hashes with secret salt. The counter accumulates daily-browser visits across days (not unique lifetime visitors).
- **Download clicks**: counted when the public ZIP button redirects through the Worker, at most once per browser per day. This is **not a completed download count**.
- **Likes**: at most once per random browser ID per page across all days; clearing browser storage or using another browser can vote again. These are voluntary, unaudited thumbs-up counts.
- Basic per-IP daily request throttling is implemented using **daily rotated hashed IPs**; raw IP values are not stored. It reduces abuse, not eliminated. Rate limits may affect institutions sharing a public IP.
- The offline widget itself contains **no analytics**. The online site stores a single opaque localStorage UUID for approximate deduplication. No player names, Discord IDs, emails, login details, or game credentials.
- The page will show **—** rather than fabricated numbers while the backend is not configured or unavailable.

## Deployment (one-time, owner-run)
1. Sign in to Cloudflare. Create a Worker and a D1 database named `kathana-metrics`. Install Node.js and Wrangler on the machine you control.
2. Create database and run SQL:
   `npx wrangler d1 create kathana-metrics`
   `npx wrangler d1 execute kathana-metrics --remote --file=counter-backend/schema.sql`
3. Create `wrangler.toml` from `wrangler.toml.example`. Paste your actual D1 database ID into `database_id`; set the Worker name if you prefer. Do **not** commit live secret values.
4. Add **two DIFFERENT strong random secrets** to the Worker:
   `npx wrangler secret put VISITOR_SALT`
   `npx wrangler secret put ABUSE_SALT`
   (Use at least 32 unpredictable bytes for each; don't post them in Discord, GitHub or public chats.)
5. Deploy the Worker: `npx wrangler deploy --config counter-backend/wrangler.toml`. Confirm the HTTPS endpoint returns `{"ok":true}` for `GET /health`.
6. In the public repository's `site-metrics-config.js`, set `apiBase` to your **verified** HTTPS Worker origin (for example `https://kathana-metrics.YOURSUBDOMAIN.workers.dev`). The config contains no secret.
7. Load the fan site on two browsers: confirm the initial counter is legitimate, repeated refreshes do not repeatedly add views, liking once adds one thumbs-up, and downloading routes to the actual ZIP. Counter service must be activated **after the ZIP file is published**.

## Privacy / safety
Only the configured site origin `https://apxinfinity.github.io` is allowed for AJAX writes. This is NOT full authentication: sophisticated bots can automate it; D1 keys and rate caps limit basic abuse. No direct browser access to the D1 database is exposed. Use Cloudflare WAF/challenges as needed if the page becomes popular.

Do not silently repurpose these IDs for behavioral profiling. Tell visitors approximate counts use an on-device random ID, and give clear reset instructions (clear site data). The Worker requires a periodic cleanup task for expired daily abuse keys and optional retention minimization; do not claim such cleanup is already running.

**Note:** If you move the fan site to a custom domain, edit `ALLOWED_ORIGIN` and `ZIP_URL` after validating the new address. If the site has not been published via GitHub Pages, none of these page links will be live yet.
