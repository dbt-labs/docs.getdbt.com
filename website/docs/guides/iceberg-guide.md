---
title: "Get hands-on with Apache Iceberg and local compute"
id: "iceberg"
time_to_complete: '60 minutes' 
level: 'Advanced'
icon: 'zap'
description: "Run dbt transformations across Snowflake and DuckDB against one shared set of Apache Iceberg tables, warehouse-free and with no data copies."
hide_table_of_contents: true
tags: ['dbt Fusion engine','Snowflake','Iceberg','DuckDB']
recently_updated: true
---

This guide shows you how to run dbt transformations across two engines (Snowflake and DuckDB) against a single, shared set of Apache Iceberg tables. You'll build your raw and staging layers as Snowflake-managed Iceberg tables, then use DuckDB to read and write those exact same tables through Snowflake's open Horizon catalog, without ever spinning up a Snowflake warehouse for that step. The result is a warehouse-free, no-copy workflow where you pick the cheapest engine for each job while your governance and lineage stay intact.

## Offload dbt compute to DuckDB with Iceberg

By the end of this guide, your `fusion-jaffle-shop` project will transform data in two different engines against one shared set of tables:

- **Snowflake:** Builds your raw and staging layers as Snowflake-managed Apache Iceberg tables, registered in Snowflake's built-in Horizon catalog.
- **DuckDB:** Reads those exact same Iceberg tables through Horizon's open Iceberg REST catalog, builds a downstream model (`orders`), and writes the result *back* as an Iceberg table in the same catalog.

The DuckDB step is the interesting part. Because Iceberg is an open table format and Horizon speaks to the open Iceberg REST protocol, an external engine like DuckDB can operate on your governed Snowflake tables _without spinning up a Snowflake virtual warehouse_. 

The transformation runs in a local DuckDB process (embedded in the dbt Fusion engine); Snowflake only serves catalog metadata and vends short-lived storage credentials. The data itself lives in your own S3 bucket the whole time.

Why that's a big deal:

- **Cost**: Warehouse-free transforms mean you don't burn Snowflake credits for compute you could run locally or on cheap commodity hardware. You pick the engine that's cheapest for each job.
- **No lock-in / no copies**: There's one physical copy of the data in open Parquet + Iceberg metadata. Snowflake, DuckDB, Spark, Trino, and others can all read and write it. No syncing, no ETL between systems.
- **Governance stays put**: The tables are still first-class Snowflake objects. They show up in the catalog, honor grants, and can carry masking/row policies and lineage — even the ones DuckDB wrote.

This is the foundation of cross-platform [dbt Mesh](https://docs.getdbt.com/docs/mesh/cross-platform-mesh): one project, one catalog, many engines.

## Notes about this guide

Before you begin, there are a few considerations:

- This is an advanced guide and assumes that you have fundamental knowledge of dbt, Snowflake, DuckDB, related tools, and how to install them.
- While dbt handles SQL transformations with grace, some of the tools used in this guide are very specific about the syntax they accept. We highly recommend you remove code comments from examples in this guide before using them in a live environment.
- The demo project used is a feature rich example of the existing Jaffle Shop project. This is to demonstrate some of the considerations you'll need to make in your own projects as you implement these workflows. To ensure a smooth outcome, we recommend you use the project link in this guide and not any other existing Jaffle Shop projects. 
- If you are using a Snowflake account that has not been configured for Python (for example, a brand new trial account), you may run into errors with the Python models in the dbt project. Deleting them for the duration of this guide will remove those errors (though there will be some non-blocking warnings).

## Prerequisites

There are a number of prerequisites and personas you'll need to complete this guide. 

### Accounts and access

To complete the required setup steps, you'll need:

- A **Snowflake account** where you can act as `ACCOUNTADMIN`. This guide builds everything from scratch, so a brand-new account (a trial works) is exactly the assumed starting point.
- An **AWS account** where you can create an S3 bucket and an IAM role + policy.
- A local clone of the [**`fusion-jaffle-shop`** project](https://github.com/matthewshaver/fusion-jaffle-shop), with the seed CSVs present in `seeds/`.
- Comfort running SQL in Snowsight and basic commands in a terminal.

### Tools to install and verify

Install and verify these before you start:

| Requirement | Why | Check |
|---|---|---|
| **dbt Fusion engine** (v2, `preview.194`+) | `catalogs.yml` v2 + DuckDB attach support | `dbt --version` |
| **DuckDB 1.5.4+** | Iceberg write-compat (`ATTACH`, credential vending) | `duckdb --version` |
| **An AWS account** | Hosts the S3 bucket that stores the Iceberg data/metadata | — |
| **A new Snowflake account** | Where Horizon + the managed Iceberg tables live | — |
| **The `fusion-jaffle-shop` project** | Cloned locally, with the seed CSVs present in `seeds/` | `ls seeds/` shows `raw_*.csv` |


### Placeholders used in this guide

Throughout this guide, replace these placeholders with your own values:

- `<ACCOUNT_IDENTIFIER>`: Your Snowflake account identifier in `ORG-ACCOUNT` form (for example, `ABCDEFG-HI12345`). Find it in Snowsight under your account menu → **Account** → **View account details**, or in the account URL `https://<ORG>-<ACCOUNT>.snowflakecomputing.com`.
- `<AWS_ACCOUNT_ID>`: Your 12-digit AWS account number.
- `<YOUR_USER>`: Your Snowflake login username.
- `<REGION>`: The AWS region for your bucket. This guide uses `us-east-2`; use whatever is closest to your Snowflake account's region.

This guide is for v2 only. The `catalogs.yml` mechanism it relies on is not available in the legacy Python `dbt-duckdb` adapter.

## The project

This guide will use a heavily augmented copy of the traditional Jaffle Shop project. The project itself contains more information than required to simply setup an Iceberg workflow, so you can use it to run more trials and observe results. 

Clone the [`fusion-jaffle-shop` project](https://github.com/matthewshaver/fusion-jaffle-shop) from GitHub:

```bash
git clone https://github.com/matthewshaver/fusion-jaffle-shop.git
```

Then navigate into the project directory:

```bash
cd fusion-jaffle-shop
```


## Part 1: Set up the Snowflake account {#set-up-snowflake}

Log into Snowsight (the Snowflake web UI) with your admin user. Open a new SQL worksheet and run each block below.

### 1.1 Create the warehouse, database, and schema

```sql
USE ROLE ACCOUNTADMIN;

CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

CREATE DATABASE IF NOT EXISTS DBT_ICEBERG;
CREATE SCHEMA IF NOT EXISTS DBT_ICEBERG.RAW;
```

### 1.2 Create the `TRANSFORMER` role and grant it everything it needs

You'll use one role, `TRANSFORMER`, for everything. Both the Snowflake-side build and the DuckDB offload. Because `TRANSFORMER` will *own* every table it creates, it automatically has read/write on them and you won't need extra `SELECT` grants later.

```sql
USE ROLE ACCOUNTADMIN;

CREATE ROLE IF NOT EXISTS TRANSFORMER;

-- Let TRANSFORMER use compute and the database objects
GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE TRANSFORMER;
GRANT USAGE ON DATABASE DBT_ICEBERG TO ROLE TRANSFORMER;
GRANT USAGE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;

-- Let TRANSFORMER create the tables dbt will build (seeds + Iceberg models)
GRANT CREATE TABLE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;
GRANT CREATE ICEBERG TABLE ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;
GRANT CREATE VIEW ON SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER;

-- Give the role to yourself so you can use it, and make it your default
GRANT ROLE TRANSFORMER TO USER <YOUR_USER>;
ALTER USER <YOUR_USER> SET DEFAULT_ROLE = TRANSFORMER;
```

We'll grant `TRANSFORMER` access to the external volume in Part 3, after it exists.


## Part 2: Create the S3 bucket and IAM role in AWS {#create-s3-and-iam}

Snowflake-managed Iceberg tables store their data and metadata files in object storage that you own. Snowflake reaches that bucket by assuming an IAM role you create. This is a two-way handshake, so the order matters.

### 2.1 Create the S3 bucket

In your AWS console

1. Navigate to **S3 → Create bucket**.
2. **Bucket name**: pick a globally unique name. A good convention is `iceberg-<AWS_ACCOUNT_ID>-<REGION>`, like `iceberg-1234567890-us-east-2`.
3. **Region**: choose `<REGION>` (for example, `us-east-2`).
4. Leave the rest as defaults and click **Create bucket**.
5. (Optional but tidy) open the bucket and create a folder/prefix named `jaffle-iceberg/` for all Iceberg files to live under.

### 2.2 Create the IAM permission policy

In your AWS console:

1. Navigate to **IAM → Policies → Create policy** and switch to the **JSON** tab.
2. Paste the following, replacing the bucket name in both `Resource` blocks:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:GetObjectVersion", "s3:DeleteObject", "s3:DeleteObjectVersion"],
      "Resource": "arn:aws:s3:::iceberg-<AWS_ACCOUNT_ID>-<REGION>/jaffle-iceberg/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Resource": "arn:aws:s3:::iceberg-<AWS_ACCOUNT_ID>-<REGION>",
      "Condition": { "StringLike": { "s3:prefix": ["jaffle-iceberg/*"] } }
    }
  ]
}
```

3. Click **Next**, name it `snowflake-iceberg-policy`, and **Create policy**.

### 2.3 Create the IAM role (with a placeholder trust)

You can't fill in the real trust policy yet as it needs values Snowflake generates in Part 3. So create the role with a temporary trust, then you'll fix it later.

In the AWS console:

1. Navigate to **IAM → Roles → Create role**.
2. **Trusted entity type**: choose **AWS account**.
3. Select **This account (`<AWS_ACCOUNT_ID>`)**. Leave both **"Require external ID"** and **"Require MFA"** **unchecked**. (This is a throwaway trust; you'll replace it in Part 3.)
4. Click **Next**. On the permissions page, search for and check **`snowflake-iceberg-policy`**.
5. Click **Next**, name the role **`snowflake-iceberg-role`**, and **Create role**.
6. Open the new role and copy its **ARN** (`arn:aws:iam::<AWS_ACCOUNT_ID>:role/snowflake-iceberg-role`) — you'll need it next.

## Part 3: Connect Snowflake to S3 with an external volume

An external volume is Snowflake's secure link to the S3 bucket where your Iceberg data and metadata live. In this part, you'll create the volume, complete the trust handshake between Snowflake and your IAM role, and set the volume as your database default so every Iceberg table knows where to store its files.


### 3.1 Create the external volume

Back in Snowsight (as `ACCOUNTADMIN`), copy and paste the following (replace `<PLACEHOLDERS>` with your info):

```sql
USE ROLE ACCOUNTADMIN;

CREATE OR REPLACE EXTERNAL VOLUME ICEBERG_EXT_VOL
  STORAGE_LOCATIONS = ((
    NAME = 'iceberg-s3-<REGION>'
    STORAGE_PROVIDER = 'S3'
    STORAGE_BASE_URL = 's3://iceberg-<AWS_ACCOUNT_ID>-<REGION>/jaffle-iceberg/'
    STORAGE_AWS_ROLE_ARN = 'arn:aws:iam::<AWS_ACCOUNT_ID>:role/snowflake-iceberg-role'
  ))
  ALLOW_WRITES = TRUE;
```

### 3.2 Get Snowflake's identity and finish the IAM trust

```sql
DESCRIBE EXTERNAL VOLUME ICEBERG_EXT_VOL;
```

In the output, find the `STORAGE_LOCATION_1` row and read two values out of its JSON:

- `STORAGE_AWS_IAM_USER_ARN` (looks like `arn:aws:iam::123456789012:user/abc1-s`)
- `STORAGE_AWS_EXTERNAL_ID` (looks like `ABC12345_SFCRole=...=`)

Now, go back to the AWS console **IAM → Roles → `snowflake-iceberg-role` → Trust relationships → Edit trust policy**, delete what's there, and paste this (with your two values):

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "<STORAGE_AWS_IAM_USER_ARN>" },
    "Action": "sts:AssumeRole",
    "Condition": { "StringEquals": { "sts:ExternalId": "<STORAGE_AWS_EXTERNAL_ID>" } }
  }]
}
```

Click **Update policy**. Copy the external ID _exactly_, including any trailing `=` and internal `/`. It's case-sensitive.

### 3.3 Grant the volume and set it as the database default

```sql
USE ROLE ACCOUNTADMIN;

-- TRANSFORMER needs USAGE on the volume (required for credential vending)
GRANT USAGE ON EXTERNAL VOLUME ICEBERG_EXT_VOL TO ROLE TRANSFORMER;

-- Make this volume the default for Iceberg tables in the database.
-- REQUIRED: when DuckDB creates a table through the REST catalog it can't
-- name a volume, so Snowflake falls back to this default.
ALTER DATABASE DBT_ICEBERG SET EXTERNAL_VOLUME = ICEBERG_EXT_VOL;
ALTER DATABASE DBT_ICEBERG SET CATALOG = 'SNOWFLAKE';
```

## Part 4: Create a Programmatic Access Token for DuckDB {#create-pat-duckdb}

DuckDB authenticates to Horizon's REST catalog over OAuth2, using a Programmatic Access Token (PAT) as its credential. To add the PAT in Snowsight:

```sql
USE ROLE ACCOUNTADMIN;

ALTER USER <YOUR_USER> ADD PROGRAMMATIC ACCESS TOKEN duckdb_pat
  ROLE_RESTRICTION = 'TRANSFORMER'
  DAYS_TO_EXPIRY = 90;
```

The result grid has two columns. Copy the long `token_secret` value (not `token_name`). You only see it once; save it somewhere safe for Part 6.

**Verify the token works:** Before wiring it into dbt, in a terminal, run the OAuth2 exchange (this is exactly what DuckDB does under the hood). Note the **empty username** before the colon in `-u ":..."` — this is essential (see FAQ):

```bash
curl -s "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog/v1/oauth/tokens" \
-u ":<TOKEN_SECRET>" \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'scope=session:role:TRANSFORMER'
```

A JSON response containing `"access_token"` means you're good. If you see `Programmatic access token is invalid`, re-copy the token. **If you see an error mentioning a network policy, see the [FAQ](/guides/iceberg?step=12#faq)**. Some Snowflake accounts require a network policy before a PAT can be created or used.

## Part 5: Load the seed data {#load-seed-data}

In this part, you'll load the dbt project's raw CSV seed data into Snowflake as regular tables. You'll run the seed against the prod target so you get the full historical dataset, rather than dev, which filters orders to the last year.

### 5.1 Seed commands

From the project root in your dbt CLI, install packages and seed the raw tables into Snowflake. (Make sure the seed CSVs are present in `seeds/` first.)

```bash
dbt deps
```
```bash
dbt seed --target prod
```

### 5.2 First seed

The project's `on-run-start` hook (`insert_freshness_heartbeat()`) queries a raw source table that doesn't exist until the seeds load, so if the _first_ `dbt seed` fails with `Object 'DBT_ICEBERG.RAW.RAW_STORES' does not exist`. Before your first seed, comment out the `on-run-start` block in `dbt_project.yml`:

```yaml
# on-run-start:
#   - "{{ insert_freshness_heartbeat() }}"
```

Uncomment it once the seeds exist.

This loads the following into `DBT_ICEBERG.RAW` as regular Snowflake tables:
- `raw_customers`
- `raw_orders`
- `raw_items`
- `raw_products`
- `raw_stores`
- `raw_supplies`
- `raw_tweets`

We use the `prod` target — you'll define it in the next section.

:::info Why `prod` and not `dev`?

This project's `stg_orders` model applies a `limit_in_dev` macro that filters orders to the last year **whenever the target is named `dev`**. The seed data is historical, so building on `dev` yields an **empty** `stg_orders` (and therefore empty `orders`). Building on any non-`dev` target skips that filter and gives you the full dataset. See the [FAQ](/guides/iceberg?step=12#faq) for more information.

:::

## Part 6: Configure the project {#configure-the-project}

### 6.1 `profiles.yml`

Create/edit `~/.dbt/profiles.yml`. Define three targets: `dev` and `prod` (both Snowflake) and `duckdb` (the offload). Paste your PAT into `client_secret`.

_You can, optionally, run `dbt init` to generate the `profiles.yml` in the proper location and configure the Snowflake profile._

If you already have a `~/.dbt/profiles.yml`, add the `jaffle_shop` profile below **before** running any commands. On an existing config, `dbt init` may not surface a `prod` target and later steps will fail to find it.

```yaml
jaffle_shop:
  target: prod
  outputs:
    # Everyday Snowflake target. NOTE: stg_orders is limited to the last year here.
    dev:
      type: snowflake 
      account: "<ACCOUNT_IDENTIFIER>"
      user: "<YOUR_USER>"
      authenticator: externalbrowser # or your preferred auth
      role: TRANSFORMER
      database: DBT_ICEBERG
      schema: RAW
      warehouse: COMPUTE_WH
      threads: 8

    # Full-data Snowflake target used to build the Iceberg parents.
    prod:
      type: snowflake
      account: "<ACCOUNT_IDENTIFIER>"
      user: "<YOUR_USER>"
      authenticator: externalbrowser
      role: TRANSFORMER
      database: DBT_ICEBERG
      schema: RAW
      warehouse: COMPUTE_WH
      threads: 8

    # DuckDB target reads/writes Iceberg via Horizon with ZERO Snowflake compute.
    duckdb:
      type: duckdb
      path: ':memory:'
      schema: RAW
      secrets:
        - type: iceberg
          name: horizon_secret
          client_id: ""  # MUST be empty (see FAQ)
          client_secret: "<TOKEN_SECRET>" # your PAT from Part 4
          oauth2_server_uri: "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog/v1/oauth/tokens"
          oauth2_scope: "session:role:TRANSFORMER"
```

The Fusion project's `dbt_project.yml` sets `profile: default`. Either rename the profile key above to `default`, or set `profile: jaffle_shop`. Keep it consistent.

:::note If `externalbrowser` fails

For example `390190 (08004) ... SAML Identity Provider account parameter`, swap it for password auth on the `dev` and `prod` targets and keep the secret out of the file with an environment variable:

```yaml
# authenticator: externalbrowser
password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
```

:::

### 6.2 `catalogs.yml`

Create `catalogs.yml` in the project root. This one entry describes the _same_ Horizon catalog for both engines.

```yaml
catalogs:
  - name: horizon_catalog
    type: horizon
    table_format: iceberg
    config:
      snowflake:
        external_volume: ICEBERG_EXT_VOL
      duckdb:
        warehouse: DBT_ICEBERG  # Horizon REST "warehouse" = the Snowflake database name
        endpoint: "https://<ACCOUNT_IDENTIFIER>.snowflakecomputing.com/polaris/api/catalog"
        secret: horizon_secret # references the profiles.yml secret above
        default_schema: RAW
        access_delegation_mode: VENDED_CREDENTIALS # Horizon vends temp S3 creds; no AWS keys needed
```

### 6.3 `dbt_project.yml`

Add the behavior flag that enables `catalogs.yml`, and remove the project-level `marts` grants (they don't work on DuckDB — see 6.4 and the FAQ). Add near the top:

```yaml
flags:
  use_catalogs_v2: true
```

Then, under `models: jaffle_shop: marts:`, **delete** the `+grants` block:

```yaml
# DELETE these two lines from the marts config:
   +grants:
     select: ["ACCOUNTADMIN"]
```

### 6.4 Model changes

These edits make the three models materialize as Iceberg and behave on both engines.

- **`models/staging/stg_orders.sql`**: Add the config header and cast the timestamp to microsecond precision (Iceberg rejects Snowflake's default nanosecond scale):

    ```sql  
    {{ config(materialized='table', catalog_name='horizon_catalog', alias='STG_ORDERS') }}
    ```
    ...and change the timestamp line to:

    ```sql
    cast({{ dbt.date_trunc('day','ordered_at') }} as timestamp_ntz(6)) as ordered_at
    ```

- **`models/marts/order_items.sql`**: add at the very top:

    ```sql
    {{ config(materialized='table', catalog_name='horizon_catalog', alias='ORDER_ITEMS') }}
    ```

- **`models/marts/orders.sql`**: replace its config header with:

    ```sql
    {{ config(
        materialized='table',
        catalog_name='horizon_catalog',
        alias='ORDERS',
        grants={} if target.name == 'duckdb' else {'select': ['ACCOUNTADMIN']},
        persist_docs={'relation': false, 'columns': false} if target.name == 'duckdb' else {'relation': true, 'columns': true}
    ) }}
    ```

- **`models/marts/orders.yml`**: Turn off the enforced contract (a single contract can't hold both Snowflake and DuckDB type names):

    ```yaml
          contract:
            enforced: false
    ```

- **`macros/insert_freshness_heartbeat.sql`**: Exclude the `duckdb` target (the heartbeat writes to the raw Snowflake source, which isn't attached in a DuckDB session):

    ```jinja
    {% if target.name not in ('ci', 'dev', 'duckdb') %}
    ```

- **Why uppercase `alias`?** Snowflake stores unquoted identifiers in UPPERCASE, and Iceberg catalogs are case-sensitive. DuckDB quotes model names in lowercase, so without the uppercase alias it would look for `"stg_orders"` and miss `STG_ORDERS`.

## Part 7: Build it {#build-it}

This is where it all comes together! You'll build your Iceberg tables across both engines and confirm the DuckDB step ran without any Snowflake compute. Snowflake builds the raw and staging Iceberg parents, then DuckDB reads those same tables to build and write back the final orders model. All of this against the one shared catalog.

### 7.1 Snowflake pass: Build the Iceberg parents (uses Snowflake compute) {#snowflake-pass}

```bash
dbt run --target prod -s +orders --exclude orders
```

This builds `stg_orders` and `order_items` as Snowflake-managed Iceberg tables in `DBT_ICEBERG.RAW`, registered in Horizon. Because you run as `TRANSFORMER`, it owns those tables.

### 7.2 DuckDB pass: The offload (ZERO Snowflake compute) {#duckdb-pass}

```bash
dbt run --target duckdb -s orders
```

DuckDB attaches Horizon, reads `STG_ORDERS` + `ORDER_ITEMS` (fetching temp S3 credentials from Horizon), builds `orders` locally, and commits it back as an Iceberg table — no warehouse involved.

### 7.3 Verify

```bash
dbt show --target duckdb --inline "select count(*) from {{ ref('orders') }}"
```

You should get a real row count (tens of thousands). You'll also see `ORDERS` listed as an **Iceberg table** in Snowsight under `DBT_ICEBERG.RAW` and written entirely by DuckDB.

**Prove it was compute-free:** in Snowsight, open **Admin → Cost Management** (or query `snowflake.account_usage.warehouse_metering_history`). You'll see credits for the `prod` build in 7.1, and **none** for the DuckDB run in 7.2.

## Congratulations!

You've just built a single set of Apache Iceberg tables and transformed them with two different engines! Snowflake for the raw and staging layers, DuckDB for the final orders model, and all against one shared Horizon catalog. The DuckDB step read and wrote governed Snowflake tables without spinning up a warehouse, which means real cost savings, no data copies or lock-in, and governance and lineage that stay intact no matter which engine does the work. This is the foundation of cross-platform dbt Mesh: one project, one catalog, and the freedom to pick the cheapest, fastest engine for every job.

## FAQ

<Expandable alt_header="OAuth token exchange returns `invalid_scope` for every role, even `PUBLIC`.">

The PAT must be sent with an **empty `client_id`** — as the HTTP Basic *password* with no username (`curl -u ":<PAT>"`), which is what `client_id: ""` produces in the DuckDB secret. If you pass a real username as `client_id`, Snowflake tries to resolve it as a registered OAuth client and rejects the scope. Empty client_id is the fix.

</Expandable>

<Expandable alt_header="The exchange returns `Programmatic access token is invalid`." >

The token value is wrong — you likely copied `token_name` instead of the long `token_secret`, or truncated it. Re-create the PAT and copy the `token_secret` carefully.

</Expandable>

<Expandable alt_header="PAT creation or use fails complaining about a network policy.">

Some Snowflake accounts require a network policy to be in effect before a PAT can be created or used. If you hit this, create a network policy scoped to your egress IP range and attach it to your user, then retry. (Intentionally out of scope for this guide's main flow.)

</Expandable>

<Expandable alt_header="DuckDB gets `401 Unauthorized` from the catalog.">

Auth problem. Check: the PAT is valid (test with the curl in Part 4); `client_id` is `""`; `oauth2_scope` is `session:role:TRANSFORMER` and your user actually holds `TRANSFORMER`; and the account in `oauth2_server_uri`/`endpoint` matches the account the PAT was minted in.

</Expandable>

<Expandable alt_header="DuckDB gets `404 Not Found` on `/v1/config`.">

The `warehouse` value in `catalogs.yml` is wrong. For Horizon it's the **Snowflake database name** (`DBT_ICEBERG`), not the `catalogs.yml` entry name.

</Expandable>

<Expandable alt_header="The catalog returns the namespace but lists no tables, or DuckDB can't find a table it should see.">

Two common causes: (1) a role lacks visibility — but if you built as `TRANSFORMER` (this guide) it owns the tables and sees them. If you built as a *different* role, note that `GRANT SELECT ON ALL TABLES` does **not** cover Iceberg tables; you must `GRANT SELECT ON ALL ICEBERG TABLES IN SCHEMA DBT_ICEBERG.RAW TO ROLE TRANSFORMER` (and `FUTURE ICEBERG TABLES`). (2) Case mismatch — see the uppercase-alias note below.

</Expandable>

<Expandable alt_header="`Catalog Error: Table with name raw.stg_orders does not exist`.">

Case sensitivity. Snowflake stores `STG_ORDERS`; DuckDB quotes `"stg_orders"`. Give the Iceberg models an uppercase `alias` (`alias='STG_ORDERS'`). For a whole project you'd standardize identifier casing rather than aliasing each model.

</Expandable>

<Expandable alt_header="`SQL compilation error: Invalid time type scale ... TIMESTAMP_NTZ(9)`.">

Iceberg only supports microsecond timestamps. Cast to `timestamp_ntz(6)`.

</Expandable>

<Expandable alt_header="`403 Forbidden` reading a `.metadata.json` from S3, with `region ''` / `No credentials provided`.">

DuckDB needs storage credentials to read the data files. Set `access_delegation_mode: VENDED_CREDENTIALS` in the `duckdb` catalog block so Horizon vends temporary, region-scoped S3 credentials — no AWS keys required. If this occurs intermittently right after rebuilding a table, just re-run; a fresh process re-fetches current metadata and credentials.

</Expandable>

<Expandable alt_header="`403 Authorization failed` on `POST .../namespaces/RAW/tables` (create).">

The database has no default external volume, so a REST `createTable` can't resolve where to write. Run `ALTER DATABASE DBT_ICEBERG SET EXTERNAL_VOLUME = ICEBERG_EXT_VOL;` (and `SET CATALOG = 'SNOWFLAKE';`). Also confirm `TRANSFORMER` has `CREATE ICEBERG TABLE` on the schema and `USAGE` on the volume.

</Expandable>

<Expandable alt_header="`500 ... Object 'ORDERS' already exists as TABLE`.">

A regular (non-Iceberg) table of the same name already occupies that namespace (e.g. from an earlier full `dbt build`). Drop it: `DROP TABLE IF EXISTS DBT_ICEBERG.RAW.ORDERS;` and re-run so DuckDB can create the Iceberg version.

</Expandable>

<Expandable alt_header="`unknown method: map has no method named warn_once` during grants.">

The dbt-duckdb `apply_grants` macro hits a Fusion incompatibility. Grants are meaningless on DuckDB anyway — make `grant_config` empty on the DuckDB target (`grants={} if target.name == 'duckdb' else {...}`) and remove the project-level `marts` `+grants` so nothing gets merged back in.

</Expandable>

<Expandable alt_header="`Not implemented Error: Only ALTER TABLE is supported for Iceberg`.">

`persist_docs` emits `COMMENT` statements DuckDB's Iceberg writer doesn't support. Disable it on the DuckDB target (`persist_docs={'relation': false, 'columns': false} if target.name == 'duckdb' else {...}`).

</Expandable>

<Expandable alt_header="`Type with name number does not exist` (DuckDB suggests `numeric`).">

An **enforced model contract** is generating a typed `CREATE TABLE` with Snowflake type names (`number`, `timestamp_ntz`) that DuckDB doesn't recognize. A single contract can't satisfy two engines, so set `contract: enforced: false` on models you build on DuckDB.

</Expandable>

<Expandable alt_header="`orders` builds successfully but has 0 rows.">

`stg_orders` came out empty because you built it on the `dev` target, where `limit_in_dev` restricts orders to the last year and the seed data is older. Build the parents on `prod` (or any non-`dev` target).

</Expandable>

<Expandable alt_header="`TRANSFORMER` can't run `count(*)` / `must specify a warehouse`.">

Metadata commands (`show`, `describe`) don't need a warehouse, but queries do. Ensure `GRANT USAGE ON WAREHOUSE COMPUTE_WH TO ROLE TRANSFORMER`. To read row counts without any warehouse, read `summary.total-records` from the Iceberg table metadata via the REST `loadTable` endpoint.

</Expandable>

<Expandable alt_header="How do I extend this beyond `orders`?">

Move the DuckDB-specific overrides (empty `grants`, disabled `persist_docs`) to a **target-aware `marts` config** in `dbt_project.yml` instead of per-model, standardize identifier casing project-wide, and add `catalog_name`/`alias` to each model you want materialized as Iceberg. Everything Snowflake writes, DuckDB can read, and vice-versa.

</Expandable>
