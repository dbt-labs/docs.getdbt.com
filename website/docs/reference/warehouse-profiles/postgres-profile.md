---
title: "Postgres Profile"
---

## Overview of dbt-postgres
**Maintained by:** core dbt maintainers        
**Author:** dbt Labs     
**Core version:** v0.13.0 and newer     
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
      keepalives_idle: 0 # default 0, indicating the system default
      connect_timeout: 10 # default 10 seconds
      search_path: [optional, override the default postgres search_path]
      role: [optional, set the role dbt assumes when executing queries]
      sslmode: [optional, set the sslmode used to connect to the database]

```

</File>

### Configurations

#### search_path

The `search_path` config controls the Postgres "search path" that dbt configures when opening new connections to the database. By default, the Postgres search path is `"$user, public"`, meaning that unqualified table names will be searched for in the `public` schema, or a schema with the same name as the logged-in user. **Note:** Setting the `search_path` to a custom value is not necessary or recommended for typical usage of dbt.

#### role

<Changelog> Added in v0.16.0 </Changelog>

The `role` config controls the Postgres role that dbt assumes when opening new connections to the database.

#### sslmode

<Changelog> Added in v0.16.0 </Changelog>

The `sslmode` config controls how dbt connectes to Postgres databases using SSL. See [the Postgres docs](https://www.postgresql.org/docs/9.1/libpq-ssl.html) on `sslmode` for usage information. When unset, dbt will connect to databases using the Postgres default, `prefer`, as the `sslmode`.

### Postgres notes

While Postgres works reasonably well for datasets smaller than about 10mm rows, database tuning is sometimes required. Make sure to create indexes for columns that are commonly used in joins or where clauses.
