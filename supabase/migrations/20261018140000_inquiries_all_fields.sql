-- Every field of a contact inquiry, so the table holds the same as the Google Sheet.
alter table public.inquiries
  add column if not exists phone text not null default '',
  add column if not exists needs text[] not null default '{}',
  add column if not exists budget text not null default '',
  add column if not exists timeline text not null default '',
  -- Add-on ids from content/pricing.ts (seo, feature), and the line the visitor saw, e.g. "SEO setup (on-page and technical) (৳2,000)".
  add column if not exists addons text[] not null default '{}',
  add column if not exists addons_label text,
  -- The currency the prices were shown in: BDT or USD.
  add column if not exists currency text;
