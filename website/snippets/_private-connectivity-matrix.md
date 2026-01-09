## Private connectivity feature matrix

The following charts outline private connectivity options across <Constant name="cloud" /> [multi-tenant (MT) and single-tenant (ST)](/docs/cloud/about-cloud/tenancy) deployments.

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

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
      <th>Data platform</th>
      <th>AWS MT</th>
      <th>AWS ST</th>
      <th>Azure MT</th>
      <th>Azure ST</th>
      <th>GCP MT</th>
      <th><Term id="native-provisioned">Provisioning</Term></th>
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

### Connecting dbt Cloud to VCS

<Constant name="cloud" /> can establish private connections to your self-hosted version control systems. All VCS connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

| VCS | AWS MT | AWS ST | Azure MT | Azure ST | GCP MT |
|:----|:------:|:------:|:--------:|:--------:|:------:|
| GitHub Enterprise Server | ✅ | ✅ | ✅ | ✅ | ❌ |
| GitLab Self-Managed | ✅ | ✅ | ✅ | ✅ | ❌ |
| Bitbucket Data Center | ✅ | ✅ | ✅ | ✅ | ❌ |
| AWS CodeCommit | ❌ | ✅ | - | - | - |

---

### Self-hosted services

For services not explicitly listed above, you can establish private connectivity using a <Term id="customer-provisioned">customer-provisioned</Term> approach. This model supports any service that can be placed behind a load balancer and exposed via your cloud platform's private connectivity technology.

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

---

## Terminology

### Parties

| Term | Definition |
|:-----|:-----------|
| **Consumer** | The party that creates a private endpoint to connect to a service. The consumer initiates the connection. |
| **Service producer** | The party that provisions and manages the service that the consumer connects to. The service producer publishes a resource ID that the consumer uses to finalize and establish the connection. |

### Provisioning models

These models describe who acts as the **service producer** (the party that provisions the service that dbt Cloud connects to or that you connect to).

| Term | Definition |
|:-----|:-----------|
| **Native** | The cloud platform (AWS, Azure, GCP) is the service producer for its own services (Redshift, Synapse, BigQuery). You obtain the resource ID from the cloud platform and share it with dbt; dbt is the consumer and creates the private endpoint. |
| **Vendor** | A third-party vendor (Snowflake, Databricks, Teradata) is the service producer. You obtain the resource ID from the vendor and share it with dbt; dbt is the consumer and creates the private endpoint. |
| **Customer-provisioned** | You are the service producer. You generate your own resource ID (endpoint service name, alias, or service attachment URI) and share it with dbt; dbt is the consumer and creates the private endpoint. |
| **dbt-provisioned** | dbt is the service producer. You are the consumer and create the private endpoint in your environment to connect to dbt Cloud. This applies only to connections TO dbt Cloud. |