---
id: data-extraction
title: Data extraction
description: Data extraction is the process by which data is retrieved from multiple sources, often varying in volume and structure.
displayText: data extraction
hoverSnippet: Data extraction is the process by which data is retrieved from multiple sources, often varying in volume and structure.
---

<head>
    <title>Data extraction: The first step of the ELT process</title>
</head>

There is no data work without data. So how do data teams get the data they need? Data extraction is the process by which data is retrieved from multiple sources, often varying in volume and structure. Most data extraction processes are followed by a loading process, where that extracted data is loaded into a central <Term id="data-warehouse" />.

To actually extract said data, teams will often rely on various [ETL tools](https://docs.getdbt.com/terms/elt#elt-tools) or create custom scripts to call API endpoints. Other times data teams may be forced to do some hacky work like manually making and dropping a CSV into an S3 bucket. Definitely a rarity. But not unheard of.

Come take a deep dive into data extraction, the process that allows us data folk to actually play with, well, said data.

## Data extraction process: How does it work?

There are two primary ways modern data teams are using to extract data: <Term id="etl" /> tools and custom scripts.

- **Extraction via ETL tools**: SaaS ETL tools like Fivetran, Airbyte, and more, allow data folks to select connectors or data sources and sync their required data directly to their data warehouses. These platforms reduce the need to write custom API calls to data sources and instead allow data folks to worry more on transforming their data when it hits their data warehouse. 
- **Extraction via custom scripts**: It’s probably inevitable, but at one point, you’re likely to find yourself hacking together a Python script to make API calls to a data source that doesn’t have a connector in an ETL tool. But let’s be real: while this is intimidating, it isn’t the end of the world. Writing and maintaining custom scripts for extracting data from data source APIs is not the most fun and there are real concerns (API limits, access tokens, lack of documentation, changing APIs, writing to external storage or directly to your data warehouse) to look out for, but gear up, read up on some basic curl requests and Python, and you got this.

These two methods above are for automated extraction, processes that you only need to run once (in theory) to get the data you need on a regular basis. For non-automated processes, such as one-time extractions or uploads to your data warehouse, data folks can upload their data to external storage, such as S3 buckets, to load to your data warehouse, or leverage [dbt seeds](/docs/build/seeds).

## Commonly extracted data

Obviously, the type of business you work for and the systems your team uses will determine the data you extract. However, there are usually some common sources that data teams will extract for business users:
- Ad platforms such as Facebook Ads, Google Ads, or Pinterest Ads
- Accounting softwares like Netsuite
- Sales CRMs such as Salesforce or HubSpot
- Backend application databases
- Customer service SaaS products like Zendesk or Kustomer

The data that is typically extracted and loaded in your data warehouse is data that business users will need for baseline reporting, OKR measurement, or other analytics.

:::tip Don’t fix what’s not broken
As we just said, there are usually common data sources that data teams will extract from, regardless of business. Instead of writing transformations for these tables and data sources, leverage [dbt packages](https://hub.getdbt.com/) to save yourself some carpal tunnel and use the work someone else has already done for you :)
:::

## Data extraction tools

If you’re not writing your own extraction scripts, you’re likely using an [ELT tool](https://docs.getdbt.com/terms/elt#elt-tools) to help you extract and load your various data sources into your data warehouse. Below, you’ll find some commonly used tools to help you do just that.

| Tool | Description | Open source option? |
|:---:|:---:|:---:|
| Airbyte | Airbyte is an open-source and cloud service that allows teams to create data extraction and load pipelines. | ✅ |
| Stitch by Talend | Stitch (part of Talend) is another SaaS product that has many data connectors to extract data and load it into data warehouses. | ❌ |
| Fivetran/HVR | Fivetran is a SaaS company that helps data teams extract, load, and perform some transformation on their data. Fivetran easily integrates with modern data warehouses and dbt. They also offer transformations that leverage dbt Core. | ❌ |
| Funnel | Funnel is another product that can extract and load data. Funnel’s data connectors are primarily focused around marketing data sources. | ❌ |

## Data extraction challenges to look out for

There are definitely some considerable considerations in data extraction, mainly around costs and viability.

- **Cadence and costs**: How often does your data need to be synced or refreshed? How often will your stakeholders really be looking at the data? There can be considerable costs to hitting API endpoints or retrieving data via ELT tools depending on the cadence you set for your data extractions. Talk to your stakeholders, understand when folks would leverage fresher data, and run some basic cost-benefit analyses to understand the cadence that works for your data extractions.
- **Viability**: Can you even extract the data your stakeholders need? As analytics engineers, your initial reaction is to check if an ETL tool has an existing connector for it. If it doesn’t, you may have to whip up a script to call the API (if there is one). If there is no API available, well, then it’s time to put on your creativity hat and get hacky!
- **PII concerns**: Oftentimes, data teams may be interested in masking PII data before it even hits their data warehouse. This would involve masking or removing the PII data immediately after extraction and immediately prior to loading the data into your data warehouse. For folks that want to mask PII, but are okay with masking it once it’s in their data warehouse, data teams can create masking policies using dbt packages.
- **Data accuracy**: This is less of a concern for data extracted via ETL tools or custom scripts, but for internal sources, such as static CSV files manually input by someone on your marketing team, you’re going to want to ensure that data is accurate (ideally before it hits your data warehouse). Not the end of the world if it does, but more of a nuisance than anything and something to look out for.

:::tip Testing your data sources
Using dbt, data folks can run automated tests on their raw data that is loaded into their data warehouse via [sources](https://docs.getdbt.com/docs/build/sources).
:::

## Conclusion

Having no data extraction is the equivalent of a conductor not having an orchestra at their disposal: sad. Overall, data extraction in analytics engineering is the process of extracting data, usually via an automated ETL tool or script, for data sources that will later be loaded into a central data warehouse. There are some considerations to look at prior to the data extraction process, such as cost, viability, and PII concerns.

## Further reading

Ready to take a deeper dive into all things data extraction, ELT and dbt? Check out some of our favorite resources below:

- [Glossary: ELT](https://docs.getdbt.com/terms/elt)
- [Glossary: ETL](https://docs.getdbt.com/terms/etl)
- [Four questions to help accurately scope analytics engineering projects](https://www.getdbt.com/blog/4-questions-to-help-you-more-accurately-scope-analytics-engineering-projects/)
- [Five principles that will keep your data warehouse organized](https://www.getdbt.com/blog/five-principles-that-will-keep-your-data-warehouse-organized/)
