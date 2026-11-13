---
title: "Lake Compute with Snowflake"
description: "Configure Snowflake, your connection profile, and your models to run Lake Compute as a sidecar alongside Snowflake."
id: compute-onboarding-snowflake
sidebar_label: "Lake Compute with Snowflake"
---

# Lake Compute with Snowflake <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

To request access, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations) before you plan real work around it.

:::

This page sets up Lake Compute as a "sidecar" for Snowflake. Lake Compute reads upstream models out of Snowflake's managed Iceberg catalog, Snowflake Horizon, runs selected models, and propagates the results back to Horizon so downstream Snowflake models can `ref` them.

## Before you start

Complete these steps in [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding):

1. [Set up MDLS](/docs/lake-compute/compute-onboarding#set-up-mdls), enable Lake Compute, and generate a token.
2. [Opt in to multi-adapter invocations](/docs/lake-compute/compute-onboarding#opt-in-to-multi-adapter-invocations).

## Configure Snowflake

These steps require `ACCOUNTADMIN` permissions.

### Supported authentication methods

Lake Compute supports the following authentication methods:
- `sso` (with `authenticator: externalbrowser` for local development)
- `keypair` (with `private_key`)
- `self_signed_jwt`
- `workload_identity`

These are the only methods currently supported. The following authentication methods can create a Snowflake PAT, but Lake Compute doesn't support them yet — coming soon:
- `user`/`password`
- `user`/`password` with MFA
- OAuth

Lake Compute uses your Snowflake connection profile to generate a token that can access Iceberg tables in Snowflake Horizon. This token has the exact same access as the user/role specified in your Snowflake connection profile. By default, this is a [personal access token (PAT)](https://docs.snowflake.com/en/user-guide/programmatic-access-tokens) that lasts for 1 month; you can configure a different `pat_duration` if required by your organization's security policies.

To use keypair authentication, follow Snowflake's guide to [key-pair authentication and key-pair rotation](https://docs.snowflake.com/en/user-guide/key-pair-auth) to create a Privacy Enhanced Mail (PEM) private-public key pair for your user, then set the public key on the user:

```sql
ALTER USER USER_NAME SET RSA_PUBLIC_KEY='PUBLIC_KEY_BODY';
```

Replace `USER_NAME` with the Snowflake user dbt connects as, and `PUBLIC_KEY_BODY` with the body of the public key you generated. Save the private key somewhere so you can specify it in your `profiles.yml` later.

Lake Compute connects to Snowflake in one of two ways:

- **Option 1 (PAT)** — compatible with any of the methods above. Lake Compute creates a Snowflake personal access token (PAT) using your connection profile, which requires a network policy (refer to [Allow Lake Compute's egress through a network policy](#allow-lake-computes-egress-through-a-network-policy-pat-only)).
- **Option 2 (JWT)** — compatible with `keypair` (private key) authentication. Lake Compute authenticates directly with a JWT instead of creating a PAT, so you don't need a network policy.

`self_signed_jwt` looks similar to `keypair` by name, but it still creates a PAT under the hood — it just caches that PAT locally so it can be reused across runs. It follows Option 1, not Option 2, and still needs a network policy.

### Create a Snowflake catalog integration for MDLS

Create a catalog integration in Snowflake, using the pre-generated SQL in the Fivetran UI under **Catalog integration > Snowflake**. Make the following changes to that SQL:

| Old value | New value |
|-----------|-----------|
| `OAUTH_CLIENT_ID` / `OAUTH_CLIENT_SECRET` | Enter your existing credentials, or click **Regenerate client secret** if you've forgotten them. |

Lake Compute uses the MDLS catalog integration to propagate Iceberg table metadata from MDLS to Snowflake after building each model. Therefore, you need to `grant usage on integration CATALOG_INTEGRATION_NAME to role ROLE_NAME` for all roles that are running dbt with Lake Compute.

### Allow Lake Compute's egress through a network policy (PAT only)

:::info This section applies to Option 1 (PAT) only

Snowflake requires a network policy to be in effect before it creates a PAT, even if your account doesn't otherwise enforce one. If you're using Option 2 (`keypair` JWT authentication), Lake Compute never creates a PAT, and you can **skip this section entirely.**

:::

First, check whether your account or your user already has a network policy assigned:

```sql
SHOW PARAMETERS LIKE 'NETWORK_POLICY' IN ACCOUNT;
SHOW PARAMETERS LIKE 'NETWORK_POLICY' IN USER USER_NAME;
```

- **If neither returns a policy:** Snowflake doesn't restrict egress by default, and no further action is needed — skip the rest of this section.
- **If either returns a policy:** continue below. In Snowflake, a network policy attached to a user *replaces* the account-level policy for that user rather than supplementing it, so your existing policy already accounts for your own IP or VPN range — you only need to add Lake Compute's egress IPs to it.

1. Create a network rule with Lake Compute's egress IPs:

```sql
CREATE NETWORK RULE lakecompute_ipv4
  TYPE = IPV4
  MODE = INGRESS
  VALUE_LIST = (
    '34.85.252.27/32',
    '35.197.105.90/32',
    '3.239.194.48/29', -- AWS us-east-1
    '35.80.36.104/29' -- AWS us-west-2
  );
```

2. Add `lakecompute_ipv4` to your existing policy's allowed rule list. `ALTER NETWORK POLICY ... SET ALLOWED_NETWORK_RULE_LIST` replaces the entire list, so include your existing rule(s) as well as the new one. Replace `EXISTING_POLICY_NAME` with your account's or user's existing policy, and `EXISTING_RULE_NAME` with the rule(s) already on that policy (check with `DESC NETWORK POLICY EXISTING_POLICY_NAME;`):

```sql
ALTER NETWORK POLICY EXISTING_POLICY_NAME SET ALLOWED_NETWORK_RULE_LIST = (
  'EXISTING_RULE_NAME',
  'lakecompute_ipv4'
);
```

:::note

Only security administrators (that is, users with the `SECURITYADMIN` role) or higher, or a role with the global `CREATE NETWORK POLICY` privilege, can create network rules or modify network policies.

:::

Some accounts also restrict which authentication methods a user or account can use. If your account blocks PAT authentication, you need an [authentication policy](https://docs.snowflake.com/en/sql-reference/sql/create-authentication-policy) that explicitly permits it before Snowflake creates a PAT for Lake Compute.

## Set up your connection profile

### Local `profiles.yml`

Replace `YOUR_ACCOUNT` with your Snowflake account identifier, `DATABASE_NAME` and `SCHEMA_NAME` with the database and schema dbt writes to, and `LAKE_COMPUTE_TOKEN` with the token you generated when you set up MDLS:

```yaml
my_profile:
  target: default
  outputs:
    default:
      - name: snowflake
        type: snowflake
        default: true
        account: YOUR_ACCOUNT
        database: DATABASE_NAME
        schema: SCHEMA_NAME
        ...
      - name: lakecompute
        type: lakecompute
        method: fivetran
        fivetran_credential: LAKE_COMPUTE_TOKEN
        # database + schema are inherited from default adapter config 
```

With this profile, Lake Compute:

- Uses the default Snowflake adapter config to create a PAT to Snowflake's managed catalog, Horizon
- Reads all upstream Iceberg tables from the Horizon catalog
- Writes models as Iceberg tables to MDLS, and propagates them to the Horizon catalog, using the `database` and `schema` from the default Snowflake adapter config as the default write location

### dbt platform

Set the `lakecompute` Extended Attributes key and the environment variables described in [Set up Lake Compute in the dbt platform](/docs/lake-compute/compute-onboarding#dbt-platform).

## Verify your setup

Run `dbt debug` to confirm your profile is configured correctly. A failure can indicate potential issues with credentials, a malformed profile, a missing `database`/`schema`, or a network policy blocking egress (refer to [Allow Lake Compute's egress through a network policy](#allow-lake-computes-egress-through-a-network-policy-pat-only)).

At a high level, `dbt debug`:

1. Parses `profiles.yml` and `dbt_project.yml`.
2. Tests authentication against every configured adapter in the output, including `lakecompute`, with both a write test and a read-back test.
3. Tests propagation: that a table written to MDLS has a corresponding table created on the Horizon catalog, so that downstream Snowflake nodes can `ref` it.

## Configure models to run on Lake Compute

Given a dbt DAG of `model_a -> model_b -> model_c`, you can configure:

- `model_a` to run on Snowflake and materialize an Iceberg table in Snowflake Horizon, using Snowflake-managed storage
- `model_b` to run on Lake Compute
- `model_c` to run on Snowflake

```sql
-- models/model_a.sql
{{ config(
    table_format = 'iceberg',
    materialized = 'table'
) }}

select 1 as id
```

```sql
-- models/model_b.sql
{{ config(
    adapter = 'lakecompute'
) }}

select * from {{ ref('model_a') }}
```

```sql
-- models/model_c.sql
select * from {{ ref('model_b') }}
```

A Lake Compute model is DuckDB SQL. If `model_b` uses Snowflake-specific functions, rewrite them using the corresponding DuckDB functions.

## Related docs

- [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding)
- [Lake Compute with BigQuery](/docs/lake-compute/compute-onboarding-bigquery)
- [Lake Compute FAQs](/docs/lake-compute/compute-faq)
