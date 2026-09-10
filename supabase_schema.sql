-- ==============================================================================
-- HealthTrack Supabase Schema Initialization
-- Run this in your Supabase Project -> SQL Editor -> New Query
-- ==============================================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null default 'HealthTrack User',
  email text,
  role text default 'Student',
  age integer default 21,
  gender text default 'Male',
  blood_group text default 'O+',
  height_cm numeric(5,2) default 175.0,
  weight_kg numeric(5,2) default 68.5,
  daily_step_goal integer default 8500,
  daily_water_goal_ml integer default 2500,
  daily_sleep_goal_hours numeric(3,1) default 8.0,
  emergency_contact jsonb default '{"name": "Elena Rivera", "relationship": "Parent", "phone": "+1 (555) 234-5678", "doctorName": "Dr. Sarah Mitchell, MD", "doctorPhone": "+1 (555) 987-6543"}'::jsonb,
  medical_conditions text[] default array['Mild Seasonal Asthma'],
  allergies text[] default array['Penicillin'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Vitals History Table
create table if not exists public.vitals_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  heart_rate integer not null,
  systolic_bp integer not null,
  diastolic_bp integer not null,
  spo2 numeric(4,1) not null,
  temperature numeric(4,1) not null,
  notes text,
  logged_by text default 'Manual',
  recorded_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 3. Activity Tracking Table
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null default current_date,
  steps integer default 0,
  step_goal integer default 8500,
  calories_burned integer default 0,
  active_minutes integer default 0,
  distance_km numeric(5,2) default 0.0,
  workouts jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  constraint unique_user_date unique(user_id, date)
);

-- 4. Sleep Tracking Table
create table if not exists public.sleep_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null default current_date,
  bedtime text default '23:30',
  wake_time text default '07:15',
  total_hours numeric(4,2) default 7.75,
  quality_score integer default 85,
  stages jsonb default '{"deepMinutes": 110, "remMinutes": 125, "lightMinutes": 195, "awakeMinutes": 35}'::jsonb,
  notes text,
  created_at timestamptz default now()
);

-- 5. Reminders Table
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  category text not null, -- 'Medicine', 'Water', 'Exercise', 'Checkup', 'Sleep'
  time text not null,
  dosage_or_detail text,
  frequency text default 'Daily',
  is_active boolean default true,
  last_taken_date date,
  created_at timestamptz default now()
);

-- 6. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.vitals_history enable row level security;
alter table public.activities enable row level security;
alter table public.sleep_logs enable row level security;
alter table public.reminders enable row level security;

-- 7. Public RLS Access Policies (Allows read/write for authenticated users & anon access for demo)
create policy "Allow all operations for profiles" on public.profiles for all using (true) with check (true);
create policy "Allow all operations for vitals_history" on public.vitals_history for all using (true) with check (true);
create policy "Allow all operations for activities" on public.activities for all using (true) with check (true);
create policy "Allow all operations for sleep_logs" on public.sleep_logs for all using (true) with check (true);
create policy "Allow all operations for reminders" on public.reminders for all using (true) with check (true);
