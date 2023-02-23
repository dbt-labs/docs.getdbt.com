---
id: data-catalog
title: Data catalog
description: A data catalog is an inventory of data assets from different parts of the data stack within an organization. This catalog can display metadata, lineage, and business definitions from your different data sources.
displayText: data catalog
hoverSnippet: A data catalog is an inventory of data assets from different parts of the data stack within an organization. This catalog can display metadata, lineage, and business definitions from your different data sources.
---

<head>
    <title>Data catalog: a centralized place for data about your data</title>
</head>

A data catalog is an inventory of data assets from different parts of the data stack within an organization. It helps to connect different parts of your stack by showing how your data relates to one another, all within one central location. A catalog can display metadata, lineage, and business definitions from your different data sources and allows for easy collaboration and governance. Data catalogs allow analytics engineers to properly document all parts of their data stack, making for easy ownership.

## Features of a data catalog

Data catalogs are known for 6 features that make them so powerful for both data teams and busines users: 

- Access to metadata 
- Business glossary functionality
- Built-in data lineage 
- Support collaboration 
- Enhanced data governance
- Varied integrations

### Metadata

Metadata is the data that describes data; this refers to characteristics like who created the dataset, its size, the databases and schemas it contains, and when it was last updated. It tells you where you can find a particular data source in terms of where it lives within your <Term id="data-warehouse" />. Those properties help an analytics engineer fully understand the data and its intricacies before working with it. 

### Business glossary

Business glossaries within a data catalog are helpful for understanding how a dataset and its columns relate back to their specific organization. They often contain information about the business description and purpose of a dataset or model, and they display the business definitions of columns and logic within a dataset. Business glossaries are particularly helpful for knowing which dataset and column to use in your logic when writing models or defining metrics.

### Data lineage

<Term id="data-lineage">Data lineage</Term> provides a holistic view of how data moves through an organization, where it is transformed, protected, and consumed. Lineage shows the relationships between datasets and models across different platforms within your data stack. Lineage is particularly helpful for understanding dependencies between datasets. Depending on the tool you use, catalogs can show it on a dataset or even column level. This way, when you are updating any process within your stack, you can do so with these dependencies in mind.

### Collaboration

Data catalogs make collaboration between data and business teams easy. It allows you to see who owns what datasets from both a technical and organizational perspective. Business teams know who to talk to when data is incorrect or not fresh, while data teams know who to turn to for questions on business context. You can also know things like when a data was last updated, how it's used, or to get more context on your warehouse.

### Data governance

Data governance allows you to control who can access which domains within a catalog or specific datasets. Most data catalogs allow you to organize your data based on a specific area of the business and then limit user access to only their area of expertise. Catalogs also help with governing which datasets meet the data quality standards required for utilization. Many tools display a quality score and let you know when a dataset hasn’t been run in a while or is deprecated, preventing users from using unreliable data sources. 

Data catalogs can also be used to identify specific datasets and columns that contain PII data. This way, teams can have a better understanding of who should and should not have access to sensitive data. Having better clarity over sensitive data will help your business stay compliant and ensure its properly protecting customer information.

### Integrations

Data catalogs are compatible with many other tools in your modern data stack. They typically allow the documentation of your data warehouse, transformation tool, and business intelligence tool to all sit in one central location. This helps to build transparency across the stack and creates a single source of truth for the organization to depend on.

## Types of data catalogs

Like most data tools, there are two different types: an open-source data catalog and an enterprise data catalog. Let’s talk about the differences between these and the pros and cons of each. 

### Open source

Open source data catalogs are free for you to use and often provide a great level of flexibility. You can build a custom solution that meets your exact needs and security requirements. But because they are free, you will be expected to manage the entire platform and set it up. Oftentimes, it’s not as simple as plugging in your various credentials to each tool in your modern data stack. It requires careful reading through the provided documentation and setting up each tool on its own, which often requires a certain threshold of technical skill. This makes for a typically more intense and potentially lengthy set-up process because there may not be experienced people to help you along the way and walk you through the steps.

Open source tools also require maintenance. Oftentimes, settings will change in the connected platforms and it's up to your team to ensure compatibility and fix any breaking changes.

In addition, with open source tools, you often need to host them yourself on a cloud provider of choice if your catalog will see broad use across the team. Depending on what you prefer, you may have to deploy multiple microservices on a platform like AWS or Azure. 

Lastly, you want to keep in mind your end user: Is this data catalog meant to be utilized by the data team or the larger business teams? Business users may have a harder time navigating an open source tool because it’s usually not as easy as logging in with an account. It requires more technical expertise to use effectively. If a business user has trouble with the catalog, it could cause a potential lag in important processes. 

### Enterprise data catalog software

Enterprise data catalogs are different from open source in that they are completely managed by the company that creates them. You pay a fee to use them and are paying for the ongoing support, quick set-up process, and the minimal maintenance that comes with it. You are typically walked through it with a dedicated resource, and the integrations with external tools can be smoother because the vendor has teams dedicated to maintaining those relationships. 

The biggest things to keep in mind with enterprise data catalogs is your budget, use cases, and greater data culture. Can your organization afford to pay for a data catalog tool? While they require fewer engineering resources to maintain, they do come with a price tag. When considering if it is worth spending your money on an enterprise tool, make sure you consider where your business and data teams stand. Is your business at a place where it respects the initiatives put in place by the data team? Are the initiatives big enough where having one would make sense?

Does the data team fully understand the data and its lineage? If they don’t, it's probably too early to put this in front of business users. You want to make sure they are set up for success when being trained to use a new tool.

Do you have sophisticated data models and sources that the business knows how to use? If not, it may be worth focusing on building out the right metrics and models to be used first.

Is the culture data-driven? If business users are caught up in their own processes like Google spreadsheets, they may not even utilize a catalog. You don’t want to pay for a tool that is too sophisticated for where the business and data teams currently stand. Don’t rush the process. 
### Data catalog tools
Data teams may choose to use third-party tools with data cataloging capabilities such as [Atlan](https://ask.atlan.com/hc/en-us/articles/4433673207313-How-to-set-up-dbt-Cloud), Alation, [Collibra](https://marketplace.collibra.com/listings/dbt-lineage-to-collibra-integration/), [Metaphor](https://support.metaphor.io/hc/en-us/articles/9302185081627), [Select Star](https://docs.selectstar.com/integrations/dbt/dbt-cloud), [Stemma](https://docs.stemma.ai/docs/stemma/getting-started/what-we-need-from-you/dbt-integration/), [Castor](https://docs.castordoc.com/integrations/dbt), and others. These tools often integrate directly with your data pipelines and dbt workflows and offer zoomed-in data cataloging and lineage capabilities.

## Conclusion

Data catalogs are a valuable asset to any data team and business as a whole. They allow people within an organization to find the data that they need when they need it and understand its quality or sensitivity. This makes communication across teams more seamless, preventing problems that impact the business in the long run. Weigh your options in terms of whether to go with open source and enterprise, trusting that the decision you land on will be best for your organization.

## Additional reading

- [Why both data cataloging?](https://www.getdbt.com/analytics-engineering/transformation/data-catalog/)
- [Glossary: Data warehouse](/terms/data-warehouse)
