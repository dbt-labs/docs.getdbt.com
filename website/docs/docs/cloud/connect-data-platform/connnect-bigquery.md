---
title: "Connect BigQuery"
id: connect-bigquery
description: "Configure BigQuery connection."
sidebar_label: "Connect BigQuery"
---
### JSON keyfile

:::info Uploading a service account JSON keyfile

While the fields in a BigQuery connection can be specified manually, we recommend uploading a service account <Term id="json" /> keyfile to quickly and accurately configure a connection to BigQuery.

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

### BigQuery OAuth
**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a BigQuery user without the configuration of BigQuery service account keyfile in dbt Cloud. For
more information on the initial configuration of a BigQuery OAuth connection in dbt Cloud, please see
[the docs on setting up BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth).

As an end user, if your organization has set up BigQuery OAuth, you can link a project with your personal BigQuery account in your personal Profile in dbt Cloud, like so:
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Link Button in dbt Cloud Credentials Screen" />

## Configuration

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [BigQuery-specific configuration](/reference/resource-configs/bigquery-configs).
