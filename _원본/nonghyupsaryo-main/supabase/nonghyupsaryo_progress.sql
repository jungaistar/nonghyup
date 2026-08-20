-- 농협사료 학습사이트 · 학습 진도 동기화 테이블
-- 공용 Supabase 프로젝트(hcmgdztsgjvzcyxyayaj)의 SQL Editor에서 1회 실행하세요.
-- 실행 후, 로그인한 사용자의 "학습 완료" 진도가 기기 간에 동기화됩니다.
-- (테이블이 없어도 앱은 localStorage로 정상 동작하도록 방어되어 있습니다.)

create table if not exists public.nonghyupsaryo_progress (
  user_id   uuid        not null references auth.users (id) on delete cascade,
  vol_id    text        not null,
  part_num  integer     not null,
  created_at timestamptz not null default now(),
  primary key (user_id, vol_id, part_num)
);

alter table public.nonghyupsaryo_progress enable row level security;

-- 본인 행만 읽기/쓰기 가능
drop policy if exists "nhs_progress_select_own" on public.nonghyupsaryo_progress;
create policy "nhs_progress_select_own"
  on public.nonghyupsaryo_progress for select
  using (auth.uid() = user_id);

drop policy if exists "nhs_progress_insert_own" on public.nonghyupsaryo_progress;
create policy "nhs_progress_insert_own"
  on public.nonghyupsaryo_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "nhs_progress_update_own" on public.nonghyupsaryo_progress;
create policy "nhs_progress_update_own"
  on public.nonghyupsaryo_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "nhs_progress_delete_own" on public.nonghyupsaryo_progress;
create policy "nhs_progress_delete_own"
  on public.nonghyupsaryo_progress for delete
  using (auth.uid() = user_id);
