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

The available profile parameters within dbt-trino can be broken into the following three categories:

- host-related
- authentication-related, and
- dbt-specific- and session-related

the below sections go into greater detail

### Host parameters

All the below fields are always required, with the exception of `user`, which is required except for the  `oauth`, `cert` and `jwt` auth methods


|   Field    | Examples                                                                                                                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :--------: | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   `host`   | `mycluster.mydomain.com`                                                                                                                                        | The hostname of your cluster.<br></br>Do not include the HTTP protocol prefix (i.e. `http://` or `https://`).                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `database` | `my_postgres_catalog`                                                                                                                                           | The name of a catalog in your cluster.<br></br>The provided username must have read/write access to this catalog.<br></br>The selection you make does not limit the data you can access through dbt to the specified catalog in Starburst/Trino. By default, dbt models will be created and/or materialized within this catalog.                                                                                                                                                                                               |
|  `schema`  | `my_schema`                                                                                                                                                     | The name of a schema within your cluster's catalog.<br></br>The provided username must have read/write access to this schema.<br></br>The selection you make does not limit the data you can access through dbt to the specified schema in Starburst/Trino. By default, dbt models will be created and/or materialized within this catalog.<br></br>**NOTE**: it is not recommended to use upper or mixed case schema names                                                                                                    |
|   `port`   | `443`                                                                                                                                                           | The default port for TLS enabled clusters is `443`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
|   `user`   | Starburst Enterprise & Trino<br></br>`user.name`<br></br>-OR-<br></br>`user.name@mydomain.com`<br></br>Starburst Galaxy<br></br>`user.name@mydomain.com/<role>` | The username to log into your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The user must have permissions to create and drop tables.<br></br>When connecting to Starburst Galaxy clusters, the role of the user must be provided as a suffix to the username.<br></br>**NOTE**: When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used. |


### Additional, optional configurations

The following fields are not explicitly tied to a specific authentication method, but are available to be set within a profile


| Profile field                 | Example                          | Description                                                                                                 |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `threads`                     | `8`                              | How many threads dbt should use (default is `1`)                                                            |
| `roles`                       | `system: analyst`                | Catalog roles                                                                                               |
| `session_properties`          | `query_max_run_time: 4h`         | Sets Trino session properties used in the connection. Execute `SHOW SESSION` to see available options       |
| `prepared_statements_enabled` | `true` or `false`                | Enable usage of Trino prepared statements (used in `dbt seed` commands) (default: `true`)                   |
| `retries`                     | `10`                             | Configure how many times all database operation is retried when connection issues arise  (default: `3`)     |
| `timezone`                    | `Europe/Brussels`                | The time zone for the Trino session (default: client-side local timezone)                                   |
| `http_headers`                | `X-Trino-Client-Info: dbt-trino` | HTTP Headers to send alongside requests to Trino, specified as a yaml dictionary of (header, value) pairs.  |
| `http_scheme`                 | `https` or `http`                | The HTTP scheme to use for requests to Trino   (default: `http`, or `https` if `kerberos`, `ldap` or `jwt`) |


### Authentication Methods

The below tabs give, for each supported authentication type in dbt Core:

- the profile fields relevant to the given authentication type, and
- an example `profiles.yml`

For a high-level introduction to authentication in Trino, see [Trino Security: Authentication Types](https://trino.io/docs/current/security/authentication-types.html).

The `method` field is used in a user's profile to declare the intended authentication type


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

#### Fields

In addition to specifying  `method: ldap`, the table below gives the ldap-relevant parameters.

For addiontal information, refer to Trino's doc page on [LDAP Authentication](https://trino.io/docs/current/security/ldap.html)

| Profile field                   | Example                                                                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `user`                          | **Starburst Enterprise/Trino**:<br></br>`user.name` OR `user.name@mydomain.com`<br></br>**Starburst Galaxy**:<br></br>`user.name@mydomain.com/<role>` | The username to log into your Starburst Enterprise, Starburst Galaxy or Trino cluster.<br></br>The user must have permissions to create and drop tables.<br></br>When connecting to Starburst Galaxy clusters, the role of the user must be provided as a suffix to the username.<br></br>**NOTE**: When connecting to a Starburst Enterprise cluster with built-in access controls enabled, you will not be able to provide the role as a suffix to the username, so the default role for the provided username will be used. |
| `password`                      | `abc123`                                                                                                                                              | Password for authentication (can be none, but not recommended!)                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `impersonation_user` (optional) | `impersonated_tom`                                                                                                                                    | Username override, used for impersonation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

#### Sample `profiles.yml`

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

#### Fields

In addition to specifying  `method: kerberos`, the table below gives the kerberos-relevant parameters.

For addiontal information, refer to Trino's doc page on [kerberos Authentication](https://trino.io/docs/current/security/kerberos.html)

| Profile field                               | Example             | Description                                                      |
| ------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| `user`                                      | `commander`         | Username for authentication                                      |
| `keytab`                                    | `/tmp/trino.keytab` | Path to keytab                                                   |
| `krb5_config`                               | `/tmp/krb5.conf`    | Path to config                                                   |
| `principal`                                 | `trino@EXAMPLE.COM` | Principal                                                        |
| `service_name` (optional)                   | `abc123`            | Service name  (default is 'trino')                               |
| `hostname_override` (optional)              | `EXAMPLE.COM`       | Kerberos hostname for a host whose DNS name doesn't match        |
| `mutual_authentication` (optional)          | `false`             | Boolean flag for mutual authentication                           |
| `force_preemptive` (optional)               | `false`             | Boolean flag for preemptively initiate the Kerberos GSS exchange |
| `sanitize_mutual_error_response` (optional) | `true`              | Boolean flag to strip content and headers from error responses   |
| `delegate`  (optional)                      | `false`             | Boolean flag for credential delgation (`GSS_C_DELEG_FLAG`)       |

#### Sample `profiles.yml`

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

#### Fields

In addition to specifying  `method: jwt`, the only additional profile parameter is `jwt_token`

For addiontal information, refer to Trino's doc page on [kerberos Authentication](https://trino.io/docs/current/security/kerberos.html)

#### Sample `profiles.yml`

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

#### Fields

Below are the fields unique to authentication with a certificate file

In addition to specifying  `method: certificate`, the table below gives the certificate-relevant parameters.

For addiontal information, refer to Trino's doc page on [certificate Authentication](https://trino.io/docs/current/security/certificate.html)


| Profile field        | Example        | Description                         |
| -------------------- | -------------- | ----------------------------------- |
| `client_certificate` | `/tmp/tls.crt` | Path to client certificate          |
| `client_private_key` | `/tmp/tls.key` | Path to client private key          |
| `cert`               |                | The full path to a certificate file |

#### Sample `profiles.yml`

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

#### Sample `profiles.yml`

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: none
      user: commander
      host: trino.example.com
      port: 443
      database: analytics
      schema: public
```

</File>

</TabItem>
</Tabs>


## Reference

### All parameters

Below all possible parameters can be found

| Profile field                               | Auth Methods Applicable    | Example                          | Description                                                                                                                                                           |
| ------------------------------------------- | -------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `database`                                  | all                        | `analytics`                      | Specify the database to build models into                                                                                                                             |
| `schema`                                    | all                        | `public`                         | Specify the schema to build models into. Note: it is not recommended to use upper or mixed case schema names                                                          |
| `host`                                      | all                        | `127.0.0.1`                      | The hostname to connect to                                                                                                                                            |
| `port`                                      | all                        | `8080`                           | The port to connect to the host on                                                                                                                                    |
| `user`                                      | `ldap`, `kerberos`, `none` | `commander`                      | Username for authentication                                                                                                                                           |
| `threads` (optional)                        | all                        | `8`                              | How many threads dbt should use      (default is `1`)                                                                                                                 |
| `roles` (optional)                          | all                        | `system: analyst`                | Catalog roles                                                                                                                                                         |
| `method` (optional)                         | all                        | `none` or `kerberos`             | The Trino authentication method to use     (default: `none`)                                                                                                          |
| `session_properties` (optional)             | all                        | `query_max_run_time: 4h`         | Sets Trino session properties used in the connection                                                                                                                  |
| `prepared_statements_enabled` (optional)    | all                        | `true` or `false`                | Enable usage of Trino prepared statements (used in `dbt seed` commands) (default: `true`) see [Trino Configs: Prepared Statements](trino-configs#prepared-statements) |
| `retries` (optional)                        | all                        | `10`                             | Configure how many times all database operation is retried when connection issues arise  (default: `3`)                                                               |
| `timezone` (optional)                       | all                        | `Europe/Brussels`                | The time zone for the Trino session (defaults to the client side local timezone)                                                                                      |
| `http_headers`  (optional)                  | all                        | `X-Trino-Client-Info: dbt-trino` | HTTP Headers to send alongside requests to Trino, specified as a yaml dictionary of (header, value) pairs.                                                            |
| `http_scheme` (optional)                    | all                        | `https` or `http`                | The HTTP scheme to use for requests to Trino   (default: `http`, or `https` if `kerberos`, `ldap` or `jwt`)                                                           |
| `password`                                  | `ldap`                     | `none` or `abc123`               | Password for authentication                                                                                                                                           |
| `impersonation_user` (optional)             | `ldap`                     | `impersonated_tom`               | Username override, used for impersonation                                                                                                                             |
| `keytab`                                    | `kerberos`                 | `/tmp/trino.keytab`              | Path to keytab                                                                                                                                                        |
| `krb5_config`                               | `kerberos`                 | `/tmp/krb5.conf`                 | Path to config                                                                                                                                                        |
| `principal`                                 | `kerberos`                 | `trino@EXAMPLE.COM`              | Principal                                                                                                                                                             |
| `service_name` (optional)                   | `kerberos`                 | `abc123`                         | Service name (default is `trino`)                                                                                                                                     |
| `hostname_override` (optional)              | `kerberos`                 | `EXAMPLE.COM`                    | Kerberos hostname for a host whose DNS name doesn't match                                                                                                             |
| `mutual_authentication` (optional)          | `kerberos`                 | `false`                          | Boolean flag for mutual authentication                                                                                                                                |
| `sanitize_mutual_error_response` (optional) | `kerberos`                 | `true`                           | Boolean flag to strip content and headers from error responses                                                                                                        |
| `force_preemptive` (optional)               | `kerberos`                 | `false`                          | Boolean flag for preemptively initiate the Kerberos GSS exchange                                                                                                      |
| `delegate` (optional)                       | `kerberos`                 | `false`                          | Boolean flag for credential delgation (`GSS_C_DELEG_FLAG`)                                                                                                            |
| `jwt_token`                                 | `jwt`                      | `none` or `abc123`               | JWT token for authentication                                                                                                                                          |
| `client_certificate`                        | `certificate`              | `/tmp/tls.crt`                   | Path to client certificate                                                                                                                                            |
| `client_private_key`                        | `certificate`              | `/tmp/tls.key`                   | Path to client private key                                                                                                                                            |
| `cert`                                      | `certificate`              |                                  | The full path to a certificate file                                                                                                                                   |
