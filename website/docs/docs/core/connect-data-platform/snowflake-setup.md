---
title: "Snowflake setup"
description: "Read this guide to learn about the Snowflake warehouse setup in dbt."
id: "snowflake-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-adapters'
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

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta}/>


## Authentication Methods

### User / Password authentication

Snowflake can be configured using basic user/password authentication as shown below.

<VersionBlock firstVersion="1.9">

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
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
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
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</VersionBlock>

Along with adding the `authenticator` parameter, be sure to run `alter account set allow_client_mfa_caching = true;` in your Snowflake warehouse. Together, these will allow you to easily verify authentication with the DUO Mobile app (skipping this results in push notifications for every model built on every `dbt run`).

### Key pair authentication

To use key pair authentication, specify the `private_key_path` in your configuration, avoiding the use of a `password`. If needed, you can add a `private_key_passphrase`. **Note**: Unencrypted private keys are accepted, so add a passphrase only if necessary. However, for dbt Core versions 1.5 and 1.6, configurations using a private key in PEM format (for example, keys enclosed with BEGIN and END tags) are not supported. In these versions, you must use the `private_key_path` to reference the location of your private key file.

dbt can specify a `private_key` directly as a string instead of a `private_key_path`. This `private_key` string can be in either Base64-encoded DER format, representing the key bytes, or in plain-text PEM format. Refer to [Snowflake documentation](https://docs.snowflake.com/en/user-guide/key-pair-auth) for more info on how they generate the key.

<VersionBlock firstVersion="1.9">

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
      # For dbt Fusion engine, make sure to read requirements about using PKCS#8 format with AES-256 encryption in the following section.
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
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

#### dbt Fusion engine key formats

Fusion requires modern key formats and doesn't support legacy 3DES encryption or headerless keys.  We recommend using PKCS#8 format with AES-256 encryption for key pair authentication with Fusion. Using older key formats may cause authentication failures.

If you encounter the `Key is PKCS#1 (RSA private key). Snowflake requires PKCS#8` error, then your private key is in the wrong format. You have two options:

- (Recommended fix) Re-export your key with modern encryption:

  ```bash
  # Convert to PKCS#8 with AES-256 encryption
  openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes-256-cbc -inform PEM -out rsa_key.p8

  ```

- (Temporary workaround) Add the `BEGIN` header and `END` footer to your PEM body:

  ```bash
  -----BEGIN ENCRYPTED PRIVATE KEY-----
  < your existing encrypted private key contents >
  -----END ENCRYPTED PRIVATE KEY-----
  ```


### SSO authentication

To use SSO authentication for Snowflake, omit a `password` and instead supply an `authenticator` config set to 'externalbrowser' to your target. 

Refer to the following example:

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
      retry_on_database_errors: True # default: true
      retry_all: False  # default: false
      reuse_connections: True # default: True if client_session_keep_alive is False, otherwise None
```

</File>

</VersionBlock>

**Note**: By default, every connection that dbt opens will require you to re-authenticate in a browser. The Snowflake connector package supports caching your session token, but it [currently only supports Windows and Mac OS](https://docs.snowflake.com/en/user-guide/admin-security-fed-auth-use.html#optional-using-connection-caching-to-minimize-the-number-of-prompts-for-authentication).

Refer to the [Snowflake docs](https://docs.snowflake.com/en/sql-reference/parameters.html#label-allow-id-token) for info on how to enable this feature in your account.

### OAuth authorization

To learn how to configure OAuth in Snowflake, refer to their [documentation](https://docs.snowflake.com/en/user-guide/oauth-snowflake-overview). Your Snowflake admin needs to generate an [OAuth token](https://community.snowflake.com/s/article/HOW-TO-OAUTH-TOKEN-GENERATION-USING-SNOWFLAKE-CUSTOM-OAUTH) for your configuration to work.

Provide the OAUTH_REDIRECT_URI in Snowflake:`http://localhost:PORT_NUMBER`. For example, `http://localhost:8080`.

Once your Snowflake admin has configured OAuth, add the following to your `profiles.yml` file:

```yaml

my-snowflake-db:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: [account id]
      
      # The following fields are retrieved from the Snowflake configuration
      authenticator: oauth
      oauth_client_id: [OAuth client id]
      oauth_client_secret: [OAuth client secret]
      token: [OAuth refresh token]
```

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
| platform_detection_timeout_seconds | No | Timeout (in seconds) for platform detection. Defaults to `0.0`. Set to a positive value if using Workload Identity Federation (WIF) authentication.|

### account
For AWS accounts in the US West default region, you can use `abc123` (without any other segments). For some AWS accounts you will have to append the region and/or cloud platform. For example, `abc123.eu-west-1` or `abc123.eu-west-2.aws`. 

For GCP and Azure-based accounts, you have to append the region and cloud platform, such as `gcp` or `azure`, respectively. For example, `abc123.us-central1.gcp`. For details, see Snowflake's documentation: "[Specifying Region Information in Your Account Hostname](https://docs.snowflake.com/en/user-guide/intro-regions.html#specifying-region-information-in-your-account-hostname)". 

Please also note that the Snowflake account name should only be the `account_name` without the prefixed `organization_name`.  To determine if the region and/or cloud platform needs to be appended to the account locator in the legacy format, see Snowflake's documentation on "[Non-VPS account locator formats by cloud platform and region](https://docs.snowflake.com/en/user-guide/admin-account-identifier#non-vps-account-locator-formats-by-cloud-platform-and-region)".

### client_session_keep_alive

The `client_session_keep_alive` feature is intended to keep Snowflake sessions alive beyond the typical 4 hour timeout limit. The snowflake-connector-python implementation of this feature can prevent processes that use it (read: dbt) from exiting in specific scenarios. If you encounter this in your deployment of dbt, please let us know in [the GitHub issue](https://github.com/dbt-labs/dbt-core/issues/1271), and work around it by disabling the keepalive.

### platform_detection_timeout_seconds

The Snowflake connector uses the `platform_detection_timeout_seconds` parameter to determine how long it waits to detect the cloud platform for a connection. This parameter is available starting in <Constant name="core"/> v1.10.


- Set to `0.0` (default) to disable cloud platform detection for faster connections.
- Set to a positive value only if you're using WIF authentication, which requires the connector to detect the cloud environment.

### query_tag

[Query tags](https://docs.snowflake.com/en/sql-reference/parameters.html#query-tag) are a Snowflake
parameter that can be quite useful later on when searching in the [QUERY_HISTORY view](https://docs.snowflake.com/en/sql-reference/account-usage/query_history.html).

### reuse_connections

During node execution (such as model and test), dbt opens connections against a Snowflake warehouse. Setting this configuration to `True` reduces execution time by verifying credentials only once for each thread.

### retry_on_database_errors

The `retry_on_database_errors` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters errors of type snowflake.connector.errors.DatabaseError. These retries can be helpful for handling errors of type "JWT token is invalid" when using key pair authentication.

By default, `retry_on_database_errors` is set to `False` when using <Constant name="core" /> (for example, if you're running dbt locally with `pip install dbt-core dbt-snowflake`).

However, in the <Constant name="dbt_platform" />, this setting is automatically set to `True`, unless the user explicitly configures it. 

### retry_all

The `retry_all` flag along with the `connect_retries` count specification is intended to make retries configurable after the snowflake connector encounters any error.

