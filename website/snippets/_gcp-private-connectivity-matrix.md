## GCP private connectivity matrix

The following charts outline private connectivity options for GCP deployments of <Constant name="cloud" /> ([multi-tenant](/docs/cloud/about-cloud/tenancy)).

**Legend:**

_Availability:_
- ✅ = Available
- ❌ = Not currently available
- \- = Not applicable

_Endpoint type:_
- \* = <Term id="shared-endpoint">Shared endpoint</Term> (all others are <Term id="dedicated-endpoint">dedicated</Term>)

_Tenancy:_ MT (multi-tenant) — [learn more about tenancy](/docs/cloud/about-cloud/tenancy).

:::note About the following matrix tables
These tables indicate whether private connectivity can be established to specific services, considering major factors such as the network and basic auth layers. dbt has validated these configurations using common deployment patterns and typical use cases. However, individual configurations may vary. If you encounter issues or have questions about your environment, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support) for guidance.
:::

:::info Terminology update
These tables use updated terminology for clarity:
- **Connecting to dbt Cloud** = previously "Ingress"
- **Connecting dbt Cloud to managed services** = previously "Egress - DW"
- **Connecting dbt Cloud to self-hosted services** = previously "Egress - VCS"
:::

:::note GCP regional considerations
Some GCP services, such as BigQuery, may have regional restrictions for Private Service Connect endpoints. Refer to [Google's Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect) for service-specific regional availability.
:::

---

### Connecting dbt Cloud to managed services

<Constant name="cloud" /> can establish private connections to managed data platforms and cloud-native services.

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

<Constant name="cloud" /> can establish private connections to your self-hosted services. All self-hosted connections use the <Term id="customer-provisioned">customer-provisioned</Term> model — you are the <Term id="service-producer">service producer</Term> and dbt is the <Term id="consumer">consumer</Term>.

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
      <td>✅</td>
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

For services not explicitly listed above, you may still be able to establish private connectivity using the same <Term id="customer-provisioned">customer-provisioned</Term> approach. For detailed instructions, see [GCP Private Service Connect for self-hosted services](/docs/cloud/secure/gcp/gcp-self-hosted).

If you have questions about whether your specific architecture is supported, [contact dbt Support](/community/resources/getting-help#dbt-cloud-support).

