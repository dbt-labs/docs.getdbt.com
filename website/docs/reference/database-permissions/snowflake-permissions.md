---
title: "Snowflake permissions"
---

In Snowflake, permissions are used to control who can perform certain actions on different database objects. Use SQL statements to manage permissions in a Snowflake database.

## Example Snowflake permissions

The following example provides you with the SQL statements you can use to manage permissions. 

**Note** that `warehouse_name`, `database_name`, and `role_name` are placeholders and you can replace them as-needed for your organization's naming convention.

```

grant all on warehouse warehouse_name to role role_name;
grant usage on database database_name to role role_name;
grant create schema on database database_name to role role_name; 
grant usage on schema database.an_existing_schema to role role_name;
grant create table on schema database.an_existing_schema to role role_name;
grant create view on schema database.an_existing_schema to role role_name;
grant usage on future schemas in database database_name to role role_name;
grant monitor on future schemas in database database_name to role role_name;
grant select on future tables in database database_name to role role_name;
grant select on future views in database database_name to role role_name;
grant usage on all schemas in database database_name to role role_name;
grant monitor on all schemas in database database_name to role role_name;
grant select on all tables in database database_name to role role_name;
grant select on all views in database database_name to role role_name;
```

For more info on the privileges how to set up your Snowflake account, refer to [this Discourse article](https://discourse.getdbt.com/t/setting-up-snowflake-the-exact-grant-statements-we-run/439).
