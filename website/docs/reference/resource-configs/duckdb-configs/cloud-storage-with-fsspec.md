---
title: "Cloud storage with fsspec"
sidebar_label: "Cloud storage with fsspec"
description: "Configure DuckDB filesystems through fsspec to connect to cloud storage such as S3, GCS, and Azure Blob Storage."
---

In `dbt-duckdb 1.4.1` and later, you can experimentally use DuckDB filesystems implemented via [fsspec](https://duckdb.org/docs/guides/python/filesystems.html). The `fsspec` library supports [a variety of cloud data storage systems](https://filesystem-spec.readthedocs.io/en/latest/api.html#other-known-implementations), including S3, GCS, and Azure Blob Storage.

To use an `fsspec` implementation, install the relevant Python modules and configure `filesystems` in your profile:

```yml
default:
  outputs:
    dev:
      type: duckdb
      path: /tmp/dbt.duckdb
      filesystems:
        - fs: s3
          anon: false
          key: "{{ env_var('S3_ACCESS_KEY_ID') }}"
          secret: "{{ env_var('S3_SECRET_ACCESS_KEY') }}"
          client_kwargs:
            endpoint_url: "http://localhost:4566"
  target: dev
```

Each entry must include an `fs` property that identifies the `fsspec` protocol to load (`s3`, `gcs`, `abfs`, etc.) and can include additional key-value pairs to configure that implementation.
