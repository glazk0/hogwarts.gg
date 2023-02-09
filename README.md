# Hogwarts.gg

[Hogwarts.gg](https://www.hogwarts.gg) is a Hogwarts Legacy fansite with an interactive map, blog and tools.

![](/assets/social.jpg)

## Contribution

This app is Open Source. Contributors are highly welcome!
Join the [Discord](https://discord.com/invite/NTZu8Px).

Please add issues and feature requests on the Discord channel #suggestions.

# Environment variables

You can start by copying the template environment variables file.

```
cp template.env .env
```

The following list shows the variables you need to set:

| KEY                            | VALUE                                |
| ------------------------------ | ------------------------------------ |
| NEXT_PUBLIC_SUPABASE_URL       | Your project's Supabase URL \        |
| NEXT_PUBLIC_SUPABASE_ANON_KEY  | Your project's Supabase URL anon key |
| NEXT_PUBLIC_PLAUSIBLE_API_HOST | Plausible API host (optional)        |
| NEXT_PUBLIC_PLAUSIBLE_DOMAIN   | Plausible domain (optional)          |

## Running Locally

1. Install dependencies:

```sh
pnpm install
```

2. Start the dev server:

```sh
pnpm dev
```

## Migrations

This project is using [supabase](https://supabase.com/), which comes with a CLI tool to generate database migrations.
See the [guide](https://supabase.com/docs/reference/cli/introduction) for more details.

A database migration is prepared with:

```sh
supabase migration new <migration name>
```

A `.sql` file is generated in supabase/migrations.

Another is to update the tables in the supbase studio and run [db diff](https://supabase.com/docs/reference/cli/supabase-db-diff):

```sh
supabase db diff <migration name> -f <migration name>
```

After changing the schema, it's time to regenerate the types with [gen types](https://supabase.com/docs/reference/cli/supabase-gen-types-typescript):

```sh
supabase gen types typescript --local > lib/database.types.ts
```

If you are using PowerShell, you could copy it directly to clipboard:

```sh
supabase gen types typescript --local | clip

## Production-accurate data

If you are a contributor and like to work with real-data, you can use [snaplet](https://www.snaplet.dev/) to restore snapshots of our database on localhost.
Contact me to get access to the team.

After restoring a snapshot with the [snaplet cli](https://docs.snaplet.dev/getting-started/start-here), you need to execute the following commands in your pSQL database (e.g. with the Supabase SQL editor):

```sql
NOTIFY pgrst, 'reload schema';

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema public to postgres, anon, authenticated, service_role;

alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to postgres, anon, authenticated, service_role;

grant usage on schema storage to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema storage to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema storage to postgres, anon, authenticated, service_role;

alter default privileges in schema storage grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema storage grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema storage grant all on sequences to postgres, anon, authenticated, service_role;

grant usage on schema auth to supabase_auth_admin;

grant all privileges on all tables in schema auth to supabase_auth_admin;
grant all privileges on all functions in schema auth to supabase_auth_admin;
grant all privileges on all sequences in schema auth to supabase_auth_admin;

alter default privileges in schema auth grant all on tables to supabase_auth_admin;
alter default privileges in schema auth grant all on functions to supabase_auth_admin;
alter default privileges in schema auth grant all on sequences to supabase_auth_admin;
```

## Licensing

MIT

Game content and assets are trademarks of Warner Bros. Entertainment Inc.
