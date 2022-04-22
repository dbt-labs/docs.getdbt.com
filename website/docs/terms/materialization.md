---
id: materialization
title: Materialization
displayText: materialization 
hoverSnippet: The exact Data Definition Language (DDL) that dbt will use when creating the model’s equivalent in a data warehouse. 
---
The exact <Term id="ddl">Data Definition Language (DDL)</Term> that dbt will use when creating the model’s equivalent in a data warehouse. It's the manner in which the data is represented, and each of those options is defined either canonically (tables, views, incremental), or bespoke. 

It is important to consider the downstream impacts of your materialization choice on query run times and macro capabilities.

