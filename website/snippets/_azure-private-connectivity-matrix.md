## Azure private connectivity matrix

The following charts outline private connectivity options for Azure deployments of <Constant name="cloud" /> ([multi-tenant and single-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**

_Availability:_
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable

_Tenancy:_ MT (multi-tenant) and ST (single-tenant) — [learn more about tenancy](/docs/cloud/about-cloud/tenancy).

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.
:::


---

### Connecting to dbt Cloud (Ingress)

Your services can connect to <Constant name="cloud" /> over private connectivity using the <Term id="dbt-provisioned">dbt-provisioned</Term> model. In this case, dbt is the <Term id="service-producer">service producer</Term> and you are the <Term id="consumer">consumer</Term>.

<table>
  <thead>
    <tr>
      <th>Connectivity type</th>
      <th>MT</th>
      <th>ST</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Private <Constant name="cloud" /> access</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Dual access (public + private)</td>
      <td>❌</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

---

### Connecting dbt Cloud to managed services (Egress)

<Constant name="cloud" /> can establish private connections to managed data platforms and cloud-native services.

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

### Connecting dbt Cloud to self-hosted services (Egress)

The services in this table are deployed as a [self-hosted Private Link service](/docs/cloud/secure/azure/azure-self-hosted). All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

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

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

