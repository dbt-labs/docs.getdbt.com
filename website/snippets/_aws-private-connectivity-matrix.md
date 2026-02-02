import Lifecycle from '/src/components/lifeCycle';

## AWS private connectivity matrix

The following charts outline private connectivity options for AWS deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)
- <Lifecycle status="beta" backgroundColor="#d8d4f0" /> = Reported working but not yet directly tested by dbt

:::note What "Available" means
Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
:::

---

### Connecting to dbt Cloud (Single-Tenant only)

Your services can connect to <Constant name="cloud" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

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

### Connecting dbt Cloud to data platforms and native services

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
      <td>Snowflake</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>&nbsp;&nbsp;Snowflake Internal Stage</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Databricks</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Redshift</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Redshift Serverless</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Amazon Athena w/ AWS Glue*</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>AWS CodeCommit*</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

---

### Connecting dbt Cloud to self-hosted services

All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

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

**Requirements for self-hosted services:**
- Network Load Balancer
- VPC Endpoint Service

For detailed setup instructions, see [AWS PrivateLink for self-hosted services](/docs/cloud/secure/private-connectivity/aws/aws-self-hosted).
