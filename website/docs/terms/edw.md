---
id: edw
title: EDW
description: The primary difference between an EDW and a regular data warehouse is, well, semantics and perspective. An EDW like any other data warehouse, is a collection of databases that centralize a business's data
displayText: EDW  
hoverSnippet: An Enterprise Data Warehouse (EDW), like any other data warehouse, is a collection of databases that centralize a business's information from multiple sources and applications.
---

<head>
    <title>What does an EDW (Enterprise Data Warehouse) really mean?</title>
</head>

An Enterprise Data Warehouse (EDW), like any other <Term id="data-warehouse" />, is a collection of databases that centralize a business's information from multiple sources and applications. The primary difference between an EDW and a regular data warehouse is, well, semantics and perspective.

The data stored in an EDW comes from all different functions of a company—marketing, finance, engineering, product, and more. The primary goal of an EDW is to provide a central and organized home for both the raw and transformed version of this data. EDWs in modern data practices are typically set-up in the cloud, meaning that the servers used to run the warehouse are owned and managed by a cloud provider such as Snowflake, AWS Redshift, or Google BigQuery.


## Data warehouse vs enterprise data warehouse

![](/img/docs/terms/edw/meme.png)

In an EDW, all departments of an organization store their raw and transformed data in databases within a main warehouse. For organizations that are not calling their data warehouse an EDW and have a more siloed setup, there’s a chance each department each has *their own separate* data warehouse for storage and computation. **But practically, the difference between a data warehouse and an enterprise data warehouse is semantics.**

Organization size, distribution, data complexity, and business needs can all determine whether a company wants a centralized data warehouse or distributed warehouses per function. Nonetheless, if your organization only has one data warehouse that centrally houses all of your data sources, the distinction isn't really necessary, but *technically* that could be called an EDW.

In the world of analytics engineering, most teams have one central data warehouse that houses data from all of their different departments and functions.


### Why is this distinction necessary? 

One of the main distinctions is in an organization’s users and distribution. If an organization has multiple databases, a central data warehouse is used to create separate entities between raw and source data, staging work, and ready-for-use analytics datasets. In this EDW and classic data warehouse setup, data is accessible across an organization, data teams can create <Term id="table">tables</Term> that join data from multiple sources, and users can gain enriched perspectives into their data.

If a company has very siloed departments that manage their own data, budgets, and have little need for crossover with other departments or data sources, emphasizing the difference between a central EDW data warehouse and their own data warehouse could be a necessity for budgeting and governance reasons.

Lastly, the somewhat exponential adoption of cloud data warehouses in the last decade has shifted the terminology from what many people called an EDW to a data warehouse.


## Enterprise data warehouse use cases

There are a variety of reasons why an organization might opt to have an EDW or data warehouse. A centralized and organized data warehouse provide advantages for the following use cases:

- Create clear partitions between raw, staging, and heavily transformed data
- Standardize data definitions and metrics across multiple data sources
- Connect a BI tool to one central data warehouse and surface that data to users across a business

### Benefits of an EDW

Like most other data warehouses, the benefit of an EDW is the ability to store raw and transformed data from multiple sources in one single data warehouse. Users across different departments and data team members embedded in different functions can all have access to the same data. Cloud data warehouses also scale with data and users, making EDWs an appropriate place for organizations to grow their analytics work.

EDWs also help in building a 360-degree view of the company by combining different sources of information, such as customer feedback, financial records, product inventory, and marketing insights. All of this information can then be organized in data marts, schemas, and tables within one EDW that are eventually exposed to a BI tool.

In addition, because all of an organization’s data is stored in one place, data teams can provide access to only those who need access to specific schemas and tables. Keeping these access patterns and changes in only one data warehouse will limit the amount of data needed to go through for auditing and other security regulations.

## Conclusion

An enterprise data warehouse is, in general, like any other data warehouse; it acts as a central home for multiple departments’ raw and transformed data. An EDW is often composed of multiple databases to store raw, staging, development, and production-ready data. The primary benefits for an EDW are centralization, standardization, and accessibility. You probably have a data warehouse setup like an EDW, you’re likely just not calling it that 😉


## Additional reading
EDW, data warehouse, or something different altogether? Check out some of our favorite resources on the fundamental of data storage and organization:

- [Glossary: Dimensional modeling](https://docs.getdbt.com/terms/dimensional-modeling)
- [Glossary: Data warehouse](https://docs.getdbt.com/terms/data-warehouse)