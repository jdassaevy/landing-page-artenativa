create or replace function public.set_current_class_period(target_period_id uuid)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if coalesce((select auth.jwt() -> 'app_metadata' ->> 'role'), '') <> 'admin' then
    raise exception using
      errcode = '42501',
      message = 'row-level security: admin role required to switch current class period';
  end if;

  if not exists (
    select 1
    from public.class_periods
    where id = target_period_id
  ) then
    raise exception 'class period % not found', target_period_id;
  end if;

  update public.class_periods
  set is_current = false
  where is_current
    and id <> target_period_id;

  update public.class_periods
  set is_current = true
  where id = target_period_id;
end;
$$;

revoke all on function public.set_current_class_period(uuid) from public;
revoke all on function public.set_current_class_period(uuid) from anon;
grant execute on function public.set_current_class_period(uuid) to authenticated;
