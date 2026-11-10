---
title: "About Lake Compute"
description: "About dbt Lake Compute."
id: lake-compute
slug: /docs/lake-compute
---

# About Lake Compute <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

Lake Compute is in active development and likely to change.

- Are you ready to get started? Fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform) to request access or ask for support in a specific region.
- Want to chat to see if Lake Compute is right for your team before signing up? Book a meeting with us to talk through how Lake Compute fits your use case. <a className="button button--primary" href="https://calendly.com/data-lakes-team/lake-compute-meeting?utm_source=docs&utm_medium=lake-compute" target="_blank" rel="noopener noreferrer">Book a meeting</a>


:::

Lake Compute is a hosted, serverless compute engine for running dbt models, powered by DuckDB and Apache Iceberg. It's designed to cut the cost of your dbt transformations while keeping one dbt project, one DAG, and one `ref` graph.

Lake Compute supports two execution models:

- **As a "sidecar" alongside your existing data warehouse, such as Snowflake or Databricks:**
 Start small by moving some models to Lake Compute and keeping the rest in your primary warehouse. You choose the execution engine model by model, and you can move more models over time.
- **As the primary compute adapter, along with an Iceberg catalog, such as Fivetran MDLS:** 
Adopt completely by running all of your models on Lake Compute.


Some workloads, such as those that use warehouse-native AI functions, may still belong on your primary warehouse. Refer to [Private beta limitations](#private-beta-limitations) for what Lake Compute doesn't support yet.

## Why use Lake Compute

Lower transformation costs, with flexibility. Move as many or as few models as you like to Lake Compute, and keep your warehouse available for anything that still needs it. Lake Compute always reads and writes data in the Iceberg table format, so it's easy to add other compute engines.

## Prerequisites

To set up Lake Compute, you need:

- Enrollment in the Lake Compute private beta. Request access with the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). The **Compute** tab doesn't appear on your MDLS destination until your account is enrolled.
- A Fivetran account. You can create a new Fivetran account, and use it indefinitely, since there is not yet billing for MDLS or Lake Compute; or trial full features (including connectors) for 14 days.
- An existing Fivetran Managed Data Lake Service (MDLS) destination — which includes an MDLS Iceberg catalog (Polaris) and an Amazon S3 storage bucket — already in a supported AWS region, or create a new one with a storage bucket in a supported AWS region. Lake Compute, your storage bucket, and (if using Lake Compute as "sidecar") your primary data must all be in the same region. Lake Compute currently supports AWS regions `us-east-1` and `us-west-2`. If you need a region that isn’t listed, complete the [sign-up form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform) to request it.
- Permission to configure the required cloud storage, catalog integration, warehouse access, authentication, and—where applicable—network policy allowlisting.

After you complete setup, you need a dbt project running on **dbt v2**. You also need time to identify suitable models, adapt SQL where necessary, and validate results.

### Supported warehouses

Snowflake is the only warehouse supported during private beta. Early Databricks support is available to a limited number of design partners. To evaluate Lake Compute with Databricks, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform) and name Databricks as your platform.

In "sidecar" execution, Lake Compute runs alongside your warehouse, reading from and writing/propagating back to the warehouse’s managed Iceberg catalog (Snowflake Horizon or Databricks Unity).

### Required permissions

Setup requires permissions to:

- Create a cloud storage bucket
- Create or configure the MDLS destination in your Fivetran account

Depending on your data warehouse, you may also need to:

- Establish the warehouse catalog integration, and grant catalog integration access to the user or role running dbt
- Configure key-pair or other required programmatic authentication
- Allow Lake Compute egress if your warehouse account enforces network policies

For Snowflake, some setup steps require `ACCOUNTADMIN` or equivalent delegated privileges, such as `NETWORK_ADMIN` for network policy changes. Always refer to the [latest setup guide](/docs/lake-compute/compute-onboarding), which may have changed since you initially set up Lake Compute.

### Required environment variable

dbt gates Lake Compute behind an experimental opt-in. dbt refuses to run any Lake Compute configuration unless you set:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

One variable gates every surface that selects an adapter:

| Gated | Notes |
|---|---|
| `type: lakecompute` in `profiles.yml` | Required for **both** the "sidecar" pattern and Lake Compute as your default adapter |
| The `adapter` config on a node | Applies to models, seeds, snapshots, analyses, functions, and data tests. dbt refuses **any** value while the gate is off, not just `lakecompute` |
| The `--adapter` command-line flag | — |

For the <Constant name="dbt_platform" />, set this as an environment variable on the environment. Refer to [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding#dbt-platform).

## Private beta limitations

The following are not supported or are intentionally limited during private beta:

- Projects running on dbt v1
- JDBC or ODBC access and direct BI tool connections.
- Role-based access control (RBAC) on Iceberg tables within MDLS written by Lake Compute.
- Warehouse-native AI SQL functions and other proprietary warehouse features.
- Automatic SQL dialect translation.
- Distributed or multi-node execution.
- Large two-sided joins and other workloads that require distributed processing.
- GCP and Azure storage.
- BigQuery integration.
- AWS regions other than the currently supported beta regions.

Additional capabilities and regions may be introduced over time, but roadmap items and dates are not commitments.

### Which dbt framework features does Lake Compute support during private beta?

You can:

- Build dbt models with simple materializations:
    - `table`, which is the default
    - `incremental`, with `incremental_strategy: append` or `insert_overwrite` (along with `partition_by`)
- Use `ephemeral` models
- Execute data tests, using Lake Compute, against models built with Lake Compute
- Preview with `dbt show`
    - `dbt show --select MODEL_NAME --adapter lakecompute`
    - `dbt show --inline SQL_QUERY --adapter lakecompute`

Not yet supported:

- `view` materialization
- Grants
- `persist_docs`
- Pre-hook / post-hook
- Unit tests

## Related docs

- [Lake Compute setup](/docs/lake-compute/compute-onboarding)
- [Lake Compute FAQs](/docs/lake-compute/compute-faq)
