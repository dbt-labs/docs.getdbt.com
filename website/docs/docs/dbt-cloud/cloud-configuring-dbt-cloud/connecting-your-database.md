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



<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" title="Configuring a Redshift connection"/>

### Connecting via an SSH Tunnel

To connect to a Postgres or Redshift instance via an SSH tunnel, check the "Use SSH Tunnel" option when creating your connection. When configuring the tunnel, you'll need to supply the hostname, username, and port for the bastion server.

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" title="A generated public key for a Redshift connection"/>

## Connecting to Snowflake

The following fields are required when creating a Snowflake connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Account | The Snowflake account to connect to | `db5261993`, `db5261993.east-us-2.azure` |
| Role | An optional field indicating what role should be assumed after connecting to Snowflake | `transformer` |
| Database | The logical database to connect to and run queries against. | `analytics` |
| Warehouse | The virtual warehouse to use for running queries. | `transforming` |

![Snowflake connection details](/img/docs/dbt-cloud/snowflake-conn-details.png)

### Username / Password

**Available in:** Development environments, Deployment environments

The `Username / Password` auth method is the simplest way to authenticate
Development or Deployment credentials in a dbt project. Simply enter your Snowflake
username (specifically, the `login_name`) and the corresponding user's Snowflake `password`
to authenticate dbt Cloud to run queries against Snowflake on behalf of a Snowflake user.

![Snowflake username/password auth](/img/docs/dbt-cloud/snowflake-userpass-auth.png)

### Key Pair
**Available in:** Development environments,  Deployment environments

The `Keypair` auth method uses Snowflake's [Key Pair Authentication](https://docs.snowflake.com/en/user-guide/python-connector-example.html#using-key-pair-authentication) to authenticate Development
or Deployment credentials for a dbt Cloud project.

After [generating an encrypted key pair](https://docs.snowflake.com/en/user-guide/python-connector-example.html#using-key-pair-authentication), be sure to set the `rsa_public_key` for the Snowflake user
to authenticate in dbt Cloud:

```sql
alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';
```

Finally, set the "Private Key" and "Private Key Passphrase" fields in the "Edit
Credentials" page to finish configuring dbt Cloud to authenticate with Snowflake
using a key pair.

**Note:** At the present time, dbt Cloud _must_ be provided with an encrypted
private key along with an encryption password. A future release of dbt Cloud
will remove this restriction, and passwordless private keys will be supported.

![Snowflake keypair auth](/img/docs/dbt-cloud/snowflake-keypair-auth.png)

### Snowflake OAuth
**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a Snowflake user without the configuration of Snowflake password in dbt Cloud. For
more information on configuring a Snowflake OAuth connection in dbt Cloud, please see
[the docs on setting up Snowflake OAuth](setting-up-enterprise-snowflake-oauth).

![Configuring Snowflake OAuth for a connection](/img/docs/dbt-cloud/dbt-cloud-enterprise/1bd0c42-Screen_Shot_2020-03-10_at_6.20.05_PM.png)

## Connecting to BigQuery

### JSON keyfile

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

### BigQuery OAuth
**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a BigQuery user without the configuration of BigQuery password in dbt Cloud. For
more information on the initial configuration of a BigQuery OAuth connection for an organization in dbt Cloud, please see
[the docs on setting up BigQuery OAuth](cloud-setting-up-bigquery-oauth).

As an end user, if your organization has set up BigQuery OAuth, you can link a project with your personal BigQuery account in your personal Profile in dbt Cloud, like so:

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Link Button in dbt Cloud Credentials Screen" />