---
title: "Onboarding to Lake Compute"
description: "Set up Fivetran MDLS, generate a Lake Compute token, and run dbt on Lake Compute with or without a data warehouse adapter."
id: compute-onboarding
---

# Onboarding to Lake Compute <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

To request access, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Lake Compute is in active development and likely to change. Breaking changes may occur, documentation may be incomplete, technical support may be limited, and no service-level agreement covers it during beta. Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations) before you plan real work around it.

:::

This page covers the setup that applies to every Lake Compute project, and how to run Lake Compute with no data warehouse adapter. If you want to run Lake Compute alongside a data warehouse, finish this page first, then follow the page for your warehouse.

## Choose how you will use Lake Compute

You can use Lake Compute in one of two ways:

- **As the only adapter:** Lake Compute is the default adapter, with Lake Compute for compute and Fivetran MDLS for storage. Every model runs on Lake Compute. Follow this page from start to finish.
- **As a "sidecar" for an existing data warehouse:** Lake Compute runs selected models and publishes the results back to the warehouse, which stays your default adapter. Complete [Set up MDLS](#set-up-mdls) and [Opt in to multi-adapter invocations](#opt-in-to-multi-adapter-invocations) on this page, then follow the warehouse-specific page:
  - [Lake Compute with Snowflake](/docs/lake-compute/compute-onboarding-snowflake)
  - [Lake Compute with BigQuery](/docs/lake-compute/compute-onboarding-bigquery)

## Set up MDLS

MDLS is Fivetran's managed data lake product, including a hosted Iceberg catalog and compute service (Lake Compute). To start using Lake Compute, you need a Fivetran account and an MDLS instance.

:::info BigQuery uses a GCS destination
The steps below create an MDLS destination on AWS S3, which is what Lake Compute with Snowflake and Lake Compute as the only adapter use. For BigQuery, create the destination on Google Cloud Storage (GCS) instead, as described in [Lake Compute with BigQuery](/docs/lake-compute/compute-onboarding-bigquery#before-you-start).
:::

### 1. Create a Fivetran account (if you don't already have one)

A Fivetran account itself is free to create and use indefinitely, even after any trial period ends, as long as you don't create connectors — billing only applies to connectors, and there is not yet any billing for MDLS or Lake Compute usage. If you also want to try connectors, you get a 14-day full-feature trial.

### 2. Create an MDLS destination (if you don't already have one) {#create-mdls-destination}

Follow the [Managed Data Lake Service setup guide for AWS](https://fivetran.com/docs/managed-data-lake-service/setup-guide#setupinstructionsforaws) on Fivetran's docs site.

:::info Things to watch for

- Provide an S3 bucket in the `us-east-1` region to reduce latency and egress costs.
- Make sure the bucket name and prefix don't contain any of these characters: `['#', '%', '^', '{', '}', '[', ']', '"', '?', '|', '', ' ']`.
- After you create the MDLS destination, Fivetran provides the required `External ID` (also known as `group_id`). Pass this along with Fivetran's AWS account (`834469178297`) to the IAM trust policy.

:::

### 3. Enable Lake Compute and generate a token

Before you enable Lake Compute, click **Save & Test** on your MDLS destination and confirm every test passes. Only enable Lake Compute and generate a token after the MDLS connection tests are all green. You don't need to generate a token as part of the MDLS connection setup itself.

On the destination page for your MDLS instance, go to the **Compute** tab and turn on **Enable Lake Compute**.

<Lightbox src="/img/docs/lake-compute/enable-lake-compute.png" title="Enable Lake Compute" width="80%" />

Then generate a token (user-scoped or service account). Save this token in a password manager, because you need it for your dbt connection profile.

<Lightbox src="/img/docs/lake-compute/generate-token.png" title="Generate a Lake Compute token" width="80%" />

## Opt in to multi-adapter invocations

Before you continue, update to the latest dbt client: `dbt system update --version VERSION`. Lake Compute support depends on a recent dbt v2 release.

dbt gates Lake Compute behind an experimental opt-in. Set this before you run anything, for **either** of the two patterns above:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

The variable gates `type: lakecompute` in `profiles.yml`, the `adapter` config on a node, and the `--adapter` flag. While it's off, dbt fails at parse time with a message naming the variable rather than falling back to your default adapter, and `DBT_ALLOW_EXPERIMENTAL_ADAPTERS` won't substitute for it. Refer to [Required environment variable](/docs/lake-compute#required-environment-variable) for the full behavior.

Add it to your terminal profile so it persists across sessions.

## Use Lake Compute as your only adapter

In this pattern, your entire project runs on Lake Compute, and Lake Compute materializes every model as an Iceberg table in your MDLS catalog instance.

### Set up your connection profile

Replace `MDLS_INSTANCE_NAME` with your MDLS instance name, `SCHEMA_NAME` with the schema dbt writes to, and `LAKE_COMPUTE_TOKEN` with the token you generated in step 3:

```yaml
# new spec
my_profile:
  target: default
  outputs:
    default:
      - name: lakecompute
        type: lakecompute
        method: fivetran
        fivetran_credential: LAKE_COMPUTE_TOKEN
        # database + schema are required when lakecompute is default
        database: MDLS_INSTANCE_NAME
        schema: SCHEMA_NAME
```

This means:

- **Every model in the project is configured `compute: 'lakecompute'` by default.**
- Every model also gets `materialized: table` and `table_format: 'iceberg'` as defaults.

### Verify your setup

Run `dbt debug` to confirm your profile is configured correctly. Normally, `debug` just makes sure that you can connect to your data platform, but for Lake Compute it is more involved, with the goal of giving you actionable feedback should something be misconfigured. A failure can indicate potential issues with credentials, a malformed profile, or a missing `database`/`schema`.

At a high level, `dbt debug`:

1. Parses `profiles.yml` and `dbt_project.yml`.
2. Tests authentication against every configured adapter in the output, including `lakecompute`, with both a write test and a read-back test.

When you use Lake Compute alongside a warehouse, `dbt debug` also tests that tables written to MDLS propagate to the warehouse. Refer to the page for your warehouse for details.

### Configure models to run on Lake Compute

All your models run on Lake Compute by default and write to Iceberg tables in MDLS. Also check for existing `materialized: view` configs — Lake Compute doesn't support views (refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations)), so switch any views to `table` or `ephemeral` before converting a project over.

For an existing project, convert models over in steps rather than all at once:

1. Identify the model you want to run on Lake Compute and its direct upstream dependencies.
2. Add `{{ config(materialized='table', table_format='iceberg') }}` to the target model and its upstream dependencies. Run the project and verify it works. Any runtime errors at this stage are due to Iceberg and warehouse type incompatibilities and require casting.
3. On the target model, add `{{ config(adapter='lakecompute') }}` and look for any warehouse-specific functions. If you find any, rewrite the query using the corresponding DuckDB function. Run the project again to verify.

## Set up Lake Compute in the dbt platform {#dbt-platform}

As a temporary workaround during private beta, you can set Lake Compute configurations in the <Constant name="dbt_platform" /> using [Extended Attributes](/docs/dbt-platform-environments#extended-attributes), by adding a key named `lakecompute`:

```yaml
lakecompute:
  method: fivetran
  fivetran_credential: "{{ env_var('DBT_ENV_SECRET_LAKE_COMPUTE_TOKEN') }}"
```

:::caution Don't put your token in Extended Attributes
Extended Attributes aren't a safe place for secrets, so never paste the token itself into this field. Reference it with `env_var()`, as shown above, and store the token in a [secret environment variable](/docs/build/environment-variables#handling-secrets) instead.
:::

Then, in your environment variables, set:

- `DBT_ALLOW_EXPERIMENTAL_ADAPTERS`: `true`
- `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER`: `true`
- `DBT_ENV_SECRET_LAKE_COMPUTE_TOKEN`: the token you generated in step 3

This differs from running locally, where you set both `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER` and `DBT_ALLOW_EXPERIMENTAL_ADAPTERS`. Refer to [Required environment variable](/docs/lake-compute#required-environment-variable).

## Next steps

- [Lake Compute with Snowflake](/docs/lake-compute/compute-onboarding-snowflake)
- [Lake Compute with BigQuery](/docs/lake-compute/compute-onboarding-bigquery)
- [Lake Compute FAQs](/docs/lake-compute/compute-faq)
