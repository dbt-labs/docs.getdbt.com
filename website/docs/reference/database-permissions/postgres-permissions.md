---
title: "Postgres Permissions"
---

## Example Postgres permissions

```
grant usage on database database_name to user_name;
grant create schema on database database_name to user_name;
grant usage on schema database.schema_name to user_name;
grant create table on schema database.schema_name to user_name;
grant create view on schema database.schema_name to user_name;
grant usage on all schemas in database database_name to user_name;
grant select on all tables in database database_name to user_name;
grant select on all views in database database_name to user_name;
```

Check out the [official documentation](https://www.postgresql.org/docs/current/sql-grant.html) for more information.
