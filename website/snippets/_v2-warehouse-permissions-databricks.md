The Databricks user or service principal that <Constant name="fusion_engine" /> uses must have privileges on the catalog and schemas where models run, plus access required for metadata queries. Requirements depend on whether you use Unity Catalog or the legacy Hive Metastore.

### Required Databricks objects

Before connecting, these objects must exist or be accessible:

| Object | Purpose |
| --- | --- |
| **Workspace** | Your Databricks workspace URL (host) |
| **SQL warehouse or cluster** | Compute resource (using `http_path`) |
| **Catalog** | Unity Catalog or Hive Metastore catalog |
| **Schema** | Target schema within the catalog |
| **User or service principal** | Identity for authentication |

### Unity Catalog

Required access for the Unity Catalog:

| Permission | Object | Purpose |
| --- | --- | --- |
| `USE CATALOG` | Catalog | Access the catalog |
| `USE SCHEMA` | Schema | Access schemas |
| `SELECT` | Tables or views | Read existing data and sources |
| `CREATE TABLE` | Schema | Create models materialized as tables |
| `CREATE VIEW` | Schema | Create models materialized as views |
| `MODIFY` | Tables | Insert, update, and delete data |
| `CREATE SCHEMA` | Catalog | Auto-create schemas (if needed) |

### Hive Metastore

Required access for the legacy Hive Metastore:

| Permission | Object | Purpose |
| --- | --- | --- |
| `USAGE` | Database | Access the database |
| `SELECT` | Tables | Read data |
| `CREATE` | Database | Create tables and views |
| `MODIFY` | Tables | Modify data |

### Metadata operations

The following are required for fundamental dbt features:

| Query type | SQL used | Required permission |
| --- | --- | --- |
| Get table schema | `DESCRIBE TABLE` or `DESCRIBE TABLE EXTENDED` | SELECT on table |
| Get table schema (DBR 16.2+) | `DESCRIBE TABLE EXTENDED ... AS JSON` | SELECT on table |
| List relations | Query `INFORMATION_SCHEMA.TABLES` | USE CATALOG and USE SCHEMA |
| Source freshness | Query `INFORMATION_SCHEMA.TABLES` for `last_altered` | USE CATALOG |
| Get view definition | Query `SYSTEM.INFORMATION_SCHEMA.VIEWS` | Access to system catalog |
| Create schemas | `CREATE SCHEMA IF NOT EXISTS` | CREATE SCHEMA on catalog |

### Python models

Optional permissions for environments using Python models

| Permission | Object | Purpose |
| --- | --- | --- |
| Workspace API access | `/api/2.0/workspace/*` | Create notebook directories |
| Notebook import | Workspace | Import Python notebooks |
| Job execution | Cluster or warehouse | Run Python models |
