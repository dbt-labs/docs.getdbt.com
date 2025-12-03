---
title: "DeltaStream setup"
description: "Read this guide to learn about the DeltaStream warehouse setup in dbt."
meta:
  maintained_by: Community
  authors: 'DeltaStream Team'
  github_repo: 'deltastreaminc/dbt-deltastream'
  pypi_package: 'dbt-deltastream'
  min_core_version: 'v1.10.0'
  cloud_support: Not supported
  min_supported_version: '?'
  slack_channel_name: '#db-deltastream'
  platform_name: 'DeltaStream'
  config_page: '/reference/resource-configs/deltastream-configs'
---

import SetUpPages from '/snippets/_setup-pages-intro.md';

<SetUpPages meta={frontMatter.meta} />

## Connecting to DeltaStream with **dbt-deltastream**

To connect to DeltaStream from dbt, you'll need to add a [profile](/docs/core/connect-data-platform/connection-profiles)
to your `profiles.yml` file. A DeltaStream profile conforms to the following syntax:

<File name='profiles.yml'>

```yaml
<profile-name>:
  target: <target-name>
  outputs:
    <target-name>:
      type: deltastream
      
      # Required parameters
      token: [ your-api-token ] # Authentication token for DeltaStream API
      database: [ your-database ] # Target database name
      schema: [ your-schema ] # Target schema name
      organization_id: [ your-org-id ] # Organization identifier
      
      # Optional parameters
      url: [ https://api.deltastream.io/v2 ] # DeltaStream API URL, defaults to https://api.deltastream.io/v2
      timezone: [ UTC ] # Timezone for operations, defaults to UTC
      session_id: [ <empty string> ] # Custom session identifier for debugging purpose
      role: [ <empty string> ] # User role
      store: [ <empty string> ] # Target store name
      compute_pool: [ <empty string> ] # Compute pool name to be used if any else use the default compute pool
```

</File>

### Description of DeltaStream profile fields

| Field             | Required | Description                                                                                                                                                                                                                                                                                                                                                      |
|-------------------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `type`            | ✅        | This must be included either in `profiles.yml` or in the `dbt_project.yml` file. Must be set to `deltastream`.                                                                                                                                                                                                                                                |
| `token`           | ✅        | Authentication token for DeltaStream API. This should be stored securely, preferably as an environment variable.                                                                                                                                                                                                                                               |
| `database`        | ✅        | Target default database name in DeltaStream where your dbt models will be created.                                                                                                                                                                                                                                                                             |
| `schema`          | ✅        | Target default schema name within the specified database.                                                                                                                                                                                                                                                                                                      |
| `organization_id` | ✅        | Organization identifier that determines which DeltaStream organization you're connecting to.                                                                                                                                                                                                                                                                   |
| `url`             | ❌        | DeltaStream API URL. Defaults to `https://api.deltastream.io/v2` if not specified.                                                                                                                                                                                                                                                                            |
| `timezone`        | ❌        | Timezone for operations. Defaults to `UTC` if not specified.                                                                                                                                                                                                                                                                                                  |
| `session_id`      | ❌        | Custom session identifier for debugging purposes. Helps track operations in DeltaStream logs.                                                                                                                                                                                                                                                                 |
| `role`            | ❌        | User role within the DeltaStream organization. If not specified, uses the default role associated with the token.                                                                                                                                                                                                                                             |
| `store`           | ❌        | Target default store name. Stores represent external system connections (Kafka, PostgreSQL, etc.) in DeltaStream.                                                                                                                                                                                                                                            |
| `compute_pool`    | ❌        | Compute pool name to be used for models that require computational resources. If not specified, uses the default compute pool.                                                                                                                                                                                                                                |

## Security best practices

When configuring your project for production, it is strongly recommended to use environment variables to store sensitive information such as the authentication token:

<File name='profiles.yml'>

```yaml
your_profile_name:
  target: prod
  outputs:
    prod:
      type: deltastream
      token: "{{ env_var('DELTASTREAM_API_TOKEN') }}"
      database: "{{ env_var('DELTASTREAM_DATABASE') }}"
      schema: "{{ env_var('DELTASTREAM_SCHEMA') }}"
      organization_id: "{{ env_var('DELTASTREAM_ORG_ID') }}"
```

</File>

## Troubleshooting connections

If you encounter issues connecting to DeltaStream from dbt, verify the following:

### Authentication issues

- Ensure your API token is valid and has not expired
- Verify the token has appropriate permissions for the target organization
- Check that the `organization_id` matches your DeltaStream organization
