---
title: "Connect Snowflake"
id: connect-snowflake
description: "Configure Snowflake connection."
sidebar_label: "Connect Snowflake"
---

The following fields are required when creating a Snowflake connection

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Account | The Snowflake account to connect to. Take a look [here](/docs/core/connect-data-platform/snowflake-setup#account) to determine what the account field should look like based on your region.| <Snippet path="snowflake-acct-name" /> |
| Role | A mandatory field indicating what role should be assumed after connecting to Snowflake | `transformer` |
| Database | The logical database to connect to and run queries against. | `analytics` |
| Warehouse | The virtual warehouse to use for running queries. | `transforming` |


**Note:** A crucial part of working with dbt atop Snowflake is ensuring that users (in development environments) and/or service accounts (in deployment to production environments) have the correct permissions to take actions on Snowflake! Here is documentation of some [example permissions to configure Snowflake access](/reference/database-permissions/snowflake-permissions).

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
more information on configuring a Snowflake OAuth connection in dbt Cloud, please see [the docs on setting up Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth).
<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/database-connection-snowflake-oauth.png" title="Configuring Snowflake OAuth connection"/>

## Configuration

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Snowflake-specific configuration](/reference/resource-configs/snowflake-configs).
