---
id: edw
title: EDW
displayText: EDW  
hoverSnippet: An Enterprise Data Warehouse (EDW) is sometimes referred to as a database, or a collection of databases that centralize a business's information from multiple sources and applications. 
---

An Enterprise Data Warehouse (EDW) is sometimes referred to as a database, or a collection of databases that centralize a business's information from multiple sources and applications.

The raw information can come from any of the departments within the company like finance, human resources, and marketing and can come from applications that are either first-party sources like applications that are built internally or third-party information that stems from applications created outside of the company. This raw data will not go directly into the EDW, but instead we will only store data that is clean, processed, and personal identifiable information-free data.

Having clean and processed data in the EDW is vital for the success of any analytics program. It will provide historical data for various analytics applications like customer sales or revenue year-over-year analysis. The other impactful use case for this data will be machine learning.  This clean data can be the basis for models to forecast sales and number of subscribers, etc.

EDWs can be set up on-premise, in the cloud and as a hybrid configuration. Setting up an EDW on-premise will mean that the servers on which the warehouse will run will be owned and managed by the business. In the cloud, the EDW is owned and managed by a cloud provider like Amazon Web Service, Google Cloud Platform, and Microsoft Azure. In the hybrid configuration, the warehouse is stored and managed by a company that can replicate across on-premise and cloud like Vertica.

## Data warehouse vs enterprise data warehouse

Technically, the differences between the two manifest based on organizational governance policies and proceudures. Practically, the difference between a <Term id="data-warehouse" /> and an enterprise data warehouse is semantics.  In plain english, often than not, if an organization makes a disctinction between the two, it's because they have one, large warehouse that contains all company's data, and then each department or team might have smaller databases that pull from that centralized data warehouse. In that situation, the large, centralized warehouse would be an enterprise data warehouse, and the smaller, departmental warehouses would be a regular data warehouse.

If your organization only has one data warehouse, the distinction isn't really necessary, but *technically* that could be called an enterprise data warehouse.

### Why is this distinction necessary? 

One of the main distinction is in their uses. If an organization has multiple warehouses, a data warehouse is used as a sort of staging area, where it contains plenty of temporary <Term id="table">tables</Term> and messy datasets. The data here is typically pretty context-heavy, and only the teams that requested that data will be the ones accessing and using it. 

In comparison, an enterprise data warehouse is the result of processes, conventions, and rules to make it more organized as many people have access to this data. Ideally, the smaller data warehouses would pull data from this EDW to create some uniformity in reporting. Because more people rely on the data from that centralized warehouse, a typical EDW has much more data than a data warehouse and governance policies will be much strictier. Organizations would have to assign roles to users that limit access to specific schemas and tables. Accidental exposure to this much larger dataset is much more likely in this instance. This is an important consideration for those looking to ensure regulations are followed and for privacy.

A smaller dataset will mean improved performance and query time. The data warehouses are typically used as messy, staging areas, which will result in less data. A smaller datasets and will therefore be easier to scan and filter, resulting in decreased query time. 

## Enterprise data warehouse use cases

There are a variety of reasons why an organization might opt to have an EDW. The first reason is to store their data in one place and make it easier for the organization to access that data. Another reason is that it makes it easier to analyze the data and figure out what is happening with the company. A third reason why an organization might want to have an EDW is so they can use it as a business intelligence tool, which gives them information on how they are doing in the market.

Organizations may also want an EDW so they can use the information they get from it as a competitive advantage. For example, if they find out who their customers are, what their competitors are doing, or what products people like best, then that information can be used as leverage in business negotiations

### Benefits of an EDW

The most important benefit is that it helps organizations make sense of their data by providing them with a single consistent and accurate source of truth. It also helps in building a 360-degree view of the company by combining different sources of information, such as customer feedback, financial records, product inventory, and marketing insights. All of this information can then be organized in schemas and tables within one EDW where we can scale as we need to compute power. 

Because all of the data is in one place, we can provide access to only those who need access to specific schemas and tables. Keeping these access patterns and changes in only one database will limit the amount of data needed to go through for auditing, and other security regulations.

Certain warehouses like Redshift and Bigquery can provide machine learning algorithms as well, so having all of the data in one EDW can make creating predictions a lot easier.

## Additional reading

- [Glossary: Dimensional modeling](https://docs.getdbt.com/terms/dimensional-modeling)
- [Glossary: Data warehouse](https://docs.getdbt.com/terms/data-warehouse)