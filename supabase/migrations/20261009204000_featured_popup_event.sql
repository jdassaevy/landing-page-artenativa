create unique index if not exists events_single_featured_popup_idx
  on public.events ((show_as_popup))
  where show_as_popup;

create or replace function public.set_featured_popup_event(target_event_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  target_status text;
begin
  if coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception using
      errcode = '42501',
      message = 'row-level security: admin role required to switch featured popup event';
  end if;

  select status
  into target_status
  from public.events
  where id = target_event_id;

  if not found then
    raise exception 'event % not found', target_event_id;
  end if;

  if target_status <> 'published' then
    raise exception 'event % must be published before it can be featured', target_event_id;
  end if;

  update public.events
  set show_as_popup = false
  where show_as_popup
    and id <> target_event_id;

  update public.events
  set show_as_popup = true
  where id = target_event_id;
end;
$$;

revoke all on function public.set_featured_popup_event(uuid) from public;
revoke all on function public.set_featured_popup_event(uuid) from anon;
grant execute on function public.set_featured_popup_event(uuid) to authenticated;
