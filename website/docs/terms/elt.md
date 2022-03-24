---
id: elt
title: ELT
displayText: ELT  
hoverSnippet: ELT, or "Extract, Load, Transform" has emerged as the dominant paradign for how to manage information flows in a modern data warehouse. 
---

### What does this mean to me?

ELT, or "Extract, Load, Transform" has emerged as the dominant paradign for how to manage information flows in a modern data warehouse. This represents a fundamental shift from how data previously was handled when ETL or Extract, Transform Load was the way most companies used their date. 

In an ETL workflow, data is *extracted* from a data source via an API [glossary link] and *loaded* into a target data warehouses or data like (often these loads are managed via a data loading tool [glossary link]). These pipelines are commonly managed by the data team and figuring out the best strategies for loading your data sources is a key skillset for analytics engineers to master.

Shifting from ETL to ELT means that you no longer have to capture your transformations during the initial loading of the data into the database. Rather you are able to load all of your data, then build transformations on top of it. Rather than every run of your ETL process being 

Data teams report that the ELT workflow has several advantages over the traditional ETL workflow. ELT enables you to create <Term id="idempotent" /> [hopeful link to glossary for idempotence] data workflows.

- Recreate Historical Transformations
- Trace Model Dependencies
- QA test analytics code changes

### Learn More
[The Case for the ELT Workflow](https://www.getdbt.com/analytics-engineering/case-for-elt-workflow/)

### Yelp Review

Having your data streams be ETL and non-idempotent puts you one mistyped query away from having bad data that you have to live with for years. No thank you! It’s idempotence for me.
