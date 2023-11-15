---
id: data-warehouse
title: Data warehouse
description: How have data warehouses evolved over the last 40 years? Explore the nuanced changes in use case since Inmon first coined the term.
displayText: data warehouse
hoverSnippet: A data warehouse is a data management system used for data storage and computing that allows for analytics activities such as transforming and sharing data.
---

<head>
    <title>Data warehouses in the modern data stack - dbt Labs</title>
</head>

A data warehouse is a data management system used for data storage and computing that allows for analytics activities such as transforming and sharing data. It helps businesses to capture and store data from external sources. Analytics engineers and data analysts use it to query datasets using SQL, helping to transform them into powerful data models and reports. Data warehouses are the central source of truth for any modern data stack. Data is ingested, transformed, and shared to other tools from the warehouse.

There are two main types of data warehouses — on-prem warehouses and cloud warehouses. An on-prem data warehouse is a physical location where companies need to maintain hardware and software in order to store data. A cloud data warehouse is available anywhere and doesn’t include a physical location that you need to access. In this arrangement, you pay to use the storage space and compute power that is provided and maintained by another company.

## History of data warehouses

While data has been stored throughout history, it wasn’t until the 1980s that technology began to accelerate and the first official data warehouse was created. It was an on-prem warehouse consisting of a lot of computer processing and storage towers, taking up a lot of space. As you can imagine, this caused a lot of problems. It not only took up a lot of physical space, but employees had to maintain the hardware and software of these warehouses. This quickly became expensive and unrealistic for smaller companies without the budget or space. 

When Amazon began scaling their on-prem data warehouses to support their business, they noticed an opportunity to sell compute capacity to other businesses in order to save costs. This is when Redshift, Amazon’s cloud data warehouse product, came to be. Shortly after, other tech giants like Google and Microsoft who were also building data infrastructure followed suit. 

Now, you can be anywhere and access the power of an online warehouse. You no longer need to maintain the infrastructure yourself but can pay a company to do this for you. This is cheaper and allows for faster data capabilities.


## Why businesses need data warehouses

Data warehouses were once unrealistic due to the costs associated with them. Now that cloud warehouses make them available to nearly everyone, they have a plethora of benefits to offer businesses. Cloud warehouses allow for scalability, availability, cost savings, and increased security- all of which are handled by the provider themself.

### Scalability

Data warehouses allow you to scale computing up or down depending on how fast you need your transformations to run and how much you are willing to spend. You can turn computing resources on or off as well in order to save on costs. 

### Availability 

Data warehouses are always available. While latency may vary based on source and destination locations, your data can be accessed anywhere, at any time. This is ideal for the remote culture that we are currently living in, where anyone can work from anywhere. 

### Cost savings

Because you no longer need to maintain all of the infrastructure, you can save on costs related to maintenance. Because the data warehouse companies manage so much data, they are able to unlock cost-savings that you wouldn’t be able to otherwise. 

### Security 

Data warehouses offer advanced security features that ensure your data is always secure. They often directly handle certain compliance strategies needed with healthcare and financial data, eliminating the need for you to do this yourself. They also have features such as roles and users which help you control who has access to your data. But we will get into this more later. 

## Potential business use cases

Businesses can leverage data warehouses for many different reasons. Most of these reasons end up savings time and money for the business, whether directly or indirectly.

### Consolidating all of your data in one place

First, a data warehouse acts as a single source of truth for all of your data. Rather than having all of your data spread across different platforms, it is available to you in one place. This allows you to standardize all of your core metrics and data definitions, rather than depending on the metrics calculated by platforms like Google and Facebook. If you find that different metrics don’t align across platforms, a data warehouse acts as a dependable source for the right metric. Rather than relying on external platforms, you now have one that centralizes all of your data. 

Not to mention, you will save your analytics engineer and data analyst a few headaches. They would otherwise have to manually pull needed data from various sources. Not having a single source of truth decreases your data quality, wastes your data team’s precious time, and makes it difficult to combine data from different sources. 

### Ability to control who has access and the type of access they have

Data warehouses have extensive security features which allow you to control who has access to what. You have the ability to give someone as little or extensive permissions as you wish. Warehouses give you the ability to create users and assign them roles. Each role has its own set of permissions to which databases and <Term id="table">tables</Term> it can see. Then, you can also choose who is allowed to query those tables or even update and delete them. 

When anyone in your organization can easily access your data, bad things can happen. You risk the potential of important data being deleted, incorrectly edited, or inappropriately accessed. Data warehouses users, roles, policies, and security measures can help ensure data is in the right hands of the right people.

### Fast reporting

Because all of your data is located in the same place, it allows for faster reporting compared to pulling data from many different sources. A central location allows for you to quickly access and query millions of rows of data, allowing transformations and reporting to be done much faster. 

## Data platforms that support data warehousing workloads

| **Data platform** | **Description** | 
|---|---|
| Snowflake | Snowflake is a fully-managed platform for data warehousing, data lakes, data engineering, data science, and data application development. |
| Databricks | Databricks is a cloud-based collaborative data science, data engineering, and data analytics platform that combines the best of data warehouses and data lakes into a lakehouse architecture. |
| Google BigQuery | Google BigQuery is a serverless, highly scalable data warehouse that comes with a built-in query engine. |
| Amazon Redshift | Amazon Redshift is a fully-managed petabyte-scale cloud-based data warehouse designed for large scale data set storage and analysis. |
| Postgres | PostgreSQL is an advanced, enterprise class open source relational database that supports both SQL (relational) and <Term id="json" /> (non-relational) querying. |

## Data warehouse vs data lake

A data lake is a system where you store, process, and query unstructured, semi-structured, and structured data at almost any scale. The main difference between a data warehouse and a data lake is the type and way data is stored. Data warehouses contain structured data that is meant to organize data for analytics use. Data lakes can contain pretty much any kind of data—structured or unstructured—and data is usually left in its raw format until it's ready to use. Compare that to data warehouses, whose primary goal is to be a place for data teams to store both raw and transformed, usable data.

## Conclusion

Data warehouses have come a long way [in the last 40 years](https://www.getdbt.com/blog/future-of-the-modern-data-stack/). They began as a physical location with huge costs associated with them to a system available to anyone, anywhere at an affordable cost. They have the power to centralize all of your business’s data, allowing for faster analytics operations, standardized KPIs, and a single source of truth. All businesses need a data warehouse in order to operate quickly and efficiently with data that they can rely on. The question isn’t whether or not you need a data warehouse, but which data warehouse you should choose. Make a list of the key features needed for your business and use that to assess the options above. 

## Additional reading

- [Operational analytics](https://www.getdbt.com/analytics-engineering/use-cases/operational-analytics/)
- [Glossary: ETL](https://docs.getdbt.com/terms/etl/)
- [Glossary: ELT](https://docs.getdbt.com/terms/elt/)

