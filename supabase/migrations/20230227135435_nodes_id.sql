alter table "public"."comments" drop constraint "comments_node_id_fkey";

alter table "public"."comments" drop constraint "only_one_value";

alter table "public"."comments" drop column "node_id";

alter table "public"."nodes" alter column "id" drop identity;

alter table "public"."nodes" alter column "id" set data type text using "id"::text;

CREATE UNIQUE INDEX nodes_name_key ON public.nodes USING btree (id);

alter table "public"."nodes" add constraint "nodes_name_key" UNIQUE using index "nodes_name_key";


