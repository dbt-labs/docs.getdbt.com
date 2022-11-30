---
title: "Connect your database"
id: "connect-your-database"
---

You can connect to your database in dbt Cloud by clicking the gear  in the top right and then selecting **Account Settings**. From the Account Settings page, click **+ New Project**.

## IP Restrictions

dbt Cloud will always connect to your data platform from the IP addresses specified in the [Regions](/docs/deploy/regions) page.

Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

<Changelog>

- November 2020 &mdash; add the IPs `54.81.134.249` and `52.22.161.231`
- September 2022 &mdash; Add EMEA IPs

</Changelog>

Allowing these IP addresses only enables the connection to your <Term id="data-warehouse" />. However, you might want to send API requests from your restricted network to the dbt Cloud API.  For example, you could use the API to send a POST request that [triggers a job to run](https://docs.getdbt.com/dbt-cloud/api-v2#operation/triggerRun). Using the dbt Cloud API requires that you allow the `cloud.getdbt.com` subdomain. For more on the dbt Cloud architecture, see [Deployment architecture](/docs/deploy/architecture).


## Connecting to Postgres, Redshift, and AlloyDB

The following fields are required when creating a Postgres, Redshift, or AlloyDB connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Postgres, Redshift, or AlloyDB database to connect to. This can either be a hostname or an IP address. | `xxx.us-east-1.amazonaws.com` |
| Port | Usually 5432 (Postgres) or 5439 (Redshift) | `5439` |
| Database | The logical database to connect to and run queries against. | `analytics` |

**Note**: When you set up a Redshift or Postgres connection in dbt Cloud, SSL-related parameters aren't available as inputs.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-connection.png" title="Configuring a Redshift connection"/>

### Connecting via an SSH Tunnel

To connect to a Postgres, Redshift, or AlloyDB instance via an SSH tunnel, select the **Use SSH Tunnel** option when creating your connection. When configuring the tunnel, you must supply the hostname, username, and port for the bastion server.

Once the connection is saved, a public key will be generated and displayed for the Connection. You can copy this public key to the bastion server to authorize dbt Cloud to connect to your database via the bastion server.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/postgres-redshift-ssh-tunnel.png" title="A generated public key for a Redshift connection"/>

## Connecting to Snowflake

The following fields are required when creating a Snowflake connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Account | The Snowflake account to connect to. Take a look [here](/reference/warehouse-setups/snowflake-setup#account) to determine what the account field should look like based on your region.| <Snippet src="snowflake-acct-name" /> |
| Role | A mandatory field indicating what role should be assumed after connecting to Snowflake | `transformer` |
| Database | The logical database to connect to and run queries against. | `analytics` |
| Warehouse | The virtual warehouse to use for running queries. | `transforming` |


**Note:** A crucial part of working with dbt atop Snowflake is ensuring that users (in development environments) and/or service accounts (in deployment to production environments) have the correct permissions to take actions on Snowflake! Here is documentation of some [example permissions to configure Snowflake access](snowflake-permissions).

### Username / Password

**Available in:** Development environments, Deployment environments

The `Username / Password` auth method is the simplest way to authenticate
Development or Deployment credentials in a dbt project. Simply enter your Snowflake
username (specifically, the `login_name`) and the corresponding user's Snowflake `password`
to authenticate dbt Cloud to run queries against Snowflake on behalf of a Snowflake user.

**Note**: The schema field in the **Developer Credentials** section is a required field.
<Lightbox src="/img/docs/dbt-cloud/snowflake-userpass-auth.png" title="Snowflake username/password authentication"/>

### Key Pair
**Available in:** Development environments,  Deployment environments

The `Keypair` auth method uses Snowflake's [Key Pair Authentication](https://docs.snowflake.com/en/user-guide/python-connector-example.html#using-key-pair-authentication) to authenticate Development or Deployment credentials for a dbt Cloud project.

After [generating an encrypted key pair](https://docs.snowflake.com/en/user-guide/key-pair-auth.html#configuring-key-pair-authentication), be sure to set the `rsa_public_key` for the Snowflake user to authenticate in dbt Cloud:

```sql
alter user jsmith set rsa_public_key='MIIBIjANBgkqh...';
```

Finally, set the "Private Key" and "Private Key Passphrase" fields in the "Edit
Credentials" page to finish configuring dbt Cloud to authenticate with Snowflake
using a key pair.

**Note:** At this time ONLY Encrypted Private Keys are supported by dbt Cloud, and the keys must be of size 4096 or smaller.

In order to successfully fill in the Private Key field, you **must** include the commented lines below when you add the passphrase. Leaving the `PRIVATE KEY PASSPHRASE` field empty will return an error - have a look at the examples below:

**Example:**
```sql
-----BEGIN ENCRYPTED PRIVATE KEY-----
< encrypted private key contents here >
-----END ENCRYPTED PRIVATE KEY-----
```
<Lightbox src="/img/docs/dbt-cloud/snowflake-keypair-auth.png" title="Snowflake keypair authentication"/>

### Snowflake OAuth

**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a Snowflake user without the configuration of Snowflake password in dbt Cloud. For
more information on configuring a Snowflake OAuth connection in dbt Cloud, please see [the docs on setting up Snowflake OAuth](/docs/collaborate/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" title="Configuring Snowflake OAuth connection"/>

## Connecting to BigQuery

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
[the docs on setting up BigQuery OAuth](/docs/collaborate/manage-access/set-up-bigquery-oauth).

As an end user, if your organization has set up BigQuery OAuth, you can link a project with your personal BigQuery account in your personal Profile in dbt Cloud, like so:
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/gsuite/bq_oauth/bq_oauth_as_user.gif" title="Link Button in dbt Cloud Credentials Screen" />

## Connecting to Databricks
You can connect to Databricks by using one of two supported adapters: [dbt-databricks](/connect-your-database#dbt-databricks) and [dbt-spark](/connect-your-database#dbt-spark). For accounts on dbt 1.0 or later, we recommend using the dbt-databricks adapter. The dbt-databricks adapter is maintained by the Databricks team and is verified by dbt Labs. The Databricks team is committed to supporting and improving the adapter over time, so you can be sure the integrated experience will provide the best of dbt and the best of Databricks. Connecting to Databricks via dbt-spark will be deprecated in the future.

### dbt-databricks Adapter
dbt-databricks is compatible with the following versions of dbt Core in dbt Cloud with varying degrees of functionality.

| Feature | dbt Versions |
| ----- | ----------- | 
| dbt-databricks | Available starting with dbt 1.0 in dbt Cloud|
| Unity Catalog | Available starting with dbt 1.1 | 
| Python models | Available starting with dbt 1.3 |

The dbt-databricks adapter offers:
- **Easier set up**
- **Better defaults:**
The dbt-databricks adapter is more opinionated, guiding users to an improved experience with less effort. Design choices of this adapter include defaulting to Delta format, using merge for incremental models, and running expensive queries with Photon.
- **Support for Unity Catalog:**
Unity Catalog allows Databricks users to centrally manage all data assets, simplifying access management and improving search and query performance. Databricks users can now get three-part data hierarchies – catalog, schema, model name – which solves a longstanding friction point in data organization and governance.


To set up the Databricks connection, supply the following fields:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Server Hostname | The hostname of the Databricks account to connect to | dbc-a2c61234-1234.cloud.databricks.com |
| HTTP Path | The HTTP path of the Databricks cluster or SQL warehouse | /sql/1.0/warehouses/1a23b4596cd7e8fg |
| Catalog | Name of Databricks Catalog (optional) | Production |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dbt-databricks.png" title="Configuring a Databricks connection using the dbt-databricks adapter"/>

### dbt-spark Adapter

dbt Cloud supports connecting to Databricks using
[a Cluster](https://docs.databricks.com/clusters/index.html) or
[a SQL Warehouse (formerly called SQL endpoints)](https://docs.databricks.com/sql/admin/sql-endpoints.html).
Depending on how you connect to Databricks, either one of the `Cluster` or
`Endpoint` configurations must be provided, but setting _both_ values is not
allowed.

The following fields are available when creating a Databricks connection:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Hostname | The hostname of the Databricks account to connect to | dbc-a2c61234-1234.cloud.databricks.com |
| Port | The port to connect to Databricks for this connection | 443 |
| Organization | Optional (default: 0) | 1123456677899012 |
| Cluster | The ID of the cluster to connect to (required if using a cluster) | 1234-567890-abc12345 |
| Endpoint | The ID of the endpoint to connect to (required if using Databricks SQL) | 1a23b4596cd7e8fg |
| User | Optional | dbt_cloud_user |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dbt-spark.png" title="Configuring a Databricks connection using the dbt-spark adapter"/>

## Connecting to Apache Spark

### HTTP and Thrift

dbt Cloud supports connecting to an Apache Spark cluster using the HTTP method
or the Thrift method. Note: While the HTTP method can be used to connect to
an all-purpose Databricks cluster, the ODBC method is recommended for all
Databricks connections. For further details on configuring these connection
parameters, please see the [dbt-spark documentation](https://github.com/dbt-labs/dbt-spark#configuring-your-profile)

The following fields are available when creating an Apache Spark connection using the
HTTP and Thrift connection methods:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Spark cluster to connect to | `yourorg.sparkhost.com` |
| Port | The port to connect to Spark on | 443 |
| Organization | Optional (default: 0) | 0123456789 |
| Cluster | The ID of the cluster to connect to | 1234-567890-abc12345 |
| Connection Timeout | Number of seconds after which to timeout a connection | 10 |
| Connection Retries | Number of times to attempt connecting to cluster before failing | 10 |
| User | Optional | dbt_cloud_user |
| Auth | Optional, supply if using Kerberos | `KERBEROS` |
| Kerberos Service Name | Optional, supply if using Kerberos | `hive` |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/spark-connection.png" title="Configuring a Spark connection"/>
