-- Contact form inquiries. The website writes them with the secret service-role key; the public key can't
-- read or write this table (row level security on, no policies).
create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  business text not null default '',
  message text not null,
  -- Package id from content/pricing.ts (landing, business, hr, custom) and the HR level (basic, standard, enterprise).
  plan text,
  tier text,
  -- What the visitor saw, e.g. "HR management system, Standard (৳20,000)".
  package text,
  -- Two-letter country code from the visitor's IP.
  country text,
  status text not null default 'New'
);

alter table public.inquiries enable row level security;
revoke all on public.inquiries from anon, authenticated;
