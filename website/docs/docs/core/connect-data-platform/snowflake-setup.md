---
title: "Snowflake setup"
description: "Read this guide to learn about the Snowflake warehouse setup in dbt."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-snowflake'
  pypi_package: 'dbt-snowflake'
  min_core_version: 'v0.8.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-snowflake'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Snowflake'
  config_page: '/reference/resource-configs/snowflake-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a><a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>


<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>python -m pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


## Authentication Methods

### User / Password authentication

Snowflake can be configured using basic user/password authentication as shown below.

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]

      # User/password auth
      user: [username]
      password: [password]

      role: [user role]
      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False # default: false (available v1.4+)
  ```

</File>

### User / Password + DUO MFA authentication

Snowflake integrates the DUO Mobile app to add 2-Factor authentication to basic user/password as seen below.

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]

      # User/password auth
      user: [username]
      password: [password]
      authenticator: username_password_mfa

      role: [user role]
      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False # default: false (available v1.4+)
```

Along with adding the `authenticator` parameter, be sure to run `alter account set allow_client_mfa_caching = true;` in your Snowflake warehouse. Together, these will allow you to easily verify authenatication with the DUO Mobile app (skipping this results in push notifications for every model built on every `dbt run`).

### Key Pair Authentication

To use key pair authentication, omit a `password` and instead provide a `private_key_path` and, optionally, a `private_key_passphrase` in your target. **Note:** Versions of dbt before 0.16.0 required that private keys were encrypted and a `private_key_passphrase` was provided. This behavior was changed in dbt v0.16.0.

Starting from [dbt v1.5.0](/docs/dbt-versions/core), you have the option to use a `private_key` string instead of a `private_key_path`. The `private_key` string should be in either Base64-encoded DER format, representing the key bytes, or a plain-text PEM format. Refer to [Snowflake documentation](https://docs.snowflake.com/developer-guide/python-connector/python-connector-example#using-key-pair-authentication-key-pair-rotation) for more info on how they generate the key.


<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]
      user: [username]
      role: [user role]

      # Keypair config
      private_key_path: [path/to/private.key]
      # or private_key instead of private_key_path
      private_key_passphrase: [passphrase for the private key, if key is encrypted]

      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [1 or more]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False # default: false
```

</File>

### SSO Authentication

To use SSO authentication for Snowflake, omit a `password` and instead supply an `authenticator` config to your target. 
`authenticator` can be one of 'externalbrowser' or a valid Okta URL. 

Refer to the following tabs for more info and examples:

<Tabs>
<TabItem value="externalbrowser" label="externalbrowser">

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id] # Snowflake <account_name>
      user: [username] # Snowflake username
      role: [user role] # Snowflake user role

      # SSO config
      authenticator: externalbrowser

      database: [database name] # Snowflake database name
      warehouse: [warehouse name] # Snowflake warehouse name
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False # default: false
```

</File>

</TabItem>

<TabItem value="oktaurl" label="Okta URL">

<File name='~/.dbt/profiles.yml'>

```yaml
my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id] # Snowflake <account_name>
      user: [username] # Snowflake username
      role: [user role] # Snowflake user role

      # SSO config -- The three following fields are REQUIRED
      authenticator: [Okta account URL]
      username: [Okta username]
      password: [Okta password]

      database: [database name] # Snowflake database name
      warehouse: [warehouse name] # Snowflake warehouse name
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false
      retry_all: False  # default: false
      reuse_connections: False # default: false
```

</File>

</TabItem>
</Tabs>

**Note**: By default, every connection that dbt opens will require you to re-authenticate in a browser. The Snowflake connector package supports caching your session token, but it [currently only supports Windows and Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Refer to the [Snowflake docs](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) for info on how to enable this feature in your account.

## Configurations

The "base" configs for Snowflake targets are shown below. Note that you should also specify auth-related configs specific to the authentication method you are using as described above.

### All configurations

| Config | Required? | Description |
| ------ | --------- | ----------- |
| account | Yes | The account to connect to as per [Snowflake's documentation](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname). See notes [below](#account) |
| user | Yes | The user to log in as |
| database | Yes | The database that dbt should create models in |
| warehouse | Yes | The warehouse to use when building models |
| schema | Yes | The schema to build models into by default. Can be overridden with [custom schemas](/docs/build/custom-schemas) |
| role | No (but recommended) | The role to assume when running queries as the specified user. |
| client_session_keep_alive | No | If `True`, the snowflake client will keep connections for longer than the default 4 hours. This is helpful when particularly long-running queries are executing (&gt; 4 hours). Default: False (see [note below](#client_session_keep_alive)) |
| threads | No | The number of concurrent models dbt should build. Set this to a higher number if using a bigger warehouse. Default=1 |
| query_tag | No | A value with which to tag all queries, for later searching in [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |
| retry_all | No | A boolean flag indicating whether to retry on all [Snowflake connector errors](https://github.com/snowflakedb/snowflake-connector-python/blob/main/src/snowflake/connector/errors.py) |
| retry_on_database_errors | No | A boolean flag indicating whether to retry after encountering errors of type [snowflake.connector.errors.DatabaseError](https://github.com/snowflakedb/snowflake-connector-python/blob/ffdd6b3339aa71885878d047141fe9a77c4a4ae3/src/snowflake/connector/errors.py#L361-L364) |
| connect_retries | No | The number of times to retry after an unsuccessful connection |
| connect_timeout | No | The number of seconds to sleep between failed connection retries |
| reuse_connections | No | A boolean flag indicating whether to reuse idle connections to help reduce total connections opened. Default is `False`. |

### account
For AWS accounts in the US West default region, you can use `abc123` (without any other segments). For some AWS accounts you will have to append the region and/or cloud platform. For example, `abc123.eu-west-1` or `abc123.eu-west-2.aws`. For GCP and Azure-based accounts, you have to append the region and cloud platform, such as `gcp` or `azure`, respectively. For example, `abc123.us-central1.gcp`. For details, see Snowflake's documentation: "[Specifying Region Information in Your Account Hostname](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)". Please also note that the Snowflake account name should only be the <account_name> without the prefixed <organization_name>.  Relevant documentation: "[Account Identifier Formats by Cloud Platform and Region](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html#account-identifier-formats-by-cloud-platform-and-region)".

### client_session_keep_alive

The `client_session_keep_alive` feature is intended to keep Snowflake sessions alive beyond the typical 4 hour timeout limit. The snowflake-connector-python implementation of this feature can prevent processes that use it (read: dbt) from exiting in specific scenarios. If you encounter this in your deployment of dbt, please let us know in [the GitHub issue](https://github.com/dbt-labs/dbt-core/issues/1271), and work around it by disabling the keepalive.


### query_tag

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

<VersionBlock firstVersion="1.4">

### reuse_connections

During node execution (such as model and test), dbt opens connections against a Snowflake warehouse. Setting this configuration to `True` reduces execution time by verifying credentials only once for each thread.

</VersionBlock>

### retry_on_database_errors

The `retry_on_database_errors` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters errors of type snowflake.connector.errors.DatabaseError. These retries can be helpful for handling errors of type "JWT token is invalid" when using key pair authentication.

### retry_all

The `retry_all` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters any error.
