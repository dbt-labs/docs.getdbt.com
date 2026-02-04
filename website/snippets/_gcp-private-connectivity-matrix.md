
## GCP private connectivity matrix

The following charts outline private connectivity options for GCP deployments of <Constant name="cloud" /> ([multi-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

:::note GCP regional considerations
Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.
:::

### Connecting to data platforms and native services

| Service | MT |
|---------|-----|
| Snowflake | ✅ |
| Google BigQuery* | ✅ |
| Teradata VantageCloud | ✅ |

*<Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

### Connecting to self-hosted services

All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

| Service | MT |
|---------|-----|
| GitHub Enterprise Server | ❌ |
| GitLab Self-Managed | ❌ |
| Bitbucket Data Center | ❌ |
| Azure DevOps Server | ✅ <sup>1</sup> |
| Postgres | ✅ |
| Starburst / Trino | ✅ |
| Teradata (self-hosted) | ✅ |

<sup>1</sup> Reported working but not yet validated by dbt Labs

**Requirements for self-hosted services:**
- Internal Proxy Load Balancer
- Service Attachment

For detailed setup instructions, see [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/private-connectivity/gcp/gcp-self-hosted).
