---
title: "[WIP] Connecting to Redshift"
id: "redshift-v2"
---

We recommend that each human being that uses dbt has a separate set
of credentials, and that your production deployment also uses a separate set of
credentials.

In this guide, we'll create credentials for one user, and for our production deployment of dbt (this user will be named `dbt_cloud`). We will be 

# Pre-requisites
* An already operating Amazon Redshift cluster.
* Raw data loaded into your Redshift cluster
* A set of superuser privileges (including database connection details)
* Privileges in AWS that allow you allow web traffic from an IP address

# Step 1: Create and configure database users

:::info 

You can skip this section if you already have a set of user credentials that can:
* `select` from raw data
* `create` schemas (or the ability to `create` within an existing schema)
* read system views to generate documentation (i.e. views in `information_schema` and `pg_catalog`)

:::

1. Connect to your Amazon Redshift cluster using a SQL client.
2. Create a user (`dbt_cloud` in this guide) for deployment. If you don't yet have your own user credentials to use when developing, create a new user for yourself now. You can also create users for any colleagues that will be developing with dbt.
```sql
-- create a new user for deployment
create user dbt_cloud
  with password 'Mgenerate-this>';

-- create a new user for development
create user <your_name> -- e.g. alice
    with password '<generate-this>';
```
2. Create a group to allow us to grant privileges to all users using dbt, rather than one at a time:
```sql
create group transformer
```
3. Add both your deployment and development user(s) to the `transformer` group.
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

# Step 2: 
## dbt Cloud


## dbt CLI
* Execute `open ~/.dbt` from the command line
* Copy the following into your `profiles.yml` file, updating as needed.

:::info 

something about default profiles path?

:::

 
### Password-based authentication
This is the most common way to connect to Redshift


<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: [hostname]
      user: [username]
      pass: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # default 0, indicating the system default
      search_path: [optional, override the default Redshift search_path]
```

</File>

### IAM Authentication

To set up a Redshift profile using IAM Authentication, set the `method` parameter to `iam` as shown below. Note that a password is not required when using IAM Authentication. For more information on this type of authentication, consult the [Redshift Documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) on generating user credentials with IAM Auth.

If you receive the "You must specify a region" error when using IAM Authentication, then your aws credentials are likely misconfigured. Try running `aws configure` to set up AWS access keys, and pick a default region.

<File name='~/.dbt/profiles.yml'>

```yaml
my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: [cluster_id]
      host: [hostname]
      user: [username]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      keepalives_idle: 0 # default 0, indicating the system default
      search_path: [optional, override the default Redshift search_path]

```

</File>
