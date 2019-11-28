---
title: "Snowflake"
description: "Profile configuration instructions for Snowflake"
---
# Set up a Snowflake target

## User / Password authentication

Snowflake can be configured using basic user/password authentication as shown below.
[block:code]
{
  "codes": [
    {
      "code": "my-snowflake-db:\n  target: dev\n  outputs:\n    dev:\n      type: snowflake\n      account: [account id]\n      \n      # User/password auth\n      user: [username]\n      password: [password]\n      \n      role: [user role]\n      database: [database name]\n      warehouse: [warehouse name]\n      schema: [dbt schema]\n      threads: [1 or more]\n      client_session_keep_alive: False\n",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## Key Pair Authentication

To use key pair authentication, omit a `password` and instead provide both `private_key_path` and `private_key_passphrase` in your target.
[block:code]
{
  "codes": [
    {
      "code": "my-snowflake-db:\n  target: dev\n  outputs:\n    dev:\n      type: snowflake\n      account: [account id]\n      user: [username]\n      role: [user role]\n      \n      # Keypair config\n      private_key_path: [path/to/private.key]\n      private_key_passphrase: [passphrase for the private key]\n      \n      database: [database name]\n      warehouse: [warehouse name]\n      schema: [dbt schema]\n      threads: [1 or more]\n      client_session_keep_alive: False",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]
## SSO Authentication

To use SSO authentication for Snowflake, omit a `password` and instead supply an `authenticator` config to your target. `authenticator` can be one of 'externalbrowser' or a valid Okta URL.

**Note**: By default, every connection that dbt opens will require you to re-authenticate in a browser. Contact your Snowflake support rep and inquire about turning on the "id token cache" for your account as described [here](https://github.com/snowflakedb/snowflake-connector-python/issues/140#issuecomment-447028785).
[block:code]
{
  "codes": [
    {
      "code": "my-snowflake-db:\n  target: dev\n  outputs:\n    dev:\n      type: snowflake\n      account: [account id]\n      user: [username]\n      role: [user role]\n      \n      # SSO config\n      authenticator: externalbrowser\n      \n      database: [database name]\n      warehouse: [warehouse name]\n      schema: [dbt schema]\n      threads: [between 1 and 8]\n      client_session_keep_alive: False",
      "language": "yaml",
      "name": "~/.dbt/profiles.yml"
    }
  ]
}
[/block]

# Configurations

The "base" configs for Snowflake targets are shown below. Note that you should also specify auth-related configs specific to the authentication method you are using as described above.

## All configurations
[block:parameters]
{
  "data": {
    "h-0": "Config",
    "h-1": "Required?",
    "h-2": "Description",
    "0-0": "account",
    "0-1": "Yes",
    "0-2": "The account to connect to. This will be something like `abc123` or `abc123.us-east-1` for your particular account",
    "1-0": "user",
    "1-1": "Yes",
    "1-2": "The user to log in as",
    "5-0": "role",
    "5-1": "No (but recommended)",
    "5-2": "The role to assume when running queries as the specified user.",
    "6-0": "client_session_keep_alive",
    "6-1": "No",
    "6-2": "If provided, issue a periodic `select` statement to keep the connection open when particularly long-running queries are executing (> 4 hours). Default: False\n\nSee note below.",
    "2-0": "database",
    "2-1": "Yes",
    "2-2": "The database that dbt should create models in",
    "3-0": "warehouse",
    "3-1": "Yes",
    "3-2": "The warehouse to use when building models",
    "4-0": "schema",
    "4-1": "Yes",
    "4-2": "The schema to build models into by default. Can be overridden with [custom schemas](doc:using-custom-schemas)",
    "7-0": "threads",
    "7-1": "No",
    "7-2": "The number of concurrent models dbt should build. Set this to a higher number if using a bigger warehouse. Default=1"
  },
  "cols": 3,
  "rows": 8
}
[/block]
## client_session_keep_alive

The `client_session_keep_alive` feature is intended to keep Snowflake sessions alive beyond the typical 4 hour timeout limit. The snowflake-connector-python implementation of this feature can prevent processes that use it (read: dbt) from exiting in specific scenarios. If you encounter this in your deployment of dbt, please let us know in [the GitHub issue](https://github.com/fishtown-analytics/dbt/issues/1271), and work around it by disabling the keepalive.
