import Lifecycle from '/src/components/lifeCycle';

## Private connectivity feature matrix

The following charts outline private connectivity options across <Constant name="cloud" /> [multi-tenant (MT) and single-tenant (ST)](/docs/cloud/about-cloud/tenancy) deployments.

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)
- <Lifecycle status="beta" backgroundColor="#d8d4f0" /> = Reported working but not yet directly tested by dbt

:::note What "Available" means
Availability indicates whether a private endpoint can be established at the network layer. dbt evaluates common configurations, authentication methods, and integration patterns when determining support. However, due to the wide range of customizations possible in customer environments, not every configuration may be covered. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
:::

---

### Connecting to dbt Cloud

Your services can connect to <Constant name="cloud" /> over private connectivity. This is available on Single-Tenant deployments only. All connections to dbt Cloud use the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

<table>
  <thead>
    <tr>
      <th>Connectivity type</th>
      <th>AWS ST</th>
      <th>Azure ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Private <Constant name="cloud" /> access</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Dual access (public + private)</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>

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

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>AWS MT</th>
      <th>AWS ST</th>
      <th>Azure MT</th>
      <th>Azure ST</th>
      <th>GCP MT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GitHub Enterprise Server</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>GitLab Self-Managed</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Bitbucket Data Center</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Azure DevOps Server</td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
      <td>✅</td>
      <td>✅</td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
    </tr>
    <tr>
      <td>AWS CodeCommit</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Postgres</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Spark</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Starburst / Trino</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata (self-hosted)</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

For services not explicitly listed above, you can establish private connectivity using the same <Term id="customer-provisioned">customer-provisioned</Term> approach. This model supports any service that can be placed behind a load balancer and exposed via your cloud platform's private connectivity technology.

To inquire about private connectivity to additional platforms, contact your account team.

**Prerequisites by cloud platform:**

<table>
  <thead>
    <tr>
      <th>Cloud</th>
      <th>Load balancer requirement</th>
      <th>Resource you create</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>AWS</strong></td>
      <td>Network Load Balancer</td>
      <td>VPC Endpoint Service</td>
    </tr>
    <tr>
      <td><strong>Azure</strong></td>
      <td>Standard Load Balancer</td>
      <td>Private Link Service</td>
    </tr>
    <tr>
      <td><strong>GCP</strong></td>
      <td>Internal Proxy Load Balancer</td>
      <td>Service Attachment</td>
    </tr>
  </tbody>
</table>

Once you create the private connectivity resource, share the resource ID (endpoint service name, alias, or service attachment URI) with dbt to establish the connection.

**Setup guides:**
- [AWS PrivateLink for self-hosted services](/docs/cloud/secure/aws/self-hosted)
- [Azure Private Link for self-hosted services](/docs/cloud/secure/azure/self-hosted)
- [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/gcp/self-hosted)

If you have questions about whether your configuration is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
