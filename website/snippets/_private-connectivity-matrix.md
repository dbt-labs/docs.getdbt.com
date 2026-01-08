## Private connectivity feature matrix

The following charts outline private connectivity options across <Constant name="cloud" /> multi-tenant (MT) and single-tenant (ST) deployments.

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable

| Connectivity Type                                 | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:--------------------------------------------------|:------:|:------:|:--------:|:--------:|:--------:|
| <b>INGRESS (to <Constant name="cloud" />)</b>                     |        |        |          |          |          |
| Private <Constant name="cloud" /> access                          |   ❌   |   ✅   |    ❌    |    ✅    |    ❌    |
| Dual access (public + private)                    |   ❌   |   ✅   |    ❌    |    ❌    |    ❌    |
| <b>EGRESS - Data platforms (from <Constant name="cloud" />)</b>   |        |        |          |          |          |
| Snowflake                                         |   ✅   |   ✅   |    ✅    |    ✅    |    ✅    |
| &nbsp;&nbsp;Snowflake Internal Stage              |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Databricks                                        |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Redshift                                          |   ✅   |   ✅   |    -     |    -     |    -     |
| Redshift Serverless                               |   ✅   |   ✅   |    -     |    -     |    -     |
| Amazon Athena w/ AWS Glue                         |   ❌   |   ✅   |    -     |    -     |    -     |
| Azure Database for PostgreSQL Flexible Server     |   -    |   -    |    ✅    |    ✅    |    -     |
| Azure Synapse                                     |   -    |   -    |    ✅    |    ✅    |    -     |
| Google BigQuery                                   |   -    |   -    |    -     |    -     |    ✅    |
| Teradata VantageCloud                             |   ✅   |   ✅   |    ✅    |    ✅    |    ✅    |
| <b>EGRESS - VCS (from <Constant name="cloud" />)</b>              |        |        |          |          |          |
| GitHub Enterprise Server                          |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| GitLab Self-Managed                               |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| Bitbucket Data Center                             |   ✅   |   ✅   |    ✅    |    ✅    |    ❌    |
| AWS CodeCommit                                    |   ❌   |   ✅   |    -     |    -     |    -     |

### Self-hosted services

For services not explicitly listed above, you can establish private connectivity using a **self-hosted** approach. This model supports any service that can be placed behind a load balancer and exposed via your cloud platform's private connectivity technology.

**Examples:** AWS EMR (Spark, Hive, Presto), self-managed databases (MySQL, PostgreSQL, SQL Server), custom applications, or any service running in your VPC.

**Prerequisites by cloud platform:**

| Cloud | Load balancer requirement | Resource you create |
|:------|:--------------------------|:--------------------|
| **AWS** | Network Load Balancer | VPC Endpoint Service |
| **Azure** | Standard Load Balancer | Private Link Service |
| **GCP** | Internal Proxy Load Balancer | Service Attachment |

Once you create the private connectivity resource, share the resource ID (endpoint service name, alias, or service attachment URI) with dbt to establish the connection.

**Setup guides:**
- [AWS PrivateLink for self-hosted services](/docs/cloud/secure/vcs-privatelink)
- [Azure Private Link for self-hosted services](/docs/cloud/secure/az-self-hosted-private-link)
- [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/gcp-self-hosted-psc)

If you have questions about whether your configuration is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
