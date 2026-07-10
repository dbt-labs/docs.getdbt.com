---
title: "Seeds"
sidebar_label: "Seeds"
description: "Learn how the dbt-watsonx-presto adapter supports all watsonx.data Presto data types in seed files."
---

The `dbt-watsonx-presto` adapter offers comprehensive support for all [watsonx.data Presto datatypes](https://www.ibm.com/support/pages/node/7157339) in seed files. To leverage this functionality, you must explicitly define the data types for each column.

You can configure column data types either in the dbt_project.yml file or in property files, as supported by dbt. For more details on seed configuration and best practices, refer to the [dbt seed configuration documentation](/reference/seed-configs).
