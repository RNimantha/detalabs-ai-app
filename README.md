# DetaLabs AI

DetaLabs AI’s marketing website, StelVoice product landing page, and blog administration application. Built with Next.js App Router, React, and TypeScript, with Supabase for blog data and Google Apps Script for website leads.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Google Sheets lead integration](#google-sheets-lead-integration)
- [Supabase and admin setup](#supabase-and-admin-setup)
- [Commands](#commands)
- [Routes and APIs](#routes-and-apis)
- [Project structure](#project-structure)
- [Content and styling](#content-and-styling)
- [Deployment](#deployment)
- [Validation](#validation)
- [Troubleshooting](#troubleshooting)

## Features

- Company, services, work, team, contact, privacy, and terms pages.
- StelVoice product page with demo, trial, and pricing inquiries.
- Validated consultation forms with Google Sheets storage, team email notifications, and visitor confirmations.
- Public blog with individual articles, views, likes, and moderated comments.
- Admin login, blog editing, image uploads, comment moderation, and stored contact management.
- Responsive components, theme support, and animated marketing sections.
- SEO metadata, structured data, sitemap, robots rules, and an `llms.txt` endpoint.
- Deployment configuration for Cloudflare Workers and Netlify.

The StelVoice page markets the product; this repository does not implement the call-analysis platform shown in its screenshots.

## Technology

| Area | Implementation |
| --- | --- |
| Application | Next.js 15.5.29, React 18, TypeScript |
| Styling and UI | Tailwind CSS 3, Radix UI, shadcn-style components, Lucide icons |
| Animation | Framer Motion, GSAP, OGL |
| Forms | React Hook Form, Zod |
| Blog and admin data | Supabase Postgres and Storage |
| Admin authentication | bcrypt password hashes and database-backed sessions |
| Lead delivery | Google Apps Script, Google Sheets, Google email services |
| Additional notification utilities | Nodemailer and Twilio |
| Cloudflare adapter | OpenNext with Wrangler |

## Local development

Use the Node.js version recorded in [`.node-version`](.node-version), currently **24.22.1**, and npm. The package declares `npm@10.9.2`.

```bash
npm ci --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The legacy peer dependency option matches the repository’s Netlify installation configuration.

Marketing pages can be developed without external services. Lead submission needs the Google webhook configuration; blog and admin features need Supabase.

To configure those features, create `.env.local` in the repository root using the example below, replace the placeholders, and restart the development server. The repository ignores `.env*` files; keep credentials out of source control.

## Environment variables

Minimal configuration for all primary backend features:

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
GOOGLE_LEADS_WEBHOOK_SECRET=your-apps-script-shared-secret
GOOGLE_LEADS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for SEO. Defaults to `https://detalabsai.com`; use the production origin when deploying. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL for blog and admin functionality. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase client key; access is governed by database policies. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for privileged database and storage operations. |
| `GOOGLE_LEADS_WEBHOOK_SECRET` | Server-only secret matching Apps Script’s `LEADS_WEBHOOK_SECRET`. Required to submit leads. |
| `GOOGLE_LEADS_WEBHOOK_URL` | Optional override of the existing deployment URL in `lib/google-leads.ts`. Use your deployment’s HTTPS `/exec` URL. |

Additional notification configuration is optional. These utilities are separate from the primary website lead workflow, which uses Google:

| Variable | Purpose / default |
| --- | --- |
| `SMTP_HOST` | SMTP host; defaults to `smtp.gmail.com`. |
| `SMTP_PORT` | SMTP port; defaults to `587`. |
| `SMTP_USER` | SMTP account username. |
| `SMTP_PASS` | SMTP account password or provider app password. |
| `SMTP_FROM` | Sender address; falls back to `SMTP_USER`. |
| `TWILIO_ACCOUNT_SID` | Twilio account identifier. |
| `TWILIO_AUTH_TOKEN` | Twilio authentication token. |
| `TWILIO_WHATSAPP_FROM` | WhatsApp sender number used by the notification utility. |

`DETALABS_NEXT_DIST_DIR` optionally overrides Next.js’s `.next` output directory. Leave it unset for Cloudflare builds. The Cloudflare build script sets `CLOUDFLARE_BUILD=1` to disable Next.js image optimization for that target.

Variables prefixed with `NEXT_PUBLIC_` can be included in browser bundles. Never give that prefix to service-role keys, webhook secrets, SMTP passwords, or Twilio credentials.

`npm run validate-env` reports configuration readiness without failing on missing variables. It reads the shell environment directly and does **not** load `.env.local`; Next.js loads that file separately.

## Google Sheets lead integration

The active lead workflow is:

```text
Contact / StelVoice form
  → POST /api/contact
  → server-side validation and authenticated Apps Script webhook
  → Google Sheets + team notification + visitor confirmation
```

Website form submissions do not write to the Supabase contact table. The admin contacts screen manages records already stored in Supabase.

To configure your own Google deployment:

1. Review [`integrations/google-apps-script/Code.gs`](integrations/google-apps-script/Code.gs), especially `LEADS_CONFIG`. Set the spreadsheet ID, team recipients, reply-to address, website, and timezone for your deployment.
2. Open the target spreadsheet’s **Extensions → Apps Script**, paste the script into `Code.gs`, and save it.
3. Run `setup()` and authorize the requested permissions. It prepares the `Website Leads` tab, generates the shared secret, and installs a notification retry trigger. Setup sends no test email.
4. Copy `LEADS_WEBHOOK_SECRET` from **Project Settings → Script properties** into the application’s server-only `GOOGLE_LEADS_WEBHOOK_SECRET`.
5. Deploy as a **Web app**, executing as your Google account, with access set to **Anyone**. The shared secret authenticates requests from the website server.
6. Set `GOOGLE_LEADS_WEBHOOK_URL` to the resulting `/exec` URL. A `/dev` URL or a URL outside the supported Apps Script deployment format is rejected.
7. Restart or redeploy the website after changing its environment configuration.

For script updates, run `setup()` as described in the script, then publish a new version of the existing deployment. Existing lead rows are preserved.

Requests reuse the same lead ID for retries. The website only reports success after Google confirms that the matching lead was stored. Email can remain pending after a successful submission; the Apps Script trigger retries pending notifications every 10 minutes, subject to Google quotas. Email delivery and sheet updates are not atomic, so a rare failure can produce a duplicate notification.

Email preview files are available under `integrations/google-apps-script/previews/`.

## Supabase and admin setup

1. Create a Supabase project and configure the three Supabase environment variables above.
2. Run [`supabase/complete-schema.sql`](supabase/complete-schema.sql) in the project’s SQL Editor. It defines blog posts, admin users and sessions, images, likes, comments, views, and contact submissions, with indexes and row-level security policies.
3. Create the public `blog-images` storage bucket:

   ```bash
   node supabase/setup-storage.js
   ```

   The script reads `.env.local`. Image uploads use the service-role client, and published image URLs must be publicly readable. Review [`supabase/storage-policies.sql`](supabase/storage-policies.sql) before applying any additional policies; its write policies are broad.

4. Create an admin interactively:

   ```bash
   node --env-file=.env.local supabase/create-admin.js
   ```

   Enter an email, password, and display name. The script hashes the password with bcrypt before inserting the account. Its password prompt is visible in the terminal, so run it in a private session.

5. Start the application and visit `/admin/login`. After login, use `/admin/uploader` to manage blog content.

Admin authentication uses the application’s own `blog_admin_users` and `blog_admin_sessions` tables rather than Supabase Auth accounts. Admin routes validate the `admin_session` cookie before privileged operations.

The schema directory also contains incremental setup and repair scripts. Choose them for a specific existing-database issue rather than running every SQL file in sequence. See [`supabase/README.md`](supabase/README.md) for supplementary setup notes; the complete schema and current implementation define the actual behavior.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server on port 3000. |
| `npm run build` | Run environment reporting through `prebuild`, then create a production build. |
| `npm start` | Serve an existing Next.js production build. |
| `npm run validate-env` | Report required and optional shell environment variables. |
| `npm run test:leads` | Run mocked Apps Script and website lead integration tests. |
| `npm run lint` | Run Next.js’s ESLint checks. |
| `npm run build:cloudflare` | Build the OpenNext Cloudflare worker and assets. |
| `npm run preview:cloudflare` | Preview the built worker with Wrangler on port 3003. |
| `npm run deploy:cloudflare` | Build and deploy to the configured Cloudflare Worker. |
| `npm run cf:typegen` | Generate Cloudflare environment types. |

The `lint` script invokes `next lint`. You can also run `npx eslint .` to check the repository directly with the existing ESLint configuration.

## Routes and APIs

### Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/about`, `/work` | Company information and work |
| `/services`, `/services/[slug]` | Services overview and detail pages |
| `/products/stelvoice` | StelVoice product landing page |
| `/stelvoice` | Permanent redirect to `/products/stelvoice` |
| `/contact` | Consultation form |
| `/blog`, `/blog/[slug]` | Published blog posts |
| `/privacy`, `/terms` | Legal pages |
| `/admin/login` | Administrator sign-in |
| `/admin/uploader` | Blog management and editing |
| `/admin/comments` | Comment moderation |
| `/admin/contacts` | Supabase contact records |

### API endpoints

| Endpoint | Methods | Purpose |
| --- | --- | --- |
| `/api/contact` | POST | Validate and deliver consultation or StelVoice leads to Google. |
| `/api/blog` | GET | Public blog listing. |
| `/api/blog/[slug]/view` | POST | Record a blog view. |
| `/api/blog/[slug]/interactions` | GET, POST | Read interactions and handle likes. |
| `/api/blog/[slug]/comments` | GET, POST | Read approved comments and submit comments for moderation. |
| `/api/admin/login`, `/api/admin/logout` | POST | Start or end an admin session. |
| `/api/admin/me` | GET | Read the current authenticated admin. |
| `/api/admin/blogs` | GET, POST | List or create blog posts. |
| `/api/admin/blogs/[id]` | GET, PUT, DELETE | Read, update, or delete a post. |
| `/api/admin/upload-image` | POST | Upload an image using multipart field `file`; maximum 5 MB. |
| `/api/admin/comments` | GET | List comments for moderation. |
| `/api/admin/comments/[id]` | PUT, DELETE | Update or delete a comment. |
| `/api/admin/contacts` | GET | List Supabase contact submissions. |
| `/api/admin/contacts/[id]` | PUT, DELETE | Update or delete a stored contact. |

Contact validation lives in [`lib/contact-validation.ts`](lib/contact-validation.ts). Consultations require `name`, `email`, `service`, and `budget`; permitted service and budget values come from `content/pages.ts`. StelVoice inquiries use `kind: "stelvoice"`, `requestType` (`demo`, `trial`, or `pricing`), `name`, `email`, and `company`. Both support optional details and a client-supplied UUID v4 `leadId` for retries.

The contact endpoint returns `201` for confirmed storage, `400` for invalid input, `413` for oversized bodies, `503` for missing webhook configuration, and `502` for unconfirmed delivery. The repository also includes diagnostic `/api/test` and `/api/test-notifications` routes; inspect their implementation before invoking notification diagnostics.

## Project structure

```text
app/                         Next.js pages, layouts, metadata, and API routes
  admin/                     Admin login and management screens
  api/                       Server-side request handlers
  products/stelvoice/         Product landing page
components/
  blog/                      Blog comments and interactions
  layout/                    Header, footer, conditional layout
  marketing/                 Forms and reusable marketing sections
  seo/                       JSON-LD rendering
  ui/                        Shared UI components
content/                     Site copy, services, leadership, product content
hooks/                       Reusable React hooks and lead retry IDs
integrations/google-apps-script/
                             Google webhook, email templates, and tests
lib/                         Validation, data access, auth, SEO, integrations
public/                      Images, product screenshots, video, and icons
scripts/                     Environment reporting, builds, integration tests
supabase/                    Clients, SQL schemas, types, and setup utilities
styles/                      Additional styling assets
```

## Content and styling

- Edit shared identity and navigation in `content/site.ts`.
- Edit marketing and contact copy in `content/pages.ts`.
- Edit product content in `content/stelvoice.ts` and team data in `content/leadership.ts`.
- Review `content/readiness.ts` when changing release-readiness content.
- Put publicly served images and video in `public/`; StelVoice assets live in `public/stelvoice/`.
- Update shared styles in `app/globals.css`, Tailwind configuration in `tailwind.config.js`, and theme tokens in `lib/theme.ts`.
- Review `lib/seo.ts`, `lib/structured-data.ts`, `app/sitemap.ts`, and `app/robots.ts` when changing routes or the public domain.

Product interactions dispatch a `stelvoice:analytics` browser event through `lib/product-analytics.ts`. A consent-aware listener can consume those event names; the helper does not send form fields or call data.

## Deployment

### Cloudflare Workers

The repository uses OpenNext and Cloudflare **Workers**, with settings in `open-next.config.ts` and `wrangler.jsonc`.

1. Install dependencies and authenticate Wrangler for your Cloudflare account.
2. Review the worker name in `wrangler.jsonc` and configure production environment values. Make public Next.js variables available during the build, and configure server secrets for the deployed worker.
3. Stop local Next.js development servers and leave `DETALABS_NEXT_DIST_DIR` unset. OpenNext reads the default `.next` directory.
4. Build and preview:

   ```bash
   npm run build:cloudflare
   npm run preview:cloudflare
   ```

5. Deploy when ready:

   ```bash
   npm run deploy:cloudflare
   ```

For repository-connected Workers Builds, the configured workflow is build command `npm run build:cloudflare` and deploy command `npx wrangler deploy`.

Provision `GOOGLE_LEADS_WEBHOOK_SECRET` as a runtime secret, for example with `npx wrangler secret put GOOGLE_LEADS_WEBHOOK_SECRET`. Blog and admin also need the Supabase values. Use your own Google deployment URL when appropriate.

Build output is generated in `.open-next/`. Cloudflare image optimization is disabled by the build configuration because the shipped images are already compressed.

### Netlify

[`netlify.toml`](netlify.toml) defines the Next.js plugin, `.next` publish directory, build command, headers, and legacy peer dependency installation option.

Connect the repository, configure production environment variables in Netlify, and use the checked-in configuration. The Netlify file currently selects Node.js 20, while local `.node-version` selects 24.22.1; review that difference when maintaining deployment compatibility. Environment validation reports missing configuration but does not block the build, despite older comments in `netlify.toml` suggesting otherwise.

### Node.js hosting

For a host that supports a persistent Next.js server:

```bash
npm run build
npm start
```

Provide the production environment to the build and running process. This application includes API routes and database-backed features and requires a server runtime for those features.

## Validation

Run the existing lead tests and static checks:

```bash
npm run test:leads
npx tsc --noEmit
npx eslint .
```

The lead tests mock external requests and Apps Script services; they do not submit real leads or send email. They cover validation, shared-secret handling, deduplication and retry behavior, delivery confirmation, and notification handling. There is no general `npm test` script.

After configuring services, manually verify the homepage and mobile navigation, a consultation submission, StelVoice inquiry flows, admin login, publishing a blog post, image upload, and comment moderation. Live submissions write to Google Sheets and can send real emails, so use an intentional test recipient and project.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Lead form returns `503` | Ensure the website secret is set and Apps Script `setup()` has created its matching secret. Restart or redeploy after changing environment values. |
| Lead form returns `502` | Check server logs for the operational error code, the deployed `/exec` URL, secret agreement, web app access, and the current script deployment version. |
| Lead saved but email is delayed | Inspect notification status columns in Sheets, the retry trigger, Google authorization, and mail quotas. |
| Blog is empty or admin requests fail | Verify Supabase configuration, run the appropriate schema, confirm published posts use `is_public = true`, and inspect database policies. |
| Admin cannot log in | Create a user in `blog_admin_users` with the interactive script; a Supabase Auth account alone does not create an application admin. |
| Image upload fails | Confirm the `blog-images` bucket exists, the service-role key is configured, the session is valid, and the file is an image no larger than 5 MB. |
| Environment validator reports missing values despite `.env.local` | The standalone validator only reads exported shell values. Next.js loads `.env.local` itself. |
| Cloudflare build cannot find Next.js output | Unset `DETALABS_NEXT_DIST_DIR`, stop `next dev`, and rebuild using `npm run build:cloudflare`. |
| Dependency installation reports peer conflicts | Use `npm ci --legacy-peer-deps`, matching the checked-in Netlify installation option. |

## Contributing and licensing

Keep changes focused, run relevant checks, and document any new configuration or database setup. Do not commit environment files, credentials, generated build output, or real lead data.

The package is marked private and this repository currently contains no license file. Confirm permissions with the repository owner before redistributing its code or assets.
