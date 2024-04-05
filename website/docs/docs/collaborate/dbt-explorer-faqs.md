---
title: "dbt Explorer FAQs"
sidebar_label: "dbt Explorer FAQs"
description: "Learn more with the FAQs about dbt Explorer, how it works, how to interact with it, and more."
pagination_next: null
---

[dbt Explorer](/docs/collaborate/explore-projects) is dbt Cloud’s new knowledge base and lineage visualization experience. It offers an interactive and high-level view of your company’s entire data estate, where you can dive deep into the context you need to understand and improve lineage so your teams can trust the data they’re using to make decisions.

## Overview

<expandable alt_header="How does dbt Explorer help with data quality?" >

dbt Explorer makes it easy and intuitive to understand your entire lineage &mdash; from data source to the reporting layer &mdash; so you can troubleshoot, improve, and optimize your pipelines. With built-in features like project recommendations and model performance analysis, you can be sure you have appropriate test and documentation coverage across your estate and quickly spot and remediate slow-running models. With column-level lineage, you can quickly identify the potential downstream impacts of table changes or work backwards to quickly understand the root cause of an incident. dbt Explorer gives teams the insights they need to improve data quality proactively, ensuring pipelines stay performant and data trust remains solid.

</expandable>

<expandable alt_header="How is dbt Explorer priced?" >

With the current Preview, dbt Explorer is available to everyone on the dbt Cloud Enterprise and Team plans. Certain features within dbt Explorer, such as multi-project lineage and column-level lineage, are only available on the Enterprise plan. dbt Explorer can be accessed by users with developer and read-only seats during the Preview period.

</expandable>

<expandable alt_header="What happened to dbt Docs?" >

dbt Explorer is the default documentation experience for dbt Cloud customers. dbt Docs is still available but doesn't offer the same speed, metadata, or visibility as dbt Explorer and will become a legacy feature.

</expandable>

## How dbt Explorer works

<expandable alt_header="Can I use dbt Explorer on-prem or with my self-hosted dbt Core deployment?" >

No. dbt Explorer is only available as a dbt Cloud user experience. dbt Explorer reflects the metadata from your dbt Cloud project(s) and their runs. 

</expandable>

<expandable alt_header="How does dbt Explorer support dbt Cloud environments?" >

dbt Explorer defaults to the latest production state of a project. Support for staging and development (Cloud CLI and IDE) environments is coming soon. Users can only assign a single production and staging environment per dbt Cloud project. 

</expandable>

<expandable alt_header="How do I get started in Explorer? How does it update?" >

Simply select **Explore** from the dbt Cloud top navigation bar. dbt Explorer automatically updates after each dbt Cloud run in the given project’s environment (production, by default). The dbt commands you run within the environment will generate and update the metadata in dbt Explorer, so make sure to run the correct combination of commands within the jobs of the environment; for more details, refer to [Generate metadata](/docs/collaborate/explore-projects#generate-metadata). 

</expandable>

<expandable alt_header="Is it possible to export dbt lineage to an external system or catalog?" >

Yes. The lineage that powers dbt Explorer is also available through the Discovery API.

</expandable>

<expandable alt_header="How does dbt Explorer integrate with third-party tools to show end-to-end lineage?" >

dbt Explorer reflects all the lineage defined within the dbt project. Our vision for dbt Explorer is to incorporate additional metadata from external tools like data loaders (sources) and BI/analytics tools (exposures) integrated with dbt Cloud, all seamlessly incorporated into the lineage of the dbt Cloud project.

</expandable>


## Key features 

<expandable alt_header="Does dbt Explorer support multi-project discovery (dbt Mesh)?" >

Yes. Refer to [Explore multiple projects](/docs/collaborate/explore-multiple-projects) to learn more. 

</expandable>

<expandable alt_header="What kind of search capabilities does dbt Explorer support?" >

Resource search capabilities include using keywords, partial strings (fuzzy search), and set operators like `OR`. Meanwhile, lineage search supports using dbt selectors. For details, refer to [Keyword search](/docs/collaborate/explore-projects#search-resources).

</expandable>

<expandable alt_header="Can I view model execution information for a job that is currently being run?" >

dbt Cloud updates the performance charts and metrics after a job run. 

</expandable>

<expandable alt_header="Can I analyze the number of successful model runs within a month?" >

A chart of models built by month is available in the dbt Cloud dashboard. 

</expandable>

<expandable alt_header="Can model or column descriptions be edited within dbt Cloud?" >

Yes. Today, you can edit descriptions in the dbt Cloud IDE or CLI by changing the YAML files within the dbt project. In the future, dbt Explorer will support more ways of editing descriptions. 

</expandable>

<expandable alt_header="Where do recommendations come from? Can they be customized?" >

Recommendations largely mirror the best practice rules from the `dbt_project_evaluator` package. At this time, recommendations can’t be customized. In the future, dbt Explorer will likely support recommendation customization capabilities (for example, in project code). 

</expandable>

## Column-level lineage

<expandable alt_header="What are the best use cases for column-level lineage in dbt Explorer?" >

Column-level lineage in dbt Explorer can be used to improve many data development workflows, including:

- **Audit** &mdash; Visualize how data moves through and is used in your dbt project
- **Root cause** &mdash; Improve time to detect and resolve data quality issues, tracking back to the source
- **Impact analysis** &mdash; Trace transformations and usage to avoid introducing issues for consumers
- **Efficiency** &mdash; Prune unnecessary columns to reduce costs and data team overhead

</expandable>

<expandable alt_header="Does the column-level lineage remain functional even if column names vary between models?" >

Yes. Column-level lineage can handle name changes across instances of the column in the dbt project. 

</expandable>

<expandable alt_header="Can multiple projects leverage the same column definition?" >

No. Cross-project column lineage is supported in the sense of viewing how a public model is used across projects, but not on a column-level. 

</expandable>

<expandable alt_header="Is column-level lineage data available through the API?" >

Yes. Column-level lineage is available through a beta endpoint using the [Discovery API](/docs/dbt-cloud-apis/discovery-api) to dbt Cloud Enterprise plan customers. 

</expandable>

<expandable alt_header="Can column descriptions be propagated down in downstream lineage automatically?" >

Not currently, but this type of functionality is planned for future releases.

</expandable>

<expandable alt_header="Is column-level lineage also available in the development tab?" >

Not currently, but we plan to incorporate column-level awareness across features in dbt Cloud in the future.

</expandable>



## Availability, access, and permissions

<expandable alt_header="How can non-developers interact with dbt Explorer?" >

Read-only users can consume metadata in dbt Explorer. More bespoke experiences and exploration avenues for analysts and less-technical contributors will be provided in the future. 

</expandable>

<expandable alt_header="Does dbt Explorer require a specific dbt Cloud plan?" >

dbt Explorer is available on the dbt Cloud Team or Enterprise plans. Certain features within dbt Explorer, like multi-project lineage and column-level lineage, are only available on the Enterprise plan. 

</expandable>

<expandable alt_header="Will dbt Core users be able to leverage any of these new dbt Explorer features?" >

No. dbt Explorer is a dbt Cloud-only product experience. 

</expandable>

<expandable alt_header="Is it possible to access dbt Explorer using a read-only license?" >

Yes, during the current Preview period. 

</expandable>

<expandable alt_header="Is there an easy way to share useful dbt Explorer content with people outside of dbt Cloud?" >

The ability to embed and share views is being evaluated as a potential future capability. 

</expandable>