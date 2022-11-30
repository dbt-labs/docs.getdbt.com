---
title: "Starburst & Trino setup"
id: "trino-setup"
meta:
  maintained_by: Starburst Data, Inc.
  authors: Matthew Carter, Andy Regan, Andrew Hedengren
  github_repo: 'starburstdata/dbt-trino'
  pypi_package: 'dbt-trino'
  min_core_version: 'v0.20.0'
  cloud_support: Not Supported
  min_supported_version: 'n/a'
  slack_channel_name: '#db-clickhouse'
  slack_channel_link: 'https://getdbt.slack.com/archives/C01DRQ178LQ'
  platform_name: 'Trino'
  config_page: 'no-configs'
---

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

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



## Set up a Trino or Starburst Target

Trino or Starburst targets should be set up using the following configuration in your `profiles.yml` file.

See all possible profile configuration options [here](#configuration).

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: none  # optional, one of {none | ldap | kerberos | oauth | jwt | certificate}
      user: [user]
      password: [password]  # required if method is ldap or kerberos
      database: [database name]
      host: [hostname]
      port: [port number]
      schema: [your dbt schema]
      threads: [1 or more]
      retries: [1 or more] # default: 3
      http_scheme: [http or https]
      session_properties:
        [some_session_property]: [value] # run SHOW SESSION query to get current session properties
```

</File>

## Incremental models

Incremental strategies supported by the adapter are:

- append (default incremental strategy) - append only adds the new records based on the condition specified in the is_incremental() conditional block.
- delete+insert - Through the delete+insert incremental strategy, you can instruct dbt to use a two-step incremental approach. It will first delete the records detected through the configured is_incremental() block and re-insert them.
- merge - Through the merge incremental strategy, dbt-trino constructs a MERGE statement which inserts new and updates existing records based on the unique key (specified by unique_key).
If your unique_key is not actually unique, the delete+insert strategy can be used instead. Note that some connectors in Trino have limited or no support for MERGE.

## Configuration

A dbt-trino profile can be configured to run against Trino or Starburst using the following configuration:

| Option                         | Description                                                                                                  | Required?                                                                                                        | Example                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------|
| method                         | The Trino authentication method to use                                                                       | Optional (default is `none`, supported methods are `ldap`, `kerberos`, `jwt`, `oauth` or `certificate`)          | `none` or `kerberos`             |
| user                           | Username for authentication                                                                                  | Optional (required if `method` is `none`, `ldap` or `kerberos`)                                                  | `commander`                      |
| password                       | Password for authentication                                                                                  | Optional (required if `method` is `ldap`)                                                                        | `none` or `abc123`               |
| keytab                         | Path to keytab for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                             | `/tmp/trino.keytab`              |
| krb5_config                    | Path to config for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                             | `/tmp/krb5.conf`                 |
| principal                      | Principal for kerberos authentication                                                                        | Optional (may be required if `method` is `kerberos`)                                                             | `trino@EXAMPLE.COM`              |
| service_name                   | Service name for kerberos authentication                                                                     | Optional (default is `trino`)                                                                                    | `abc123`                         |
| jwt_token                      | JWT token for authentication                                                                                 | Optional (required if `method` is `jwt`)                                                                         | `none` or `abc123`               |
| client_certificate             | Path to client certificate to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                                 | `/tmp/tls.crt`                   |
| client_private_key             | Path to client private key to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                                 | `/tmp/tls.key`                   |
| http_headers                   | HTTP Headers to send alongside requests to Trino, specified as a yaml dictionary of (header, value) pairs.   | Optional                                                                                                         | `X-Trino-Client-Info: dbt-trino` |
| http_scheme                    | The HTTP scheme to use for requests to Trino                                                                 | Optional (default is `http`, or `https` for `method: kerberos`, `ldap` or `jwt`)                                 | `https` or `http`                |
| cert                           | The full path to a certificate file for authentication with trino                                            | Optional                                                                                                         |                                  |
| session_properties             | Sets Trino session properties used in the connection                                                         | Optional                                                                                                         | `query_max_run_time: 5d`         |
| database                       | Specify the database to build models into                                                                    | Required                                                                                                         | `analytics`                      |
| schema                         | Specify the schema to build models into. Note: it is not recommended to use upper or mixed case schema names | Required                                                                                                         | `public`                         |
| host                           | The hostname to connect to                                                                                   | Required                                                                                                         | `127.0.0.1`                      |
| port                           | The port to connect to the host on                                                                           | Required                                                                                                         | `8080`                           |
| threads                        | How many threads dbt should use                                                                              | Optional (default is `1`)                                                                                        | `8`                              |
| prepared_statements_enabled    | Enable usage of Trino prepared statements (used in `dbt seed` commands)                                      | Optional (default is `true`)                                                                                     | `true` or `false`                |
| retries                        | Configure how many times a database operation is retried when connection issues arise                        | Optional (default is `3`)
