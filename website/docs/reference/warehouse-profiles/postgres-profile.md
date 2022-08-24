---
title: "Postgres Profile"
---

## Overview of dbt-postgres
**Maintained by:** core dbt maintainers        
**Author:** dbt Labs     
**dbt Cloud:** Supported       
**dbt Slack channel** [Link to channel](https://getdbt.slack.com/archives/C0172G2E273)      

## Profile Configuration

Postgres targets should be set up using the following configuration in your `profiles.yml` file.

<File name='~/.dbt/profiles.yml'>

```yaml
company-name:
  target: dev
  outputs:
    dev:
      type: postgres
      host: [hostname]
      user: [username]
      password: [password]
      port: [port]
      dbname: [database name]
      schema: [dbt schema]
      threads: [1 or more]
      [keepalives_idle](#keepalives_idle): 0 # default 0, indicating the system default. See below
      connect_timeout: 10 # default 10 seconds
      [retries](#retries): 1  # default 1 retry on error/timeout when opening connections
      [search_path](#search_path): [optional, override the default postgres search_path]
      [role](#role): [optional, set the role dbt assumes when executing queries]
      [sslmode](#sslmode): [optional, set the sslmode used to connect to the database]

```

</File>

### Configurations

#### search_path

The `search_path` config controls the Postgres "search path" that dbt configures when opening new connections to the database. By default, the Postgres search path is `"$user, public"`, meaning that unqualified <Term id="table" /> names will be searched for in the `public` schema, or a schema with the same name as the logged-in user. **Note:** Setting the `search_path` to a custom value is not necessary or recommended for typical usage of dbt.

#### role

<Changelog> Added in v0.16.0 </Changelog>

The `role` config controls the Postgres role that dbt assumes when opening new connections to the database.

#### sslmode

<Changelog> Added in v0.16.0 </Changelog>

The `sslmode` config controls how dbt connectes to Postgres databases using SSL. See [the Postgres docs](https://www.postgresql.org/docs/9.1/libpq-ssl.html) on `sslmode` for usage information. When unset, dbt will connect to databases using the Postgres default, `prefer`, as the `sslmode`.

### `keepalives_idle`
If the database closes its connection while dbt is waiting for data, you may see the error `SSL SYSCALL error: EOF detected`. Lowering the [`keepalives_idle` value](https://www.postgresql.org/docs/9.3/libpq-connect.html) may prevent this, because the server will send a ping to keep the connection active more frequently. 

[dbt's default setting](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/adapters/postgres/connections.py#L28) is 0 (the server's default value), but can be configured lower (perhaps 120 or 60 seconds), at the cost of a chattier network connection.

<VersionBlock firstVersion="1.2">

#### retries

If `dbt-postgres` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. The default value is 1 retry. If set to 2+ retries, dbt will wait 1 second before retrying. If set to 0, dbt will not retry at all.

</VersionBlock>
