---
title: "Postgres Permissions"
---


In Postgres, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Postgres database.

## Example Postgres permissions

The following example provides you with the SQL statements you can use to manage permissions. These examples allow you to run dbt smoothly without encountering permission issues, such as creating schemas, reading existing data, and accessing the information schema. 

**Note** that `database_name`, `source_schema`, `destination_schema`, and `user_name` are placeholders and you can replace them as needed for your organization's naming convention.

```sql
grant connect on database database_name to user_name;

-- Grant read permissions on the source schema
grant usage on schema source_schema to user_name;
grant select on all tables in schema source_schema to user_name;
alter default privileges in schema source_schema grant select on tables to user_name;

-- Create destination schema and make user_name the owner
create schema if not exists destination_schema;
alter schema destination_schema owner to user_name;

-- Grant write permissions on the destination schema
grant usage on schema destination_schema to user_name;
grant create on schema destination_schema to user_name;
grant insert, update, delete, truncate on all tables in schema destination_schema to user_name;
alter default privileges in schema destination_schema grant insert, update, delete, truncate on tables to user_name;
```

Check out the [official documentation](https://www.postgresql.org/docs/current/sql-grant.html) for more information.
