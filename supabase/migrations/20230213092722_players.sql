create extension if not exists "pg_net"
with
  schema "extensions";


create table
  "public"."players" (
    "id" text not null,
    "user_id" uuid not null,
    "house_id" text not null,
    "first_name" text not null,
    "last_name" text not null,
    "year" bigint not null,
    "updated_at" timestamp
    with
      time zone default now() not null,
      "position_x" double precision not null,
      "position_y" double precision not null,
      "position_z" double precision not null,
      "position_pitch" double precision not null,
      "position_roll" double precision not null,
      "position_yaw" double precision not null,
      "position_world" text not null
  );


alter table
  "public"."players" enable row level security;


CREATE UNIQUE INDEX players_pkey ON public.players USING btree (id);


alter table
  "public"."players"
add
  constraint "players_pkey" PRIMARY KEY using index "players_pkey";


alter table
  "public"."players"
add
  constraint "players_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;


alter table
  "public"."players" validate constraint "players_user_id_fkey";


create policy "Allow authenticated insert access" on "public"."players" as permissive for insert to authenticated
with
  check (true);


create policy "Allow individual update access" on "public"."players" for
update
  using (auth.uid() = user_id);


create policy "Allow public read access" on "public"."players" as permissive for
select
  to public using (true);