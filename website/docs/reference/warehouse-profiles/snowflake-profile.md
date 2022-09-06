---
title: "Snowflake Profile"
---

## Overview of dbt-snowflake
**Maintained by:** core dbt maintainers        
**Author:** dbt Labs        
**Source:** [Github](https://github.com/dbt-labs/dbt-snowflake)       
**dbt Cloud:** Supported        
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/CJN7XRF1B)      


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
```

Along with adding the `authenticator` parameter, be sure to run `alter account set allow_client_mfa_caching = true;` in your Snowflake warehouse. Together, these will allow you to easily verify authenatication with the DUO Mobile app (skipping this results in push notifications for every model built on every `dbt run`).

### Key Pair Authentication

To use key pair authentication, omit a `password` and instead provide a `private_key_path` and, optionally, a `private_key_passphrase` in your target. **Note:** Versions of dbt before 0.16.0 required that private keys were encrypted and a `private_key_passphrase` was provided. This behavior was changed in dbt v0.16.0.

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
```

</File>

### SSO Authentication

To use SSO authentication for Snowflake, omit a `password` and instead supply an `authenticator` config to your target. `authenticator` can be one of 'externalbrowser' or a valid Okta URL.

<Changelog>New in v0.18.0</Changelog>

**Note**: By default, every connection that dbt opens will require you to re-authenticate in a browser. The Snowflake connector package supports caching your session token, but it [currently only supports Windows and Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication). See [the Snowflake docs](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) for how to enable this feature in your account.

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

      # SSO config
      authenticator: externalbrowser

      database: [database name]
      warehouse: [warehouse name]
      schema: [dbt schema]
      threads: [between 1 and 8]
      client_session_keep_alive: False
      query_tag: [anything]

      # optional
      connect_retries: 0 # default 0
      connect_timeout: 10 # default: 10
      retry_on_database_errors: False # default: false 
      retry_all: False  # default: false 
```

</File>


## Configurations

The "base" configs for Snowflake targets are shown below. Note that you should also specify auth-related configs specific to the authentication method you are using as described above.

### All configurations

| Config | Required? | Description |
| ------ | --------- | ----------- |
| account | Yes | The account to connect to as per [Snowflake's documentation](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname). See notes [below](#account) |
| user | Yes | The user to log in as |
| database | Yes | The database that dbt should create models in |
| warehouse | Yes | The warehouse to use when building models |
| schema | Yes | The schema to build models into by default. Can be overridden with [custom schemas](using-custom-schemas) |
| role | No (but recommended) | The role to assume when running queries as the specified user. |
| client_session_keep_alive | No | If `True`, the snowflake client will keep connections for longer than the default 4 hours. This is helpful when particularly long-running queries are executing (&gt; 4 hours). Default: False (see [note below](#client_session_keep_alive)) |
| threads | No | The number of concurrent models dbt should build. Set this to a higher number if using a bigger warehouse. Default=1 |
| query_tag | No | A value with which to tag all queries, for later searching in [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |
| retry_all | No | A boolean flag indicating whether to retry on all [Snowflake connector errors](https://github.com/snowflakedb/snowflake-connector-python/blob/main/src/snowflake/connector/errors.py) |
| retry_on_database_errors | No | A boolean flag indicating whether to retry after encountering errors of type [snowflake.connector.errors.DatabaseError](https://github.com/snowflakedb/snowflake-connector-python/blob/ffdd6b3339aa71885878d047141fe9a77c4a4ae3/src/snowflake/connector/errors.py#L361-L364) |
| connect_retries | No | The number of times to retry after an unsuccessful connection |
| connect_timeout | No | The number of seconds to sleep between failed connection retries |

### account
For AWS accounts in the US West default region, you can use `abc123` (without any other segments). For some AWS accounts you will have to append the region and/or cloud platform. For example, `abc123.eu-west-1.aws`. For GCP and Azure-based accounts, you have to append the region and cloud platform, such as `gcp` or `azure`, respectively. For example, `abc123.us-central1.gcp`. For details, see Snowflake's documention: "[Specifying Region Information in Your Account Hostname](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)" and "[Account Identifier Formats by Cloud Platform and Region](https://docs.snowflake.com/en/user-guide/admin-account-identifier.html#account-identifier-formats-by-cloud-platform-and-region)".

### client_session_keep_alive

The `client_session_keep_alive` feature is intended to keep Snowflake sessions alive beyond the typical 4 hour timeout limit. The snowflake-connector-python implementation of this feature can prevent processes that use it (read: dbt) from exiting in specific scenarios. If you encounter this in your deployment of dbt, please let us know in [the GitHub issue](https://github.com/dbt-labs/dbt-core/issues/1271), and work around it by disabling the keepalive.


### query_tag

<Changelog>New in v0.18.0</Changelog>

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).


### retry_on_database_errors

<Changelog>New in v1.0.0.</Changelog>

The `retry_on_database_errors` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters errors of type snowflake.connector.errors.DatabaseError. These retries can be helpful for handling errors of type "JWT token is invalid" when using key pair authentication.

### retry_all

<Changelog>New in v1.0.0.</Changelog>

The `retry_all` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters any error.
