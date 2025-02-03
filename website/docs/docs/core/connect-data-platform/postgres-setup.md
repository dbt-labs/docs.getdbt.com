---
title: "Postgres setup"
description: "Read this guide to learn about the Postgres warehouse setup in dbt."
id: "postgres-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-postgres'
  pypi_package: 'dbt-postgres'
  min_core_version: 'v0.4.0'
  cloud_support: Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-postgres'
  slack_channel_link: 'https://getdbt.slack.com/archives/C0172G2E273'
  platform_name: 'Postgres'
  config_page: '/reference/resource-configs/postgres-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />


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
      dbname: [database name] # or database instead of dbname
      schema: [dbt schema]
      threads: [optional, 1 or more]
      [keepalives_idle](#keepalives_idle): 0 # default 0, indicating the system default. See below
      connect_timeout: 10 # default 10 seconds
      [retries](#retries): 1  # default 1 retry on error/timeout when opening connections
      [search_path](#search_path): [optional, override the default postgres search_path]
      [role](#role): [optional, set the role dbt assumes when executing queries]
      [sslmode](#sslmode): [optional, set the sslmode used to connect to the database]
      [sslcert](#sslcert): [optional, set the sslcert to control the certifcate file location]
      [sslkey](#sslkey): [optional, set the sslkey to control the location of the private key]
      [sslrootcert](#sslrootcert): [optional, set the sslrootcert config value to a new file path in order to customize the file location that contain root certificates]
  
```

</File>

### Configurations

#### search_path

The `search_path` config controls the Postgres "search path" that dbt configures when opening new connections to the database. By default, the Postgres search path is `"$user, public"`, meaning that unqualified <Term id="table" /> names will be searched for in the `public` schema, or a schema with the same name as the logged-in user. **Note:** Setting the `search_path` to a custom value is not necessary or recommended for typical usage of dbt.

#### role

The `role` config controls the Postgres role that dbt assumes when opening new connections to the database.

#### sslmode

The `sslmode` config controls how dbt connects to Postgres databases using SSL. See [the Postgres docs](https://www.postgresql.org/docs/9.1/libpq-ssl.html) on `sslmode` for usage information. When unset, dbt will connect to databases using the Postgres default, `prefer`, as the `sslmode`.


#### sslcert

The `sslcert` config controls the location of the certificate file used to connect to Postgres when using client SSL connections. To use a certificate file that is not in the default location, set that file path using this value. Without this config set, dbt uses the Postgres default locations. See [Client Certificates](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) in the Postgres SSL docs for the default paths.

#### sslkey

The `sslkey` config controls the location of the private key for connecting to Postgres using client SSL connections. If this config is omitted, dbt uses the default key location for Postgres. See [Client Certificates](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) in the Postgres SSL docs for the default locations.

#### sslrootcert

When connecting to a Postgres server using a client SSL connection, dbt verifies that the server provides an SSL certificate signed by a trusted root certificate. These root certificates are in the `~/.postgresql/root.crt` file by default. To customize the location of this file, set the `sslrootcert` config value to a new file path.

### `keepalives_idle`
If the database closes its connection while dbt is waiting for data, you may see the error `SSL SYSCALL error: EOF detected`. Lowering the [`keepalives_idle` value](https://www.postgresql.org/docs/9.3/libpq-connect.html) may prevent this, because the server will send a ping to keep the connection active more frequently. 

[dbt's default setting](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/adapters/postgres/connections.py#L28) is 0 (the server's default value), but can be configured lower (perhaps 120 or 60 seconds), at the cost of a chattier network connection.


#### retries

If `dbt-postgres` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. The default value is 1 retry. If set to 2+ retries, dbt will wait 1 second before retrying. If set to 0, dbt will not retry at all.


### `psycopg2` vs `psycopg2-binary`

`psycopg2-binary` is installed by default when installing `dbt-postgres`.
Installing `psycopg2-binary` uses a pre-built version of `psycopg2` which may not be optimized for your particular machine.
This is ideal for development and testing workflows where performance is less of a concern and speed and ease of install is more important.
However, production environments will benefit from a version of `psycopg2` which is built from source for your particular operating system and architecture. In this scenario, speed and ease of install is less important as the on-going usage is the focus.

<VersionBlock firstVersion="1.8">

To use `psycopg2`:
1. Install `dbt-postgres`
2. Uninstall `psycopg2-binary`
3. Install the equivalent version of `psycopg2`

```bash
pip install dbt-postgres
if [[ $(pip show psycopg2-binary) ]]; then
    PSYCOPG2_VERSION=$(pip show psycopg2-binary | grep Version | cut -d " " -f 2)
    pip uninstall -y psycopg2-binary && pip install psycopg2==$PSYCOPG2_VERSION
fi
```

</VersionBlock>

<VersionBlock lastVersion="1.7">

To ensure your dbt installation uses `psycopg2`, prefix all `dbt-postgres` installation commands with `DBT_PSYCOPG2_NAME=psycopg2`.
For example:
```bash
DBT_PSYCOPG2_NAME=psycopg2 pip install dbt-postgres
```

</VersionBlock>

Installing `psycopg2` often requires OS level dependencies.
These dependencies may vary across operating systems and architectures.

For example, on Ubuntu, you need to install `libpq-dev` and `python-dev`:
```bash
sudo apt-get update
sudo apt-get install libpq-dev python-dev
```
whereas on Mac, you need to install `postgresql`:
```bash
brew install postgresql
pip install psycopg2
```
Your OS may have its own dependencies based on your particular scenario.

<VersionBlock firstVersion="1.8">

#### Limitations

In versions 1.8.0 and 1.8.1, `psycopg2-binary` is installed on MacOS and Windows operating systems and `psycopg2` is installed on Linux operating systems.
This has the side effect of requiring the OS dependencies identified above to install `dbt-postgres` on Linux.
Users will either need to update their workflows to install these dependencies, or upgrade to 1.8.2.

</VersionBlock>
