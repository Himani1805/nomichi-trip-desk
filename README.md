# Nomichi Trip Desk

Nomichi Trip Desk is a practical trip enquiry and operations tool for Nomichi. It helps travellers discover live trips and submit enquiries, while giving the team a simple admin workspace to manage leads, update trip availability, and keep follow-up work organised.

## Live Demo

Deployment URL: https://nomichi-trip-desk-xi.vercel.app/

## Admin Access

Use the following admin credentials:
- Email: admin@nomichi.com
- Password: admin123

## Features

### Public Enquiry Experience
- Browse live open trips
- View destination, dates, and price including GST
- Submit an enquiry
- Validation and success state
- Mobile-first experience

### Team Operations Console
- Secure login
- Lead management
- Search and filtering
- Lead ownership
- Pipeline management
- Notes and touchpoints
- Dashboard overview

### Trips Management
- Create trips
- Edit trips
- Open or close trips
- Automatic public visibility

### AI Assistance
The AI WhatsApp draft feature uses trip details and traveller responses to generate a warm first outreach draft. It runs server-side only and is intended as a drafting aid, not an automated decision maker.

## Tech Stack
- Next.js App Router
- JavaScript
- Supabase
- PostgreSQL
- Gemini API
- Vercel

## Data Model
Trips store public trip details and availability. Enquiries capture traveller intent and trip selection. Call logs record the team’s follow-up activity and notes.

## Environment Variables
```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
ADMIN_EMAIL_ALLOWLIST=
```

## Local Setup
```bash
npm install
npm run dev
```

## Deployment
The app is designed for deployment on Vercel with environment variables configured in the project settings. The public site and admin routes run from the same Next.js application.

## Product Decisions

### Key Decisions
1. Trips are managed entirely through admin instead of code.
2. Leads and trips remain connected through the database.
3. AI is used as an assistant, not an automated decision maker.

## What I Would Improve With Another Week
- Follow-up reminders
- Activity timeline
- CSV export
- Better analytics
- Richer AI assistance

## Security Notes
- Supabase authentication
- Protected admin APIs
- Environment variables
- Server-side AI calls

## Assignment Coverage

| Requirement | Status |
| --- | --- |
| Public enquiry flow | Completed |
| Admin login and protected workspace | Completed |
| Lead management and notes | Completed |
| Trip management | Completed |
| AI draft assistant | Completed |

## Final Note
Built a practical Nomichi Trip Desk that helps travellers discover trips, submit enquiries, and gives the team a simple admin workspace to manage leads, trips, notes, and follow-up. I’m especially proud of designing the experience around the real Nomichi workflow, making GST-inclusive pricing clearer for admins, and keeping the product focused on the core needs rather than unnecessary complexity.

With another week, I would strengthen the follow-up experience with reminders, a richer activity timeline, and better analytics.
