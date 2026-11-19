---
title: "Lake Compute with Databricks"
description: "Set up Unity Catalog, an External Location, and your dbt profile to run selected models on Lake Compute while the rest stay on Databricks."
id: compute-onboarding-databricks
sidebar_label: "Lake Compute with Databricks"
---

# Lake Compute with Databricks <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

To request access, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations) before you plan real work around it.

:::

This page sets up a dbt project on Lake Compute with Databricks Unity Catalog as the warehouse. Lake Compute writes each model to the lake and publishes it into a Unity Catalog catalog and schema, where Databricks models downstream of it read it like any other table.

## Before you start

Complete these steps in [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding):

1. [Set up MDLS](/docs/lake-compute/compute-onboarding#set-up-mdls) on AWS S3, enable Lake Compute, and generate a token.
2. [Opt in to multi-adapter invocations](/docs/lake-compute/compute-onboarding#opt-in-to-multi-adapter-invocations).
3. If your token came from a non-production deployment, [set the two endpoints for that deployment](/docs/lake-compute/compute-onboarding#non-production-deployment).

Then complete the Databricks-specific prerequisites below.

### 1. An AWS Databricks workspace with Unity Catalog

These instructions are written for an AWS Databricks workspace. The optional catalog entry in [Step 2](#step-2-add-a-unity-catalog-entry-if-lake-compute-models-read-databricks-tables) accepts only hosts ending in `.cloud.databricks.com`, so it doesn't work for GCP or Azure workspaces.

You need four values:

- The workspace host from your browser's address bar
- A SQL warehouse HTTP path, from **SQL Warehouses** > **Connection details**
- The catalog to publish into
- The schema to publish into

Use lowercase names, because Lake Compute lowercases Databricks relation names.

Create the catalog and the schema before the first run, from the workspace or any SQL client on the warehouse:

```sql
CREATE CATALOG IF NOT EXISTS CATALOG;
CREATE SCHEMA IF NOT EXISTS CATALOG.SCHEMA;
```

Turn on **External data access** for the metastore if it's off: in Catalog Explorer, click the gear icon, then the metastore, then **Details**. `GET /api/2.1/unity-catalog/metastore_summary` reports `"external_access_enabled": true` when it's on.

### 2. An External Location over the folder Lake Compute writes

Lake Compute writes every model into the destination's own storage, at `DESTINATION_BUCKET/lake_compute_staging/CATALOG_SCHEMA/MODEL_NAME`. The bucket isn't shown in the Fivetran dashboard. If you don't know it, do the first run in [Step 3](#step-3-run-a-model-on-lake-compute) and read the path from the publication error, which quotes it in full. Then come back here.

Create a storage credential for the bucket, then an External Location over `DESTINATION_BUCKET/lake_compute_staging/CATALOG_SCHEMA`, the folder holding all of this project's tables.

Doing this from scratch needs an administrator for the bucket's IAM role. If you aren't that administrator and there's no time to wait for one, you can name an existing storage credential that already reaches the bucket in the External Location as-is.

The credential needs an AWS Identity and Access Management (IAM) role that can read and write the bucket. Databricks assumes that role through its trust policy, which has to name Databricks' Unity Catalog master role and the metastore's external ID. Both come from the credential itself. Open it in Catalog Explorer under **External Data** > **Credentials**, or call `GET /api/2.1/unity-catalog/storage-credentials/NAME` and read `aws_iam_role`.

```json
{
  "Effect": "Allow",
  "Principal": {
    "AWS": [
      "UNITY_CATALOG_IAM_ARN",
      "BUCKET_ROLE_ARN"
    ]
  },
  "Action": "sts:AssumeRole",
  "Condition": { "StringEquals": { "sts:ExternalId": "EXTERNAL_ID" } }
}
```

Add this statement to the role's existing trust statements rather than replacing them. Whoever administers the bucket role applies the policy. Then create the location in Catalog Explorer under **External Data** > **External Locations**, choose **Manual**, and enter the URL and the credential.

If External Locations are an administrator's job in your organization, ask for one over `DESTINATION_BUCKET/lake_compute_staging/CATALOG_SCHEMA` before you start.

### 3. Privileges for the publishing identity

Publication runs as the credential in your profile: an OAuth machine-to-machine (M2M) service principal, or a personal access token (PAT) that has both the `sql` scope, which dbt uses for the warehouse, and the `unity-catalog` scope, which publication uses.

`PRINCIPAL` is the Databricks identity that credential belongs to: your own account for a PAT, or the service principal's application ID. `GET /api/2.0/preview/scim/v2/Me` reports which identity a token resolves to.

Grant it the following, replacing the names:

```sql
GRANT USE CATALOG ON CATALOG CATALOG TO `PRINCIPAL`;
GRANT USE SCHEMA, CREATE TABLE, MODIFY, SELECT, EXTERNAL USE SCHEMA
  ON SCHEMA CATALOG.SCHEMA TO `PRINCIPAL`;

GRANT CREATE EXTERNAL TABLE, EXTERNAL USE LOCATION, READ FILES, WRITE FILES, BROWSE
  ON EXTERNAL LOCATION `LOCATION_NAME` TO `PRINCIPAL`;
```

If you create the External Location yourself, the same identity also needs `CREATE EXTERNAL LOCATION` on the storage credential and `CREATE EXTERNAL LOCATION` at the metastore level. Grant the first in Catalog Explorer under **External Data** > **Credentials**. If you hold neither, have an administrator create the location.

Don't rely on owning the schema or the External Location to cover `EXTERNAL USE SCHEMA` and `EXTERNAL USE LOCATION`. Grant both.

### 4. A dbt build that supports Lake Compute publication to Databricks

Update dbt and check the version:

```bash
dbt system update
dbt --version
```

`dbt system update` installs the current stable release. Databricks publication and Databricks reads are both listed from release `2.0.7` in the changelog, so check that `dbt --version` reports that release or later.

## Step 1: Configure the profile

The profile reads three environment variables, so export them first:

```bash
export DATABRICKS_HOST=https://dbc-abc123.cloud.databricks.com
export DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/0123456789abcdef
export DATABRICKS_TOKEN=...
```

If you have no token yet, create one under **Settings** > **Developer** > **Access tokens**, with the `sql` and `unity-catalog` scopes. For a service principal, create an OAuth M2M credential in the account console and use its client ID and secret instead.

Databricks stays the default adapter, and the Lake Compute output publishes into the same catalog and schema. Add this to `profiles.yml`, at `~/.dbt/profiles.yml` or in a directory you pass with `--profiles-dir`:

```yaml
profile_name:
  target: prod
  outputs:
    prod:
      - type: databricks
        default: true
        host: "{{ env_var('DATABRICKS_HOST') }}"
        http_path: "{{ env_var('DATABRICKS_HTTP_PATH') }}"
        token: "{{ env_var('DATABRICKS_TOKEN') }}"
        database: CATALOG
        schema: SCHEMA
        threads: 4

      - type: lakecompute
        method: fivetran
        fivetran_credential: "{{ env_var('LAKE_COMPUTE_TOKEN') }}"
        database: CATALOG
        schema: SCHEMA
```

- `database` and `schema` on the `lakecompute` output are the Unity Catalog catalog and schema that Lake Compute publishes into. Set them to the same values as the `databricks` output, in lowercase and unquoted.
- Set `threads` on the `databricks` output only. A `threads` setting on the `lakecompute` output is ignored, with a warning.
- Databricks publication doesn't support quoted identifiers. A top-level `quoting:` block doesn't reach Lake Compute, because it applies to the default adapter only.
- Publish into a Unity Catalog catalog. `hive_metastore` isn't a publication target.
- For a service principal, replace `token:` with `client_id:` and `client_secret:`.

The project needs a `dbt_project.yml` whose `profile:` names this profile, and nothing else for this setup:

```yaml
name: YOUR_PROJECT_NAME
profile: profile_name
```

Quoting reaches a Lake Compute model through an `adapters:` block, so leave this out of `dbt_project.yml`:

```yaml
adapters:
  lakecompute:
    quoting:
      identifier: true
```

If your project needs quoting for Databricks, keep that at the top level.

## Step 2: Add a Unity Catalog entry, if Lake Compute models read Databricks tables

A Lake Compute model can only read a Databricks upstream that it can attach as a catalog. The upstream has to be a `table` or `incremental` model with no `table_format`, and its `file_format` unset or `delta`. Declare the catalog in `catalogs.yml` at the project root:

```yaml
catalogs:
  - name: databricks_cat
    type: unity
    table_format: iceberg
    config:
      lakecompute:
        catalog_database: CATALOG
        region: us-east-1        # The workspace's region, from metastore_summary
        host: dbc-abc123.cloud.databricks.com
```

- `catalog_database` has to match the upstream model's database, because that is how the entry is matched to the model.
- `table_format` is required on every catalog entry, and a Unity entry takes `iceberg`. It says how the entry is read. The upstream model stays plain Delta, as described above.
- `region` is the AWS region of the workspace. `GET /api/2.1/unity-catalog/metastore_summary` reports it as `region`.
- `host` is the same workspace host as in the profile, with or without `https://`. Both are accepted.
- Credentials come from the `databricks` output, not from this file. The entry is read-only.
- This path needs `use_catalogs_v2`, which is on by default.
- Lake Compute reads tables in that catalog from the storage that Databricks manages for them. A managed table needs an effective managed storage location, which comes from the schema, the catalog, or the metastore. If none of the three supplies one, set it on the catalog: `ALTER CATALOG CATALOG SET MANAGED LOCATION 's3://BUCKET/PREFIX';`.

Those conditions apply to this catalog route. For an upstream that doesn't meet them, the parse error offers the other routes: put the upstream on `adapter: lakecompute`, or set `catalog_name` or `table_format: iceberg` on it so it lands in an open table format.

## Step 3: Run a model on Lake Compute

On the model that should run on Lake Compute, add:

```sql
{{ config(adapter='lakecompute', materialized='table') }}
```

Run it and its upstreams:

```bash
dbt run --select +MODEL_NAME
```

The first run can fail at publication with `parent external location for path ... does not exist`. That error names the path the External Location in [prerequisite 2](#2-an-external-location-over-the-folder-lake-compute-writes) has to cover. Create it and run again.

The model runs over the lake, writes its output there, and publishes it into Unity Catalog, where Databricks models can query it. Databricks is the profile's default adapter, so you don't need a `propagate` setting.

Before you move a whole project, read [What works on Lake Compute](#what-works-on-lake-compute) and check each model's materialization on the new adapter. After that, the project-wide switch is:

```yaml
models:
  YOUR_PROJECT_NAME:
    +adapter: lakecompute
```

## Step 4: Verify your setup

Publication creates an external Delta table over the lake path. Check it from the warehouse:

```sql
show create table CATALOG.SCHEMA.MODEL_NAME;
select * from CATALOG.SCHEMA.MODEL_NAME;
```

The first statement reports your model's columns, then `USING delta` and a location of `s3://DESTINATION_BUCKET/lake_compute_staging/CATALOG_SCHEMA/MODEL_NAME`. A table pointing at a Unity managed location instead means publication didn't run.

`dbt debug` fails its write check with `Catalog Error: Catalog with name CATALOG does not exist!` while writing `database.schema.__dbt_debug_probe_*`. That's the probe's address, which the compute side has no catalog for. It isn't a problem with your credentials or the bucket, even though the message mentions both. Verify with the model run and the queries above instead, and treat any other `dbt debug` failure as real.

## What works on Lake Compute

| Materialization | Behavior on a Databricks target |
| --- | --- |
| `table` | Works. It is the default on Lake Compute. |
| `incremental` with `incremental_strategy='append'` | Runs, but keeps only the latest run's rows, so it doesn't accumulate across runs. |
| `view` | Not supported: `Views are not supported on Lake Compute yet`. Use `table`. |
| `ephemeral` | Runs, and is never published. |
| `snapshot` | Not supported: the adapter `runs only models, seeds and tests`. Keep snapshots on Databricks. |
| `function` | Not supported: `compute_platform: 'dbt' does not support 'function' materialization on LakeCompute yet`. A function configured with `adapter: lakecompute` is rejected earlier, with the same `runs only models, seeds and tests` message. |

Seeds load into the Databricks output like any other model. A seed that uses the Databricks adapter can't be the direct upstream of a Lake Compute model. Parse then fails for the whole project with `is not reachable through a catalog`, which stops every invocation, including runs that select unrelated models. Either put a Databricks model between them, or run the seed on Lake Compute:

```yaml
seeds:
  YOUR_PROJECT_NAME:
    +adapter: lakecompute
```

## Troubleshooting

Lake Compute wraps publication errors as `Propagation failed for 1 target(s): TARGET: ERROR`, and a `dbt debug` probe adds its own text. Match on the fragments below rather than on the whole string.

| Message | Cause | Fix |
| --- | --- | --- |
| `The 'lakecompute' adapter is not yet supported by dbt` | The build predates the release that includes Lake Compute. | Update with `dbt system update`, or set `DBT_ALLOW_EXPERIMENTAL_ADAPTERS=true`. |
| `is experimental and not yet supported` | Multi-adapter support is off. | Set `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true`. |
| `token exchange failed` | The exchange rejected the token. A token issued by another deployment is one cause, and an invalid or expired token is another. | Read the response body. If the token came from a non-production deployment, [set `fivetran_auth_url` and `base_url`](/docs/lake-compute/compute-onboarding#non-production-deployment) for that deployment. |
| `User does not have EXTERNAL USE SCHEMA on Schema 'CATALOG.SCHEMA'` | The publishing identity lacks a privilege that external table creation needs. | `GRANT EXTERNAL USE SCHEMA ON SCHEMA CATALOG.SCHEMA TO ...`. |
| `parent external location for path` | No External Location covers the folder Lake Compute writes to. The message names the path. | Create an External Location over that path, or ask a metastore administrator for one. |
| `User does not have CREATE EXTERNAL LOCATION on Credential 'NAME'` | You tried to create an External Location without that privilege on the storage credential. | Grant `CREATE EXTERNAL LOCATION` on the credential, or have the location created for you. |
| `User does not have EXTERNAL USE LOCATION on External Location 'NAME'` | The location exists, but the identity can't use it. | `GRANT EXTERNAL USE LOCATION ON EXTERNAL LOCATION ... TO ...`, together with `CREATE EXTERNAL TABLE`, `READ FILES`, `WRITE FILES`, and `BROWSE`. |
| `Databricks propagation does not support quoted identifiers` | The Lake Compute adapter has quoting on, usually from an `adapters: lakecompute: quoting:` block in `dbt_project.yml`. A top-level `quoting:` block doesn't cause it. | Remove quoting for the Lake Compute adapter. |
| `UC_HIVE_METASTORE_DISABLED_EXCEPTION` | The profile or the session targets `hive_metastore`. | Publish into a Unity Catalog catalog. |
| `Catalog Error: Catalog with name CATALOG does not exist!` from a `dbt debug` write check | The probe addresses a catalog the compute side doesn't have. | Verify with a model run and the queries in [Step 4](#step-4-verify-your-setup). |
| `not reachable through a catalog`, for a Databricks upstream | The upstream isn't plain Delta, `catalog_database` doesn't match its database, no catalog entry applies, or the build predates release `2.0.7`. | Follow [Step 2](#step-2-add-a-unity-catalog-entry-if-lake-compute-models-read-databricks-tables), or move the upstream onto `adapter: lakecompute`. |
| `UnusedConfigKey` (dbt1060) for `threads:` on the `lakecompute` output | Threads belong on the default output. | Remove `threads` from the `lakecompute` output. |

## Cleaning up

Remove the published tables from the warehouse:

```sql
drop table if exists CATALOG.SCHEMA.MODEL_NAME;
```

Then remove what you created around them, in this order, because revoking on a deleted object fails:

1. Revoke the privileges you granted on the storage credential, the External Location, and the schema.
2. Drop the schema, if it exists only for this trial.
3. Delete the External Location in Catalog Explorer or through the Unity Catalog API.

The lake copy of each table stays behind in the lake namespace `CATALOG_SCHEMA`, with no drop path exposed through dbt.

## Lake Compute without Databricks

To run every model on Lake Compute with no Databricks involved, follow [Use Lake Compute as your only adapter](/docs/lake-compute/compute-onboarding#use-lake-compute-as-your-only-adapter).

## Related docs

- [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding)
- [Lake Compute with Snowflake](/docs/lake-compute/compute-onboarding-snowflake)
- [Lake Compute with BigQuery](/docs/lake-compute/compute-onboarding-bigquery)
- [Lake Compute FAQs](/docs/lake-compute/compute-faq)
