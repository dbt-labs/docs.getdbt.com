---
title: "Postgres setup"
description: "Read this guide to learn about the Postgres warehouse setup in dbt."
id: "postgres-setup"
meta:
  maintained_by: dbt Labs
  authors: 'core dbt maintainers'
  github_repo: 'dbt-labs/dbt-core'
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

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>


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

<Changelog> Added in v0.16.0 </Changelog>

The `role` config controls the Postgres role that dbt assumes when opening new connections to the database.

#### sslmode

<Changelog> Added in v0.16.0 </Changelog>

The `sslmode` config controls how dbt connectes to Postgres databases using SSL. See [the Postgres docs](https://www.postgresql.org/docs/9.1/libpq-ssl.html) on `sslmode` for usage information. When unset, dbt will connect to databases using the Postgres default, `prefer`, as the `sslmode`.


#### sslcert

<Changelog> Added in v0.21.0 </Changelog>

The `sslcert` config controls the location of the certificate file used to connect to Postgres when using client SSL connections. To use a certificate file that is not in the default location, set that file path using this value. Without this config set, dbt uses the Postgres default locations. See [Client Certificates](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) in the Postgres SSL docs for the default paths.

#### sslkey

<Changelog> Added in v0.21.0 </Changelog>

The `sslkey` config controls the location of the private key for connecting to Postgres using client SSL connections. If this config is omitted, dbt uses the default key location for Postgres. See [Client Certificates](https://www.postgresql.org/docs/current/libpq-ssl.html#LIBPQ-SSL-CLIENTCERT) in the Postgres SSL docs for the default locations.

#### sslrootcert

<Changelog> Added in v0.21.0 </Changelog>

When connecting to a Postgres server using a client SSL connection, dbt verifies that the server provides an SSL certificate signed by a trusted root certificate. These root certificates are in the `~/.postgresql/root.crt` file by default. To customize the location of this file, set the `sslrootcert` config value to a new file path.

### `keepalives_idle`
If the database closes its connection while dbt is waiting for data, you may see the error `SSL SYSCALL error: EOF detected`. Lowering the [`keepalives_idle` value](https://www.postgresql.org/docs/9.3/libpq-connect.html) may prevent this, because the server will send a ping to keep the connection active more frequently. 

[dbt's default setting](https://github.com/dbt-labs/dbt-core/blob/main/plugins/postgres/dbt/adapters/postgres/connections.py#L28) is 0 (the server's default value), but can be configured lower (perhaps 120 or 60 seconds), at the cost of a chattier network connection.

<VersionBlock firstVersion="1.2">

#### retries

If `dbt-postgres` encounters an operational error or timeout when opening a new connection, it will retry up to the number of times configured by `retries`. The default value is 1 retry. If set to 2+ retries, dbt will wait 1 second before retrying. If set to 0, dbt will not retry at all.

</VersionBlock>
