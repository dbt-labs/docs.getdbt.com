The following charts outline private connectivity options across <Constant name="cloud" /> [multi-tenant (MT) and single-tenant (ST)](/docs/cloud/about-cloud/tenancy) deployments.

### Scope of this matrix

This matrix focuses on one question: **can a private endpoint be established between dbt Cloud and the service at the network layer?** Availability (✅) means dbt Cloud supports creating a private endpoint to that service using the cloud platform's private connectivity technology (AWS PrivateLink, Azure Private Link, or GCP Private Service Connect).

Beyond the network layer, the possibilities for application-layer configurations, authentication methods, and custom architectures are extensive. Not every combination has been tested. This matrix does not account for:
- Application-layer configurations or feature-specific requirements
- Custom architectures unique to your environment
- Service-specific limitations that may affect functionality after the private endpoint is established

For detailed setup instructions, refer to the individual configuration guides. If you have a custom configuration and are unsure whether it's supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- ST = Single-Tenant only
- \- = Not applicable

## Terminology

### Parties and roles

| Term | Definition |
|:-----|:-----------|
| **Cloud platform** | The underlying cloud infrastructure: AWS, Azure, or GCP. |
| **Service provider** | The party that publishes a service for private access. This can be a third-party vendor (Snowflake, Databricks) or the cloud platform itself (Redshift, Synapse, BigQuery). When dbt Cloud is the service provider, your services connect to dbt Cloud. |
| **Consumer** | The party that creates a private endpoint to connect to a service. When dbt Cloud is the consumer, it connects to your services. |

### Provisioning models

| Term | Definition |
|:-----|:-----------|
| **Native** | The cloud platform provisions the private connectivity infrastructure for its own services (Redshift, Synapse, BigQuery). You obtain the resource ID from the cloud platform and share it with dbt; dbt creates the endpoint. |
| **Vendor** | A third-party vendor (Snowflake, Databricks, Teradata) provisions the private connectivity infrastructure. You obtain the resource ID from the vendor and share it with dbt; dbt creates the endpoint. |
| **Customer-provisioned** | You create and manage the private connectivity infrastructure. You generate your own resource ID (endpoint service name, alias, or service attachment URI) and share it with dbt. |

### Endpoint types

| Term | Definition | Isolation model |
|:-----|:-----------|:----------------|
| **Dedicated endpoint** | A private endpoint created specifically for your account. Used with Native, Vendor, and Customer-provisioned setups. | Network isolation + access controls (authentication, authorization, etc.) |
| **Shared endpoint** | A private endpoint maintained by dbt that multiple customers use. Traffic is routed through a common endpoint. | Access controls only (authentication, authorization, etc.) |

---

## Connecting dbt Cloud to your services

dbt Cloud can establish private connections to your services. The table below shows all supported services with their provisioning model and endpoint type.

| Service | AWS | Azure | GCP | Provisioning | Endpoint |
|:--------|:---:|:-----:|:---:|:-------------|:---------|
| **Amazon Athena** w/ AWS Glue | ✅ | - | - | Native | Shared |
| **Azure Database for PostgreSQL Flexible Server** | - | ✅ | - | Native | Shared |
| **Databricks** | ✅ | ✅ | - | Vendor | Dedicated |
| **Google BigQuery** | - | - | ✅ | Native | Shared |
| **Redshift** | ✅ | - | - | Native | Dedicated |
| **Redshift Serverless** | ✅ | - | - | Native | Dedicated |
| **Snowflake** | ✅ | ✅ | ✅ | Vendor | Dedicated |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ | ❌ | Vendor | Dedicated |
| **Teradata VantageCloud** | ✅ | ✅ | ✅ | Vendor | Dedicated |

### Customer-provisioned connections

For customer-provisioned connectivity, you create and manage the private connectivity infrastructure and share access with dbt. This model supports any service that can be placed behind a load balancer and exposed via the cloud platform's private connectivity technology. All customer-provisioned connections use dedicated endpoints.

**Prerequisites:**

Your service must be exposed via the cloud platform's private connectivity technology:

| Cloud | Load balancer requirement | Resource you create |
|:------|:--------------------------|:--------------------|
| **AWS** | Network Load Balancer | VPC Endpoint Service |
| **Azure** | Standard Load Balancer | Private Link Service |
| **GCP** | Internal Proxy Load Balancer* | Service Attachment |

*Other GCP load balancer types may be compatible, but Internal Proxy Load Balancer is the only type tested by dbt.

You must be able to grant dbt access to your endpoint.

**Setup guides:**
- [AWS PrivateLink for self-hosted services](/docs/cloud/secure/vcs-privatelink)
- [Azure Private Link for self-hosted services](/docs/cloud/secure/az-self-hosted-private-link)
- [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/gcp-self-hosted-psc)

If you have questions about whether your configuration is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

---

## Connecting to dbt Cloud

Your services can connect to dbt Cloud over private connectivity. This is available on Single-Tenant deployments only.

| Connectivity type | AWS ST | Azure ST |
|:------------------|:------:|:--------:|
| Private <Constant name="cloud" /> access | ✅ | ✅ |
| Dual access (public + private) | ✅ | ❌ |
