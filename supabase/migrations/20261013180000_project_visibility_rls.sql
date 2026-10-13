-- Access rules for the work on/off switches.
--
-- Before this, anyone holding the project's public key could change the table directly. With these rules:
--   * anyone may READ the switches (which projects are shown is public anyway)
--   * nobody may change them through the public key
--   * the website changes them with the secret service-role key, which is not subject to these rules
--
-- IMPORTANT before applying: SUPABASE_SERVICE_ROLE_KEY must be set in the site's environment (Vercel).
-- Without it the admin page can still read the switches but saving a change will fail.

alter table public.project_visibility enable row level security;

drop policy if exists "project_visibility is readable by everyone" on public.project_visibility;
create policy "project_visibility is readable by everyone"
  on public.project_visibility
  for select
  to anon, authenticated
  using (true);

-- No insert, update or delete policies: with row level security on, those are refused for the public key.
revoke insert, update, delete, truncate on public.project_visibility from anon, authenticated;
