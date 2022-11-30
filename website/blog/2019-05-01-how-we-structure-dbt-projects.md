---
title: "How We Structure our dbt Projects"
description: "As the maintainers of dbt, and analytics consultants, at Fishtown Analytics we build a lot of dbt projects. Over time, we’ve developed internal conventions on how we structure them."
slug: how-we-structure-our-dbt-projects
canonical_url: https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355

authors: [claire_carroll]

tags: [dbt tutorials]
hide_table_of_contents: false

date: 2019-05-01
is_featured: true
---


As the maintainers of dbt, and analytics consultants, at [Fishtown Analytics](https://www.getdbt.com/dbt-labs/about-us/) (now dbt Labs) we build a lot of dbt projects. Over time, we’ve developed internal conventions on how we structure them.

This article does not seek to instruct you on how to design a final model for your stakeholders — it won’t cover whether you should denormalize everything into one wide master <Term id="table" />, or have many tables that need to be joined together in the BI layer. There are entire books on this topic. Instead, use this as a guide once you’ve already got an idea of what you’re building for how you should break the transformations up into separate dbt models.

<!--truncate-->

It’s important to note that **this is not the only, or the objectively best, way to structure a dbt project**. Rather, this document reflects our current opinions. These opinions are strongly influenced by:

*   our views on data model design; which in turn are influenced by:
*   the kinds of analytics problems we are solving for clients
*   the data stack we typically work within, in which multiple data sources are loaded by third party tools, and the <Term id="data-warehouse" /> is optimized for analytical queries (therefore we aren’t tightly bounded by performance optimization considerations).

Our opinions are **almost guaranteed to change over time** as we update our views on modeling, are exposed to more analytics problems, and data stacks evolve. It’s also worth clearly stating here: the way we structure dbt projects makes sense for our projects, but may not be the best fit for yours! This article exists on Discourse so that we can have a conversation – I would love to know how others in the community are structuring their projects.

In comparison, the (recently updated) [best practices](/guides/best-practices) reflect principles that we believe to be true for any dbt project. Of course, these two documents go hand in hand – our projects are structured in such a way that makes the those principles easy to observe, in particular:

*   Limit references to raw data
*   Rename and recast fields once
*   Group your models in directories
*   Add tests to your models
*   Consider the information architecture of your data warehouse
*   Separate source-centric and business-centric transformations

We also recently held (and recorded) an office hours on this topic – this article provides a high level outline, but there’s a lot more detail and discussion in the [video](https://youtu.be/xzKLh342s08).

Lastly, before I dive in, a huge thank you to Jeremy Cohen for not only teaching me a lot of the material in this article, but also for doing a lot of the groundwork that went into this article – entire sections of this article are in fact lifted from his work.

## Data transformation 101
-----------------------------------------------------

The data in any of our projects has three distinct checkpoints:

1.  **Sources**: Schemas and tables in a source-conformed structure (i.e. tables and columns in a structure based on what an API returns), loaded by a third party tool.
2.  **Staging models**: The atomic unit of data modeling. Each model bears a one-to-one relationship with the source data table it represents. It has the same granularity, but the columns have been renamed, recast, or usefully reconsidered into a consistent format.
3.  **Marts models**: Models that represent business processes and entities, abstracted from the data sources that they are based on.

In a simple project, these may be the only models you build; more complex projects may have a number of intermediate models that help along this journey, as well as accessories to these models (see below).

Still confused? An example might help! Let’s think about a software business that uses both Stripe and Braintree to collect subscription payments. Their three stages of modeling might look like:

1.  **Sources**: Payment records from the Stripe API and payment records from the Braintree API, loaded into their data warehouse by a third party tool.
2.  **Staging models**: Both the Stripe and Braintree payments are recast into a consistent shape, with consistent column names.
3.  **Marts models**: A monthly recurring revenue (MRR) model that classifies revenue per customer per month as new revenue, upgrades, downgrades, and churn, to understand how a business is performing over time. It may be useful to note whether the revenue was collected via Stripe or Braintree, but they are not fundamentally separate models.

Of note here is that there is a distinct change that occurs between the staging and marts checkpoints – sources and staging models are source-centric, whereas marts models are business-centric.

In our dbt projects, this leads us to our first split in our `models/` directory which helps us make this distinction:

```
    ├── dbt_project.yml
    └── models
        ├── marts
        └── staging

```

## Staging raw data
---------------------------------------

The goal of the staging layer is to create staging models. Staging models take raw data, and clean and prepare them for further analysis. For a user querying the data warehouse, a relation with a `stg_` prefix indicates that:

*   Fields have been renamed and recast in a consistent way.¹
*   Datatypes, such as timezones, are consistent.
*   Light cleansing, such as replacing empty string with NULL values, has occurred.
*   If useful, flattening of objects might have occurred.
*   There is a <Term id="primary-key" /> that is both unique and not null (and tested).

Staging models can have joins in them to field additional columns for context or enrichment; add rows through unions and remove them through filters; deduplicate a natural key or hash together a [surrogate one](/blog/sql-surrogate-keys).

Because we often work with multiple data sources, in our `staging` directory, we create one directory per source.


```
    ├── dbt_project.yml
    └── models
        ├── marts
        └── staging
            ├── braintree
            └── stripe
```    

Each staging directory contains at a minimum:


*   One staging model for each object that is useful for analytics:
    *   Named `stg_<source>__<object>`.
    *   Generally materialized as a <Term id="view" /> (unless performance requires it as a table).
*   A `src_<source>.yml` file which contains:
    *   [Source](/docs/building-a-dbt-project/using-sources) definitions, tests, and documentation
*   A `stg_<source>.yml` file which contains
  * [Tests](/docs/build/tests) and [documentation](/docs/building-a-dbt-project/documentation) for models in the same directory

```
    ├── dbt_project.yml
    └── models
        ├── marts
        └── staging
            └── braintree
                ├── src_braintree.yml
                ├── stg_braintree.yml
                ├── stg_braintree__customers.sql
                └── stg_braintree__payments.sql
```        


Some dbt users prefer to have one `.yml` file per model (e.g. `stg_braintree__customers.yml`). This is a completely reasonable choice, and we recommend implementing it if your `.yml` files start to become unwieldy.

### But what about base models?

Earlier versions of the dbt documentation recommended implementing “base models” as the first layer of transformation – and we used to organize and name our models in this way, for example `models/braintree/base/base_payments.sql`.

We realized that while the reasons behind this convention were valid, the naming was an opinion, so in our recent update to the [best practices](/guides/best-practices), we took the mention of base models out. Instead, we replaced it with the principles of “renaming and recasting once” and “limiting the dependencies on raw data”.

That being said, in our dbt projects every source flows through exactly one model of the following form:

```
    with source as (

        select * from {{ source('braintree', 'payments') }}

    ),

    renamed as (

        select
            id as payment_id,
            order_id,
            convert_timezone('America/New_York', 'UTC', createdat) as created_at,
            ...

        from source

    )

    select * from renamed
```    

We still refer to this a base transformation. If your source data is in good shape, this transformation may be all that’s required to build a staging model, and our staging model is this SQL.

However, building a staging model may warrant several models’ worth of cleaning, correcting, and categorizing, or may require a join or union to another source. To ensure our data source flows through a base transformation, we extend our DAG upstream of the staging model, by creating a separate base model, that we then select from.

![27_AM](/img/blog/dbt-project-structure-318751d1b7d09a0abc1627a7f6d219d3a8c0455b_2_690x173.jpeg)

In our dbt projects, we place these base models in a nested `base` subdirectory.

```
    ├── dbt_project.yml
    └── models
        ├── marts
        └── staging
            └── braintree
                ├── base
                |   ├── base.yml
                |   ├── base_braintree__failed_payments.sql
                |   └── base_braintree__successful_payments.sql
                ├── src_braintree.yml
                ├── stg_braintree.yml
                ├── stg_braintree__customers.sql
                └── stg_braintree__payments.sql
```

In our projects, base models:

*   Often use the ephemeral materialization, so they are not exposed to end users querying our warehouse.
*   Are tested in a `base.yml` file within the same directory as the base models.

If we need additional transformations between base and staging models, we create a nested `staging/<source>/intermediate` directory and place these transformations in there.

## Describing a business through `marts`
-------------------------------------------------------------------------------

Marts are stores of models that describe business entities and processes. They are often grouped by business unit: marketing, finance, product. Models that are shared across an entire business are grouped in a core directory.

```
    ├── dbt_project.yml
    └── models
        ├── marts
        |   ├── core
        |   ├── finance
        |   ├── marketing
        |   └── product
        └── staging
```    

There are entire books written on how to design models, which is beyond the scope of this article. In our view of the world, our goal is to build fact and dimension models, that are abstracted from the source data that they rely upon:

*   `fct_<verb>`**:** A tall, narrow table representing real-world processes that have occurred or are occurring. The heart of these models is usually an immutable event stream: sessions, transactions, orders, stories, votes.
*   `dim_<noun>`: A wide, short table where each row is a person, place, or thing; the ultimate source of truth when identifying and describing entities of the organization. They are mutable, though slowly changing: customers, products, candidates, buildings, employees.

Where the work of staging models is limited to cleaning and preparing, fact tables are the product of substantive data transformation: choosing (and reducing) dimensions, date-spining, executing business logic, and making informed, confident decisions.

This layer of modeling is considerably more complex than creating staging models, and the models we _design_ are highly tailored to the analytical needs of an organization. As such, we have far less convention when it comes to these models. Some patterns we’ve found to be useful are:

*   `fct_` and `dim_` models should be materialized as tables within a warehouse to improve query performance. As a default, we use the table materialization, and where performance requires it, we use the incremental materialization.
*   Intermediate transformations required to get to a fact or dimension model are placed in a nested `marts/<mart>/intermediate` directory. They are named `<useful_name>__<transformation_in_past_tense>.sql`. The lack of prefix and use of double underscores indicates that these are intermediate models, not to be trusted, however, it may also be worth hiding these in a different [schema](/docs/building-a-dbt-project/building-models/using-custom-schemas).
*   Models are tested and documented in a `<dir_name>.yml` file in the same directory as the models.
*   Any extra documentation in a [docs block](/docs/building-a-dbt-project/documentation#using-docs-blocks) is placed in a `<dir_name>.md` file in the same directory.

A marts directory may therefore end up looking like:

```
    ├── dbt_project.yml
    └── models
        ├── marts
        │   ├── core
        │   │   ├── core.md
        │   │   ├── core.yml
        │   │   ├── dim_customers.sql
        │   │   ├── fct_orders.sql
        │   │   └── intermediate
        │   │       ├── customer_orders__grouped.sql
        │   │       ├── customer_payments__grouped.sql
        │   │       ├── intermediate.yml
        │   │       └── order_payments__joined.sql
        │   ├── finance
        │   ├── marketing
        │   └── product
        └── staging
```    

This entire project results in the following DAG:

![12_AM](/img/blog/dbt-project-structure-a5567e3711a30c72bbf9c117548452fac476d8c6_2_690x160.jpeg)

## Accessories to data
-------------------------------------------------

There are other kinds of SQL files that find their way into robust dbt projects. In addition to `staging` and `marts`, we find ourselves with model directories such as:

*   `utils`: An `all_days` table. This is useful everywhere, though it never forms the basis for analysis/reporting.
*   `lookups`**:** A user-mapping table, a zipcode-country table, etc. These are as likely to be [CSV seeds](/docs/building-a-dbt-project/seeds) as tables in a production database. You may reference it at several unpredictable points throughout modeling, and maybe even in a BI tool.
*   `admin`**:** Audit logs, warehouse operations, Redshift maintenance, and incremental records of the miscellaneous <Term id="ddl" /> you run to make your project run smoothly.
*   `metrics`**:** Precisely defined measurements taken from fact tables, directly conducive to time-series reporting, and tightly structured so as to allow one-to-one comparison with goals and forecasting. A metrics table lives downstream of dimension and fact tables in your DAG, and it deserves special status.
*   **Packages:** While not a model folder within your main project, packages that include models (like our [snowplow](https://github.com/dbt-labs/snowplow) package) can be configured into custom schema and materialization patterns from `dbt_project.yml`.

In projects where we find ourselves with these additional models, we often leverage [custom schemas](/docs/building-a-dbt-project/building-models/using-custom-schemas) as directories in our warehouse, to logically group the models, choosing a schema name that matches the directory name in our dbt project.

## Final thoughts
-----------------------------------

In this article, building the DAG for a dbt project has been described left to right, starting at sources, and ending with marts models.

However, it’s worth noting that in reality we often first think through a modeling problem from right to left — we start with an idea of the dashboard or report we want to build, then whiteboard the structure of the marts model we need in our warehouse to power this dashboard. On the same whiteboard, we’ll often then work backwards until we reach our source, before we start writing any actual SQL. I’ve found that it’s only once I’ve solved a modeling problem a few times that I get an intuition for how to build a DAG from left to right. In other words: we tend to think about our destination before we start our modeling journey.

* * *

¹We’ve standardized our naming and type conventions in our [dbt coding conventions](https://github.com/dbt-labs/corp/blob/master/dbt_coding_conventions.md).
