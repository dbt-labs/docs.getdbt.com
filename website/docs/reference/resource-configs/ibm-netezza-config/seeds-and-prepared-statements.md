---
title: "Seeds and prepared statements"
sidebar_label: "Seeds"
description: "Learn how the dbt-ibm-netezza adapter supports all data types in seed files when you define each column type."
---

The `dbt-ibm-netezza` adapter offers comprehensive support for all [datatypes](https://www.ibm.com/docs/en/netezza?topic=nrl-data-types) in seed files. To leverage this functionality, you must explicitly define the data types for each column.

You can configure column data types either in the dbt_project.yml file or in property files, as supported by dbt. For more details on seed configuration and best practices, refer to the [dbt seed configuration documentation](/reference/seed-configs).


### Recommendations

- **Check SQL Documentation:** Review IBM Netezza [SQL command reference ](https://www.ibm.com/docs/en/netezza?topic=dud-netezza-performance-server-sql-command-reference) to create your dbt project.
