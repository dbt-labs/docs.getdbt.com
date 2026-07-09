---
title: "Secrets manager"
sidebar_label: "Secrets manager"
description: "Use the DuckDB Secrets Manager to manage cloud storage credentials, fetch them from context, and scope them by storage prefix."
---

Use the [DuckDB Secrets Manager](https://duckdb.org/docs/configuration/secrets_manager.html) to manage credentials for cloud storage. Configure the `secrets` field in your profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      extensions:
        - httpfs
        - parquet
      secrets:
        - type: s3
          region: my-aws-region
          key_id: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
  target: dev
```

### Fetch credentials from context

Instead of specifying credentials directly, you can use the `credential_chain` secret provider to use any supported AWS mechanism (for example, web identity tokens). Refer to the [DuckDB secret providers documentation](https://duckdb.org/docs/configuration/secrets_manager.html#secret-providers) for details.

```yml
secrets:
  - type: s3
    provider: credential_chain
```

### Scoped credentials by storage prefix

Secrets can be scoped so that different storage paths use different credentials:

```yml
secrets:
  - type: s3
    provider: credential_chain
    scope: [ "s3://bucket-in-eu-region", "s3://bucket-2-in-eu-region" ]
    region: "eu-central-1"
  - type: s3
    region: us-west-2
    scope: "s3://bucket-in-us-region"
```

When fetching a secret for a path, the secret scopes are compared to the path. In the case of multiple matching secrets, the longest prefix is chosen.
