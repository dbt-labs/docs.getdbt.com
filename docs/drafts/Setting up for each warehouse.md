
This guide assumes that you:
* Already have a data warehouse setup
* Already have raw data in your warehouse, and
* Have access to a set of super user credentials

This is not the only way to grant privileges, but is a good guide for getting
started. Alternatives include:
* Leveraging future/default grants
* Not granting create access, and instead giving someone a schema that they can
create within

## BigQuery


## Redshift
To run these statements, you'll need a set of super-user database credentials.
Run these statements from a SQL editor.

1. Create a user (`dbt_cloud`) for deployment. If you don't yet have your own
set of credentials to use when developing, create one now.
```sql
-- create a new user for deployment
create user dbt_cloud
  with password '<generate-this>';

-- create a new user for development
create user <your_name> -- e.g. alice
    with password '<generate-this>';

```
2. Create a group to allow us to grant privileges to all users using dbt, rather
than one at a time:
```sql
create group transformer
```
3. Add both your deployment and development users to the `transformer` group.
```sql
alter group transformer
  add user  dbt_cloud, <your_name>, <the_name_of_your_colleague>
```
4. Grant `select` access to any schemas containing data you want to transform.
For each schema, run:
```sql
grant usage on schema <schema_name> to group transformer;
grant select on all tables in schema raw_stripe to group transformer;
```
5. Grant the ability to create within the existing database:
```sql
grant create on database <database_name> to group transformer
```
6. Grant permission to see the system tables, to generate documentation:
```sql
grant select on all tables in schema information_schema to group transformer;
grant select on all tables in schema pg_catalog to group transformer;
```

Advanced tips:
* Leverage default grants


## Snowflake
To run these statements, you'll need `ACCOUNTADMIN` role privileges.

1. Create a user (`dbt_cloud`) for deployment. If you don't yet have your own
set of credentials to use when developing, create one now.
```sql
-- create a new user for deployment
create user dbt_cloud
  with password '<generate-this>';

-- create a new user for development
create user <your_name> -- e.g. alice
    with password '<generate-this>';
```
2. Create a warehouse to use, `transforming`
```sql
create warehouse transforming
    warehouse_size = xsmall
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;
  ```
3. Create a role to use when running dbt
```sql
create role loader;
grant all on warehouse loading to role loader;
```
