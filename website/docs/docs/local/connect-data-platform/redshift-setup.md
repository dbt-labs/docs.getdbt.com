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
import RedshiftDatasharing from '/snippets/_redshift-datasharing.md';

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
| `datasharing` <Lifecycle status="beta" /> | true | Optional, default `False`. Enables cross-database and cross-cluster access for [Redshift Datasharing](https://docs.aws.amazon.com/redshift/latest/dg/datashare-overview.html). Available in `dbt-redshift` v1.11.0rc1 and later. |
| `autocommit`  | true | Optional, default `True`. Enables autocommit after each statement |
| `retries`  | 1 | Number of retries (on each statement) |
| `retry_all`  | true | Allows dbt to retry all statements in a query|
| `tcp_keepalive`  | true | Allows dbt to prevent idle connections from being dropped by intermediate firewalls or load-balancers |
| `tcp_keepalive_idle`  | 200 | Number of seconds of inactivity before the first keep-alive probe is sent |
| `tcp_keepalive_interval`  | 200 | Number of seconds of inactivity before the next probe is sent |
| `tcp_keepalive_count`  | 5 | Number of times probes will be sent |
| `drop_without_cascade`  | false | Optional, default `False`. Omits `CASCADE` from `DROP TABLE/VIEW/MATERIALIZED VIEW` statements. Available in `dbt-redshift` v1.11.0rc3 and later. |

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

<RedshiftDatasharing />

### Deprecated `profile` parameters in 1.5

- `iam_duration_seconds`

- `keepalives_idle`

### `drop_without_cascade`

Set `drop_without_cascade: true` to omit `CASCADE` from `DROP TABLE`, `DROP VIEW`, and `DROP MATERIALIZED VIEW` statements. Use this when your project has no downstream dependents (for example, it uses only unbound views) and you want to avoid the overhead of resolving the `CASCADE` dependency graph on every drop for large clusters.

:::info
This option is intended for projects with no downstream dependents. If a dependent object exists and `CASCADE` is omitted, Redshift raises an error.
:::

### `sort` and `dist` keys

Where possible, dbt enables the use of `sort` and `dist` keys. See the section on [Redshift specific configurations](/reference/resource-configs/redshift-configs).

#### retries

If `dbt-redshift` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. If set to 2+ retries, dbt will wait 1 second before retrying. The default value is 1 retry. If set to 0, dbt will not retry at all.

</VersionBlock>
