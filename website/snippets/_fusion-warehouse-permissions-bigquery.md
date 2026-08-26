The Google Cloud identity (service account or user) that <Constant name="fusion_engine" /> uses must have IAM permissions to run jobs, read and write table data, and read metadata <Constant name="fusion" /> uses for introspection and source freshness.

### Required Google Cloud objects

Before connecting, these objects must exist or be accessible:

| Object | BigQuery term | Purpose |
| --- | --- | --- |
| **Project** | GCP project | Your Google Cloud project ID |
| **Dataset** | Dataset | Target dataset (equivalent to a schema) |
| **Service account or user** | IAM identity | Identity for authentication |
| **Location or region** | Location | Data location (for example, `US`, `EU`, `us-east1`) |

### IAM permissions

The following permissions are required for fundamental dbt features::

| Permission | Purpose |
| --- | --- |
| `bigquery.datasets.get` | Access dataset metadata |
| `bigquery.tables.create` | Create tables |
| `bigquery.tables.delete` | Drop or replace tables |
| `bigquery.tables.get` | Read table metadata |
| `bigquery.tables.getData` | Read table data |
| `bigquery.tables.list` | List tables in dataset |
| `bigquery.tables.update` | Update table schema |
| `bigquery.tables.updateData` | Insert, update, or delete rows |
| `bigquery.jobs.create` | Run queries |

The following are optional permissions for additional dbt features:

| Permission | When required |
| --- | --- |
| `bigquery.datasets.create` | Auto-create datasets |
| `bigquery.routines.create` | Create UDFs or stored procedures |
| `bigquery.jobs.get` | Monitor job status |
| `storage.objects.create` | Python models (GCS staging) |
| `dataproc.*` | Python models on Dataproc |

#### Predefined IAM roles

The following roles represent the typical starting point for dbt access:

| Role | Description | Use case |
| --- | --- | --- |
| `roles/bigquery.dataEditor` | Read and write tables in datasets | Standard dbt operations |
| `roles/bigquery.user` | Run jobs, create datasets | Job execution |
| `roles/bigquery.jobUser` | Run jobs only | Minimal query execution |

For Storage Read API access with <Constant name="fusion" />, also grant **BigQuery Read Session User** (`roles/bigquery.readSessionUser`) on the project, as noted in [Connect BigQuery](/docs/platform/connect-data-platform/connect-bigquery#required-permissions).

### Metadata operations

The following are required for fundamental dbt features:

| Query type | SQL or API used | Required permission |
| --- | --- | --- |
| Get table schema | `get_table_schema` API | `bigquery.tables.get` |
| List relations | Query against dataset | `bigquery.tables.list` |
| Source freshness | Query `__TABLES__` metadata | `bigquery.tables.get` |
| Get table stats | Query `INFORMATION_SCHEMA` | `bigquery.tables.get` |
| Create dataset | `CREATE SCHEMA` | `bigquery.datasets.create` |

### INFORMATION_SCHEMA and metadata views

Fusion queries these BigQuery system views:

| View | Purpose | Scope |
| --- | --- | --- |
| `INFORMATION_SCHEMA.TABLES` | List tables | Dataset or region |
| `INFORMATION_SCHEMA.COLUMNS` | Column metadata | Dataset or region |
| `INFORMATION_SCHEMA.VIEWS` | View definitions | Dataset or region |
| `INFORMATION_SCHEMA.PARTITIONS` | Partition information | Dataset only |
| `__TABLES__` (deprecated) | Table modification times | Dataset |

### BigQuery DataFrames (optional) {#bigquery-dataframes}

For BigQuery DataFrames workflows, users typically need additional roles such as `BigQuery Job User`, `BigQuery Read Session User`, `Notebook Runtime User`, `Code Creator`, and `colabEnterpriseUser`. See your Google Cloud admin for exact role names in your organization.
