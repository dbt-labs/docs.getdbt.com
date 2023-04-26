---
title: "How we reduced a 6-hour runtime in Alteryx to 9 minutes with dbt and Snowflake"
description: Learn how the folks at Indicium Tech leveraged the modularity and visibility features of dbt to reduce a 6-hour runtime in Alteryx to only 9 minutes by implementing a refactoring workflow.
authors: [arthur_marcon, lucas_bergodias, christian_vanbellen]
slug: framework-refactor-alteryx-dbt
tags: [analytics craft]
hide_table_of_contents: false
date: 2023-04-25
is_featured: true
---

Alteryx is a visual data transformation platform with a user-friendly interface and drag-and-drop tools. Nonetheless, Alteryx may have difficulties to cope with the complexity increase within an organization’s data pipeline, and it can become a suboptimal tool when companies start dealing with large and complex data transformations. In such cases, moving to dbt can be a natural step, since dbt is designed to manage complex data transformation pipelines in a scalable, efficient, and more explicit manner. Also, this transition involved migrating from on-premises SQL Server to Snowflake cloud computing. In this article, we describe the differences between Alteryx and dbt, and how we reduced a client's 6-hour runtime in Alteryx to 9 minutes with dbt and Snowflake at Indicium Tech.

<!--truncate-->

## Introduction

Transforming data to follow business rules can be a complex task, especially with the increasing amount of data collected by companies. To reduce such complexity, data transformation solutions designed as drag-and-drop tools can be seen as more intuitive, since analysts can visualize the steps taken to transform data. One example of a popular drag-and-drop transformation tool is Alteryx which allows business analysts to transform data by dragging and dropping operators in a canvas. The graphic interface of Alteryx Designer is presented in **Figure 1**.

<Lightbox src="/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure1.png" title="Figure 1 — Alteryx Designer workflow interface" />

Nonetheless, as data workflows become more complex, Alteryx lacks the modularity, documentation, and version control capabilities that these flows require. In this sense, dbt may be a more suitable solution to building resilient and modular data pipelines due to its focus on data modeling.

**This article reports our experience migrating a large client's data workflow from Alteryx to dbt over the course of three months. After model refactoring, model runtime was reduced from 6 hours to 9 minutes in dbt, with clearer lineage of models and better documentation and version control.**

To that end, we:

- Defined which models would be prioritized together with the client's team,
- Defined which approach would be used to refactor Alteryx workflows to dbt models,
- Audited refactored models to make sure they matched the outputs from the original Alteryx workflow, and
- Replaced clients' data sources to the dbt refactored models.

We hope that our experience can be useful for analytics engineers who are looking for a high-level framework to help in the transition from Alteryx workflows to dbt, and that it can help them to see the bigger picture in model refactoring.

## Who isn't this post for?

While we feel that dbt is a better transformation tool than Alteryx for most use cases, we acknowledge that a migration from Alteryx to dbt isn’t appropriate for everyone. Alteryx is designed for data analysts, but its capabilities are well-suited for business users, including marketing, sales, accounting, and HR. Alteryx may be a good enough tool when:

- You have a small number of transformations
- The transformations are relatively simple
- Transformations don't need to run frequently
- You want non-technical users to manage this process

Focusing more on data pipeline visibility and a friendlier user experience, Alteryx excels while working with smaller, more understandable data flows, where the Analytics Engineer (AE) can really visualize how the data is being transformed from the source all the way downstream to each output.

When it comes to handling complex data structures, dbt has several features that make it superior to Alteryx. As we will see ahead with more details, in a data stack transition context, when long and complex data flows are common, dbt is often faster than Alteryx. That happens for a few reasons (**Table 2**):

| Aspect | dbt | Alteryx |
| --- | --- | --- |
| Development experience | Command-line interface and IDE | Graphical user interface |
| Goal | Designed for data transformation and modeling | Data manipulation and analysis capabilities |
| Optimization | Takes advantage of query optimization capabilities | It does not reuse the same source that has already been executed by a model and runs it again |
| Run logic | Processes only changed data for large data sets (incremental run) | Processes all data every time it is run |

*<center>**Table 2** — High-level comparison between dbt and Alteryx</center>*

## A step-by-step guide on how we moved Alteryx workflows into dbt models

### Case description

This blog post reports a consulting project for a major client at Indicium Tech®, which will be kept anonymous. The client is a global technology company that specializes in providing enterprise content management and automation solutions. Several data analytic softwares were implemented by the organization to store and analyze data. Because the data transformation step is not concentrated in one single software, analyzing and transforming data has gotten increasingly complex and expensive over time. Especially, because the company purchased many data transformation tools (such as Alteryx, Tableau Prep, Power BI and SQL Server Stored Procedures) that were used across different teams. This hampered having one single source of truth and a centralized data transformation platform.

When the client hired Indicium, they had dozens of Alteryx workflows built and running daily solely for the marketing team, which was the focus of the project. For the marketing team, the Alteryx workflows had to be executed in the correct order since they were interdependent, which means one Alteryx workflow used the outcome of the previous one, and so on. The main Alteryx workflows run daily by the marketing team took about 6 hours to run. Another important aspect to consider was that if a model had not finished running when the next one downstream began to run, the data would be incomplete, requiring the workflow to be run again. The execution of all models was usually scheduled to run overnight and by early morning, so the data would be up to date the next day. But if there was an error the night before, the data would be incorrect or out of date. **Figure 3** exemplifies the scheduler.

<Lightbox src="/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure3.png" title="Figure 3 — Example of Alteryx schedule workflow" />

<Term id="data-lineage">Data lineage</Term> was a point that added a lot of extra labor because it was difficult to identify which models were dependent on others with so many Alteryx workflows built. When the number of workflows increased, it required a long time to create a view of that lineage in another software. So, if a column's name changed in a model due to a change in the model's source, the marketing analysts would have to map which downstream models were impacted by such change to make the necessary adjustments. Because model lineage was mapped manually, it was a challenge to keep it up to date.

One of our main objectives was to refactor the Alteryx workflows that the marketing team utilized every day. As you may already suspect, this refactoring was done by creating models in dbt. The construction and description of how this refactoring was done is presented next.

### How we refactored (a step-by-step guide based on our experience)

Below we provide a high-level framework with the steps we followed to refactor the Alteryx workflows into dbt:

![Figure 4 — Steps followed for Alteryx to dbt model refactoring](/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure4.png)
*<center>Figure 4 — Steps followed for Alteryx to dbt model refactoring</center>*

#### Step 1: Start by refactoring smaller Alteryx workflows and then move on to more complex ones

Understanding where to begin the refactoring process is very important, as it directly impacts the client's perception of value delivery. For some clients, it may be better to start with minor models to understand the best approach to model refactoring. Starting with shorter and less complex Alteryx workflows can be a way of creating a proof of concept and having small/quick wins. Also, this approach can be used to provide evidence of dbt's superior run performance for skeptical clients.

On the other hand, some clients may prefer to start with their most important or most used models to have the major business intelligence reports running on dbt as soon as possible. Although this approach allows for greater value delivery, it will probably take longer for AEs to refactor these workflows due to their complexity of transformations and steps involved in the workflow.

We adopted a mixed approach by starting with one or two simpler workflows to gain experience and confidence with the refactoring process and then moving on to refactoring the client's most important workflows. This approach provides for a great balance between time and value delivery.

#### Step 2: Identify the source models and refactor the Alteryx from left to right

The first step is to validate all data sources and create one <Term id="cte">common table expression (CTE)</Term> for each source referenced in the specific Alteryx workflow being refactored, so that it is easy to reuse them throughout the model.

It is essential to click on each data source (the green book icons on the leftmost side of **Figure 5**) and examine whether any transformations have been done inside that data source query. It is very common for a source icon to contain more than one data source or filter, which is why this step is important. The next step is to follow the workflow and transcribe the transformations into SQL queries in the dbt models to replicate the same data transformations as in the Alteryx workflow.

<Lightbox src="/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure5.png" title="Figure 5 — Alteryx workflow" />


For this step, we identified which operators were used in the data source (for example, joining data, order columns, group by, etc). Usually the Alteryx operators are pretty self-explanatory and all the information needed for understanding appears on the left side of the menu. We also checked the documentation to understand how each Alteryx operator works behind the scenes.

We followed dbt Labs' guide on how to refactor legacy SQL queries in dbt and some [best practices](https://docs.getdbt.com/guides/migration/tools/refactoring-legacy-sql). After we finished refactoring all the Alteryx workflows, we checked if the Alteryx output matched the output of the refactored model built on dbt.

#### Step 3: Use the `audit_helper` package to audit refactored data models

Auditing large models, with sometimes dozens of columns and millions of rows, can be a really tough task to execute manually. It is humanly impossible to validate columns one by one, joining tables by their primary key and measuring compatibility through hand-made SQL. Fortunately, there are a couple of dbt packages built entirely for the purpose of automating this process!

In this project, we used [the `audit_helper` package](https://github.com/dbt-labs/dbt-audit-helper), because it provides more robust auditing macros and offers more automation possibilities for our use case. To that end, we needed to have both the legacy Alteryx workflow output table and the refactored dbt model materialized in the project’s data warehouse. Then we used the macros available in `audit_helper` to compare query results, data types, column values, row numbers and many more things that are available within the package. For an in-depth explanation and tutorial on how to use the `audit_helper` package, check out [this blog post](https://docs.getdbt.com/blog/audit-helper-for-migration). **Figure 6** graphically illustrates the validation logic behind audit_helper.

<Lightbox src="/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure6.png" title="Figure 6 - Audit_helper data validation logic" />

#### Step 4: Duplicate reports and connect them to the dbt refactored models

With the models refactored and audited, it is time to plug them in the BI report tool. Although some will be brave enough to plug the refactored model directly into the original BI report, we recommend duplicating the BI report and connecting this replica to the newly refactored dbt model.

This approach allows you to compare the two reports side by side and check how data behaves in the visualizations created. Also, it can function as a step to double check that values match in refactored and legacy tables. Therefore, at times, it may be necessary to go back to the transformation step and cast column types or change a business rule, for example.

## The gains of the refactoring process

Successfully converting an entire set of data workflows from the Alteryx engine to dbt is surely not a trivial task, but the implementation of this framework, as a result of a trial-and-error learning process from the team, allowed us to accelerate this process, while its data auditing focus enabled delivering data with visible and automated quality assurance.

The conversion proved to be of great value to the client due to three main aspects of the new dbt-based data stack, which were observed by both teams:

- Incredibly shortened run time: Perhaps the most impressive result obtained, the total run time of the marketing team’s data workflow was reduced from more than **6 hours** to just **9 minutes**. This represents a **run time reduction of more than** **40x**. Much of this comes from transitioning from SQL Server on-premises computing to Snowflake cloud computing, dbt’s agile SQL compilation and materialization offers, and the sequential lineage based execution (see Figure 7).
- Improved workflow visibility: dbt’s support for documentation and testing, associated with dbt Cloud, allows for great visibility of the workflow’s lineage execution, accelerating errors and data inconsistencies identification and troubleshooting. More than once, our team was able to identify the impact of one column’s logic alteration in downstream models much earlier than these Alteryx models.
- Workflow simplification: dbt’s modularized approach of data modeling, aside from accelerating total run time of the data workflow, simplified the construction of new tables, based on the already existing modules, and improved code readability.

<Lightbox src="/img/blog/2023-04-24-framework-refactor-alteryx-dbt/Figure7.png" title="Figure 7 — Run time comparison, in minutes" />

As we can see, refactoring Alteryx to dbt was an important step in the direction of data availability, and allowed for much more agile processes for the client’s data team. With less time dedicated to manually executing sequential Alteryx workflows that took hours to complete, and searching for errors in each individual file, the analysts could focus on what they do best: **getting insights from the data and generating value from them**.

## References

> [Migrating from Stored Procedures to dbt](https://docs.getdbt.com/blog/migrating-from-stored-procs)
>
>
> [Audit_helper in dbt: Bringing data auditing to a higher level](https://docs.getdbt.com/blog/audit-helper-for-migration)
>
> [Refactoring legacy SQL to dbt](https://docs.getdbt.com/guides/migration/tools/refactoring-legacy-sql)
