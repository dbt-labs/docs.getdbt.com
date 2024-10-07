---
title: "Iceberg Is An Implementation Detail"
description: "This blog will talk about iceberg table support and why it both matters and doesn't"
slug: icebeg-is-an-implementation-detail

authors: [amy_chen]

tags: [table formats, iceberg]
hide_table_of_contents: false

date: 2024-10-04
is_featured: false
---

If you haven’t paid attention to the data industry news cycle, you might have missed the recent excitement centered around an open table format called Apache Iceberg™. It’s one of many open table formats like Delta Lake, Hudi, and Hive. These formats are changing the way data is stored and metadata accessed. They are groundbreaking in many ways.

But I have to be honest: **I don’t care**. But not for the reasons you think.

## What is Iceberg?

To have this conversation, we need to start with the same foundational understanding of Iceberg. Apache Iceberg is a high-performance open table format developed for modern data lakes. It was designed for large-scale datasets, and within the project, there are many ways to interact with it. When people talk about Iceberg, it often means multiple components including but not limited to:

1. Iceberg Table Format - an open-source table format with large-scale data. Tables materialized in iceberg table format are stored on a user’s infrastructure, such as S3 Bucket.
2. Iceberg Data Catalog - an open-source metadata management system that tracks the schema, partition, and versions of Iceberg tables.
3. Iceberg REST Protocol (also called Iceberg REST API) is how engines can support and speak to other Iceberg-compatible catalogs.

If you have been in the industry, you also know that everything I just wrote above about Iceberg could easily be replaced by `Hive,` `Hudi,` or `Delta.` This is because they were all designed to solve essentially the same problem. Ryan Blue (creator of Iceberg) and Michael Armbrust (creator of Delta Lake) recently sat down for this [fantastic chat](https://vimeo.com/1012543474) and said two points that resonated with me:

- “We never intended for people to pay attention to this area. It’s something we wanted to fix, but people should be able to not pay attention and just work with their data. Storage systems should just work.”
- “We solve the same challenges with different approaches.”

At the same time, the industry is converging on Apache Iceberg. [Iceberg has the highest availability of read and write support](https://medium.com/sundeck/2024-lakehouse-format-rundown-7edd75015428).

<Lightbox src="/img/blog/2024-10-04-iceberg-blog/2024-10-03-iceberg-support.png" width="85%" title="Credit to Jacques at Sundeck for creating this fantastic chart of all the Iceberg Support" />


Snowflake launched Iceberg support in 2022. Databricks launched Iceberg support via Uniform last year. Microsoft announced Fabric support for Iceberg in September 2024 at Fabric Con. **Customers are demanding interoperability, and vendors are listening**.

Why does this matter? Standardization of the industry benefits customers. When the industry standardizes - customers have the gift of flexibility. Everyone has a preferred way of working, and with standardization &mdash; they can always bring their preferred tools to their organization’s data.

## Just another implementation detail

I’m not saying open table formats aren't important. The metadata management and performance make them very meaningful and should be paid attention to.  Our users are already excited to use it to create data lakes to save on storage costs, create more abstraction from their computing, etc.

But when building data models or focusing on delivering business value through analytics, my primary concern is not *how* the data is stored—it's *how* I can leverage it to generate insights and drive decisions. The analytics development lifecycle is hard enough without having to take into every detail. dbt abstracts the underlying platform and lets me focus on writing SQL and orchestrating my transformations. It’s a feature that I don’t need to think about how tables are stored or optimized—I just need to know that when I reference dim_customers or fct_sales, the correct data is there and ready to use. **It should just work.**

## Sometimes the details do matter

While table formats are an implementation detail for data transformation &mdash; Iceberg can impact dbt developers when the implementation details aren’t seamless. Currently, using Iceberg requires a significant amount of upfront configuration and integration work beyond just creating tables to get started.

One of the biggest hurdles is managing Iceberg’s metadata layer. This metadata often needs to be synced with external catalogs, which requires careful setup and ongoing maintenance to prevent inconsistencies. Permissions and access controls add another layer of complexity—because multiple engines can access Iceberg tables, you have to ensure that all systems have the correct access to both the data files and the metadata catalog. Currently, setting up integrations between these engines is also far from seamless; while some engines natively support Iceberg, others require brittle workarounds to ensure the metadata is synced correctly. This fragmented landscape means you could land with a web of interconnected components.

## Fixing it

**Today, we announced official support for the Iceberg table format in dbt.** By supporting the Iceberg table format, it’s one less thing you have to worry about on your journey to adopting Iceberg.

With support for Iceberg Table Format, it is now easier to convert your dbt models using proprietary table formats to Iceberg by updating your configuration. After you have set up your external storage for Iceberg and connected it to your platforms, you will be able to jump into your dbt model and update the configuration to look something like this:

<Lightbox src="/img/blog/2024-10-04-iceberg-blog/iceberg_materialization.png" width="85%" title="Iceberg Table Format Support on dbt for Snowflake" />

It is available on these adapters:

- Athena
- Databricks
- Snowflake
- Spark
- Starburst/Trino
- Dremio

As with the beauty of any open-source project, Iceberg support grew organically, so the implementations vary. However, this will change in the coming months as we converge onto one dbt standard. This way, no matter which adapter you jump into, the configuration will always be the same.

## dbt the Abstraction Layer

dbt is more than about abstracting away the DDL to create and manage objects. It’s also about ensuring an opinionated approach to managing and optimizing your data. That remains true for our strategy around Iceberg Support.

In our dbt-snowflake implementation, we have already started to [enforce best practices centered around how to manage the base location](https://docs.getdbt.com/reference/resource-configs/snowflake-configs#base-location) to ensure you don’t create technical debt accidentally, ensuring your Iceberg implementation scales over time. And we aren’t done yet.

That said, while we can create the models, there is a *lot* of initial work to get to that stage.  dbt developers must still consider the implementation, like how their external volume has been set up or where dbt can access the metadata. We have to make this better.

Given the friction of getting launched on Iceberg, over the coming months, we will enable more capabilities to empower users to adopt Iceberg. It should be easier to read from foreign Iceberg catalogs. It should be easier to mount your volume. It should be easier to manage refreshes. And you should also trust that permissions and governance are consistently enforced.

And this work doesn’t stop at Iceberg. The framework we are building is also compatible with other table formats, ensuring that whatever table format works for you is supported on dbt. This way &mdash; dbt users can also stop caring about table formats. **It’s just another implementation detail.**
