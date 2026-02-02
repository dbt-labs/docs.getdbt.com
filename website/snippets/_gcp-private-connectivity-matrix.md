import Lifecycle from '/src/components/lifeCycle';

## GCP private connectivity matrix

The following charts outline private connectivity options for GCP deployments of <Constant name="cloud" /> ([multi-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**
- ✅ = Available
- ❌ = Not currently available
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)
- <Lifecycle status="beta" backgroundColor="#d8d4f0" /> = Reported working but not yet directly tested by dbt

:::note What "Available" means
Availability indicates whether a private endpoint can be established at the network layer. If you have questions about a specific use case, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).
:::

:::note GCP regional considerations
Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.
:::

---

### Connecting dbt Cloud to data platforms and native services

<table>
  <thead>
    <tr>
      <th>Service</th>
      <th>MT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Snowflake</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Google BigQuery*</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
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
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>GitHub Enterprise Server</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>GitLab Self-Managed</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Bitbucket Data Center</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Azure DevOps Server</td>
      <td>✅ <Lifecycle status="beta" backgroundColor="#d8d4f0" /></td>
    </tr>
    <tr>
      <td>Postgres</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Starburst / Trino</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata (self-hosted)</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

**Requirements for self-hosted services:**
- Internal Proxy Load Balancer
- Service Attachment

For detailed setup instructions, see [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/private-connectivity/gcp/gcp-self-hosted).
