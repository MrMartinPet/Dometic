# Lunchkollen – GitHub Pages

App: https://mrmartinpet.github.io/Dometic/lunchkollen/

All frontend files, source adapters, saved menus and scheduled updates are in this GitHub repository. There are no OpenAI runtime dependencies and no API keys.

The first six restaurants accept Dometic lunch coupons according to Martin's supplied local list. Their order is fixed, including when favorites are saved. The others have no coupon assertion.

## Updates

`lunchkollen-refresh.yml` runs at minute 17 each hour from 05:00 through 14:00 UTC on weekdays, and at 17:17 UTC on Sundays. GitHub schedules may be delayed and can become inactive after 60 days without repository activity. Manual runs are available from Actions. The update commits data.json and explicitly requests a Pages build, because GITHUB_TOKEN commits do not trigger Pages builds on their own.

Jives and Helliden: text menus are read from the original websites. Facebook: known current-week posts are read through public embeds; the updater also looks for numeric and pfbid post links through the public page, mobile page and public Page Plugin timeline, then validates the ISO week and publication date. Facebook public access is not guaranteed, so a new post may still require updating the known post reference in scripts/sources.mjs. Unverified old menus remain hidden for the current week. If no current menu is available, the app links to the restaurant's Facebook **profile/page**, not a stale weekly post. A copy-link fallback is available when the Facebook mobile app opens its home feed.

Only images actually returned by the source are used. Higher-resolution contentUrl images are preferred when exposed. No speculative OCR is presented as menu text. Missing menus are shown clearly and saved menus are gated by year and ISO week. Original timestamps survive failed source checks.

Ordinary offerings for other restaurants are informational, not a claim of today's opening hours, prices or changing dishes. No manual menu entry exists. Favorites are browser-local. Menu images are opened inside the app; cards use consistent text/vector typography, including Jives.

Run `node lunchkollen/scripts/update.mjs` from the repository root to refresh. Run `node lunchkollen/scripts/check.mjs` for essential assertions. Node 22+.

Helliden: If the regular webpage cannot be fetched or parsed for the current week, the updater also checks the site's public WordPress REST page content and then retries the webpage without cache. The workflow logs all attempts and saves `lastFetchError` to the restaurant record. A menu from the wrong ISO week is never considered current. This cannot bypass a fully unavailable website.
