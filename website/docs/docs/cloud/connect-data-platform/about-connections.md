---
title: "About data platform connections"
id: about-connections
description: "Information about data platform connections"
sidebar_label: "About data platform connections"
pagination_next: "docs/cloud/connect-data-platform/connect-microsoft-fabric"
pagination_prev: null
---
dbt Cloud can connect with a variety of data platform providers including: 
- [AlloyDB](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
- [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
- [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark)
- [Azure Synapse Analytics](/docs/cloud/connect-data-platform/connect-azure-synapse-analytics)
- [Databricks](/docs/cloud/connect-data-platform/connect-databricks) 
- [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery)
- [Microsoft Fabric](/docs/cloud/connect-data-platform/connect-microsoft-fabric)
- [PostgreSQL](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)
- [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)
- [Starburst or Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)

You can connect to your database in dbt Cloud by clicking the gear in the top right and selecting **Account Settings**. From the Account Settings page, click **+ New Project**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choose-a-connection.png" title="Choose a connection"/>

These connection instructions provide the basic fields required for configuring a data platform connection in dbt Cloud. For more detailed guides, which include demo project data, read our [Quickstart guides](https://docs.getdbt.com/guides)

## Connection management

:::info Connections are moving!

Up until July 2024, connections were nested under projects. One dbt Cloud project could only have one connection, which was re-used across all its environments. Extended attributes were leveraged to switch warehouse instances depending on the environment for a given project. 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-legacy-model.png" title="Previous connection model"/>

We are rolling out an important change that moves connection management to the account level. The following connection management section describes these changes. 

This feature is being rolled out in phases over the coming weeks. 

:::

Warehouse connections are an account level resource. As such you can find them under **Accounts Settings** > **Connections**:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-list.png" title="Connection list"/>

Warehouse connections can be re-used across projects. If multiple projects all connect to the same warehouse, you should re-use the same connection in order to streamline your management operations. Connections are assigned to a project via an environment. 

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-new-model.png" title="Connection model"/>

As shown above, a project with 2 environments can target between 1 and 2 different connections. If you want to separate your production environment from your non-production environment, use multiple connections for a single project.

### Migration from project level connections to account level connections

As we roll-out account level connections, you should not expect any interruption of service in your current usage (IDE, CLI, jobs...).

But to fully utilize the value of account level connections, you may have to re-thing how you assign and use connections across projects and environments.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout.png" title="Typical connection setup post rollout"/>

Please read all of the potential actions below before beginning to work on your connections, as depending on the final outcome you wish to attain you may want to take different first steps.

- Initial clean-up (connection list)
  - Delete un-used connections (with 0 environment)
  - Re-name connections to a temporary naming scheme, to better understand where each is used

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-2.png" title="Post initial clean-up"/>

- Decide on a granularity 
  - Define an intent for each connection, usually a combination of warehouse/database instance, intended use (dev/prod…), and administrative surface (which teams/projects will want to change that connection together)
  - Try to aim for a minimization of the need for local overrides (like extended attributes)
  - Settle on a naming convention - we recommand you name connections after the server hostname and distinct intent/domain/configuration - it will be easier to re-use connections across projects this way

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-3.png" title="Granularity determined"/>

- De-duplication (connection list + environment details - not touching extended attributes for now)
  - Based of the granularity decided above, decide which connection should remain among groups of duplicates, and update every relevant environment to leverage that connection
  - Delete un-used connections (with 0 environment) as you go
  - All de-duplications are not wanted. If you want connections to be maintained by 2 different groups of users, you may want to maintain 2 identical connections to the same warehouse so each group can evolve them as they see fit without impacting the other group
  - Do not update extended attributes at this stage

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-4.png" title="Connections de-duplicated"/>

- Normalization
  - Undertsand how new connections should be created to avoid local overrides. If you currently use extended attributes to override the warehouse instance in your production environment - you should instead create a new connection for that instance, and wire your production environment to it, removing the need for the local overrides
  - Create new connections, update relevant environments to target these connections, removing now unecessary local overrides (which may not be all of them!)
  - Test the new wiring by triggering jobs or starting IDE sessions

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/connections-post-rollout-5.png" title="Connections normalized"/>

## IP Restrictions

dbt Cloud will always connect to your data platform from the IP addresses specified in the [Regions & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) page.

Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

Allowing these IP addresses only enables the connection to your <Term id="data-warehouse" />. However, you might want to send API requests from your restricted network to the dbt Cloud API.  For example, you could use the API to send a POST request that [triggers a job to run](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#operation/triggerRun). Using the dbt Cloud API requires that you allow the `cloud.getdbt.com` subdomain. For more on the dbt Cloud architecture, see [Deployment architecture](/docs/cloud/about-cloud/architecture).
