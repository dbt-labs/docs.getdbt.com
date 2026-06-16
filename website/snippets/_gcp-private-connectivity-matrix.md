## GCP private connectivity matrix

The following charts outline private connectivity options for GCP deployments of <Constant name="dbt" /> ([multi-tenant](/docs/platform/about-platform/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

_Tenancy:_ MT (multi-tenant) — [learn more about tenancy](/docs/platform/about-platform/tenancy).

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.

**GCP regional considerations:** Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.
:::

---

### Connecting the dbt platform to managed services (Egress)

<Constant name="dbt" /> can establish private connections to managed data platforms and cloud-native services.

| Service | MT | Setup guide |
|---------|-----|-------------|
| Snowflake | ✅ | [View](/docs/platform/secure/private-connectivity/gcp/gcp-snowflake) |
| Google BigQuery | ✅* | [View](/docs/platform/secure/private-connectivity/gcp/gcp-bigquery) |
| Teradata VantageCloud | ✅ | |

---

### Connecting the dbt platform to self-hosted services (Egress)

All of the services below share a common Private Service Connect setup guide — backend configuration varies by service. Self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

**Setup guide:** [Configuring GCP Private Service Connect for self-hosted services](/docs/platform/secure/private-connectivity/gcp/gcp-self-hosted)

| Service | MT |
|---------|-----|
| GitHub Enterprise Server | ✅ |
| GitLab Self-Managed | ✅ |
| Bitbucket Data Center | ✅ |
| Azure DevOps Server | ✅ |
| Postgres | ✅ |
| Starburst / Trino | ✅ |
| Teradata (self-hosted) | ✅ |

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
