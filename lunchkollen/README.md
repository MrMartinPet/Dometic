# Lunchkollen – GitHub Pages

App: https://mrmartinpet.github.io/Dometic/lunchkollen/

All frontend files, source adapters, saved menus and scheduled updates are in this GitHub repository. There are no OpenAI runtime dependencies and no API keys.

The first six restaurants accept Dometic lunch coupons according to Martin's supplied local list. Their order is fixed, including when favorites are saved. The others have no coupon assertion.

## Updates

`lunchkollen-refresh.yml` runs at minute 17 each hour from 05:00 through 14:00 UTC on weekdays, and at 17:17 UTC on Sundays. GitHub schedules may be delayed and can become inactive after 60 days without repository activity. Manual runs are available from Actions. The update commits data.json and explicitly requests a Pages build, because GITHUB_TOKEN commits do not trigger Pages builds on their own.

Jives and Helliden: text menus are read from the original websites. Facebook: known current-week posts are read through public embeds; discovery of new posts from the public page is attempted. Public access is not guaranteed, so a new weekly Facebook post may require changing the known post reference in scripts/sources.mjs. Never describe this as guaranteed Facebook synchronization.

Only images actually returned by the source are used. Higher-resolution contentUrl images are preferred when exposed. No speculative OCR is presented as menu text. Missing menus are shown clearly and saved menus are gated by year and ISO week. Original timestamps survive failed source checks.

Ordinary offerings for other restaurants are informational, not a claim of today's opening hours, prices or changing dishes. No manual menu entry exists. Favorites are browser-local. Menu images are opened inside the app; cards use consistent text/vector typography, including Jives.

Run `node lunchkollen/scripts/update.mjs` from the repository root to refresh. Run `node lunchkollen/scripts/check.mjs` for essential assertions. Node 22+.
