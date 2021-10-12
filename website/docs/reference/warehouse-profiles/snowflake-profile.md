---
title: "Snowflake Profile"
---

## Overview of dbt-snowflake
**Maintained by:** core dbt maintainers        
**Author:** dbt Labs        
**Source:** [Github](https://github.com/dbt-labs/dbt-snowflake)       
**Core version:** v0.13.0 and newer    
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

```

</File>

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
| client_session_keep_alive | No | If provided, issue a periodic `select` statement to keep the connection open when particularly long-running queries are executing (&gt; 4 hours). Default: False (see note below) |
| threads | No | The number of concurrent models dbt should build. Set this to a higher number if using a bigger warehouse. Default=1 |
| query_tag | No | A value with which to tag all queries, for later searching in [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html) |

### account
For AWS accounts in the default US West region, this will be something like `abc123` (without any other segments). For AWS accounts *not* in the default US West region you have to append the region (for example: `abc123.eu-west-1`). For GCP and Azure-based accounts, you also have to append the cloud platform, such as `gcp` or `azure`, respectively (for example: `abc123.us-central1.gcp`) See [Snowflake's documentation](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname) for more information.

### client_session_keep_alive

The `client_session_keep_alive` feature is intended to keep Snowflake sessions alive beyond the typical 4 hour timeout limit. The snowflake-connector-python implementation of this feature can prevent processes that use it (read: dbt) from exiting in specific scenarios. If you encounter this in your deployment of dbt, please let us know in [the GitHub issue](https://github.com/dbt-labs/dbt/issues/1271), and work around it by disabling the keepalive.


### query_tag

<Changelog>New in v0.18.0</Changelog>

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).
