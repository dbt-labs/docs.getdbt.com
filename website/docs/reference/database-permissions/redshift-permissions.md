---
title: "Redshift permissions"
---

In Redshift, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Databricks database.

## Example Redshift permissions

The following example provides you with the SQL statements you can use to manage permissions. 

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

Check out the [official documentation](https://docs.aws.amazon.com/redshift/latest/dg/r_GRANT.html) for more information.
