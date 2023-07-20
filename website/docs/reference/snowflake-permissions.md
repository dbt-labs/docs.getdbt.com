---
title: "Snowflake Permissions"
---

## Example Snowflake permissions

```
-- NOTE: warehouse_name, database_name, and role_name are placeholders!
-- Replace as-needed for your organization's naming convention!

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
