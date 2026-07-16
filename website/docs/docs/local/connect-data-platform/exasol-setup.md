---
title: "Connect Exasol to dbt Core"
sidebar_label: "Exasol"
description: "Read this guide to learn about the Exasol warehouse setup in dbt."
meta:
  maintained_by: Exasol
  authors: 'Torsten Glunde, Ilija Kutle'
  github_repo: 'exasol/dbt-exasol'
  pypi_package: 'dbt-exasol'
  min_core_version: 'v1.8.0'
  max_core_version: 'v1.10.x'
  cloud_support: Not Supported
  min_supported_version: 'Exasol 6.x'
  slack_channel_name: 'n/a'
  slack_channel_link:
  platform_name: 'Exasol'
  config_page: '/reference/resource-configs/exasol-configs'
---
import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

### Connecting to Exasol with **dbt-exasol**

#### User / password authentication

Configure your dbt profile for using Exasol:

##### Exasol connection information

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      password: PASSWORD
      dbname: db
      schema: SCHEMA
```

</File>

#### OpenID authentication (Exasol SaaS) {#open-id-authentication}

For Exasol SaaS environments, you can authenticate using OpenID tokens instead of username and password:

<File name='profiles.yml'>

```yaml
dbt-exasol:
  target: dev
  outputs:
    dev:
      type: exasol
      threads: 1
      dsn: HOST:PORT
      user: USERNAME
      access_token: YOUR_ACCESS_TOKEN  # or use refresh_token
      dbname: db
      schema: SCHEMA
      encryption: True  # required for SaaS
```

</File>

- **`access_token`** &mdash; Personal access token for OpenID authentication
- **`refresh_token`** &mdash; Refresh token for OpenID authentication (alternative to `access_token`)

:::info
Use either `access_token` or `refresh_token`, not both. TLS encryption is required when using OpenID authentication with Exasol SaaS.
:::

#### Optional parameters

- **`connection_timeout`** &mdash; defaults to pyexasol default
- **`socket_timeout`** &mdash; defaults to pyexasol default
- **`query_timeout`** &mdash; defaults to pyexasol default
- **`compression`** &mdash; default: False
- **`encryption`** &mdash; default: True. Enables SSL/TLS encryption for secure connections. Required for Exasol SaaS
- **`validate_server_certificate`** &mdash; default: True. Validates the SSL/TLS certificate when encryption is enabled. Set to False only for development/testing with self-signed certificates (not recommended for production)
- **`protocol_version`** &mdash; default: v3
- **`row_separator`** &mdash; default: CRLF for windows - LF otherwise
- **`timestamp_format`** &mdash; default: `YYYY-MM-DDTHH:MI:SS.FF6`

:::info SSL/TLS Certificate Validation
By default, dbt-exasol validates SSL/TLS certificates when `encryption=True`. For development/testing with self-signed certificates, you can either:

- Set `validate_server_certificate: False` (not recommended for production)
- Use a certificate fingerprint in the DSN: `dsn: myhost/FINGERPRINT:8563`
- Use `dsn: myhost/nocertcheck:8563` to skip validation (testing only)

For more information, see the [PyExasol security documentation](https://exasol.github.io/pyexasol/master/user_guide/configuration/security.html).
:::
