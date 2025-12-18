## Private connectivity feature matrix

The following feature charts outline the availability of private connectivity features across <constant name="dbt_platform" /> [multi-tenant (MT) and single-tenant (ST)](/docs/cloud/about-cloud/tenancy) instances.

**Legend:**
- ✅ = Available
- ❌ = Not currently supported
- \- = Not applicable

### Ingress into dbt Cloud

| Connectivity type | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:------------------|:------:|:------:|:--------:|:--------:|:--------:|
| Private <Constant name="cloud" /> Ingress | ❌ | ✅ | ❌ | ✅ | ❌ |
| Dual <Constant name="cloud" /> Ingress | ❌ | ✅ | ❌ | ❌ | ❌ |

---

### Egress from dbt Cloud to services managed by Cloud Provider or 3rd party

| Connectivity type | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:------------------|:------:|:------:|:--------:|:--------:|:--------:|
| **Amazon Athena** w/ AWS Glue | ❌ | ✅ | - | - | - |
| **AWS CodeCommit** | ❌ | ✅ | - | - | - |
| **Azure Database for PostgreSQL Flexible Server** | - | - | ✅ | ✅ | - |
| **Azure DevOps Repos**<br/>(not supported by Azure) | - | - | ❌ | ❌ | - |
| **Azure Fabric**<br/>(cross-tenant not supported by Azure) | - | - | ❌ | ❌ | - |
| **Azure Synapse** | - | - | ✅ | ✅ | - |
| **Databricks** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Google BigQuery** | - | - | - | - | ✅ |
| **Redshift (Interface)** | ✅ | ✅ | - | - | - |
| **Redshift (Managed)** | ✅ | ✅ | - | - | - |
| **Redshift Serverless (Interface)** | ✅ | ✅ | - | - | - |
| **Redshift Serverless (Managed)** | ✅ | ✅ | - | - | - |
| **Snowflake** | ✅ | ✅ | ✅ | ✅ | ✅ |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Teradata** | ✅ | ✅ | ✅ | ✅ | ❌ |

---

### Egress from dbt Cloud to Self-Hosted service

| Connectivity type | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:------------------|:------:|:------:|:--------:|:--------:|:--------:|
| **BitBucket** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitHub Enterprise Server** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitLab Enterprise** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Postgres** | ✅ | ✅ | ✅ | ✅ | ❌ |
