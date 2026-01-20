import Lifecycle from '/src/components/lifeCycle';

## AWS private connectivity matrix

The following charts outline private connectivity options for AWS deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable
- MT = Multi-tenant
- ST = Single-tenant
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)
- <Lifecycle status="beta" backgroundColor="#d8d4f0" /> = Reported working but not yet directly tested by dbt

:::note What "Available" means
Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
:::

---

### Connecting to dbt Cloud (Single-Tenant only)

Your services can connect to <Constant name="cloud" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model. In this case, dbt is the <Term id="service-producer">service producer</Term> and you are the <Term id="consumer">consumer</Term>.

<table>
  <thead>
    <tr>
      <th>Connectivity type</th>
      <th>AWS ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Private <Constant name="cloud" /> access</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Dual access (public + private)</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

---

### Connecting dbt Cloud to data platforms

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>MT</th>
      <th>ST</th>
      <th>Provisioning</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Snowflake</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>&nbsp;&nbsp;Snowflake Internal Stage</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>Databricks</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
    <tr>
      <td>Redshift</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Redshift Serverless</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Amazon Athena w/ AWS Glue*</td>
      <td>❌</td>
      <td>✅</td>
      <td><Term id="native-provisioned">Native</Term></td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
      <td>✅</td>
      <td>✅</td>
      <td><Term id="vendor-provisioned">Vendor</Term></td>
    </tr>
  </tbody>
</table>

For <Term id="vendor-provisioned">Vendor</Term> and <Term id="native-provisioned">Native</Term> provisioned services, the vendor or cloud platform is the <Term id="service-producer">service producer</Term>. You obtain the resource ID from them and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the VPC endpoint.

---

### Connecting dbt Cloud to self-hosted services

<Constant name="cloud" /> can establish private connections to your self-hosted services. All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>MT</th>
      <th>ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GitHub Enterprise Server</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>GitLab Self-Managed</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Bitbucket Data Center</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Azure DevOps Server</td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
    </tr>
    <tr>
      <td>AWS CodeCommit</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Postgres</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Spark</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Starburst / Trino</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata (self-hosted)</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

For services not explicitly listed above, you can establish private connectivity using the same <Term id="customer-provisioned">customer-provisioned</Term> approach. This model supports any service that can be placed behind a load balancer and exposed via AWS PrivateLink.

To inquire about private connectivity to additional platforms, contact your account team.

#### Prerequisites

| Requirement | Value |
|-------------|-------|
| Load balancer | Network Load Balancer |
| Resource you create | VPC Endpoint Service |
| Resource ID to share with dbt | Endpoint service name |

Once you create the VPC Endpoint Service, share the endpoint service name with dbt to establish the connection.

For detailed setup instructions, see [AWS PrivateLink for self-hosted services](/docs/cloud/secure/aws/aws-self-hosted).

If you have questions about whether your configuration is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
