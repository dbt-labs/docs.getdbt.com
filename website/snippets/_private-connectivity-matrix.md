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

Private connectivity can be established with self-hosted services, provided they can be integrated with each cloud provider's private connectivity mechanism as a producer:

- **AWS:** [AWS PrivateLink](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html)
- **Azure:** [Azure Private Link](/docs/cloud/secure/az-self-hosted-private-link)
- **GCP:** [Private Service Connect (Service Attachment)](/docs/cloud/secure/gcp-self-hosted-psc)

:::important
Self-hosted services can have a virtually infinite number of configurations and architectures. For this reason, dbt Support can only provide accurate guidance on establishing PrivateLink or Private Service Connect (GCP) connections between your self-hosted service and dbt Cloud. Any network guidance beyond this is provided on a best-effort basis. We highly recommend engaging your vendor's support team and documentation for proper configuration of your self-hosted service.
:::

The table below lists some self-hosted services that have been tested.

| Connectivity type | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:------------------|:------:|:------:|:--------:|:--------:|:--------:|
| **BitBucket** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitHub Enterprise Server** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **GitLab Enterprise** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Postgres** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Trino / Starburst** | ✅ | ✅ | ✅ | ✅ | ✅ |
