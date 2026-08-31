The Snowflake user or service account that <Constant name="fusion_engine" /> connects as must be able to run dbt workloads (queries, metadata, and typical materializations). Grant privileges through a Snowflake role assigned to that user.

### Required Snowflake objects

Before connecting, these objects must exist:

| Object | Purpose |
| --- | --- |
| **Account** | Your Snowflake account identifier |
| **User** | Service account or user for <Constant name="fusion" /> |
| **Role** | Role assigned to the user with required privileges |
| **Warehouse** | Virtual warehouse for compute |
| **Database** | Target database or databases for dbt models |
| **Schema** | Target schema or schemas within the database |

### Core operations 

The following are required permissions for fundamental dbt operations:

| Permission | Object | Purpose |
| --- | --- | --- |
| `USAGE` | Warehouse | Execute queries |
| `USAGE` | Database | Access the database |
| `USAGE` | Schema | Access schemas |
| `SELECT` | Tables or views | Read existing data and sources |
| `CREATE TABLE` | Schema | Create models materialized as tables |
| `CREATE VIEW` | Schema | Create models materialized as views |
| `INSERT` | Tables | Load data into tables |
| `UPDATE` | Tables | Incremental model updates |
| `DELETE` | Tables | Incremental models using delete and insert |
| `TRUNCATE` | Tables | Full refresh of incremental models |
| `DROP` | Tables or views | Replace existing objects |

### Metadata operations

The following are required permissions for dbt metadata operations:

| Permission | Object | Purpose |
| --- | --- | --- |
| `USAGE` | INFORMATION_SCHEMA | Query table and column metadata |
| `DESCRIBE TABLE` | Tables | Get schema information |
| `SHOW OBJECTS` | Schema | List relations in schema |
| `SHOW USER FUNCTIONS` | Schema | Discover UDFs (if used) |

### Schema and database management

The following are conditional permissions for schema and database management:

| Permission | Object | When required |
| --- | --- | --- |
| `CREATE SCHEMA` | Database | <Constant name="fusion" /> should auto-create schemas |
| `CREATE DATABASE` | Account | <Constant name="fusion" /> should auto-create databases |

### Advanced features

The following are optional permissions for advanced features:

| Permission | Object | Feature |
| --- | --- | --- |
| `CREATE STAGE` | Schema | File staging for seeds or snapshots |
| `CREATE FILE FORMAT` | Schema | Custom file formats |
| `CREATE SEQUENCE` | Schema | Sequences |
| `EXECUTE TASK` | Schema | Snowflake tasks |
