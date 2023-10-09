---
id: materialization
title: Materialization
description: A materialization is the exact Data Definition Language (DDL) that dbt will use when creating the model’s equivalent in a data warehouse.
displayText: materialization 
hoverSnippet: The exact Data Definition Language (DDL) that dbt will use when creating the model’s equivalent in a data warehouse. 
---

<head>
    <title> What does materialization mean in the context of dbt?</title>
</head>

:::important This page could use some love
This term would benefit from additional depth and examples. Have knowledge to contribute? [Create an issue in the docs.getdbt.com repository](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose) to begin the process of becoming a glossary contributor!
:::

The exact <Term id="ddl">Data Definition Language (DDL)</Term> that dbt will use when creating the model’s equivalent in a <Term id="data-warehouse" />. It's the manner in which the data is represented, and each of those options is defined either canonically (tables, views, incremental), or bespoke. 

It is important to consider the downstream impacts of your materialization choice on query run times and macro capabilities.

