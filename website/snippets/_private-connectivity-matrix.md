## Private connectivity feature matrix

The following charts outline private connectivity options across <Constant name="dbt" /> [multi-tenant (MT) and single-tenant (ST)](/docs/platform/about-platform/tenancy) deployments.

**Legend:**

_Availability:_
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable

_Endpoint type:_
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.
:::

:::info Terminology update
These tables use updated terminology for clarity:
- **Connecting to dbt Cloud** = previously "Ingress"
- **Connecting dbt Cloud to managed services** = previously "Egress - DW"
- **Connecting dbt Cloud to self-hosted services** = previously "Egress - VCS"
:::

---

### Connecting to dbt Cloud

Your services can connect to <Constant name="dbt" /> over private connectivity. This is available on Single-Tenant deployments only. All connections to dbt Cloud use the <Term id="dbt-provisioned">dbt-provisioned</Term> model.

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
      <td>Private <Constant name="dbt" /> access</td>
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

### Connecting dbt Cloud to managed services

<Constant name="dbt" /> can establish private connections to managed data platforms and cloud-native services.

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
      <td>Snowflake</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>&nbsp;&nbsp;Snowflake Internal Stage</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Databricks</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>❌</td>
    </tr>
    <tr>
      <td>Redshift</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Redshift Serverless</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Amazon Athena w/ AWS Glue*</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>AWS CodeCommit*</td>
      <td>❌</td>
      <td>✅</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Database for PostgreSQL Flexible Server</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Synapse</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Azure Fabric</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
      <td>✅</td>
      <td>-</td>
    </tr>
    <tr>
      <td>Google BigQuery*</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Teradata VantageCloud</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
  </tbody>
</table>

---

### Connecting dbt Cloud to self-hosted services

<Constant name="dbt" /> can establish private connections to your self-hosted services. All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model.

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
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
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

For services not explicitly listed above, you may still be able to establish private connectivity using the same <Term id="customer-provisioned">customer-provisioned</Term> approach. For detailed instructions, see the self-hosted services guide for your cloud platform.

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

