---
title: "Redshift setup"
sidebar_label: "Redshift"
description: "Read this guide to learn about the Redshift warehouse setup in dbt."
id: "redshift-setup"
meta:
  maintained_by: dbt Labs
  authors: 'dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
  pypi_package: 'dbt-redshift'
  min_core_version: 'v0.10.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-redshift'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Redshift'
  config_page: '/reference/resource-configs/redshift-configs'
---

<VersionBlock firstVersion="2.0">

# Connect Redshift to Fusion <Lifecycle status='preview' />

You can configure the Redshift adapter by running `dbt init` in your CLI or manually providing the `profiles.yml` file with the fields configured for your authentication type.

The Redshift adapter for Fusion supports the following [authentication methods](#supported-authentication-types):
- Password
- IAM profile

## Warehouse permissions

import FusionRedshiftWarehousePerms from '/snippets/_fusion-warehouse-permissions-redshift.md';

<FusionRedshiftWarehousePerms />

For example SQL grants in Redshift, refer to [Redshift permissions](/reference/database-permissions/redshift-permissions).

## Configure Fusion

Executing `dbt init` in your CLI will prompt for the following fields:
- **Host:** The hostname of your Redshift cluster
- **User:** Username of the account that will be connecting to the database
- **Database:** The database name
- **Schema:** The schema name
- **Port (default: 5439):** Port for your Redshift environment

Alternatively, you can manually create the `profiles.yml` file and configure the fields. See examples in [authentication](#supported-authentication-types) section for formatting. If there is an existing `profiles.yml` file, you are given the option to retain the existing fields or overwrite them. 

Next, select your authentication method. Follow the on-screen prompts to provide the required information.

## Supported authentication types

<Tabs>
<TabItem value="Password">

Use your Redshift user's password to authenticate. You can also manually enter it in plain text into the `profiles.yml` file configuration.

#### Example password configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: true
      method: database
      host: ABC123.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      password: ABC123
      threads: 16
```

</File>
</TabItem>

<TabItem value="IAM profile">

Specify the IAM profile to use to connect your Fusion sessions. You will need to provide the following information:
- **IAM Profile:** The profile name
- **Cluster ID:** The unique identifier for your AWS cluster
- **Region:** Your AWS region (for example, us-east-1)
- **Use RA3 node type (y/n):** Use high performance AWS RA3 node

#### Example IAM profile configuration

<File name="profiles.yml">

```yml
default:
  target: dev
  outputs:
    dev:
      type: redshift
      port: 5439
      database: JAFFLE_SHOP
      schema: JAFFLE_TEST
      ra3_node: false
      method: iam
      host: YOURHOSTNAME.COM
      user: JANE.SMITH@YOURCOMPANY.COM
      iam_profile: YOUR_PROFILE_NAME
      cluster_id: ABC123
      region: us-east-1
      threads: 16
```

</File>
</TabItem>
</Tabs>

## More information

Find Redshift-specific configuration information in the [Redshift adapter reference guide](/reference/resource-configs/redshift-configs).

</VersionBlock>

<VersionBlock lastVersion="1.99">

# Connect Redshift to dbt Core

<ProductCard text="Fusion compatible" url="/docs/local/connect-data-platform/redshift-setup?version=2" /> connection also available.

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Configurations

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `type` | redshift | The type of data warehouse you are connecting to|
| `host` | `hostname.region.redshift.amazonaws.com` or `workgroup.account.region.redshift-serverless.amazonaws.com` | Host of cluster|
| `port`  | 5439 | Port for your Redshift environment|
| `dbname`  | my_db | Database name|
| `schema`  | my_schema | Schema name|
| `connect_timeout`  | 30 | Number of seconds before the connection times out. Default is `None` |
| `sslmode`  | prefer | optional, set the sslmode to connect to the database. Defaults to `prefer`, which will use 'verify-ca' to connect. For more information on `sslmode`, see Redshift note below |
| `role`  | None | Optional, user identifier of the current session |
| `autocreate`  | false | Optional, default `False`. Creates user if they do not exist |
| `db_groups`  | ['ANALYSTS'] | Optional. A list of existing database group names that the DbUser joins for the current session |
| `ra3_node`  | true | Optional, default `False`. Enables cross-database sources. Kept for backward compatibility; use `datasharing` for new projects instead. |
| `datasharing` <Lifecycle status="beta" /> | true | Optional, default `False`. Enables cross-database and cross-cluster access for [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). Available in `dbt-redshift v1.11.0rc1` and later. |
| `autocommit`  | true | Optional, default `True`. Enables autocommit after each statement |
| `retries`  | 1 | Number of retries (on each statement) |
| `retry_all`  | true | Allows dbt to retry all statements in a query|
| `tcp_keepalive`  | true | Allows dbt to prevent idle connections from being dropped by intermediate firewalls or load-balancers |
| `tcp_keepalive_idle`  | 200 | Number of seconds of inactivity before the first keep-alive probe is sent |
| `tcp_keepalive_interval`  | 200 | Number of seconds of inactivity before the next probe is sent |
| `tcp_keepalive_count`  | 5 | Number of times probes will be sent |

For your tcp_keepalive inputs, we recommend taking a look at the [Redshift documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/troubleshooting-connections.html) for more information on the right configuration for you. 


## Authentication Parameters


The authentication methods that <Constant name="core" /> supports on Redshift are: 

- `Database` &mdash; Password-based authentication (default, will be used if `method` is not provided)
- `IAM User` &mdash; IAM User authentication via AWS Profile

Click on one of these authentication methods for further details on how to configure your connection profile. Each tab also includes an example `profiles.yml` configuration file for you to review.

<Tabs
  defaultValue="database"
  values={[
    {label: 'Database', value: 'database'},
    {label: 'IAM User via AWS Profile (Core)', value: 'iam-user-profile'}]
}>

<TabItem value="database">

The following table contains the parameters for the database (password-based) connection method.

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` | database| Leave this parameter unconfigured, or set this to database |
| `user`   | username | Account username to log into your cluster |
| `password`  | password1 | Password for authentication  |

<br/>

#### Example profiles.yml for database authentication

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: hostname.region.redshift.amazonaws.com
      user: username
      password: password1
      dbname: analytics
      schema: analytics
      port: 5439

      # Optional Redshift configs:
      sslmode: prefer
      role: None
      ra3_node: true
      datasharing: true
      autocommit: true
      threads: 4
      connect_timeout: None

```

</File>

</TabItem>

<TabItem value="iam-user-profile">

The following table lists the authentication parameters to use IAM authentication.
  
To set up a Redshift profile using IAM Authentication, set the `method` parameter to `iam` as shown below. Note that a password is not required when using IAM Authentication. For more information on this type of authentication, consult the [Redshift Documentation](https://docs.aws.amazon.com/redshift/latest/mgmt/generating-user-credentials.html) and [boto3 docs](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/redshift.html#Redshift.Client.get_cluster_credentials) on generating user credentials with IAM Auth.

If you receive the "You must specify a region" error when using IAM Authentication, then your aws credentials are likely misconfigured. Try running `aws configure` to set up AWS access keys, and pick a default region. If you have any questions, please refer to the official AWS documentation on [Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` |IAM| use IAM to authenticate via IAM User authentication |
| `iam_profile` | analyst | dbt will use the specified profile from your ~/.aws/config file |
| `cluster_id` | cluster_id| Required for IAM authentication only for provisoned cluster, not for Serverless |
| `user`   | username | User querying the database, ignored for Serverless (but field still required) |
| `region`  | us-east-1 | Region of your Redshift instance | 


<br/>

#### Example profiles.yml for IAM

<File name='~/.dbt/profiles.yml'>

```yaml
  my-redshift-db:
  target: dev
  outputs:
    dev:
      type: redshift
      method: iam
      cluster_id: CLUSTER_ID
      host: hostname.region.redshift.amazonaws.com
      user: alice
      iam_profile: analyst
      region: us-east-1
      dbname: analytics
      schema: analytics
      port: 5439

      # Optional Redshift configs:
      threads: 4
      connect_timeout: None 
      [retries](#retries): 1 
      role: None
      sslmode: prefer
      ra3_node: true
      datasharing: true
      autocommit: true
      autocreate: true
      db_groups: ['ANALYSTS']

```

</File>

#### Specifying an IAM Profile

When the `iam_profile` configuration is set, dbt will use the specified profile from your `~/.aws/config` file instead of using the profile name `default`

</TabItem>


</Tabs>

## Redshift notes

### `sslmode` change

Before dbt-redshift 1.5, `psycopg2` was used as the driver. `psycopg2` accepts `disable`, `prefer`, `allow`, `require`, `verify-ca`, `verify-full` as valid inputs of `sslmode`, and does not have an `ssl` parameter, as indicated in PostgreSQL [doc](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING:~:text=%2Dencrypted%20connection.-,sslmode,-This%20option%20determines).

In dbt-redshift 1.5, we switched to using `redshift_connector`, which accepts `verify-ca`, and `verify-full` as valid `sslmode` inputs, and has a `ssl` parameter of `True` or `False`, according to redshift [doc](https://docs.aws.amazon.com/redshift/latest/mgmt/python-configuration-options.html#:~:text=parameter%20is%20optional.-,sslmode,-Default%20value%20%E2%80%93%20verify).

For backward compatibility, dbt-redshift now supports valid inputs for `sslmode` in `psycopg2`. We've added conversion logic mapping each of `psycopg2`'s accepted `sslmode` values to the corresponding `ssl` and `sslmode` parameters in `redshift_connector`.

The table below details accepted `sslmode` parameters and how the connection will be made according to each option:

`sslmode` parameter | Expected behavior in dbt-redshift | Actions behind the scenes
-- | -- | --
disable | Connection will be made without using ssl | Set `ssl` = False
allow | Connection will be made using verify-ca | Set `ssl` = True &  `sslmode` = verify-ca
prefer | Connection will be made using verify-ca | Set `ssl` = True &  `sslmode` = verify-ca
require | Connection will be made using verify-ca | Set `ssl` = True &  `sslmode` = verify-ca
verify-ca | Connection will be made using verify-ca | Set `ssl` = True &  `sslmode` = verify-ca
verify-full | Connection will be made using verify-full | Set `ssl` = True &  `sslmode` = verify-full

When a connection is made using `verify-ca`, will look for the CA certificate in `~/redshift-ca-bundle.crt`.

For more details on sslmode changes, our design choices, and reasoning &mdash; please refer to the [PR pertaining to this change](https://github.com/dbt-labs/dbt-redshift/pull/439).

### `autocommit` parameter

The [autocommit mode](https://www.psycopg.org/docs/connection.html#connection.autocommit) is useful to execute commands that run outside a transaction. Connection objects used in Python must have `autocommit = True` to run operations such as `CREATE DATABASE`, and `VACUUM`. `autocommit` is off by default in `redshift_connector`, but we've changed this default to `True` to ensure certain macros run successfully in your dbt project.

If desired, you can define a separate target with `autocommit=True` as such:

<File name='~/.dbt/profiles.yml'>

```yaml
profile-to-my-RS-target:
  target: dev
  outputs:
    dev:
      type: redshift
      ...
      autocommit: False
      
  
  profile-to-my-RS-target-with-autocommit-enabled:
  target: dev
  outputs:
    dev:
      type: redshift
      ...
      autocommit: True
  ```

</File>

To run certain macros with autocommit, load the profile with autocommit using the `--profile` flag. For more context, please refer to this [PR](https://github.com/dbt-labs/dbt-redshift/pull/475/files).

### `datasharing` <Lifecycle status="beta" />

Previously, the Redshift adapter used PostgreSQL-compatible catalog tables (for example, `pg_*`, `information_schema`) for metadata operations such as listing relations, schemas, and columns. These tables only surface objects within the currently connected database, which prevents cross-database operations needed for [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html).

Starting `dbt-redshift v1.11.0rc1`, you can set `datasharing: true` in your `profiles.yml` to enable cross-database and cross-cluster access. When enabled, `dbt-redshift` switches metadata queries to Redshift's native `SHOW` system commands. You can then materialize models into a database or cluster other than the one specified in your profile using `{{ config(database='other_db') }}`.

Example configuration:

<File name='profiles.yml'>

```yml
company-name:
  target: dev
  outputs:
    dev:
      type: redshift
      host: hostname.region.redshift.amazonaws.com
      ...
      datasharing: true  # default: false
```

</File>

Once enabled, you can materialize a model into a different database by setting `database` in the model config. For example:

```sql
{{ config(database='other_db') }}

select * from {{ ref('my_model') }}
```

The following macros switch to `SHOW` commands when `datasharing: true`:

| Macro | Without `datasharing` | With `datasharing` |
|-------|-----------------------|-------------------|
| `list_relations_without_caching` | `information_schema.tables` | `SHOW TABLES FROM SCHEMA` |
| `list_schemas`, `check_schema_exists` | `pg_namespace` | `SHOW SCHEMAS FROM DATABASE` |
| `get_columns_in_relation` | `information_schema.columns` | `SHOW COLUMNS FROM TABLE` |
| Catalog queries | `pg_class`, `pg_tables`, `pg_views` | `SHOW TABLES FROM SCHEMA` + `SVV_REDSHIFT_COLUMNS` |
| `get_relation_last_modified` | `information_schema.tables` | `SHOW TABLES FROM SCHEMA` |
| Grants | `pg_user`, `has_table_privilege()` | `SHOW GRANTS ON TABLE` |
<br /><br />
`ra3_node: true` also enables this behavior and is supported for backward compatibility. For new projects, use `datasharing: true` instead.

Take note of the following limitations when using `datasharing`:

- Creating views (including materialized views) in another database is not supported.
- Cross-database grants on objects are not supported.
- Source freshness checks can have a lag of up to 5 minutes.
- Metadata queries are limited to 10,000 rows. If a database has more than 10,000 schemas, or a schema has more than 10,000 tables, dbt runs can result in unexpected scenarios.
- Cross-database writes require the `SNAPSHOT` transaction isolation level.
- For views that reference tables in another database, define them as [late-binding views](/reference/resource-configs/redshift-configs#late-binding-views).

### Deprecated `profile` parameters in 1.5

- `iam_duration_seconds`

- `keepalives_idle`

### `sort` and `dist` keys

Where possible, dbt enables the use of `sort` and `dist` keys. See the section on [Redshift specific configurations](/reference/resource-configs/redshift-configs).

#### retries

If `dbt-redshift` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. If set to 2+ retries, dbt will wait 1 second before retrying. The default value is 1 retry. If set to 0, dbt will not retry at all.

</VersionBlock>
