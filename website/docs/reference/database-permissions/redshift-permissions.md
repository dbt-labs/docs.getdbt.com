---
title: "Redshift permissions"
---

In Redshift, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Redshift database.

## Example Redshift permissions

The following example provides you with the SQL statements you can use to manage permissions. 

**Note** that `database_name`, `database.schema_name`, and `user_name` are placeholders and you can replace them as needed for your organization's naming convention.

```
grant create schema on database database_name to user_name;
grant usage on schema database.schema_name to user_name;
grant create table on schema database.schema_name to user_name;
grant create view on schema database.schema_name to user_name;
grant usage for schemas in database database_name to role role_name;
grant select on all tables in database database_name to user_name;
grant select on all views in database database_name to user_name;
```

To connect to the database, confirm with an admin that your user role or group has been added to the database. Note that Redshift permissions differ from Postgres, and commands like [`grant connect`](https://www.postgresql.org/docs/current/sql-grant.html) aren't supported in Redshift.

Check out the [official documentation](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) for more information.
