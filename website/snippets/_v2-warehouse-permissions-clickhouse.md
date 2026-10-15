The ClickHouse user that the <Constant name="fusion_engine" /> connects as must be able to run dbt workloads in the target database and read the system tables used for introspection.

### Required ClickHouse objects

Before connecting, these objects must exist or be accessible:

| Object | Purpose |
| --- | --- |
| Service (ClickHouse Cloud) or server (self-managed, single node) | Compute resource |
| Database | Target database. ClickHouse has no separate schema level, so the dbt `schema` maps to a database |
| User | Database user for authentication |

### Core permissions

The following permissions are required for fundamental dbt features:

| Permission | Object | Purpose |
| --- | --- | --- |
| `SELECT` | Tables and views | Read data |
| `INSERT` | Tables | Load models, seeds, and snapshots |
| `ALTER` | Tables | Schema changes (`on_schema_change`), indexes and projections, comments (`persist_docs`), `REPLACE PARTITION` (`insert_overwrite`), and lightweight deletes (`delete+insert`) |
| `TRUNCATE` | Tables | Full-refresh seeds |
| `CREATE TABLE`, `CREATE VIEW`, `CREATE DICTIONARY` | Database | Create materializations, including the intermediate and backup relations used for atomic rebuilds (`EXCHANGE TABLES`, `RENAME TABLE`) |
| `DROP TABLE`, `DROP VIEW`, `DROP DICTIONARY` | Database | Drop or replace objects |


### Metadata operations

<Constant name="fusion" /> reads these ClickHouse system tables:

| System table | Purpose |
| --- | --- |
| `system.tables` | List relations, build the catalog, detect materialized views pointing at a table |
| `system.columns` | Column metadata for the catalog and for schema-change detection |
| `system.databases` | Check whether the target database exists |
| `system.settings` | Capability probes (lightweight deletes, `insert_distributed_sync`) |
| `system.view_refreshes` | Validate refreshable materialized view dependencies |

ClickHouse filters system tables to the objects the user can access, so no separate grant is needed for them.

### Database management

Conditional permissions for database management:

| Permission | Object | When required |
| --- | --- | --- |
| `CREATE DATABASE` | Server | Auto-create the target database when it doesn't exist yet |
