---
title: "Connecting your database"
id: "connecting-your-database"
---

## Connecting to Redshift and Postgres

The following fields are required when creating a Redshift connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Postgres or Redshift database to connect to. This can either be a hostname an IP address. | `xxx.us-east-1.amazonaws.com` |
| Port | Usually 5432 (Postgres) or 5439 (Redshift) | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/e180a10-Screen_Shot_2019-11-18_at_9.44.44_PM.png" title="Configuring a Redshift connection"/>

### Connecting via an SSH Tunnel

To connect to a Postgres or Redshift instance via an SSH tunnel, check the "Use SSH Tunnel" option when creating your connection. When configuring the tunnel, you'll need to supply the hostname, username, and port for the bastion server. 

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/3f25478-Screen_Shot_2019-11-18_at_9.43.32_PM.png" title="A generated public key for a Postgres connection"/>

## Connecting to Snowflake

The following fields are required when creating a Snowflake connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Account | The Snowflake account to connect to | `db5261993`, `db5261993.us-east-1` |
| Role | An optional field indicating what role should be assumed after connecting to Snowflake | `transformer` |
| Database | The logical database to connect to and run queries against. | `analytics` |
| Warehouse | The virtual warehouse to use for running queries. | `transforming` |



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/4483b17-Screen_Shot_2019-11-18_at_9.46.47_PM.png" title="A configured Snowflake connection"/>

## Connecting to BigQuery

<Callout type="info" title="Uploading a service account JSON keyfile">

While the fields in a BigQuery connection can be specified manually, we recommend uploading a service account JSON keyfile to quickly and accurately configure a connection to BigQuery.

</Callout>

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



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/14dba0a-Screen_Shot_2019-11-18_at_9.49.03_PM.png" title="A valid BigQuery connection"/>
