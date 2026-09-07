# Hala’s World

An interactive portfolio for Hala Abdul Hakeem Neamah. Visitors can drive an orange rover through five island stops or use the accessible Simple view.

## Development

Use Node.js 22.13 or newer, then run `npm ci` and `npm run dev`.

## Build and hosting

`npm run build` exports the static portfolio to `dist/client`. Cloudflare Pages builds the main branch and publishes this directory. No API keys or runtime secrets are needed.

Content lives in `app/portfolio-data.ts`; the island is in `app/world.tsx` and layout in `app/page.tsx` and `app/globals.css`.

The CV is the content source. Dates and project contributions are preserved without invented metrics. The original CV and phone number are not included in the published assets.

Security: static hosting, no forms, cookies, tracking, database, uploads, or server functions. The build generates a Content Security Policy with hashes for inline bootstrap scripts and additional response headers. Dependencies are locked and should be audited when updated.

Inspired by the explorable format of Bruno Simon’s portfolio. The scene and code here are original.
