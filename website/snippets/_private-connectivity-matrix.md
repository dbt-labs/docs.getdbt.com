## Private connectivity feature matrix


| Connectivity Type                                 | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:--------------------------------------------------|:------:|:------:|:--------:|:--------:|:--------:|
| <b>INGRESS (to <Constant name="cloud" />)</b>                     |        |        |          |          |          |
| Private <Constant name="cloud" /> Ingress                         |   ❌   |   ✅   |    ❌    |    ✅    |    ❌    |
| Dual <Constant name="cloud" /> Ingress                            |   ❌   |   ✅   |    ❌    |    ❌    |    ❌    |
| <b>EGRESS - DW (from <Constant name="cloud" />)</b>               |        |        |          |          |          |
| Snowflake                                         |   ✅   |   ✅   |    ✅    |    ✅    |    ✅    |
| - Snowflake Internal Stage                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Databricks                                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Postgres (via load balancer)                      |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Azure Database for PostgreSQL Flexible Server     |   -    |   -    |    ✅    |    ✅    |    -     |
| Redshift (Interface)                              |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift (Managed)                                |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift Severless (Interface)                    |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift Serverless (Managed)                     |   ✅   |   ✅   |    -     |    -     |    -     |
| Amazon Athena w/ AWS Glue                         |   ❌   |   ✅   |    -     |    -     |    -     |
| Azure Synapse                                     |   -    |   -    |    ✅    |    ✅    |    -     |
| Azure Fabric (cross-tenant not supported by Azure)|   -    |   -    |    ❌    |    ❌    |    -     |
| Google BigQuery                                   |   -    |   -    |    -     |    -     |    ✅    |
| Teradata - Database Server                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| <b>EGRESS - VCS (from <Constant name="cloud" />)</b>              |        |        |          |          |          |
| GitHub Enteprise Server                           |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| GitLab Enterprise                                 |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| BitBucket                                         |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| AWS CodeCommit                                    |   ❌   |   ✅   |    -     |    -     |    -     |
| Azure DevOps Repos (not supported by Azure)       |   -    |   -    |    ❌    |    ❌    |    -     |
