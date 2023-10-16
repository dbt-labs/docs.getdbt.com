---
title: "About data platform connections"
id: about-connections
description: "Information about data platform connections"
sidebar_label: "About data platform connections"
---
dbt Cloud can connect with a variety of data platform providers including: 
- [Amazon Redshift](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb) 
- [Apache Spark](/docs/cloud/connect-data-platform/connect-apache-spark) 
- [Databricks](/docs/cloud/connect-data-platform/connect-databricks) 
- [Google BigQuery](/docs/cloud/connect-data-platform/connect-bigquery)
- [PostgreSQL](/docs/cloud/connect-data-platform/connect-redshift-postgresql-alloydb)
- [Snowflake](/docs/cloud/connect-data-platform/connect-snowflake)
- [Starburst or Trino](/docs/cloud/connect-data-platform/connect-starburst-trino)

import MSCallout from '/snippets/_microsoft-adapters-soon.md';

<MSCallout />

You can connect to your database in dbt Cloud by clicking the gear in the top right and selecting **Account Settings**. From the Account Settings page, click **+ New Project**.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choose-a-connection.png" title="Choose a connection"/>

These connection instructions provide the basic fields required for configuring a data platform connection in dbt Cloud. For more detailed guides, which include demo project data, read our [Quickstart guides](https://docs.getdbt.com/quickstarts)

## IP Restrictions

dbt Cloud will always connect to your data platform from the IP addresses specified in the [Regions & IP addresses](/docs/cloud/about-cloud/regions-ip-addresses) page.

Be sure to allow traffic from these IPs in your firewall, and include them in any database grants.

Allowing these IP addresses only enables the connection to your <Term id="data-warehouse" />. However, you might want to send API requests from your restricted network to the dbt Cloud API.  For example, you could use the API to send a POST request that [triggers a job to run](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#operation/triggerRun). Using the dbt Cloud API requires that you allow the `cloud.getdbt.com` subdomain. For more on the dbt Cloud architecture, see [Deployment architecture](/docs/cloud/about-cloud/architecture).
