## Azure private connectivity matrix

The following charts outline private connectivity options for Azure deployments of <Constant name="dbt" /> ([multi-tenant and single-tenant](/docs/platform/about-platform/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

_Tenancy:_ MT (multi-tenant) and ST (single-tenant) — [learn more about tenancy](/docs/platform/about-platform/tenancy).

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.
:::

---

### Connecting to the dbt platform (Ingress)

Your services can connect to <Constant name="dbt" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model. In this case, dbt is the <Term id="service-producer">service producer</Term> and you are the <Term id="consumer">consumer</Term>.

| Connectivity type | MT | ST |
|-------------------|-----|-----|
| Private <Constant name="dbt" /> access | ❌ | ✅ |
| Dual access (public + private) | ❌ | ✅ |

---

### Connecting the dbt platform to managed services (Egress)

<Constant name="dbt" /> can establish private connections to managed data platforms and cloud-native services.

| Service | MT | ST | Setup guide |
|---------|-----|-----|-------------|
| Snowflake | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-snowflake) |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-snowflake) |
| Databricks | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-databricks) |
| Azure Database for PostgreSQL Flexible Server | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-postgres) |
| Azure Synapse | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-synapse) |
| Azure Fabric  <Lifecycle status="beta"/> | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-fabric) |
| Teradata VantageCloud | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/azure/azure-teradata) |

---

### Connecting the dbt platform to self-hosted services (Egress)

All of the services below share a common Private Link setup guide — backend configuration varies by service. Self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

**Setup guide:** [Configuring Azure Private Link for self-hosted services](/docs/platform/secure/private-connectivity/azure/azure-self-hosted)

| Service | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ | ✅ |
| Postgres | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (self-hosted) | ✅ | ✅ |

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
