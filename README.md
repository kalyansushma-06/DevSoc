# DevSoc Website

A full website for a student developer club, built with **Next.js 14 (App
Router)** + **Tailwind CSS**. Public site + a working admin backend with
login and approval workflows — not a static mockup.

## What's included

**Public site**
- Space-themed home page (animated starfield/asteroid canvas, your logo)
- About / transparency page
- Public **certificate verification** — look up any certificate ID
- Success stories (testimonials), with a public submission form
- Core team page (photos placeholder, roles, LinkedIn/GitHub) + mentors
- Event calendar (upcoming) with **RSVP**, plus a past-events **archive**
  with recap/summary/recording fields
- Project showcase: tag/domain filtering, **upvotes**, comments, public
  submission form (goes to "pending" for admin review)
- "Team Up" board — post/browse listings for hackathon or side-project teammates
- Blog (published/draft posts, per-post pages)
- Newsletter signup, FAQ accordion, Contact form, floating feedback widget

**Admin backend** at `/admin` (protected by login)
- Dashboard with live stats + a "needs your attention" pending-approval queue
- Events: create/edit/delete
- Certificates: issue new ones (instantly checkable on the public Verify
  page), revoke/reinstate, delete
- Projects: approve/reject/delete submissions
- Recruitment applications: approve/reject/delete
- Mentors: add, approve, delete
- Core team: add/edit/remove
- Testimonials: approve/unpublish/delete
- Blog: write drafts, publish/unpublish, edit, delete
- FAQ: add/edit/delete
- Inbox: feedback-widget notes, contact messages, newsletter subscribers

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit the values (see below)
npm run dev
```

Open http://localhost:3000. Admin login is at **http://localhost:3000/admin/login**.

### Default admin login

Set in `data/admins.json` (and mirrored in `.env.example` for reference):

- Email: `admin@devsoc.club`
- Password: `change-this-password`

**Change this password before sharing the site with anyone.** Either edit
`data/admins.json` directly, or wire up a proper hashed-password flow (see
"Hardening for production" below).

## How data storage works

There is **no external database** — every collection (events, projects,
certificates, members, etc.) is a JSON file in `/data`, read and written by
`lib/db.js`. This means:

- Zero setup — it runs immediately after `npm install`.
- All data is local to your machine/server's filesystem. If you deploy to a
  serverless host (Vercel, Netlify, etc.), **writes will not persist**
  between requests because those platforms have a read-only filesystem at
  runtime. It's great for local development, a self-hosted VM/VPS, or a
  Docker container with a persistent volume — not for serverless hosting
  as-is.

To move to a real database later, you only need to change `lib/db.js`
(swap the `fs.readFileSync`/`writeFileSync` calls for calls to Postgres,
MongoDB, etc.) — every API route and admin page calls the same small set of
functions (`readCollection`, `writeCollection`, `insert`, `update`,
`remove`) and doesn't need to change.

## Project structure

```
app/
  page.js                 Home page
  about/ verify/ team/ testimonials/ events/ projects/
  teamup/ blog/ faq/ contact/ join/       Public pages
  admin/
    login/page.js          Admin login (unprotected)
    (app)/                 Everything under here requires a session:
      layout.js             Sidebar + server-side auth guard
      page.js                Dashboard
      events/ certificates/ projects/ members/ mentors/
      team/ testimonials/ blog/ faq/ inbox/    Admin management pages
  api/                     One folder per resource; route.js = collection
                            (GET/POST), [id]/route.js = single item
                            (GET/PATCH/DELETE). Custom endpoints:
                            events/[id]/rsvp, certificates/verify,
                            projects/[id]/upvote, projects/[id]/comments.
components/                Navbar, Footer, StarField (canvas bg), forms,
                            RsvpButton, UpvoteButton, CommentSection, etc.
lib/
  db.js                    JSON-file datastore (swap this for a real DB)
  auth.js                  Admin session (signed cookie)
  crud.js                  Generic CRUD API-route factory
  adminFetch.js             Small fetch wrapper used by admin pages
data/*.json                Seed data / the "database" itself
middleware.js               Redirects unauthenticated /admin/* requests
public/logo.jpg
public/logo-animated.mp4   Your DevSoc logo (extracted from the video you
                            uploaded) used as a looping hero animation
```

## Hardening for production

This is built to run correctly out of the box, but a few things are
intentionally simple and should be upgraded before real-world use:

1. **Passwords are stored in plaintext** in `data/admins.json`. Hash them
   (e.g. with `bcrypt`) and compare hashes in `lib/auth.js`.
2. **Swap the JSON-file store for a real database** if you deploy anywhere
   with a read-only or ephemeral filesystem (see above).
3. **Set a strong `SESSION_SECRET`** in `.env.local` in production.
4. Add file/image upload storage (e.g. S3 or Cloudinary) if you want real
   photos for team members and event covers — currently those fields are
   plain URL strings you can fill in from the admin forms.
5. Consider adding rate limiting to public POST endpoints (RSVP, contact,
   feedback, project submission) to prevent spam.

## Customizing the space theme

- Colors/gradients: `tailwind.config.js` (`nova` and `void` color scales)
- Starfield/asteroid animation: `components/StarField.js` (pure canvas, no
  external assets)
- Fonts: Space Grotesk (headings) + Inter (body), loaded in `app/globals.css`
