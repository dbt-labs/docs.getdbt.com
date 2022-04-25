---
id: materialization
title: Materialization
displayText: materialization 
hoverSnippet: The exact Data Definition Language (DDL) that dbt will use when creating the model’s equivalent in a data warehouse. 
---
:::important This page needs some love
This term lacks depth and requires more content. Would you like to contribute your knowledge to this page? [Create a discussion in our GitHub repository](https://github.com/dbt-labs/docs.getdbt.com/discussions) to begin the process of becoming a glossary contributor!
:::

The exact <Term id="ddl">Data Definition Language (DDL)</Term> that dbt will use when creating the model’s equivalent in a data warehouse. It's the manner in which the data is represented, and each of those options is defined either canonically (tables, views, incremental), or bespoke. 

It is important to consider the downstream impacts of your materialization choice on query run times and macro capabilities.

