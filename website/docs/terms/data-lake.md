---
id: data-lake
title: Data lake
description: A data lake is a data management system used for storing large amounts of data in in its raw, native form as files.
displayText: data lake
hoverSnippet: A data lake is a data management system used for storing large amounts of data in in its raw, native form as files. Data lakes can store any type of data—structured, semi-structured, unstructured—in one centralized place.
---

<head>
    <title>Data lake: an integral addition to the MDS</title>
</head>

A data lake is a data management system used for storing large amounts of data in in its raw, native form as files. Data lakes can store any type of data—structured, semi-structured, unstructured—in one centralized place. Several common data file formats that are widely being used today include CSV, <Term id="json" />, XML, Parquet, and Avro. This makes the data lake a cost-effective and flexible storage container in contrast to the <Term id="data-warehouse" />, where data must be in a structured and tabular format. The primary use case of a data lake in many organizations is to serve as an initial staging area before data is ready to be transformed and aggregated in a data warehouse. 

## How do data lakes provide value?

In the past, some organizations couldn’t store all their data in one centralized place because databases and data warehouses could only store structured, relational data. On top of that, data storage was once cost-prohibitive, hence data teams would have to filter and transform data volumes to smaller sizes first to be able to store them. These challenges have been addressed by cloud data lakes; they allow for scalability, flexibility, and cost savings—all of which are handled by the cloud platform itself. 

### Scalability

Data lakes allow you to scale your storage up or down depending on how much data you need to store at a particular point in time. You no longer have to know and calculate upfront how much storage capacity you need because of the advent of cloud data lakes. In the past, setting up a new data lake involved considerable hardware configuration tasks. Now, all of this can be achieved in a few steps by hitting a few buttons on your web browser or by typing a few lines of code on your computer.

### Flexibility

At times, a data team might know data from a new source could be useful, but they might now know how it would be used yet. Data lakes offer a place to store this data without needing to build a use case for structuring or shaping it first. This is different from the approach that data warehouses take, where it was optimized to store and analyze relational, structured data. In addition to the data lake’s ability to store raw, uncurated data, the advent of data lake query engines (ex. Athena, Dremio, Starburst, etc.) mean that data analysts and data scientists can now perform exploratory data analysis (EDA) on top of a data lake using this layer of abstraction, without having to bring it into the data warehouse first.

### Cost-effectiveness

The rise of the data lake coincided with the cloud computing revolution. Data teams no longer had to worry about making massive upfront hardware investments for data storage. Instead, you pay a usage-based fee dependent on how much data you store and how many compute queries you run.

### Modern approaches

As mentioned earlier, storing data in the past was an expensive endeavor, therefore organizations had to curate and think through what type of data they brought into their data warehouse. This approach is called <Term id="etl">ETL (Extract-Transform-Load)</Term>, where only transformed data ultimately gets stored and analyzed in a data warehouse or data lake. 

The ability to store tons of data in a cost-efficient and flexible way in the data lake gave rise to a new approach to processing data, a technique that aligns with the modern practice of analytics engineering—the ,<Term id="elt">Extract-Load-Transform (ELT)</Term> approach. In this new process, data is immediately loaded to the destination data lake upon extraction from the source. The benefit of this approach is that it allows for flexibility and exploration of new business use cases which may or may not be known initially when data is ingested.

## What are the drawbacks and challenges when using a data lake? 

For all of the advantages of data lakes listed above such as cost-effectiveness and flexibility, they also come with several drawbacks and challenges.

### Inability to do fast reporting

Query performance and speed is one capability area where data warehouses typically trump data lakes. While structuring data first may seem inflexible and rigid at times, it is the right approach to implement when you have analyses and reports that you want to run frequently. The following are several query performance techniques that can only be applied to data warehouses:

| Performance technique | Description | Practical scenario |
|:---:|:---:|:---:|
| Columnar storage | Data is physically organized in columns in a data warehouse rather than rows (in a database) or files (in a data lake)  | Most analysis and reports require pulling only a subset of columns from an entire <Term id="table" />. Columnar storage makes your queries run faster by retrieving only the relevant columns for your analysis |
| Query caching | When a query is executed, the result is temporarily stored for a period of time  | When someone executes a query on a table, the results of that table will be made available right away to the next user who executes the same query, significantly reducing computation time |
| Data partitioning | Grouping similar data together based on selected table dimensions | Many organizations partition their tables based on a dimension that includes a date field. The reason for this is that most analyses only require pulling data on a rolling two-year period. If you want to calculate year-to-date sales this year and compare it to the same period last year, partitioning your data based on date will make your queries run faster by eliminating the need to scan through the entire table first |

That being said, storing it in a data lake first and exploring it with an ad hoc query engine would be the recommended approach if you have a massive data set with a still undefined use case you want to explore. 

### Lack of fine-grained access control 

It is difficult to enforce <Term id="grain">fine-grained</Term> access control on your data when it's in its raw form. Fine-grained access control pertains to granting permissions to a particular subset of your data set by restricting access to certain rows and columns. These two concepts are known as column-level security and row-level security:

- **Column-level security**: A bank may want to anonymize columns that contain personally identifiable information (PII) such as credit card numbers, social security numbers, and so on. To achieve this, analytics engineers use a variety of encryption functions available in their data warehouse. 
- **Row-level security**: Imagine a retailer with a massive table containing millions of rows of sales transactions across all 50 states in the US. These companies may want to dynamically enforce limited querying permissions to end-users based on which state they’re in. For example, when an analyst based in California starts querying the table, the data set would pre-filter itself to only show sales data from California, even if the analyst attempts to query the entire table. This type of row-level data governance is typically better suited for data warehouses than data lakes.

## Data lake use cases

Organizations use data lakes for many different reasons. Most of these reasons ultimately tie back to the three primary benefits of cost-effectiveness, scalability, and flexibility summarized earlier. Below are common use cases that data lakes are able to achieve:

### Data archiving and storage 

Data lakes can support cost-effective archiving of historical data that is no longer being actively used. Most organizations have data retention and lifecycle policies that indicate how business data should be stored and analyzed, where it is typically organized into three tiers: Hot, Warm, and Cold storage. As an example, a company may state that the past two years’ worth of data belongs in the hot tier, data from three to five years ago are in the warm tier, and anything beyond that in the cold tier.

| Storage tier | Access pattern | Description |
|:---:|:---:|:---:|
| Hot | Data that is being used often  | This is primarily the level in which data warehouses lie. At this level, data is highly structured and optimized for reporting and analytics. Data lakes may also lie at this tier to support machine learning and exploratory data analysis use cases |
| Warm | Data that is infrequently accessed | At this level, data is infrequently accessed and stored at a lower cost than in the hot tier. On some occasions, data may need to be transitioned back to the hot tier which cloud computing companies allow you to do with relative ease |
| Cold | Data stored for archiving purposes  | Data in this tier is rarely accessed. Typically, cold data must be retained for regulatory and compliance purposes on a long-term basis, if not indefinitely. |

### Data science and machine learning

Because of a data lake’s ability to store any type of data format, it lends itself well to advanced analytics use cases, especially those that require the use of semi-structured and unstructured data that data warehouses traditionally don’t support. Some examples include:

- **Sentiment analysis**: This is a technique that uses statistics and natural language processing (NLP) algorithms to determine the emotional meaning of communications. Organizations use sentiment analysis to evaluate customer reviews, call center interactions, social media posts, and other related content, all of which require the use of unstructured data sources (e.g. free-form text, audio recordings) 
- **Predictive maintenance**: This is a common use case in the field of manufacturing, mining, and other heavy industries. Organizations take advantage of a data lake’s ability to store machine logs, sensor and telemetry data to predict the probability of a piece of equipment failing before it happens. This enables the company to make proactive actions to service the equipment, thus preventing defects and maximizing resource utilization. 

### Exploratory data analysis (EDA)

Because you don’t need to impose a formal structure for how data is organized in a data lake, you can perform preliminary data exploration on that data, such as calculate summary statistics, discover anomalies and outliers, and plot data visualizations to derive preliminary insights. Commonly referred to as EDA, this is typically conducted as an initial step before formalizing a data science or machine learning use case. 

## Data lake vs. data warehouse

|  |  Data lake | Data warehouse |
|---|---|---|
| Types of data  | Structured, Semi-Structured, Unstructured | Structured  |
| Data stored in  | Folders and files in raw format | Schemas and tabular data format |
| Schema/schema definition | Store data in its raw format, transform the data later | Must know upfront |
| Intended users | Data engineers, analytics engineers, data analysts,  data scientists | Analytics engineers, data analysts,  business analysts |
| Common use cases | Data archiving and storage, data science and machine learning, exploratory data analysis | Business intelligence, dashboarding, reporting and analytics  |

## Data platforms that support data lake workloads

|  Data Platform | Description | Data warehouse |
|:---:|:---:|---|
| Cloudera | Cloudera Open Data Lakehouse is a platform that provides data lake flexibility and data warehouse performance in a single platform.  | Structured  |
| Databricks | Databricks is a cloud-based collaborative data science, data engineering, and data analytics platform that brings the best of data warehouses and data lakes into a single unified platform.  | Schemas and tabular data format |
| Dremio | Dremio is the data lakehouse platform built for SQL and built on open source technologies that both data engineers and data analysts love. Dremio powers BI dashboards and analytics directly on data lake storage. | Must know upfront |
| Snowflake | Snowflake is a fully-managed platform for data warehousing, data lakes, data engineering, data science, and data application development. | Analytics engineers, data analysts,  business analysts |

## Conclusion

The data lake is the younger data management platform compared to its data warehouse counterpart. Because of its unique ability to hold large amounts of data in its native, raw format, it has allowed organizations to store all its data in a centralized place, even if sometimes they don’t have a definitive use case for the data yet. In addition, it serves as a great buffer and landing zone for data before it is ultimately transformed and aggregated in a data warehouse. Lastly, it has unlocked a world of new possibilities by enabling organizations to build data science and machine learning use cases on top of it. The data lake is an integral pillar in the Modern Data Stack and the practice of analytics engineering.

## Additional reading
- [Glossary: Data warehouse](/terms/data-warehouse) 
- [Glossary: ETL](/terms/etl)
- [Glossary: ELT](/terms/elt)
- [Glossary: EDW](/terms/edw) 
