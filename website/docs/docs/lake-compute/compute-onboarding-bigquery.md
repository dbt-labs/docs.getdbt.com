---
title: "Lake Compute with BigQuery"
description: "Set up a GCS-backed managed data lake, a BigLake connection, and your dbt profile to run selected models on Lake Compute while the rest stay on BigQuery."
id: compute-onboarding-bigquery
sidebar_label: "Lake Compute with BigQuery"
---

# Lake Compute with BigQuery <Lifecycle status="private_beta" />

:::info Lake Compute is in private beta

To request access, fill out the [Lake Compute signup form](https://docs.google.com/forms/d/e/1FAIpQLSdWXHU3VFqq1t8GVAA2BMfY_AfeVJH26OXJFlNwXiVv4pcuXQ/viewform). Refer to [Private beta limitations](/docs/lake-compute#private-beta-limitations) before you plan real work around it.

:::

This page sets up a BigQuery project on Lake Compute. You create:

- A managed data lake destination in Google Cloud Storage (GCS)
- A BigLake connection, so BigQuery can read the Iceberg metadata that Lake Compute writes
- A dbt project where selected models run on Lake Compute and the rest stay on BigQuery

Two buckets are involved, and they are different things:

- The **destination bucket** backs the data lake. Lake Compute writes every table there, and publication reads the Iceberg metadata from it. You create it in your own project and give Fivetran's service account access.
- The **Iceberg bucket** is the bucket BigQuery models write their own Iceberg data into. You create it separately.

Set `REGION` to the region of the destination bucket, for example `us-east4`. Everything on this page must be in that region.

## Before you start

### 1. A managed data lake destination with Lake Compute enabled

Open an existing GCP managed data lake destination, or create one by following Fivetran's Managed Data Lake Service setup guide for GCS:

1. Add a destination in Fivetran and note the Fivetran service account it shows.
2. Create the bucket and grant that service account access to it.

Fivetran doesn't create the bucket for you, and destination setup fails if the bucket is in a region Fivetran doesn't support.

Create the bucket in your own project:

```bash
gcloud storage buckets create gs://DESTINATION_BUCKET --location=REGION --uniform-bucket-level-access
```

Grant Fivetran's service account Storage Object Admin on it:

```bash
gcloud storage buckets add-iam-policy-binding gs://DESTINATION_BUCKET \
  --member="serviceAccount:FIVETRAN_SERVICE_ACCOUNT" \
  --role="roles/storage.objectAdmin"
```

Then finish the destination setup in Fivetran. Open the destination, go to the **Compute** tab, turn on **Enable Lake Compute**, and click **Generate Token**.

Record three values, which later steps use:

- The token, which starts with `dct_` and is shown once
- The destination bucket's region, which becomes `REGION`
- The destination bucket name without the `gs://` prefix, for example `lake_compute_bq_demo`

Put the token in the environment rather than in the profile:

```bash
export LAKE_COMPUTE_TOKEN=dct_...
```

### 2. Application Default Credentials for the publishing identity

Lake Compute publishes with the credential from your `bigquery` output:

```bash
gcloud auth application-default login
```

A user login and a service account key file both work. `method: oauth` reads Application Default Credentials (ADC), and `method: service-account` reads the JSON file at `keyfile`. `impersonate_service_account` isn't supported for publication. If your organization enforces reauthentication, ADC expires and publication fails until you log in again.

The identity needs these roles:

- `roles/bigquery.dataEditor` on the dataset, so it can create the published tables
- `roles/bigquery.connectionUser` on the connection, so it can use it
- `bigquery.datasets.create` on the project, if the dataset doesn't exist yet, because dbt creates it

### 3. A GCP project where you can create datasets, buckets, and connections

`roles/bigquery.admin` and `roles/storage.admin` on the project cover the setup steps on this page. To check your permissions before you start:

```bash
curl -s -X POST \
  -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{"permissions":["bigquery.datasets.create","bigquery.connections.create","storage.buckets.create"]}' \
  "https://cloudresourcemanager.googleapis.com/v1/projects/PROJECT_ID:testIamPermissions"
```

The response lists the permissions you hold. If any are missing, ask for the roles rather than working around them. You also need permission to change IAM on the destination bucket from the first prerequisite.

### 4. A GCS bucket for BigQuery Iceberg data

This is the Iceberg bucket, separate from the destination bucket. Create it in `REGION`:

```bash
gcloud storage buckets create gs://BUCKET_NAME --location=REGION --uniform-bucket-level-access
```

Some organizations cap the soft delete policy, which makes bucket creation fail. In that case, add `--soft-delete-duration=0`.

### 5. A dbt build that supports Lake Compute publication to BigQuery

Publication is new, so an older build parses the project but can't publish. Update and check the version:

```bash
dbt system update --version VERSION
dbt --version
```

`VERSION` is the newest published build. [Step 5](#step-5-verify-your-setup) shows how to tell whether your build can publish.

Also complete [Opt in to multi-adapter invocations](/docs/lake-compute/compute-onboarding#opt-in-to-multi-adapter-invocations).

## Step 1: Create the BigQuery connection

A BigLake connection is how BigQuery reads the Iceberg objects that Lake Compute and BigQuery write. A `CLOUD_RESOURCE` connection needs no network policy or IP allowlist.

```bash
bq mk --connection --location=REGION \
  --project_id=PROJECT_ID \
  --connection_type=CLOUD_RESOURCE \
  lake_compute_conn
```

You can create the same connection in the Google Cloud console under **Connections**.

Read back the connection's service account:

```bash
bq show --connection --format=json PROJECT_ID.REGION.lake_compute_conn \
  | jq -r .cloudResource.serviceAccountId
```

It looks like `bqcx-PROJECT_NUMBER-xxxx@gcp-sa-bigquery-condel.iam.gserviceaccount.com`.

Grant it access to both buckets. Publication reads Iceberg metadata from the destination bucket:

```bash
gcloud storage buckets add-iam-policy-binding gs://DESTINATION_BUCKET \
  --member="serviceAccount:CONNECTION_SERVICE_ACCOUNT" \
  --role="roles/storage.objectUser"
```

BigQuery models write their Iceberg data into the Iceberg bucket, so the same service account needs access there too:

```bash
gcloud storage buckets add-iam-policy-binding gs://BUCKET_NAME \
  --member="serviceAccount:CONNECTION_SERVICE_ACCOUNT" \
  --role="roles/storage.objectUser"
```

If `gcloud storage` fails with an `ssl.PROTOCOL_TLSv1` error, the CLI is using a Python version that is too new. Refer to [Troubleshooting](#troubleshooting).

Keep the connection name. It goes in the profile and in `catalogs.yml`, and BigQuery uses it to query the published tables.

## Step 2: Configure the profile

BigQuery stays the default adapter. Lake Compute is a second output, and you move models to it one at a time.

```yaml
profile_name:
  target: prod
  outputs:
    prod:
      - type: bigquery
        default: true
        method: oauth
        project: PROJECT_ID
        dataset: DATASET
        location: REGION
        threads: 4

      - type: lakecompute
        method: fivetran
        fivetran_credential: "{{ env_var('LAKE_COMPUTE_TOKEN') }}"
        database: PROJECT_ID
        schema: DATASET
        bigquery_connection: PROJECT_ID.REGION.lake_compute_conn
```

- `database` is the BigQuery project that Lake Compute publishes into, and `schema` is the dataset. Set `schema` to the same dataset as the `bigquery` output. In the data lake, the tables appear under the namespace `PROJECT_ID_DATASET`.
- `DATASET` doesn't have to exist yet. dbt creates it in `location` if it's missing, which needs `bigquery.datasets.create`. To create it first yourself, run `bq mk --dataset --location=REGION PROJECT_ID:DATASET`.
- `bigquery_connection` is required, in `PROJECT.LOCATION.CONNECTION_ID` form. Without it, the run fails with `InvalidConfig (dbt1005)`.
- Don't set `threads` on the `lakecompute` output. Thread count is target-wide, taken from the default output or `--threads`, and a `threads` setting here is ignored with the warning `UnusedConfigKey (dbt1060)`.
- A custom BigQuery `api_endpoint` is rejected for publication. Only the default endpoint is supported.

Turn on multi-adapter support, and keep it in your shell profile:

```bash
export DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true
```

Without it, parsing a project with `adapter: lakecompute` fails with `InvalidConfig (dbt1005)` and names the variable to set.

## Step 3: Add the BigQuery Iceberg catalog

Lake Compute models can only read BigQuery upstreams that BigQuery exposes as Iceberg through a `biglake_metastore` catalog. If a Lake Compute model reads any BigQuery table, add a `catalogs.yml` file at the project root:

```yaml
catalogs:
  - name: bigquery_iceberg
    type: biglake_metastore
    table_format: iceberg
    config:
      bigquery:
        external_volume: gs://BUCKET_NAME
        file_format: parquet
        connection_id: PROJECT_ID.REGION.lake_compute_conn
```

- `external_volume` and `file_format` are required for a standard BigLake catalog. Use the Iceberg bucket from prerequisite 4, not the destination bucket.
- `connection_id` is the connection from [Step 1](#step-1-create-the-bigquery-connection). The generated `CREATE TABLE` statement uses it, so the grants in Step 1 apply to these tables. If you omit it, dbt falls back to the project's `default` connection, which then needs the same access to `external_volume`.
- `use_catalogs_v2` is on by default, so `catalogs.yml` needs no flag.

A BigQuery model that a Lake Compute model reads then looks like this:

```sql
{{ config(catalog_name='bigquery_iceberg', materialized='table') }}
```

BigQuery runs `create or replace table ... with connection ... options(table_format='iceberg', file_format='parquet', storage_uri='gs://BUCKET_NAME/_dbt/DATASET/MODEL')`.

## Step 4: Run a model on Lake Compute

On every upstream BigQuery model that a Lake Compute model reads, use the catalog from Step 3. On the model that should run on Lake Compute, add:

```sql
{{ config(adapter='lakecompute', materialized='table') }}
```

Run it and its upstreams:

```bash
dbt run --select +MODEL_NAME
```

The model runs in DuckDB over Iceberg, writes to the data lake, and publishes its result to BigQuery as an Iceberg table through the connection. Downstream BigQuery models `ref()` it like any other table. You don't need a `propagate` config, because BigQuery is the profile's default adapter: a Lake Compute node with no `+propagate` publishes to the default.

To run every model on Lake Compute while still publishing to BigQuery, set the adapter for the whole project instead of per model:

```yaml
models:
  YOUR_PROJECT_NAME:
    +adapter: lakecompute
```

A Lake Compute model is DuckDB SQL. Replace BigQuery-only functions with DuckDB ones, and give decimals an explicit precision, such as `decimal(38, 9)`. In DuckDB, a bare `decimal` or `numeric` is `DECIMAL(18,3)` and keeps only 3 decimal places.

## Step 5: Verify your setup

Read the model you ran in Step 4 back from BigQuery. This proves the write, the publication, and the connection.

```bash
bq show --format=json PROJECT_ID:DATASET.MODEL_NAME
bq query --use_legacy_sql=false \
  "select * from \`PROJECT_ID.DATASET.MODEL_NAME\`"
```

`bq show` reports `"type": "EXTERNAL"` and `"sourceFormat": "ICEBERG"`, and the query returns the model's rows.

When the profile declares a `lakecompute` output, `dbt debug` runs these checks:

- A connection test per output
- A catalog attach check
- A write and read-back probe against MDLS in the configured `database` and `schema`
- A BigQuery publication probe that writes a probe table, publishes it, and reads it back. dbt removes the probes afterward.

On a passing run, the end of the output reads:

```text
Debugging catalog attach test: skipped (no declared catalogs to check)
Debugging MDLS write test: OK (9.4s)
Debugging MDLS read-back test: OK (8.9s)
Debugging BigQuery publication test (this writes a probe table, publishes it to BigQuery and reads it back through BigQuery; can take up to a minute)...
Debugging BigQuery publication test: OK (15.2s)
Debugged All checks passed!
```

With only the `biglake_metastore` catalog from Step 3, the attach check reports `skipped`, because it covers catalogs that Lake Compute attaches from details in `catalogs.yml`.

If `dbt debug` stops after the read-back test, or prints `Parser Error: syntax error at or near "-"` instead of a publication test, your build predates the BigQuery checks. The probe writes the configured `database` unquoted, and a GCP project ID contains hyphens. Use a newer build, or skip `dbt debug` and rely on the model run above.

## What works on Lake Compute

| Materialization | Behavior on a BigQuery target |
| --- | --- |
| `table` | Works. It is the default on Lake Compute. |
| `incremental` with `incremental_strategy='append'` | Works. Each run appends, so two runs leave both runs' rows in the published table. Other incremental strategies aren't covered here. |
| `view` | Rejected with `UnsupportedFusionFeature (dbt1106)`: Lake Compute can't publish views to BigQuery. Use `table`, or `ephemeral` if the model doesn't need to persist. |
| `ephemeral` | Runs, and is never published. |
| `snapshot`, `function` | Rejected with `InvalidConfig (dbt1005)`: a node configured with `adapter: lakecompute` runs only models, seeds, and tests. |

Seeds load into BigQuery through the default output. A seed can't be the direct upstream of a Lake Compute model: at parse time, `InvalidConfig (dbt1005)` reports that the seed is not reachable through a catalog. Either put a BigQuery model with `catalog_name='bigquery_iceberg'` between the seed and the Lake Compute model, or place the seed on `adapter: lakecompute` so it publishes like a Lake Compute model.

## Troubleshooting

| Message | Cause | Fix |
| --- | --- | --- |
| `[ParserException] ... syntax error at or near "-"` from the MDLS probe | An older build writes `database.schema.__dbt_debug_probe_*` unquoted, and a GCP project ID has hyphens. | Use a newer build, or verify with a model run. |
| `Catalog Error: Catalog with name X does not exist!` from the MDLS probe | An older build resolved the probe against the data lake catalog instead of the configured namespace. | Use a newer build, or verify with a model run. |
| `Selecting a node's adapter with adapter: lakecompute is experimental` | Multi-adapter support is off. | Set `DBT_ENGINE_EXPERIMENTAL_MULTI_ADAPTER=true`. |
| `Lake Compute publication to BigQuery needs 'bigquery_connection'` | The `lakecompute` output has no `bigquery_connection`. | Add `bigquery_connection: PROJECT_ID.REGION.CONNECTION_ID`. |
| `UnusedConfigKey` (dbt1060) for `threads` on the `lakecompute` output | Threads were set on a non-default output, where they are ignored. | Remove `threads` there, and set the thread count on the default output or with `--threads`. |
| `... is not reachable through a catalog` | A seed or BigQuery model without `catalog_name` is the direct upstream of a Lake Compute model. | Give the upstream `catalog_name='bigquery_iceberg'`, or put a BigQuery model with the catalog between them. |
| `... does not have storage.objects.get access to the Google Cloud Storage object` on publish | The connection's service account can't read the destination bucket. | Grant it `roles/storage.objectUser` on the destination bucket, as in Step 1. |
| `Not found: Connection X` on publish | The connection name in the profile doesn't exist in that project and region. | Check it with `bq show --connection --format=json PROJECT_ID.REGION.CONNECTION_ID`. |
| `Access Denied` or `403` when BigQuery creates a table | The publishing identity lacks `roles/bigquery.dataEditor` on the dataset, or `roles/bigquery.connectionUser` on the connection. | Grant both. |
| `invalid_rapt` or `invalid_grant` warnings, then publication fails | ADC expired under a reauthentication policy. | Run `gcloud auth application-default login` again. |
| `gcloud storage` crashes with `module 'ssl' has no attribute 'PROTOCOL_TLSv1'` | The CLI is using a Python version without `ssl.PROTOCOL_TLSv1`. | Prefix the command with `CLOUDSDK_PYTHON=/path/to/python3.13`. |
| `412: '604800' violates constraint 'constraints/storage.softDeletePolicySeconds'` | An organization policy caps the soft delete retention. | Add `--soft-delete-duration=0` to `gcloud storage buckets create`. |
| `dbt debug` write test passes and the read-back fails | `database` or `schema` is missing, or resolves differently for the two outputs, so the write and the probe land in different namespaces. | Set both on the `lakecompute` output. |

## Clean up

Remove the trial model's tables from the dataset the profile writes to:

```bash
bq rm -f -t PROJECT_ID:DATASET.MODEL_NAME
```

If nothing else uses the dataset and it exists only for this trial, drop it instead, which also removes its tables:

```bash
bq rm -f -r -d PROJECT_ID:DATASET
```

Then remove the connection and the Iceberg bucket, and undo the binding on the destination bucket:

```bash
bq rm --connection PROJECT_ID.REGION.lake_compute_conn
gcloud storage rm -r gs://BUCKET_NAME
gcloud storage buckets remove-iam-policy-binding gs://DESTINATION_BUCKET \
  --member="serviceAccount:CONNECTION_SERVICE_ACCOUNT" \
  --role="roles/storage.objectUser"
```

The tables Lake Compute wrote stay in the data lake under the `PROJECT_ID_DATASET` namespace.

## Lake Compute without BigQuery

To run every model on Lake Compute with no BigQuery involved, follow [Use Lake Compute as your only adapter](/docs/lake-compute/compute-onboarding#use-lake-compute-as-your-only-adapter). Without BigQuery, you don't need the connection (Step 1) or the catalog (Step 3), and `bigquery_connection` can stay out of the profile.

## Related docs

- [Onboarding to Lake Compute](/docs/lake-compute/compute-onboarding)
- [Lake Compute with Snowflake](/docs/lake-compute/compute-onboarding-snowflake)
- [Lake Compute FAQs](/docs/lake-compute/compute-faq)
