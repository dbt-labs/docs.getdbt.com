## Private connectivity feature matrix

The following charts outline private connectivity options across <Constant name="cloud" /> [multi-tenant (MT) and single-tenant (ST)](/docs/cloud/about-cloud/tenancy) deployments.

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

:::note What "Available" means
Availability indicates whether a private endpoint can be established at the network layer. dbt evaluates common configurations, authentication methods, and integration patterns when determining support. However, due to the wide range of customizations possible in customer environments, not every configuration may be covered. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
:::

---

### Connecting to dbt Cloud

Your services can connect to <Constant name="cloud" /> over private connectivity. This is available on Single-Tenant deployments only. All connections to dbt Cloud use the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

| Connectivity type | AWS ST | Azure ST |
|:------------------|:------:|:--------:|
| Private <Constant name="cloud" /> access | ✅ | ✅ |
| Dual access (public + private) | ✅ | ❌ |

---

### Connecting dbt Cloud to data platforms

<Constant name="cloud" /> can establish private connections to your data platforms.

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>AWS MT</th>
      <th>AWS ST</th>
      <th>Azure MT</th>
      <th>Azure ST</th>
      <th>GCP MT</th>
      <th>Provisioning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Snowflake</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>&nbsp;&nbsp;Snowflake Internal Stage</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>Databricks</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>Redshift</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Redshift Serverless</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Amazon Athena w/ AWS Glue*</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Azure Database for PostgreSQL Flexible Server</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Azure Synapse</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Azure Fabric</td>
      <td>-</td>
      <td>-</td>
      <td>❌</td>
      <td>❌</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Google BigQuery*</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
  </tbody>
</table>

---

### Connecting dbt Cloud to self-hosted services

<Constant name="cloud" /> can establish private connections to your self-hosted services. All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

| Service | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:--------|:------:|:------:|:--------:|:--------:|:------:|
| GitHub Enterprise Server | ✅ | ✅ | ✅ | ✅ | ❌ |
| GitLab Self-Managed | ✅ | ✅ | ✅ | ✅ | ❌ |
| Bitbucket Data Center | ✅ | ✅ | ✅ | ✅ | ❌ |
| Azure DevOps Server | - | - | ✅ | ✅ | - |
| AWS CodeCommit | ❌ | ✅ | - | - | - |
| Postgres | ✅ | ✅ | ✅ | ✅ | ✅ |
| Spark | ✅ | ✅ | - | - | - |
| Starburst / Trino | ✅ | ✅ | ✅ | ✅ | ✅ |
| Teradata (self-hosted) | ✅ | ✅ | ✅ | ✅ | ✅ |

For services not explicitly listed above, you can establish private connectivity using the same <Term id="customer-provisioned">customer-provisioned</Term> approach. This model supports any service that can be placed behind a load balancer and exposed via your cloud platform's private connectivity technology.

To inquire about private connectivity to additional platforms, contact your account team.

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
