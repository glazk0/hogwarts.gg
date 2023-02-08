alter table
  "public"."nodes" drop column "coordinates";


alter table
  "public"."nodes"
add
  column "world" text not null;


alter table
  "public"."nodes"
add
  column "x" real not null;


alter table
  "public"."nodes"
add
  column "y" real not null;


alter table
  "public"."nodes"
add
  column "z" double precision not null;