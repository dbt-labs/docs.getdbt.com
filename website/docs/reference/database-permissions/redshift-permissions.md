---
title: "Redshift Permissions"
---

## Example Redshift permissions

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

Check out the [Official Documentation](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) for more information.
