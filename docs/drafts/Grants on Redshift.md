In our recent guide on [database administration](https://blog.fishtownanalytics.com/five-principles-that-will-keep-your-data-warehouse-organized-9c3d29caf6ce), I talked conceptually about how we organize our data warehouses. For those that haven't read it (you should!), here's a recap of the parts of that article that are relevant to this guide.

In the data warehouses we maintain, we:
- Ensure grants are consistent across a schema
- Use shared roles (groups on Redshift, roles on Snowflake) named `loader`, `transformer`, `reporter`
- Grant privileges to the shared roles, that are then inherited by their members
- Use a simplified privilege structure:
  * `read-schema`: Ability to select from a schema and all relations within it.
  * `create-schema`: Ability to create a schema in a database, and therefore create relations within it and have all privileges on those relations.
- Apply these privileges to the shared roles as follows:
  * `loader`:
     * `create-schema`
  * `transformer`:
     * `read-schema` for all schemas containing raw data
     * `create-schema`
  * `reporter`:
     * `read-schema` for all schemas containing transformed data

While the article went really deep into the "why" of all these practices, it was pretty light on the very specific "how" of setting this up, i.e. the implementation steps.

In this guide, I'll run through the exact privileges we grant outside of dbt to set up our warehouses in this way. I'm going to first talk through the Redshift specific statements we run to set up our warehouses – these are the statements we'd run if we were given a brand new cluster to play in, so if you're cleaning up an existing cluster, thigns will look a little different!

# 0. Set up the database(s) (and warehouses)
On Redshift, you can't run cross-database queries, so we'll do everything in one single database.
```
-- Redshift
create database analytics
```

On Snowflake we get a little luckier, and instead can use databases to group together our raw and transformed data:
```sql
-- Snowflake
create database raw;
create database analytics;
```

For snowflake we also have to set up the warehouses here:
```
create warehouse loading
    warehouse_size = xsmall
    auto_suspend = 3600
    auto_resume = false
    initially_suspended = true;

create warehouse transforming
    warehouse_size = xsmall
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;

create warehouse reporting
    warehouse_size = xsmall
    auto_suspend = 60
    auto_resume = true
    initially_suspended = true;
```

# 1. Set up shared roles
In Redshift, `shared roles == groups`
```
-- Redshift
create group loader;
create group transformer;
create group reporter;
```
In Snowflake, `shared roles == role`. We also grant privileges to a warehouse at this stage too.
```sql
-- Snowflake
create role loader;
grant all on warehouse loading to role loader;

create role transformer;
grant all on warehouse transforming to role transformer;

create role reporter;
grant all on warehouse reporting to role reporter;

```
# 2. Create users, assigning them to their shared roles
Every human being and application gets a separate user, and is assigned to the correct shared role.
```
-- Redshift
create user stitch -- or fivetran
    password = '_generate_this_'
    in group loader;

create user claire -- or drew, jeremy, etc
    password = '_generate_this_'
    in group transformer, reporter; -- dbt users get two roles!

create user dbt_cloud
    password = '_generate_this_'
    in group transformer;

create user looker -- or mode or periscope
    password = '_generate_this_'
    in group reporter;
```
```
-- Snowflake
-- create the users
create user stitch_user -- or fivetran_user
    password = '_generate_this_'
    default_warehouse = loading
    default_role = loader;

create user claire -- or drew, jeremy, etc.
    password = '_generate_this_'
    default_warehouse = transforming
    default_role = transformer;

create user dbt_cloud_user
    password = '_generate_this_'
    default_warehouse = transforming
    default_role = transformer;

create user looker_user -- or mode_user, periscope_user etc.
    password = '_generate_this_'
    default_warehouse = reporting
    default_role = reporter;

-- then grant these the share role to each user
grant role loader to user stitch_user; -- or fivetran_user
grant role transformer to user dbt_cloud_user;
grant role transformer to user claire; -- or drew, jeremy
grant role reporter to user looker_user; -- or mode_user, periscope_user


```

# 3. Grant `create-schema` privileges to `loader` and `transformer`
By granting a user the privilege to create a schema within a database, they will also then be able to create relations within that schema. Since they own the schema and relations, they also have all privileges on the schema and relations.

Both your `loader` group, and `transformer` will need to be able to create in your database.

On Redshift this looks like:
```
-- Redshift

-- create-schema to loader
grant create on database analytics to group loader;
grant select on all tables in schema information_schema to group transformer;
grant select on all tables in schema pg_catalog to group transformer;

-- create-schema to transformer
grant create on database analytics to group transformer;
grant select on all tables in schema information_schema to group transformer;
grant select on all tables in schema pg_catalog to group transformer;
```
^ I've also snuck in some statements to give privileges to information schemas here – these are required by both your ETL tools (i.e. members of your `loader` group) and by dbt users (i.e. members of your `transformer` group).

On Snowflake we make things a little easier – just grant `all` on the relevant database.
```
-- Snowflake
grant all on database raw to role loader;
grant create schema on database analytics to role transformer;

```

# 4. Wait...
If you've just set up your database from scratch, you'll have to wait a while here for data to start flowing before you can grant privileges for members of your `transformer` group to read it.

# 5. Grant `read-schema` privileges on raw data to `transformer`
Once your raw data is in your warehouse, you'll need to give privileges for your `loader` group to read it!

There are three parts to granting the privilege to read all relations within a schema:
* Granting usage on a schema
* Granting select privileges on all existing relations within a schema
* Granting select privileges on all relations created in this schema in the future (default privileges on Postgres and Redshift, or future privileges in Snowflake), so that you don't need to rerun grant statements for every new object.

On Redshift, this looks like:
```
-- Redshift
-- for each schema:
grant usage on schema raw_stripe to group transformer;
grant select on all tables in schema raw_stripe to group transformer;
-- note that the `for user` clause should be adjusted based on the user who will be creating
-- objects in the schema (which should also be the schema owner).
alter default privileges for user stitch in schema raw_stripe
  grant select on tables to group transformer;
```
And on Snowflake, we can grant on the whole database
```
-- Snowflake
grant usage on database raw to role transformer;
grant usage on all schemas in database raw to role transformer;
grant usage on future schemas in database raw to role transformer;
grant select on all tables in database raw to role transformer;
grant select on future tables in database stripe to role transformer;

```

# 6. Grant `read-schema` privileges on transformed data to `reporter`

The `reporter` role should be able to read anything that dbt creates.

In Redshift, we implement these via an [on-run-end hook](https://docs.getdbt.com/docs/using-hooks) – check out [this](https://discourse.getdbt.com/t/the-exact-grant-statements-we-use-in-a-dbt-project/430) article about the exact hooks we run!

For Snowflake we can just do a database-wide grant on all views, table and future views/table in the `analytics` database. Since `transformer` is creating all the relations within the `analytics` database, that role will have all privileges on these relation automatically.
```
-- Snowflake
grant usage on database analytics to reporter;
grant usage on all schemas in database analytics to role reporter;
grant usage on future schemas in database analytics to role reporter;
grant select on all views in database analytics to role reporter;
grant select on all table in database analytics to role reporter;
grant select on future views in database analytics to role reporter;
grant select on future tables in database analytics to role reporter;
```

# 7. Maintain!
When new users are added, make sure you add them to the right shared role! And as new schemas of raw data are added, ensure that privileges are granted to the `transformer` role to be able to read them.
