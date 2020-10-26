---
title: "Connecting to Bigquery"
id: "connecting-to-bigquery"
sidebar_label: "BigQuery"
---

## Connecting to BigQuery

:::info Uploading a service account JSON keyfile

While the fields in a BigQuery connection can be specified manually, we recommend uploading a service account JSON keyfile to quickly and accurately configure a connection to BigQuery.

:::

Uploading a JSON keyfile should populate the following fields:
- Project id
- Private key id
- Private key
- Client email
- Client id
- Auth uri
- Token uri
- Auth provider x509 cert url
- Client x509 cert url

In addition to these fields, there are two other optional fields that can be configured in a BigQuery connection:

| Field | Description | Examples |
| ----- | ----------- | ------- |
| Timeout | Deprecated; exists for backwards compatibility with older versions of dbt and will be removed in the future. | `300` |
| Location | The [location](https://cloud.google.com/bigquery/docs/locations) where dbt should create datasets. | `US`, `EU` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/bigquery-connection.png" title="A valid BigQuery connection"/>
