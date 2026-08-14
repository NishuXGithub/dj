# Fine Arts DJ Amplifier 🎛️

A premium, fully responsive website for **Fine Arts DJ Amplifier** — a DJ & pro-audio equipment store in New Usmanpur, Delhi (est. 1994). Built with **pure HTML, CSS and JavaScript** — no frameworks.

## ✨ Features

- Dark neon theme (purple + electric blue) with glassmorphism
- Fixed transparent navbar with sticky scroll + mobile hamburger menu
- Full-screen hero slider with rotating headline
- Sections: About, Services, Blog, Why Choose Us, Pricing, Testimonials, Terms, Contact
- Animated achievement counters
- Scroll-reveal animations, smooth scrolling, scroll-to-top
- Contact form with live validation
- Fully responsive (desktop / tablet / mobile)

## 🗂️ Structure

```
index.html   → markup / content
style.css    → styling, theme variables, responsive layout
script.js    → interactivity (nav, slider, counters, form validation)
```

## 📍 Business Details (public sources)

- **Name:** Fine Arts DJ Amplifier
- **Address:** E-94, Main Road, 3rd Pusta, New Usmanpur, Delhi – 110053 (Near Sharda Kuan)
- **Established:** 1994
- **Category:** Amplifier Dealers · Repair & Services
- **Hours:** Opens daily at 10:00 AM
- **Rating:** 4.1★ (Justdial)

> ⚠️ The real phone number is gated behind Justdial's "Show Number". Replace the placeholder
> `+91 98765 43210` (and `info@fineartsdjamplifier.com`) throughout `index.html` with the real details.

## 🚀 Run locally

Just open `index.html` in any browser. That's it.

Or serve it locally:

```bash
npx serve
```

## 📧 Contact enquiry email (serverless)

The **Contact / Get a Quote** form posts to a Vercel serverless function that
emails the enquiry to the business inbox via **[Resend](https://resend.com)**.
No database is used, and no secrets live in the browser.

```
Browser form  →  POST /api/contact  →  Resend  →  Business email
```

**Files involved**

- `api/contact.js` — serverless function: validates input, blocks spam (honeypot), sends the email.
- `script.js` — form handler: validation, loading state, success/error, POST to `/api/contact`.
- `package.json` — declares the single `resend` dependency.

**Environment variables** (Vercel → Project → Settings → Environment Variables):

| Variable | Required | Example |
|---|---|---|
| `RESEND_API_KEY` | yes | `re_xxxxxxxx` (from resend.com/api-keys) |
| `TO_EMAIL` | yes | the Fine Arts business inbox that receives enquiries |
| `FROM_EMAIL` | optional | `Fine Arts DJ Amplifier <enquiry@yourdomain.com>` (defaults to Resend's `onboarding@resend.dev` for testing) |

> Quick start: with `FROM_EMAIL` unset, Resend's shared sender only delivers to
> the email that owns your Resend account — so set `TO_EMAIL` to that address.
> For production, verify your domain in Resend and set `FROM_EMAIL` to an
> address on it.

**Test locally**

```bash
npm install
npm i -g vercel        # once
vercel env pull        # or create .env.local with the 3 vars above
vercel dev             # serves the site + /api/contact at http://localhost:3000
```

Then submit the form. (Opening `index.html` directly won't run the API — use `vercel dev`.)

## 🚀 Run locally (static only)

Open `index.html` in any browser to preview the design (the form's email send
needs `vercel dev`, see above).

## 🌐 Deploy

Push to the connected GitHub repo — Vercel auto-builds the static site **and**
the `/api/contact` function. Add the three environment variables above in the
Vercel dashboard, then redeploy.

---

Built for the sound of Delhi. 🔊
