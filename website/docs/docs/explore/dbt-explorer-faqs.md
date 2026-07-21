---
title: "dbt Catalog FAQs"
sidebar_label: "dbt Catalog FAQs"
description: "Learn more with the FAQs about dbt Catalog, how it works, how to interact with it, and more."
---

[<Constant name="catalog" />](/docs/explore/explore-projects) is <Constant name="dbt" />’s new knowledge base and lineage visualization experience. It offers an interactive and high-level view of your company’s entire data estate, where you can dive deep into the context you need to understand and improve lineage so your teams can trust the data they’re using to make decisions.

## Overview

<Expandable alt_header="How does dbt Catalog help with data quality?" >

<Constant name="catalog" /> makes it easy and intuitive to understand your entire lineage &mdash; from data source to the reporting layer &mdash; so you can troubleshoot, improve, and optimize your pipelines. With built-in features like project recommendations and model performance analysis, you can be sure you have appropriate test and documentation coverage across your estate and quickly spot and remediate slow-running models. With column-level lineage, you can quickly identify the potential downstream impacts of table changes or work backwards to quickly understand the root cause of an incident. <Constant name="catalog" /> gives teams the insights they need to improve data quality proactively, ensuring pipelines stay performant and data trust remains solid.

</Expandable>

<Expandable alt_header="How is dbt Catalog priced?" >

<Constant name="catalog" /> is generally available to all regions and deployment types on all <Constant name="dbt" /> [Enterprise-tier and Starter plans](https://www.getdbt.com/). Certain features within <Constant name="catalog" />, such as project recommendations, multi-project lineage, column-level lineage, and more are only available on the Enterprise and Enterprise+ plans.

<Constant name="catalog" /> can be accessed by users with developer and read-only seats.

</Expandable>

<Expandable alt_header="What happened to dbt Docs?" >

<Constant name="catalog" /> is the default documentation experience for <Constant name="dbt" /> customers. dbt Docs is still available but doesn't offer the same speed, metadata, or visibility as <Constant name="catalog" /> and will become a legacy feature.

</Expandable>

## How dbt Catalog works

<Expandable alt_header="Can I use dbt Catalog on-premises or with my self-hosted dbt Core deployment?" >

No. <Constant name="catalog" /> and all of its features are only available as a <Constant name="dbt" /> user experience. <Constant name="catalog" /> reflects the metadata from your <Constant name="dbt" /> project(s) and their runs. 

</Expandable>

<Expandable alt_header="How does dbt Catalog support dbt environments?" >

<Constant name="catalog" /> supports a production or staging [deployment environment](/docs/deploy/deploy-environments) for each project you want to explore. It defaults to the latest production or staging state of a project. Users can only assign one production and one staging environment per <Constant name="dbt" /> project.

Support for development (<Constant name="platform_cli" /> and <Constant name="studio_ide" />) environments is coming soon.

</Expandable>

<Expandable alt_header="How do I get started in Catalog? How does it update?" >

Simply select **Catalog** from the <Constant name="dbt" /> top navigation bar. <Constant name="catalog" /> automatically updates after each <Constant name="dbt" /> run in the given project’s environment (production, by default). The dbt commands you run within the environment will generate and update the metadata in <Constant name="catalog" />, so make sure to run the correct combination of commands within the jobs of the environment; for more details, refer to [Generate metadata](/docs/explore/explore-projects#generate-metadata). 

</Expandable>

<Expandable alt_header="Is it possible to export dbt lineage to an external system or catalog?" >

Yes. The lineage that powers <Constant name="catalog" /> is also available through the Discovery API.

</Expandable>

<Expandable alt_header="How does dbt Catalog integrate with third-party tools to show end-to-end lineage?" >

<Constant name="catalog" /> reflects all the lineage defined within the dbt project. Our vision for <Constant name="catalog" /> is to incorporate additional metadata from external tools like data loaders (sources) and BI/analytics tools (exposures) integrated with <Constant name="dbt" />, all seamlessly incorporated into the lineage of the <Constant name="dbt" /> project.

</Expandable>

<Expandable alt_header="Why did previously visible data in dbt Catalog disappear?" >

<Constant name="catalog" /> automatically deletes stale metadata after 3 months if no jobs were run to refresh it. To avoid this, make sure you schedule jobs to run more frequently than 3 months with the necessary commands.

</Expandable>

## Key features 

<Expandable alt_header="Does dbt Catalog support multi-project discovery (dbt Mesh)?" >

Yes. Refer to [Explore multiple projects](/docs/explore/explore-multiple-projects) to learn more. 

</Expandable>

<Expandable alt_header="What kind of search capabilities does dbt Catalog support?" >

Resource search capabilities include using keywords, partial strings (fuzzy search), and set operators like `OR`. Meanwhile, lineage search supports using dbt selectors. For details, refer to [Keyword search](/docs/explore/explore-projects#search-resources).

</Expandable>

<Expandable alt_header="Can I view model execution information for a job that is currently being run?" >

<Constant name="dbt" /> updates the performance and metrics after a job run. However, **Model performance** charts only display data for _completed_ UTC days. This means that runs from the current UTC day won't appear in the charts until the UTC day changes (midnight UTC). For example, if you're in US Pacific time, you won't see the current day's runs reflected until 4:00 PM PT.

</Expandable>

<Expandable alt_header="Can I analyze the number of successful model runs within a month?" >

A chart of models built by month is available in the<Constant name="dbt" /> dashboard. 

</Expandable>

<Expandable alt_header="Can model or column descriptions be edited within dbt?" >

Yes. Today, you can edit descriptions in the <Constant name="studio_ide" /> or <Constant name="platform_cli" /> by changing the YAML files within the dbt project. In the future, <Constant name="catalog" /> will support more ways of editing descriptions. 

</Expandable>

<Expandable alt_header="Where do recommendations come from? Can they be customized?" >

Recommendations largely mirror the best practice rules from the `dbt_project_evaluator` package. At this time, recommendations can’t be customized. In the future, <Constant name="catalog" /> will likely support recommendation customization capabilities (for example, in project code). 

</Expandable>

## Column-level lineage

<Expandable alt_header="What are the best use cases for column-level lineage in dbt Catalog?" >

Column-level lineage in <Constant name="catalog" /> can be used to improve many data development workflows, including:

- **Audit** &mdash; Visualize how data moves through and is used in your dbt project
- **Root cause** &mdash; Improve time to detect and resolve data quality issues, tracking back to the source
- **Impact analysis** &mdash; Trace transformations and usage to avoid introducing issues for consumers
- **Efficiency** &mdash; Prune unnecessary columns to reduce costs and data team overhead

</Expandable>

<Expandable alt_header="Does the column-level lineage remain functional even if column names vary between models?" >

Yes. Column-level lineage can handle name changes across instances of the column in the dbt project.

</Expandable>

<Expandable alt_header="Can multiple projects leverage the same column definition?" >

No. Cross-project column lineage is supported in the sense of viewing how a public model is used across projects, but not on a column-level. 

</Expandable>


<Expandable alt_header="Can column descriptions be propagated down in downstream lineage automatically?" >

Yes, a reused column, labeled as passthrough or rename, inherits its description from source and upstream model columns. In other words, source and upstream model columns propagate their descriptions downstream whenever they are not transformed, meaning you don’t need to manually define the description. Refer to [Inherited column descriptions](/docs/explore/column-level-lineage#inherited-column-descriptions) for more info.

</Expandable>

<Expandable alt_header="Is column-level lineage also available in the development tab?" >

Not currently, but we plan to incorporate column-level awareness across features in <Constant name="dbt" /> in the future.

</Expandable>

## Availability, access, and permissions

<Expandable alt_header="How can non-developers interact with dbt Catalog?" >

Read-only users can consume metadata in <Constant name="catalog" />. More bespoke experiences and exploration avenues for analysts and less-technical contributors will be provided in the future. 

</Expandable>

<Expandable alt_header="Does dbt Catalog require a specific dbt plan?" >

<Constant name="catalog" /> is available on dbt Starter and all Enterprise plans. Certain features within <Constant name="catalog" /> are only available on Enterprise and Enterprise+ plans, including Model Performance, project recommendations, multi-project lineage, column-level lineage, and more. Refer to the [availability by plan](/docs/explore/explore-projects#availability-by-plan) table for a complete list.

</Expandable>

<Expandable alt_header="Will dbt Core users be able to leverage any of these new dbt Catalog features?" >

No. <Constant name="catalog" /> is a <Constant name="dbt" />-only product experience.

</Expandable>

<Expandable alt_header="Is it possible to access dbt Catalog using a read-only license?" >

Yes, users with read-only access can use the <Constant name="catalog" />. Specific feature availability within <Constant name="catalog" /> will depend on your <Constant name="dbt" /> plan. 

</Expandable>

<Expandable alt_header="Is there an easy way to share useful dbt Catalog content with people outside of dbt?" >

The ability to embed and share views is being evaluated as a potential future capability. 

</Expandable>

<Expandable alt_header=" Is dbt Catalog accessible from other areas inside dbt?" >

Yes, you can [access <Constant name="catalog" /> from various <Constant name="dbt" /> features](/docs/explore/access-from-dbt-platform), ensuring you have a seamless experience navigating between resources and lineage in your project.

While the primary way to access <Constant name="catalog" /> is through the **Catalog** link in the navigation, you can also access it from the [<Constant name="studio_ide" />](/docs/explore/access-from-dbt-platform#studio-ide), [the lineage tab in jobs](/docs/explore/access-from-dbt-platform#lineage-tab-in-jobs), and the [model timing tab in jobs](/docs/explore/access-from-dbt-platform#model-timing-tab-in-jobs).

</Expandable>
