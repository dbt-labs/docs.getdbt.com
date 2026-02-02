import Lifecycle from '/src/components/lifeCycle';

## Azure private connectivity matrix

The following charts outline private connectivity options for Azure deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available

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
      <th>Azure ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Private <Constant name="cloud" /> access</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Dual access (public + private)</td>
      <td>❌</td>
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
      <td>Azure Database for PostgreSQL Flexible Server</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Azure Synapse</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Azure Fabric</td>
      <td>❌</td>
      <td>❌</td>
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
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Postgres</td>
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
- Standard Load Balancer
- Private Link Service

For detailed setup instructions, see [Azure Private Link for self-hosted services](/docs/cloud/secure/private-connectivity/azure/azure-self-hosted).
