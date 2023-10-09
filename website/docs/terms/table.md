---
id: table
title: Table
description: "Read this guide to understand how tables work in dbt."
displayText:  table 
hoverSnippet: In simplest terms, a table is the direct storage of data in rows and columns.  Think excel sheet with raw values in each of the cells.  
---
:::important This page could use some love
This term would benefit from additional depth and examples. Have knowledge to contribute? [Create an issue in the docs.getdbt.com repository](https://github.com/dbt-labs/docs.getdbt.com/issues/new/choose) to begin the process of becoming a glossary contributor!
:::

In simplest terms, a table is the direct storage of data in rows and columns.  Think excel sheet with raw values in each of the cells.  

Here is an example of a table:

| character_id | first_name   | last_name | email                 |
| ------------ | ------------ | --------- | --------------------- |
| 01           | Frodo        | Baggins   | frodo@lotr.com        |
| 02           | Bilbo        | Baggins   | bilbo@theshire.co.uk  |
| 03           | Gandalf      | The Grey  | greywizard1@gmail.com |

Tables do use storage in your <Term id="data-warehouse" />. The data can be queried directly because you are directly pulling from the raw data itself. If a particular table was created by underlying data, the table will not be automatically updated. 

This table definition applies to most data warehouses, however, there are different flavors of tables for different warehouses.  For example, Snowflake has transient and temporary tables that support different features.

## Why are tables useful?

Tables are an excellent choice for persisting transformed data in your warehouse at the time of execution. However, if the underlying data used is changed, the table will not reflect the underlying changes.  If that is something you need, dbt Labs recommends <Term id="view">views</Term>.
