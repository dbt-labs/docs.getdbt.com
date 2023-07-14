---
title: "Starburst/Trino setup"
description: "Read this guide to learn about the Starburst/Trino warehouse setup in dbt."
id: "trino-setup"
meta:
  maintained_by: Starburst Data, Inc.
  authors: Marius Grama, Przemek Denkiewicz, Michiel de Smet
  github_repo: 'starburstdata/dbt-trino'
  pypi_package: 'dbt-trino'
  min_core_version: 'v0.20.0'
  cloud_support: 'Supported'
  min_supported_version: 'n/a'
  slack_channel_name: '#db-starburst-and-trino'
  slack_channel_link: 'https://getdbt.slack.com/archives/CNNPBQ24R'
  platform_name: 'Starburst/Trino'
  config_page: '/reference/resource-configs/trino-configs'
---

<Snippet path="warehouse-setups-cloud-callout" />

<h2> Overview of {frontMatter.meta.pypi_package} </h2>

<ul>
    <li><strong>Maintained by</strong>: {frontMatter.meta.maintained_by}</li>
    <li><strong>Authors</strong>: {frontMatter.meta.authors}</li>
    <li><strong>GitHub repo</strong>: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a> <a href={`https://github.com/${frontMatter.meta.github_repo}`}><img src={`https://img.shields.io/github/stars/${frontMatter.meta.github_repo}?style=for-the-badge`}/></a></li>
    <li><strong>PyPI package</strong>: <code>{frontMatter.meta.pypi_package}</code> <a href={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}`}><img src={`https://badge.fury.io/py/${frontMatter.meta.pypi_package}.svg`}/></a></li>
    <li><strong>Slack channel</strong>: <a href={frontMatter.meta.slack_channel_link}>{frontMatter.meta.slack_channel_name}</a></li>
    <li><strong>Supported dbt Core version</strong>: {frontMatter.meta.min_core_version} and newer</li>
    <li><strong>dbt Cloud support</strong>: {frontMatter.meta.cloud_support}</li>
    <li><strong>Minimum data platform version</strong>: {frontMatter.meta.min_supported_version}</li>
    </ul>

:::info Vendor-supported plugin

Certain core functionality may vary. If you would like to report a bug, request a feature, or contribute, you can check out the linked repository and open an issue.

:::

<h2> Installing {frontMatter.meta.pypi_package} </h2>

pip is the easiest way to install the adapter:

<code>pip install {frontMatter.meta.pypi_package}</code>

<p>Installing <code>{frontMatter.meta.pypi_package}</code> will also install <code>dbt-core</code> and any other dependencies.</p>

<h2> Configuring {frontMatter.meta.pypi_package} </h2>

<p>For {frontMatter.meta.platform_name}-specifc configuration please refer to <a href={frontMatter.meta.config_page}>{frontMatter.meta.platform_name} Configuration</a> </p>

<p>For further info, refer to the GitHub repository: <a href={`https://github.com/${frontMatter.meta.github_repo}`}>{frontMatter.meta.github_repo}</a></p>

## Connecting to Starburst/Trino

To connect to a data platform with dbt Core, create appropriate _profile_ and _target_ YAML keys/values in the `profiles.yml` configuration file for your Starburst/Trino clusters. This dbt YAML file lives in the  `.dbt/` directory of your user/home directory. For more information, refer to [Connection profiles](/docs/core/connect-data-platform/connection-profiles) and [profiles.yml](/docs/core/connect-data-platform/profiles.yml). 

The parameters for setting up a connection are for Starburst Enterprise, Starburst Galaxy, and Trino clusters. Unless specified, "cluster" will mean any of these products' clusters.

## Host parameters

The following profile fields are always required except for `user`, which is also required unless you're using the `oauth`, `cert`, or `jwt` authentication methods.

| Field     | Example | Description |
| --------- | ------- | ----------- |
|   `host`   | `mycluster.mydomain.com` | The hostname of your cluster.<br/><br/>Don't include the `http://` or `https://` prefix.  |
| `database` | `my_postgres_catalog` | The name of a catalog in your cluster. |
|  `schema`  | `my_schema`  | The name of a schema within your cluster's catalog. <br/><br/>It's _not recommended_ to use schema names that have upper case or mixed case letters.  |
|   `port`   | `443`  | The port to connect to your cluster. By default, it's 443 for TLS enabled clusters. |
|   `user`   | Format for Starburst Enterprise or Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> | The username (of the account) to log in to your cluster. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username. |

### Roles in Starburst Enterprise
<Snippet path="connect-starburst-trino/roles-starburst-enterprise" />

### Schemas and databases
<Snippet path="connect-starburst-trino/schema-db-fields" />

## Additional parameters

The following profile fields are optional to set up. They let you configure your cluster's session and dbt for your connection. 


| Profile field                 | Example                          | Description                                                                                                 |
| ----------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `threads`                     | `8`                              | How many threads dbt should use (default is `1`)                                                            |
| `roles`                       | `system: analyst`                | Catalog roles                                                                                               |
| `session_properties`          | `query_max_run_time: 4h`         | Sets Trino session properties used in the connection. Execute `SHOW SESSION` to see available options       |
| `prepared_statements_enabled` | `true` or `false`                | Enable usage of Trino prepared statements (used in `dbt seed` commands) (default: `true`)                   |
| `retries`                     | `10`                             | Configure how many times all database operation is retried when connection issues arise  (default: `3`)     |
| `timezone`                    | `Europe/Brussels`                | The time zone for the Trino session (default: client-side local timezone)                                   |
| `http_headers`                | `X-Trino-Client-Info: dbt-trino` | HTTP Headers to send alongside requests to Trino, specified as a YAML dictionary of (header, value) pairs.  |
| `http_scheme`                 | `https` or `http`                | The HTTP scheme to use for requests to Trino   (default: `http`, or `https` if `kerberos`, `ldap` or `jwt`) |

## Authentication parameters

The authentication methods that dbt Core supports are: 

- `ldap` &mdash; LDAP (username and password)  
- `kerberos` &mdash; Kerberos
- `jwt` &mdash; JSON Web Token (JWT)
- `certificate` &mdash; Certificate-based authentication
- `oauth` &mdash; Open Authentication (OAuth)
- `none` &mdash; None, no authentication

Set the `method` field to the authentication method you intend to use for the connection. For a high-level introduction to authentication in Trino, see [Trino Security: Authentication types](https://trino.io/docs/current/security/authentication-types.html).

Click on one of these authentication methods for further details on how to configure your connection profile. Each tab also includes an example `profiles.yml` configuration file for you to review.

<Tabs
  defaultValue="ldap"
  values={[
    {label: 'LDAP', value: 'ldap'},
    {label: 'Kerberos', value: 'kerberos'},
    {label: 'JWT', value: 'jwt'},
    {label: 'Certificate', value: 'certificate'},
    {label: 'OAuth', value: 'oauth'},
    {label: 'None', value: 'none'},
  ]}
>

<TabItem value="ldap">

The following table lists the authentication parameters to set for LDAP.

For more information, refer to [LDAP authentication](https://trino.io/docs/current/security/ldap.html) in the Trino docs. 

| Profile field | Example | Description |
| ------------- | ------- | ------------ |
| `method` | `ldap`| Set LDAP as the authentication method. |
| `user`   | Format for Starburst Enterprise or Trino: <br/> <ul><li>`user.name`</li><li>`user.name@mydomain.com`</li></ul><br/>Format for Starburst Galaxy:<br/> <ul><li>`user.name@mydomain.com/role`</li></ul> | The username (of the account) to log in to your cluster. When connecting to Starburst Galaxy clusters, you must include the role of the user as a suffix to the username. |
| `password`  | `abc123` | Password for authentication.  |
| `impersonation_user` (optional) | `impersonated_tom` | Override the provided username. This lets you impersonate another user. |
<br/>

#### Example profiles.yml for LDAP

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

The following table lists the authentication parameters to set for Kerberos.

For more information, refer to [Kerberos authentication](https://trino.io/docs/current/security/kerberos.html) in the Trino docs.

| Profile field                               | Example             | Description                                                      |
| ------------------------------------------- | ------------------- | ---------------------------------------------------------------- |
| `method` | `kerberos`| Set Kerberos as the authentication method. |
| `user`                                      | `commander`         | Username for authentication                                      |
| `keytab`                                    | `/tmp/trino.keytab` | Path to keytab                                                   |
| `krb5_config`                               | `/tmp/krb5.conf`    | Path to config                                                   |
| `principal`                                 | `trino@EXAMPLE.COM` | Principal                                                        |
| `service_name` (optional)                   | `abc123`            | Service name (default is `trino`)                               |
| `hostname_override` (optional)              | `EXAMPLE.COM`       | Kerberos hostname for a host whose DNS name doesn't match        |
| `mutual_authentication` (optional)          | `false`             | Boolean flag for mutual authentication                           |
| `force_preemptive` (optional)               | `false`             | Boolean flag to preemptively initiate the Kerberos GSS exchange |
| `sanitize_mutual_error_response` (optional) | `true`              | Boolean flag to strip content and headers from error responses   |
| `delegate`  (optional)                      | `false`             | Boolean flag for credential delegation (`GSS_C_DELEG_FLAG`)       |

<br/>

#### Example profiles.yml for Kerberos

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

The following table lists the authentication parameters to set for JSON Web Token.

For more information, refer to [JWT authentication](https://trino.io/docs/current/security/jwt.html) in the Trino docs.

| Profile field        | Example        | Description                |
| -------------------- | -------------- | -------------------------- |
| `method` | `jwt`| Set JWT as the authentication method. |
| `jwt_token` | `aaaaa.bbbbb.ccccc` | The JWT string. |

<br/>

#### Example profiles.yml for JWT

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: jwt 
      jwt_token: [my_long_jwt_token_string]
      host: [hostname]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="certificate">

The following table lists the authentication parameters to set for certificates.

For more information, refer to [Certificate authentication](https://trino.io/docs/current/security/certificate.html) in the Trino docs.

| Profile field        | Example        | Description                         |
| -------------------- | -------------- | ----------------------------------- |
| `method` | `certificate`| Set certificate-based authentication as the method |
| `client_certificate` | `/tmp/tls.crt` | Path to client certificate          |
| `client_private_key` | `/tmp/tls.key` | Path to client private key          |
| `cert`               |                | The full path to a certificate file |

<br/>

#### Example profiles.yml for certificate

<File name='~/.dbt/profiles.yml'>

```yaml
trino:
  target: dev
  outputs:
    dev:
      type: trino
      method: certificate 
      cert: [path/to/cert_file]
      client_certificate: [path/to/client/cert]
      client_private_key: [path to client key]
      database: [database name]
      schema: [your dbt schema]
      port: [port number]
      threads: [1 or more]
```

</File>

</TabItem>

<TabItem value="oauth">

The only authentication parameter to set for OAuth 2.0 is `method: oauth`. If you're using Starburst Enterprise or Starburst Galaxy, you must enable OAuth 2.0 in Starburst before you can use this authentication method.

For more information, refer to both [OAuth 2.0 authentication](https://trino.io/docs/current/security/oauth2.html) in the Trino docs and the [README](https://github.com/trinodb/trino-python-client#oauth2-authentication) for the Trino Python client.

It's recommended that you install `keyring` to cache the OAuth 2.0 token over multiple dbt invocations by running `pip install 'trino[external-authentication-token-cache]'`. The `keyring` package is not installed by default.

#### Example profiles.yml for OAuth

```yaml
sandbox-galaxy:
  target: oauth
  outputs:
    oauth:
      type: trino
      method: oauth
      host: bunbundersders.trino.galaxy-dev.io
      catalog: dbt_target
      schema: dataders
      port: 433
```

</TabItem>

<TabItem value="none">

You don't need to set up authentication (`method: none`), however, dbt Labs strongly discourages people from using it in any real application. Its use case is only for toy purposes (as in to play around with it), like local examples such as running Trino and dbt entirely within a single Docker container.

#### Example profiles.yml for no authentication

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
