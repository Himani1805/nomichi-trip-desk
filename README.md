# Nomichi Trip Desk

Nomichi Trip Desk is a Next.js App Router submission for the Nomichi engineering assignment. It includes a public lead capture website for travellers and an authenticated admin workspace for reviewing enquiries, managing trip inventory, updating lead pipeline stages, saving call notes, and generating an AI-assisted WhatsApp draft.

## Tech Stack

- Next.js App Router
- React with JavaScript
- Tailwind CSS
- Supabase database and Supabase Auth
- Gemini API for the internal WhatsApp draft helper

## Core Features

- Public travel desk with active seasonal routes
- Public enquiry form with trip selection and traveller preferences
- Admin login through Supabase Auth
- Email allowlist based admin authorization
- Protected admin APIs for leads, trips, metrics, notes, and AI draft generation
- Dashboard metrics for total leads, leads by stage, and leads per trip
- Leads CRM with search, status filter, trip filter, and owner filter
- Lead detail workspace with status updates, owner assignment, call notes, and AI WhatsApp draft
- Trips CMS with create, edit, open, and close actions
- Closed trips are hidden from the public website

## Admin Login

Use an approved Supabase Auth admin user.

Default reviewer account:

```txt
Email: admin@nomichi.com
Password: admin123
```

The authenticated email must be present in `ADMIN_EMAIL_ALLOWLIST`.

## Environment Variables

Create `.env.local` using `.env.example` as the reference.

Required variables:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
GEMINI_API_KEY
ADMIN_EMAIL_ALLOWLIST
```

## Local Development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
```

Admin:

```txt
http://localhost:3000/admin/login
```

## Quality Checks

```bash
npm run lint
npm run build
```

Both commands should pass before submission.

## Submission Notes

- Public users can submit enquiries without authentication.
- Admin routes require a valid Supabase Auth session.
- Admin APIs return unauthorized or forbidden responses when the request is missing a valid admin session.
- The AI endpoint is server-side only and does not expose the Gemini key to the browser.
