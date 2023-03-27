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

## Connecting to Starburst/Trino with dbt-core

With dbt-core, the way to connect to your data platform is to creating a `profile` and `target` within the user-configured `profiles.yml` in the `.dbt/` directory of your user/home directory. For more information, please see both [Connection profiles](connection-profiles) and the [profiles.yml](../profiles.yml.md) reference page.

The two main ways in which a target's specificaiton varies across adapter plugins are related to:

- [Connecting to Starburst/Trino with dbt-core](#connecting-to-starbursttrino-with-dbt-core)
  - [Authentication Methods](#authentication-methods)
  - [All parameters](#all-parameters)
  - [Optional configurations](#optional-configurations)
  - [Errata](#errata)
    - [Ben's Cloud table](#bens-cloud-table)

### Authentication Methods

The below tabs give, for each supported authentication type in dbt Core:
- the profile fields relevant to the given authentication type, and
- an example `profiles.yml`

For a high-level introduction to authentication in Trino, see [Trino Security: Authentication Types](https://trino.io/docs/current/security/authentication-types.html).





<Tabs
  defaultValue="ldap"
  values={[
    {label: 'LDAP (username & password)', value: 'ldap'},
    {label: 'kerberos', value: 'kerberos'},
    {label: 'JWT Token', value: 'jwt'},
    {label: 'Certificate', value: 'certificate'},
    {label: 'Oauth', value: 'oauth'},
    {label: 'None', value: 'none'},
  ]}
>

<TabItem value="ldap">

In addition to specifying  `method: ldap`, the table below gives the ldap-relevant parameters.

For addiontal information, refer to Trino's doc page on [LDAP Authentication](https://trino.io/docs/current/security/ldap.html)

| Profile field                     | Example                                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| user                          | **Starburst Enterprise/Trino**:<br></br>`user.name` OR `user.name@mydomain.com`<br></br>**Starburst Galaxy**:<br></br>`user.name@mydomain.com/<role>` | The username to log into your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The user must have permissions to create and drop tables.<br></br>When connecting to Starburst Galaxy clusters, the role of the user must be provided as a suffix to the username.<br></br>**NOTE**: When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used. |
| password                      | `abc123`                                                                                                                                              | Password for authentication (can be none, but not recommended!)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| impersonation_user (optional) | `impersonated_tom`                                                                                                                                    | Username override, used for impersonation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |



<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: ldap 
      user: [user]
      password: [password]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="kerberos">

In addition to specifying  `method: kerberos`, the table below gives the kerberos-relevant parameters.

For addiontal information, refer to Trino's doc page on [kerberos Authentication](https://trino.io/docs/current/security/kerberos.html)

| Profile field                             | Example             | Description                                                      |
| ----------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| user                                      | `commander`         | Username for authentication                                      |
| keytab                                    | `/tmp/trino.keytab` | Path to keytab                                                   |
| krb5_config                               | `/tmp/krb5.conf`    | Path to config                                                   |
| principal                                 | `trino@EXAMPLE.COM` | Principal                                                        |
| service_name (optional)                   | `abc123`            | Service name  (default is 'trino')                               |
| hostname_override (optional)              | `EXAMPLE.COM`       | Kerberos hostname for a host whose DNS name doesn't match        |
| mutual_authentication (optional)          | `false`             | Boolean flag for mutual authentication                           |
| force_preemptive (optional)               | `false`             | Boolean flag for preemptively initiate the Kerberos GSS exchange |
| sanitize_mutual_error_response (optional) | `true`              | Boolean flag to strip content and headers from error responses   |
| delegate  (optional)                      | `false`             | Boolean flag for credential delgation (`GSS_C_DELEG_FLAG`)       |

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
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
```

</File>

</TabItem>

<TabItem value="jwt">

Below are the fields unique to jwt authentication

In addition to specifying  `method: jwt`, the only additional profile parameter is `jwt_token`

For addiontal information, refer to Trino's doc page on [kerberos Authentication](https://trino.io/docs/current/security/kerberos.html)

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: ldap 
      user: [user]
      password: [password]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="certificate">

Below are the fields unique to authentication with a certificate file

In addition to specifying  `method: certificate`, the table below gives the certificate-relevant parameters.

For addiontal information, refer to Trino's doc page on [certificate Authentication](https://trino.io/docs/current/security/certificate.html)


| Profile field        | Example            | Description                  |
| -------------------- | ------------------ | ---------------------------- |
| `client_certificate` | `/tmp/tls.crt`     | Path to client certificate   |
| `client_private_key` | `/tmp/tls.key`     | Path to client private key   |


<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: ldap 
      user: [user]
      password: [password]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="oauth">

Authenticating in dbt-core using OAuth 2 is currently underdocumented, but helpful information is given on the [trino-python-client's README](https://github.com/trinodb/trino-python-client#oauth2-authentication).

For addiontal information, refer to Trino's doc page on [Oauth2 Authentication](https://trino.io/docs/current/security/oauth2.html)

Note: It is recommended to install `keyring` to cache the OAuth2 token over multiple dbt invocations by running `pip install 'trino[external-authentication-token-cache]'`, `keyring` is not installed by default.

</TabItem>

<TabItem value="none">

Note: `none` is also a supported authentication method, but it is strongly discouraged. It use case is only for toy, local examples such as running Trino and dbt entirely within a single Docker container.

</TabItem>
</Tabs>

### All parameters

A dbt-trino profile can be configured to run against Trino or Starburst using the following configuration:

| Option                         | Description                                                                                                  | Required?                                                                                               | Example                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------- |
| database                       | Specify the database to build models into                                                                    | Required                                                                                                | `analytics`                      |
| schema                         | Specify the schema to build models into. Note: it is not recommended to use upper or mixed case schema names | Required                                                                                                | `public`                         |
| host                           | The hostname to connect to                                                                                   | Required                                                                                                | `127.0.0.1`                      |
| port                           | The port to connect to the host on                                                                           | Required                                                                                                | `8080`                           |
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
| threads                        | How many threads dbt should use                                                                              | Optional (default is `1`)                                                                               | `8`                              |
| prepared_statements_enabled    | Enable usage of Trino prepared statements (used in `dbt seed` commands)                                      | Optional (default is `true`)                                                                            | `true` or `false`                |
| retries                        | Configure how many times a database operation is retried when connection issues arise                        | Optional (default is `3`)                                                                               | `10`                             |
| timezone                       | The time zone for the Trino session                                                                          | Optional (defaults to the client side local timezone)                                                   | `Europe/Brussels`                |


### Optional configurations

For reference on which session properties can be set on the the dbt profile, execute the following statement.

```sql
SHOW SESSION;
```

### Errata


#### Ben's Cloud table

The below table covers the most relevant fields for target, especially as they pertain to authentication to dbt Cloud, which today only supports LDAP authentication.

|  Field   |                                                                                                                                                                                                                                                          Description                                                                                                                                                                                                                                                           |                                                                           Examples                                                                            |
| :------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------------------: |
|   Host   |                                                                                                                                                                                 The hostname of your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>Do not include the HTTP protocol prefix (i.e. `http://` or `https://`).                                                                                                                                                                                  |                                                                   `mycluster.mydomain.com`                                                                    |
|   Port   |                                                                                                                                                                                   The port number to connect to on your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The default port for TLS enabled clusters is `443`.                                                                                                                                                                                   |                                                                              443                                                                              |
|   User   | The username to log into your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The user must have permissions to create and drop tables.<br></br>When connecting to Starburst Galaxy clusters, the role of the user must be provided as a suffix to the username.<br></br>**NOTE**: When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used. | Starburst Enterprise/Trino<br></br>`user.name`<br></br>-OR-<br></br>`user.name@mydomain.com`<br></br>Starburst Galaxy<br></br>`user.name@mydomain.com/<role>` |
| Password |                                                                                                                                                                                                                                            The password for the provided username.                                                                                                                                                                                                                                             |                                                                             *****                                                                             |
| Database |                                                                                  The name of a catalog in your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The provided username must have read/write access to this catalog.<br></br>The selection you make does not limit the data you can access through dbt to the specified catalog in Starburst/Trino. It is only used for the initial connection to your cluster.                                                                                  |                                                                     `my_postgres_catalog`                                                                     |
|  Schema  |                                                               The name of a schema in your Starburst Enterprise, Starburst Galaxy or Trino cluster that exists within the provided catalog.<br></br>The provided username must have read/write access to this schema.<br></br>The selection you make does not limit the data you can access through dbt to the specified schema in Starburst/Trino. It is only used for the initial connection to your cluster.                                                                |                                                                          `my_schema`                                                                          |
