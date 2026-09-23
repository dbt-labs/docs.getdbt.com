## AWS private connectivity matrix

The following charts outline private connectivity options for AWS deployments of <Constant name="dbt" /> ([multi-tenant and single-tenant](/docs/platform/about-platform/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

_Tenancy:_ MT (multi-tenant) and ST (single-tenant) — [learn more about tenancy](/docs/platform/about-platform/tenancy).

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.
:::

---

### Connecting to the dbt platform (Ingress) <Lifecycle status="beta"/>

Your services can connect to <Constant name="dbt" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model. In this case, dbt is the <Term id="service-producer">service producer</Term> and you are the <Term id="consumer">consumer</Term>.

| Connectivity type | MT | ST | Setup guide |
|-------------------|-----|-----|-------------|
| Private <Constant name="dbt" /> access | ❌ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-ingress) |
| Dual access (public + private) | ❌ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-ingress) |

---

### Connecting the dbt platform to managed services (Egress)

<Constant name="dbt" /> can establish private connections to managed data platforms and cloud-native services.

| Service | MT | ST | Setup guide |
|---------|-----|-----|-------------|
| Snowflake | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-snowflake) |
| &nbsp;&nbsp;Snowflake Internal Stage | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-snowflake) |
| Databricks | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-databricks) |
| Redshift | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-redshift) |
| Redshift Serverless | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-redshift) |
| Amazon Athena w/ AWS Glue | ❌ | ✅ | |
| AWS CodeCommit | ❌ | ✅ | |
| Teradata VantageCloud | ✅ | ✅ | [View](/docs/platform/secure/private-connectivity/aws/aws-teradata) |

---

### Connecting the dbt platform to self-hosted services (Egress)

All of the services below share a common PrivateLink setup guide — backend configuration varies by service. Self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

**Setup guide:** [Configuring AWS PrivateLink for self-hosted services](/docs/platform/secure/private-connectivity/aws/aws-self-hosted)

| Service | MT | ST |
|---------|-----|-----|
| GitHub Enterprise Server | ✅ | ✅ |
| GitLab Self-Managed | ✅ | ✅ |
| Bitbucket Data Center | ✅ | ✅ |
| Azure DevOps Server | ✅ | ✅ |
| Postgres | ✅ | ✅ |
| Spark | ✅ | ✅ |
| Starburst / Trino | ✅ | ✅ |
| Teradata (self-hosted) | ✅ | ✅ |

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
