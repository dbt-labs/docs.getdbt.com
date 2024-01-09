---
id: data-lineage
title: What is data lineage?
description: Data lineage provides a holistic view of how data moves through an organization, where it’s transformed and consumed.
displayText: data lineage
hoverSnippet: Data lineage provides a holistic view of how data moves through an organization, where it’s transformed and consumed.
---

<head>
    <title>What is data lineage? And how do you get started?</title>
</head>

Data lineage provides a holistic view of how data moves through an organization, where it’s transformed and consumed. Overall, data lineage is a fundamental concept to understand in the practice of analytics engineering and modern data work.

At a high level, a data lineage system typically provides data teams and consumers with one or both of the following resources:

- A visual graph (DAG) of sequential workflows at the data set or column level
- A data catalog of data asset origins, owners, definitions, and policies

This holistic view of the data pipeline allows data teams to build, troubleshoot, and analyze workflows more efficiently. It also enables business users to understand the origins of reporting data and provides a means for data discovery.

We’ll unpack why data lineage is important, how it works in the context of analytics engineering, and where some existing challenges still exist for data lineage.

## Why is data lineage important?

As a data landscape grows in size and complexity, the benefits of data lineage become more apparent. For data teams, the three main advantages of data lineage include reducing root-cause analysis headaches, minimizing unexpected downstream headaches when making upstream changes, and empowering business users.

### Root cause analysis

It happens: dashboards and reporting fall victim to data pipeline breaks. Data teams quickly need to diagnose what’s wrong, fix where things may be broken, and provide up-to-date numbers to their end business users. But when these breaks happen (and they surely do) how can teams quickly identify the root cause of the problem?

If data teams have some form of data lineage in place, they can more easily identify the root cause of the broken pipeline or data quality issue. By backing out into the data models, sources, and pipelines powering a dashboard a report, data teams can understand all the upstream elements impacting that work and see where the issues lie.

Will a data lineage or a DAG solve your breaking pipelines? Definitely not. Will it potentially make your life easier to find problems in your data work? Heck yes.

### Downstream impacts on upstream changes

You may have been here—your backend engineering team drops the `customers` table to create a newer, more accurate `users` table. The only bad thing is…[they forgot to tell the data team about the change](https://docs.getdbt.com/blog/when-backend-devs-spark-joy).

When you have a data lineage system, you can visually see which downstream models, nodes, and exposures are impacted by big upstream changes such as source or model renaming or removals. Referring to your DAG or data lineage system before any significant change to your analytics work is a great way to help prevent accidental downstream issues.

### Value to business users

While data lineage makes it easier for data teams to manage pipelines, stakeholders and leaders also benefit from data lineage, primarily around promoting data transparency into the data pipelines.

**Shared data literacy**

New hires, existing team members, and internal data practitioners can independently explore a holistic view of the data pipeline with a data lineage system. For data teams using a DAG to encapsulate their data work, business users have a clear visual representation of how data flows from different sources to the dashboards they consume in their BI tool, providing an increased level of transparency in data work. At the end of the day, the added visibility makes it easier for everyone to be on the same page.

**Pipeline cleanliness**

A visual graph (DAG) of how data flows through various workflows makes it easy to identify redundant loads of source system data or workflows that produce identical reporting insights.

Spotlighting redundant data models can help trim down on WET (write every time/write everything twice) code, non-performant joins, and ultimately help promote reusability, modularity, and standardization within a data pipeline.

Overall, data lineage and data-driven business go hand-in-hand. A data lineage system allows data teams to be more organized and efficient, business users to be more confident, and data pipelines to be more modular.

## How does data lineage work?

In the greater data world, you may often hear of data lineage systems based on tagging, patterns or parsing-based systems. In analytics engineering however, you’ll often see data lineage implemented in a DAG or through third-party tooling that integrates into your data pipeline.

### DAGs (directed acyclic graphs)

If you use a transformation tool such as dbt that automatically infers relationships between data sources and models, a DAG automatically populates to show you the lineage that exists for your [data transformations](https://www.getdbt.com/analytics-engineering/transformation/).

<Lightbox src="/img/docs/terms/data-lineage/dag_example.jpg" width="80%" title="dbt Cloud Project with generated DAG" />

Your <Term id="dag" /> is used to visually show upstream dependencies, the nodes that must come before a current model, and downstream relationships, the work that is impacted by the current model. DAGs are also directional—they show a defined flow of movement and form non-cyclical loops.

Ultimately, DAGs are an effective way to see relationships between data sources, models, and dashboards. DAGs are also a great way to see visual bottlenecks, or inefficiencies in your data work (see image below for a DAG with...many bottlenecks). Data teams can additionally add [meta fields](https://docs.getdbt.com/reference/resource-configs/meta) and documentation to nodes in the DAG to add an additional layer of governance to their dbt project.

<Lightbox src="/img/docs/terms/data-lineage/bad_dag.png" title="A bad DAG" />

:::tip Automatic > Manual

DAGs shouldn’t be dependent on manual updates. Instead, your DAG should be automatically inferred and created with your data transformation and pipelines. Leverage tools such as dbt to build your own version-controlled DAG as you develop your data models.

:::

### Third-party tooling

Data teams may also choose to use third-party tools with lineage capabilities such as [Atlan](https://ask.atlan.com/hc/en-us/articles/4433673207313-How-to-set-up-dbt-Cloud), Alation, [Collibra](https://marketplace.collibra.com/listings/dbt-lineage-to-collibra-integration/), [Datafold](https://www.datafold.com/column-level-lineage), Metaphor, [Monte Carlo](https://docs.getmontecarlo.com/docs/dbt-cloud), [Select Star](https://docs.selectstar.com/integrations/dbt/dbt-cloud), or [Stemma](https://docs.stemma.ai/docs/stemma/getting-started/what-we-need-from-you/dbt-integration/). These tools often integrate directly with your data pipelines and dbt workflows and offer zoomed-in data lineage capabilities such as column-level or business logic-level lineage.

## Data lineage challenges

The biggest challenges around data lineage become more apparent as your data, systems, and business questions grow.

### Data lineage challenge #1: Scaling data pipelines

As dbt projects scale with data and organization growth, the number of sources, models, macros, seeds, and [exposures](https://docs.getdbt.com/docs/build/exposures) invariably grow. And with an increasing number of nodes in your DAG, it can become harder to audit your DAG for WET code or inefficiencies.

Working with dbt projects with thousands of models and nodes can feel overwhelming, but remember: your DAG and data lineage are meant to help you, not be your enemy. Tackle DAG audits in chunks, document all models, and [leverage strong structure conventions](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview).

:::tip dbt project evaluator

Is your DAG keeping up with best practices? Instead of manually auditing your DAG, the [dbt project evaluator package](https://github.com/dbt-labs/dbt-project-evaluator) can help audit your project and find areas of improvement.

:::

### Data lineage challenge #2: Column-level lineage

Complex workflows also add to the difficulties a data lineage system will encounter. For example, consider the challenges in describing a data source's movement through a pipeline as it's filtered, pivoted, and joined with other tables. These challenges increase when the granularity of the data lineage shifts from the table to the column level.

As data lineage graphs mature and grow, it becomes clear that column or field-level lineage is often a needed layer of specificity that is not typically built-in to data lineage systems. [Some of the third party tooling](#third-party-tooling) from above can support column-level lineage.

## **Conclusion**

Data lineage is the holistic overview of how data moves through an organization or system, and is typically represented by a DAG. Analytics engineering practitioners use their DAG and data lineage to unpack root causes in broken pipelines, audit their models for inefficiencies, and promote greater transparency in their data work to business users. Overall, using your data lineage and DAG to know when your data is transformed and where it’s consumed is the foundation for good analytics work.

## **Further reading**

DAGs, data lineage, and root cause analysis…tell me more! Check out some of our favorite resources of writing modular models, DRY code, and data modeling best practices:

- [Glossary: DRY](https://docs.getdbt.com/terms/dry)
- [Data techniques for modularity](https://www.getdbt.com/analytics-engineering/modular-data-modeling-technique/)
- [How we structure our dbt projects](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview)
