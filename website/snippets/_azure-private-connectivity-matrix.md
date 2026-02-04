import Lifecycle from '/src/components/lifeCycle';

## Azure private connectivity matrix

The following charts outline private connectivity options for Azure deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

### Connecting to single-tenant dbt platform

Your services can connect to <Constant name="cloud" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

| Connectivity type | Azure ST |
|-------------------|----------|
| Private <Constant name="cloud" /> access | ✅ |
| Dual access (public + private) | ❌ |

### Connecting to data platforms and native services

| Service | MT | ST |
|---------|-----|-----|
| Snowflake | ✅ | ✅ |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ |
| Databricks | ✅ | ✅ |
| Azure Database for PostgreSQL Flexible Server | ✅ | ✅ |
| Azure Synapse | ✅ | ✅ |
| Azure Fabric | ❌ | ❌ |
| Teradata VantageCloud | ✅ | ✅ |

### Connecting to self-hosted services

All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

| Service | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ | ✅ |
| Postgres | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (self-hosted) | ✅ | ✅ |

**Requirements for self-hosted services:**
- Standard Load Balancer
- Private Link Service

For detailed setup instructions, see [Azure Private Link for self-hosted services](/docs/cloud/secure/private-connectivity/azure/azure-self-hosted).
