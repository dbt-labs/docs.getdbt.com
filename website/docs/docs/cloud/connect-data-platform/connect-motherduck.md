---
title: "Connect MotherDuck"
id: connect-motherduck
description: "Setup instructions for connecting MotherDuck to dbt Cloud"
sidebar_label: "Connect MotherDuck"
---

## Overview

dbt Cloud supports connecting to [MotherDuck](https://motherduck.com/) using the dbt-postgres adapter. 

:::note
You must run a Postgres proxy with the `pg_duckdb` extension, which streams queries from dbt Cloud to MotherDuck. See the [MotherDuck dbt Cloud integration guide](https://motherduck.com/docs/integrations/transformation/dbt-cloud/) for a full setup script and configuration details.
:::

**You will need:**
- A Postgres instance with `pg_duckdb` installed (Docker is recommended)
- Your MotherDuck token
- A dbt Cloud account

## dbt Cloud Connection Settings

When creating a MotherDuck connection in dbt Cloud, use the following fields:

| Field     | Description                                                      | Example                                  |
|-----------|------------------------------------------------------------------|------------------------------------------|
| Host Name | The hostname or IP address of your Postgres proxy                | `localhost` or your EC2 public DNS       |
| Port      | The port your proxy is running on (default: 5432)                | `5432`                                   |
| Database  | The logical database to connect to (default: `postgres`)         | `postgres`                               |
| Username  | The Postgres user (default: `postgres`)                          | `postgres`                               |
| Password  | The Postgres password you set in the proxy                       | (your password)                          |
| Schema    | Must use the format `ddb$[database]$[schema]` (see below)        | `ddb$postgres$my_schema`                 |

### Schema Setup
- **Create your schemas in MotherDuck before connecting.** The proxy cannot create new schemas.
- In dbt Cloud, set the `DBT_SCHEMA` as `ddb$[database]$[schema]` (e.g., `ddb$postgres$my_schema`).
- This `ENV_VAR` should vary for prod vs development as well as each user.

### Connecting via an SSH Tunnel

If your Postgres proxy is not publicly accessible, you can connect dbt Cloud via an SSH tunnel. See [SSH Tunnel instructions](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb#connecting-via-an-ssh-tunnel) for details on configuring a bastion host.


## Usage Notes and Limitations

- SQL is executed using a hybrid dialect (Postgres + DuckDB); some idiosyncrasies may occur.
- **Views:** Only stored in Postgres, not in MotherDuck. Use tables for final datasets.
- **Materialization:** Changing a model's materialization between view and table is not supported.
- **Threads:** Use up to 4 threads for dbt runs. If you encounter deadlocks, retry your run.
- **Types:** DuckDB is stricter with numeric types than Postgres; you may need to adjust your model column types.
- **Catalog Sync:** If the Postgres catalog shows tables that don't exist in MotherDuck, create the missing table in MotherDuck to unblock your dbt model.

## Example dbt Cloud Connection Block

```yaml
# Example dbt Cloud connection settings
host: <your-proxy-host>
port: 5432
database: postgres
user: postgres
password: <your-password>
schema: ddb$postgres$my_schema
threads: 4
```

## References
- [MotherDuck dbt Cloud Integration Guide](https://motherduck.com/docs/integrations/transformation/dbt-cloud/)

For troubleshooting connectivity issues (including SSH tunnel timeouts), see the [Redshift/Postgres FAQ](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb#faqs).
