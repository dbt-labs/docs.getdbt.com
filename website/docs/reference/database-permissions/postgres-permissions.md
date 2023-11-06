---
title: "Postgres Permissions"
---


In Postgres, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Postgres database.

## Example Postgres permissions

The following example provides you with the SQL statements you can use to manage permissions. These examples allow you to run dbt smoothly without encountering permission issues, such as creating schemas, reading existing data, and accessing the information schema. 

**Note** that `database_name`, `database.schema_name`, and `user_name` are placeholders and you can replace them as needed for your organization's naming convention.

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
