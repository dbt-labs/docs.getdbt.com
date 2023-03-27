---
title: "Starburst & Trino setup"
id: "trino-setup"
meta:
  maintained_by: Starburst Data, Inc.
  authors: Marius Grama, Przemek Denkiewicz, Michiel de Smet
  github_repo: 'starburstdata/dbt-trino'
  pypi_package: 'dbt-trino'
  min_core_version: 'v0.20.0'
  cloud_support: 'Supported (Beta)'
  min_supported_version: 'n/a'
  slack_channel_name: '#db-starburst-and-trino'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNNPBQ24R'
  platform_name: 'Starburst (Trino)'
  config_page: 'trino-configs'
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

See all possible profile configuration options [here](#configuration).sss

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

## Profile Setup

### Ben's Table

|   Field  |                                                                                                                                                                                                                                                Description                                                                                                                                                                                                                                                |                                                              Examples                                                              |
|:--------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------------------------------------------------------------------------------------------------------------------:|
|   Host   | The hostname of your Starburst Enterprise, Starburst Galaxy or Trino cluster. Do not include the HTTP protocol.                                                                                                                                                                                                                                                                                                                                                                                           |                                                       mycluster.mydomain.com                                                       |
|   Port   | The port number to connect to on your Starburst Enterprise, Starburst Galaxy or Trino cluster. The default port for TLS enabled clusters is 443.                                                                                                                                                                                                                                                                                                                                                          |                                                                 443                                                                |
|   User   | The username to log into your Starburst Enterprise, Starburst Galaxy or Trino cluster. The user must have permissions to create and drop tables. When connecting to Starburst Galaxy clusters, the role of the user must be provided as a suffix to the username.<br><br>NOTE: When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used. | Starburst Enterprise/Trino<br>user.name<br>-OR-<br>user.name@mydomain.com<br><br>Starburst Galaxy<br>user.name@mydomain.com/<role> |
| Password | The password for the provided username.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |                                                                *****                                                               |
| Database | The name of a catalog in your Starburst Enterprise, Starburst Galaxy or Trino cluster. The provided username must have read/write access to this catalog. The selection you make does not limit the data you can access through dbt to the specified catalog in Starburst/Trino. It is only used for the initial connection to your cluster.                                                                                                                                                              |                                                         my_postgres_catalog                                                        |
|  Schema  | The name of a schema in your Starburst Enterprise, Starburst Galaxy or Trino cluster that exists within the provided catalog. The provided username must have read/write access to this schema. The selection you make does not limit the data you can access through dbt to the specified schema in Starburst/Trino. It is only used for the initial connection to your cluster.                                                                                                                         |                                                              my_schema                                                             |

### WIP staging area
For reference on which session properties can be set on the the dbt profile do execute

```sql
SHOW SESSION;
```

Example profiles.yml entry:

my-trino-db:
  target: dev
  outputs:
    dev:
      type: trino
      user: commander
      host: 127.0.0.1
      port: 8080
      database: analytics
      schema: public
      threads: 8
      http_scheme: http
      session_properties:
        query_max_run_time: 4h
        exchange_compression: True
      timezone: UTC

Example profiles.yml entry for kerberos authentication:

my-trino-db:
  target: dev
  outputs:
    dev:
      type: trino
      method: kerberos
      user: commander
      keytab: /tmp/trino.keytab
      krb5_config: /tmp/krb5.conf
      principal: trino@EXAMPLE.COM
      host: trino.example.com
      port: 443
      database: analytics
      schema: public

#### Supported authentication types

- none - No authentication
- [ldap](https://trino.io/docs/current/security/authentication-types.html) - Specify username in `user` and password in `password`
- [kerberos](https://trino.io/docs/current/security/kerberos.html) - Specify username in `user`
- [jwt](https://trino.io/docs/current/security/jwt.html) - Specify JWT token in `jwt_token`
- [certificate](https://trino.io/docs/current/security/certificate.html) - Specify a client certificate in `client_certificate` and private key in `client_private_key`
- [oauth](https://trino.io/docs/current/security/oauth2.html) - It is recommended to install keyring to cache the OAuth2 token over multiple dbt invocations by running `pip install 'trino[external-authentication-token-cache]'`, keyring is not installed by default.

See also: https://trino.io/docs/current/security/authentication-types.html

### LDAP

### Keberos

A dbt-trino profile can be configured to run against Trino or Starburst using the following configuration:

| Option                         | Description                                                                                                  | Required?                                                                                               | Example                          |
|--------------------------------|--------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|----------------------------------|
| method                         | The Trino authentication method to use                                                                       | Optional (default is `none`, supported methods are `ldap`, `kerberos`, `jwt`, `oauth` or `certificate`) | `none` or `kerberos`             |
| user                           | Username for authentication                                                                                  | Optional (required if `method` is `none`, `ldap` or `kerberos`)                                         | `commander`                      |
| password                       | Password for authentication                                                                                  | Optional (required if `method` is `ldap`)                                                               | `none` or `abc123`               |
| impersonation_user             | Username override, used for impersonation                                                                    | Optional (applicable if `ldap`)                                                                         | `impersonated_tom`               |
| roles                          | Catalog roles                                                                                                | Optional                                                                                                | `system: analyst`                |
| keytab                         | Path to keytab for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                    | `/tmp/trino.keytab`              |
| krb5_config                    | Path to config for kerberos authentication                                                                   | Optional (may be required if `method` is `kerberos`)                                                    | `/tmp/krb5.conf`                 |
| principal                      | Principal for kerberos authentication                                                                        | Optional (may be required if `method` is `kerberos`)                                                    | `trino@EXAMPLE.COM`              |
| service_name                   | Service name for kerberos authentication                                                                     | Optional (default is `trino`)                                                                           | `abc123`                         |
| mutual_authentication          | Boolean flag for mutual authentication                                                                       | Optional (may be required if `method` is `kerberos`)                                                    | `false`                          |
| force_preemptive               | Boolean flag for preemptively initiate the Kerberos GSS exchange                                             | Optional (may be required if `method` is `kerberos`)                                                    | `false`                          |
| hostname_override              | Kerberos hostname for a host whose DNS name doesn't match                                                    | Optional (may be required if `method` is `kerberos`)                                                    | `EXAMPLE.COM`                    |
| sanitize_mutual_error_response | Boolean flag to strip content and headers from error responses                                               | Optional (may be required if `method` is `kerberos`)                                                    | `true`                           |
| delegate                       | Boolean flag for credential delgation (GSS_C_DELEG_FLAG)                                                     | Optional (may be required if `method` is `kerberos`)                                                    | `false`                          |
| jwt_token                      | JWT token for authentication                                                                                 | Optional (required if `method` is `jwt`)                                                                | `none` or `abc123`               |
| client_certificate             | Path to client certificate to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                        | `/tmp/tls.crt`                   |
| client_private_key             | Path to client private key to be used for certificate based authentication                                   | Optional (required if `method` is `certificate`)                                                        | `/tmp/tls.key`                   |
| http_headers                   | HTTP Headers to send alongside requests to Trino, specified as a yaml dictionary of (header, value) pairs.   | Optional                                                                                                | `X-Trino-Client-Info: dbt-trino` |
| http_scheme                    | The HTTP scheme to use for requests to Trino                                                                 | Optional (default is `http`, or `https` for `method: kerberos`, `ldap` or `jwt`)                        | `https` or `http`                |
| cert                           | The full path to a certificate file for authentication with trino                                            | Optional                                                                                                |                                  |
| session_properties             | Sets Trino session properties used in the connection                                                         | Optional                                                                                                | `query_max_run_time: 4h`         |
| database                       | Specify the database to build models into                                                                    | Required                                                                                                | `analytics`                      |
| schema                         | Specify the schema to build models into. Note: it is not recommended to use upper or mixed case schema names | Required                                                                                                | `public`                         |
| host                           | The hostname to connect to                                                                                   | Required                                                                                                | `127.0.0.1`                      |
| port                           | The port to connect to the host on                                                                           | Required                                                                                                | `8080`                           |
| threads                        | How many threads dbt should use                                                                              | Optional (default is `1`)                                                                               | `8`                              |
| prepared_statements_enabled    | Enable usage of Trino prepared statements (used in `dbt seed` commands)                                      | Optional (default is `true`)                                                                            | `true` or `false`                |
| retries                        | Configure how many times a database operation is retried when connection issues arise                        | Optional (default is `3`)                                                                               | `10`                             |
| timezone                       | The time zone for the Trino session                                                                          | Optional (defaults to the client side local timezone)                                                   | `Europe/Brussels`                |
