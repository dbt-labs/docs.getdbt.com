The Redshift database user that <Constant name="fusion_engine" /> uses must be able to run dbt workloads and read catalog metadata used for introspection.

### Required Redshift objects

Before connecting, these objects must exist or be accessible:

| Object | Purpose |
| --- | --- |
| **Cluster** (provisioned) or **workgroup** (serverless) | Compute resource |
| **Database** | Target database |
| **Schema** | Target schema within the database |
| **User** | Database user for authentication |
| **IAM role or profile** (optional) | For IAM-based authentication |

### Core permissions

The following permissions are required for fundamental dbt features:

| Permission | Object | Purpose |
| --- | --- | --- |
| `USAGE` | Schema | Access the schema |
| `CREATE` | Schema | Create tables and views in the schema |
| `SELECT` | Tables or views | Read data |
| `INSERT` | Tables | Insert data |
| `UPDATE` | Tables | Update data |
| `DELETE` | Tables | Delete data |
| `DROP` | Tables or views | Drop or replace objects |
| `TRUNCATE` | Tables | Truncate tables |

### Metadata operations 

<Constant name="fusion" /> queries these Redshift system relations:

| System relation | Purpose | Permission required |
| --- | --- | --- |
| `SVV_ALL_COLUMNS` | Column metadata | SELECT on the system view |
| `pg_class` | List relations | Access to system catalog |
| `pg_namespace` | Schema information | Access to system catalog |
| `sys_query_detail` | Source freshness (last insert time) | SELECT on the system view |
| `svv_table_info` | List materialized views when the project includes them | SELECT on the system view |
| `svv_mv_info` | List materialized views when the project includes them | SELECT on the system view |

### Schema management 

Conditional permissions for schema management

| Permission | Object | When required |
| --- | --- | --- |
| `CREATE SCHEMA` | Database | Auto-create schemas |
