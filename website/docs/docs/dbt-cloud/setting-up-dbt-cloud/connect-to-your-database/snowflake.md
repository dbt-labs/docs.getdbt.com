---
title: "Connecting to Snowflake"
id: "connecting-to-snowflake"
sidebar_label: "Snowflake"
---

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

### OAuth
**Available in:** Development environments, Enterprise plans only

The OAuth auth method permits dbt Cloud to run development queries on behalf of
a Snowflake user without the configuration of Snowflake password in dbt Cloud. For
more information on configuring a Snowflake OAuth connection in dbt Cloud, please see
[the docs on setting up Snowflake OAuth](setting-up-enterprise-snowflake-oauth).

![Configuring Snowflake OAuth for a connection](/img/docs/dbt-cloud/dbt-cloud-enterprise/1bd0c42-Screen_Shot_2020-03-10_at_6.20.05_PM.png)
