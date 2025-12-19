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
There are some minimal prerequisites per Cloud (AWS, Azure, and GCP) which if a self-hosted service meets can be considered a supported connectivity type:
- **For AWS:** The self-hosted service must be shared with dbt through [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html)
- **For Azure:** The self-hosted service must be shared with dbt through [Azure PrivateLink](https://learn.microsoft.com/en-us/azure/private-link/create-private-link-service-portal?tabs=dynamic-ip)
- **For GCP:** The self-hosted service must be shared with dbt through a [Private Service Connect (Service Attachment)](/docs/cloud/secure/gcp-self-hosted-psc)

The table below is not a comprehensive list of all supported self-hosted services. The services listed have been tested and validated for private connectivity.

| Connectivity type | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:------------------|:------:|:------:|:--------:|:--------:|:--------:|
| **BitBucket** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitHub Enterprise Server** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitLab Enterprise** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Postgres** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Trino / Starburst** | ✅ | ✅ | ✅ | ✅ | ✅ |
