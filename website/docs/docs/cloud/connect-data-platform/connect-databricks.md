---
title: "Connect Databricks"
id: connect-databricks
description: "Setup instructions for connecting Databricks to dbt Cloud"
sidebar_label: "Connect Databricks"
---

The dbt-databricks adapter is maintained by the Databricks team and is verified by dbt Labs. The Databricks team is committed to supporting and improving the adapter over time, so you can be sure the integrated experience will provide the best of dbt and the best of Databricks. Connecting to Databricks via dbt-spark has been deprecated.

## About the dbt-databricks adapter

dbt-databricks is compatible with the following versions of dbt Core in dbt Cloud with varying degrees of functionality. 

| Feature | dbt Versions |
| ----- | ----------- | 
| dbt-databricks | Available starting with dbt 1.0 in dbt Cloud|
| Unity Catalog | Available starting with dbt 1.1 | 
| Python models | Available starting with dbt 1.3 |

The dbt-databricks adapter offers:
- **Easier set up**
- **Better defaults:**
The dbt-databricks adapter is more opinionated, guiding users to an improved experience with less effort. Design choices of this adapter include defaulting to Delta format, using merge for incremental models, and running expensive queries with Photon.
- **Support for Unity Catalog:**
Unity Catalog allows Databricks users to centrally manage all data assets, simplifying access management and improving search and query performance. Databricks users can now get three-part data hierarchies – catalog, schema, model name – which solves a longstanding friction point in data organization and governance.

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Databricks-specific configuration](/reference/resource-configs/databricks-configs).


To set up the Databricks connection, supply the following fields:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Server Hostname | The hostname of the Databricks account to connect to | dbc-a2c61234-1234.cloud.databricks.com |
| HTTP Path | The HTTP path of the Databricks cluster or SQL warehouse | /sql/1.0/warehouses/1a23b4596cd7e8fg |
| Catalog | Name of Databricks Catalog (optional) | Production |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/dbt-databricks.png" title="Configuring a Databricks connection using the dbt-databricks adapter"/>
