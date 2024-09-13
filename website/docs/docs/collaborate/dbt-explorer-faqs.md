---
title: "dbt Explorer FAQs"
sidebar_label: "dbt Explorer FAQs"
description: "Learn more with the FAQs about dbt Explorer, how it works, how to interact with it, and more."
pagination_next: "docs/collaborate/auto-exposures"
---

[dbt Explorer](/docs/collaborate/explore-projects) is dbt Cloud’s new knowledge base and lineage visualization experience. It offers an interactive and high-level view of your company’s entire data estate, where you can dive deep into the context you need to understand and improve lineage so your teams can trust the data they’re using to make decisions.

## Overview

<Expandable alt_header="How does dbt Explorer help with data quality?" >

dbt Explorer makes it easy and intuitive to understand your entire lineage &mdash; from data source to the reporting layer &mdash; so you can troubleshoot, improve, and optimize your pipelines. With built-in features like project recommendations and model performance analysis, you can be sure you have appropriate test and documentation coverage across your estate and quickly spot and remediate slow-running models. With column-level lineage, you can quickly identify the potential downstream impacts of table changes or work backwards to quickly understand the root cause of an incident. dbt Explorer gives teams the insights they need to improve data quality proactively, ensuring pipelines stay performant and data trust remains solid.

</Expandable>

<Expandable alt_header="How is dbt Explorer priced?" >

dbt Explorer is generally available to all regions and deployment types on the dbt Cloud [Enterprise and Team plans](https://www.getdbt.com/). Certain features within dbt Explorer, such as multi-project lineage and column-level lineage, are only available on the Enterprise plan.

dbt Explorer can be accessed by users with developer and read-only seats.

</Expandable>

<Expandable alt_header="What happened to dbt Docs?" >

dbt Explorer is the default documentation experience for dbt Cloud customers. dbt Docs is still available but doesn't offer the same speed, metadata, or visibility as dbt Explorer and will become a legacy feature.

</Expandable>

## How dbt Explorer works

<Expandable alt_header="Can I use dbt Explorer on-premises or with my self-hosted dbt Core deployment?" >

No. dbt Explorer and all of its features are only available as a dbt Cloud user experience. dbt Explorer reflects the metadata from your dbt Cloud project(s) and their runs. 

</Expandable>

<Expandable alt_header="How does dbt Explorer support dbt Cloud environments?" >

dbt Explorer supports a production or staging [deployment environment](/docs/deploy/deploy-environments) for each project you want to explore. It defaults to the latest production or staging state of a project. Users can only assign one production and one staging environment per dbt Cloud project.

Support for development (dbt Cloud CLI and dbt Cloud IDE) environments is coming soon.

</Expandable>

<Expandable alt_header="How do I get started in Explorer? How does it update?" >

Simply select **Explore** from the dbt Cloud top navigation bar. dbt Explorer automatically updates after each dbt Cloud run in the given project’s environment (production, by default). The dbt commands you run within the environment will generate and update the metadata in dbt Explorer, so make sure to run the correct combination of commands within the jobs of the environment; for more details, refer to [Generate metadata](/docs/collaborate/explore-projects#generate-metadata). 

</Expandable>

<Expandable alt_header="Is it possible to export dbt lineage to an external system or catalog?" >

Yes. The lineage that powers dbt Explorer is also available through the Discovery API.

</Expandable>

<Expandable alt_header="How does dbt Explorer integrate with third-party tools to show end-to-end lineage?" >

dbt Explorer reflects all the lineage defined within the dbt project. Our vision for dbt Explorer is to incorporate additional metadata from external tools like data loaders (sources) and BI/analytics tools (exposures) integrated with dbt Cloud, all seamlessly incorporated into the lineage of the dbt Cloud project.

</Expandable>


## Key features 

<Expandable alt_header="Does dbt Explorer support multi-project discovery (dbt Mesh)?" >

Yes. Refer to [Explore multiple projects](/docs/collaborate/explore-multiple-projects) to learn more. 

</Expandable>

<Expandable alt_header="What kind of search capabilities does dbt Explorer support?" >

Resource search capabilities include using keywords, partial strings (fuzzy search), and set operators like `OR`. Meanwhile, lineage search supports using dbt selectors. For details, refer to [Keyword search](/docs/collaborate/explore-projects#search-resources).

</Expandable>

<Expandable alt_header="Can I view model execution information for a job that is currently being run?" >

dbt Cloud updates the performance charts and metrics after a job run. 

</Expandable>

<Expandable alt_header="Can I analyze the number of successful model runs within a month?" >

A chart of models built by month is available in the dbt Cloud dashboard. 

</Expandable>

<Expandable alt_header="Can model or column descriptions be edited within dbt Cloud?" >

Yes. Today, you can edit descriptions in the dbt Cloud IDE or CLI by changing the YAML files within the dbt project. In the future, dbt Explorer will support more ways of editing descriptions. 

</Expandable>

<Expandable alt_header="Where do recommendations come from? Can they be customized?" >

Recommendations largely mirror the best practice rules from the `dbt_project_evaluator` package. At this time, recommendations can’t be customized. In the future, dbt Explorer will likely support recommendation customization capabilities (for example, in project code). 

</Expandable>

## Column-level lineage

<Expandable alt_header="What are the best use cases for column-level lineage in dbt Explorer?" >

Column-level lineage in dbt Explorer can be used to improve many data development workflows, including:

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

Yes, a reused column, labeled as passthrough or rename, inherits its description from source and upstream model columns. In other words, source and upstream model columns propagate their descriptions downstream whenever they are not transformed, meaning you don’t need to manually define the description. Refer to [Inherited column descriptions](/docs/collaborate/column-level-lineage#inherited-column-descriptions) for more info.

</Expandable>

<Expandable alt_header="Is column-level lineage also available in the development tab?" >

Not currently, but we plan to incorporate column-level awareness across features in dbt Cloud in the future.

</Expandable>

## Availability, access, and permissions

<Expandable alt_header="How can non-developers interact with dbt Explorer?" >

Read-only users can consume metadata in dbt Explorer. More bespoke experiences and exploration avenues for analysts and less-technical contributors will be provided in the future. 

</Expandable>

<Expandable alt_header="Does dbt Explorer require a specific dbt Cloud plan?" >

dbt Explorer is available on the dbt Cloud Team and Enterprise plans. Certain features within dbt Explorer, like multi-project lineage and column-level lineage, are only available on the Enterprise plan. 

</Expandable>

<Expandable alt_header="Will dbt Core users be able to leverage any of these new dbt Explorer features?" >

No. dbt Explorer is a dbt Cloud-only product experience.

</Expandable>

<Expandable alt_header="Is it possible to access dbt Explorer using a read-only license?" >

Yes, users with read-only access can use the dbt Explorer. Specific feature availability within dbt Explorer will depend on your dbt Cloud plan. 

</Expandable>

<Expandable alt_header="Is there an easy way to share useful dbt Explorer content with people outside of dbt Cloud?" >

The ability to embed and share views is being evaluated as a potential future capability. 

</Expandable>

<Expandable alt_header=" Is dbt Explorer accessible from other areas inside dbt Cloud?" >

Yes, you can [access dbt Explorer from various dbt Cloud features](/docs/collaborate/access-from-dbt-cloud), ensuring you have a seamless experience navigating between resources and lineage in your project.

While the primary way to access dbt Explorer is through the **Explore** link in the navigation, you can also access it from the [dbt Cloud IDE](/docs/collaborate/access-from-dbt-cloud#dbt-cloud-ide), [the lineage tab in jobs](/docs/collaborate/access-from-dbt-cloud#lineage-tab-in-jobs), and the [model timing tab in jobs](/docs/collaborate/access-from-dbt-cloud#model-timing-tab-in-jobs).

</Expandable>
