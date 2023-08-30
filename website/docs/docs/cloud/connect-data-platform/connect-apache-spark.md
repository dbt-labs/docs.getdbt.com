---
title: "Connect Apache Spark"
id: connect-apache-spark
description: "Setup instructions for connecting Apache Spark to dbt Cloud"
sidebar_label: "Connect Apache Spark"
---

<Snippet path="dbt-databricks-for-databricks" />

:::note
See [Connect Databricks](#connect-databricks) for the Databricks version of this page.
:::

dbt Cloud supports connecting to an Apache Spark cluster using the HTTP method
or the Thrift method. Note: While the HTTP method can be used to connect to
an all-purpose Databricks cluster, the ODBC method is recommended for all
Databricks connections. For further details on configuring these connection
parameters, please see the [dbt-spark documentation](https://github.com/dbt-labs/dbt-spark#configuring-your-profile).

To learn how to optimize performance with data platform-specific configurations in dbt Cloud, refer to [Apache Spark-specific configuration](/reference/resource-configs/spark-configs).


The following fields are available when creating an Apache Spark connection using the
HTTP and Thrift connection methods:

| Field | Description | Examples |
| ----- | ----------- | -------- |
| Host Name | The hostname of the Spark cluster to connect to | `yourorg.sparkhost.com` |
| Port | The port to connect to Spark on | 443 |
| Organization | Optional (default: 0) | 0123456789 |
| Cluster | The ID of the cluster to connect to | 1234-567890-abc12345 |
| Connection Timeout | Number of seconds after which to timeout a connection | 10 |
| Connection Retries | Number of times to attempt connecting to cluster before failing | 10 |
| User | Optional | dbt_cloud_user |
| Auth | Optional, supply if using Kerberos | `KERBEROS` |
| Kerberos Service Name | Optional, supply if using Kerberos | `hive` |

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/spark-connection.png" title="Configuring a Spark connection"/>
