# GrowBro — AI Customer Growth Platform

Full-stack app: marketing landing page with lead-capture modal, public
blog, admin Blog CMS, and an inbound-lead Mini-CRM.

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, lucide-react
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy (async) + asyncpg
- **Database:** Supabase (PostgreSQL)

## 1. Database

1. Open your Supabase project → **SQL Editor**.
2. Paste and run `supabase_migration.sql`. This creates the `blogs` and
   `leads` tables, indexes, an `updated_at` trigger, and basic RLS policies.

## 2. Backend (`/backend`)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in DATABASE_URL from Supabase
uvicorn main:app --reload --port 8000
```

- API docs: http://localhost:8000/docs
- `DATABASE_URL` comes from **Supabase → Project Settings → Database →
  Connection string (URI)**. Use the direct connection (port 5432) for a
  long-running `uvicorn` process, or the pooler (port 6543) for
  serverless deploys.

## 3. Frontend (`/frontend`)

This project assumes an existing Next.js 14+ App Router project with
TypeScript and Tailwind CSS already configured (matching your company's
setup), with `lucide-react` installed:

```bash
npm install lucide-react
```

Copy the `app/`, `components/`, and `lib/` folders from this delivery
into your Next.js project (merging with any existing `app/` directory),
then:

```bash
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL
npm run dev
```

- Landing page: http://localhost:3000/
- Public blog: http://localhost:3000/blog
- Admin CMS: http://localhost:3000/admin/blogs
- CRM leads: http://localhost:3000/admin/crm

### Lead capture modal

`components/LeadCaptureModal.tsx` is wired to every "Start Free now" /
"Book demo" CTA on the landing page. It posts Name, WhatsApp Phone,
Email, and Business Type to `POST /api/leads`. The `leads` table (per
the SQL spec) has no dedicated `business_type` column, so the backend
folds that field into `notes` on save (see `create_lead` in
`backend/main.py`) — add a real column + migration if you want it as
its own queryable field later.

If your `tsconfig.json` doesn't already have the `@/*` path alias used
in `lib/api.ts` imports, add:

```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```

## Notes / next steps

- **Auth:** `/admin/*` routes are not gated behind authentication in
  this delivery — add a middleware/auth check (e.g. Supabase Auth)
  before deploying, since these expose full create/edit/delete access.
- **Product video:** the video section ships as a styled placeholder
  (thumbnail + play button) since no video URL was provided — swap in
  a real `<iframe>` (YouTube/Vimeo/Drive) or `<video>` tag; a commented
  example is left in `app/page.tsx`.
- **Markdown rendering:** the editor stores raw Markdown/plain text;
  the public reader currently renders paragraphs directly. Wire in
  `react-markdown` (or similar) in `app/blog/[slug]/page.tsx` and the
  editor preview if you want full Markdown formatting (headers, bold,
  links, etc.) rendered as HTML.
- **Blog categories:** `BLOG_CATEGORIES` in `lib/api.ts` is a fixed
  starter list used by the admin editor's category dropdown — edit
  that array to match your real taxonomy.
- Table/section styling uses the GrowBro palette (`#10b981` /
  `#059669` / `#064e3b` emerald, `#0f172a` / `#1e293b` slate,
  `#f8fafc` off-white) per the spec; adjust in the Tailwind classes if
  your design system differs slightly.
