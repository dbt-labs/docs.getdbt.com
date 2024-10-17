---
title: "Column-level lineage"
description: "Use dbt Explorer's column-level lineage to gain insights about your data at a granular level."
---

dbt Explorer now offers column-level lineage (CLL) for the resources in your dbt project. Analytics engineers can quickly and easily gain insight into the provenance of their data products at a more granular level. For each column in a resource (model, source, or snapshot) in a dbt project, Explorer provides end-to-end lineage for the data in that column given how it's used.

CLL is available to dbt Cloud Enterprise accounts that can use Explorer. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-overview-cll.png" width="95%" title="Overview of column level lineage"/>

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

## Access the column-level lineage

There is no additional setup required for CLL if your account is on an Enterprise plan that can use Explorer. You can access the CLL by expanding the column card in the **Columns** tab of an Explorer [resource details page](/docs/collaborate/explore-projects#view-resource-details) for a model, source, or snapshot.

dbt Cloud updates the lineage in Explorer after each run that's executed in the production or staging environment. At least one job in the production or staging environment must run `dbt docs generate`. Refer to [Generating metadata](/docs/collaborate/explore-projects#generate-metadata) for more details.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-cll.png" width="40%" title="Example of the Columns tab and where to expand for the CLL"/>


## Column evolution lens {#column-lens}

You can use the column evolution lineage lens to determine when a column is transformed vs. reused (passthrough or rename). The lens helps you distinguish when and how a column is actually changed as it flows through your dbt lineage, informing debugging workflows in particular. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-evolution-lens.png" width="90%" title="Example of the Column evolution lens"/>

### Inherited column descriptions

A reused column, labeled as **Passthrough** or **Rename** in the lineage, automatically inherits its description from the source and upstream model columns. The inheritance goes as far back as possible. As long as the column isn't transformed, you don't need to manually define the description; it'll automatically propagate downstream.

Passthrough and rename columns are clearly labeled and color-coded in the lineage.

In the following `dim_salesforce_accounts` model example (located at the end of the lineage), the description for a column inherited from the `stg_salesforce__accounts` model (located second to the left) indicates its origin. This helps developers quickly identify the original source of the column, making it easier to know where to make documentation changes.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-prop-inherit.jpg" width="100%" title="Example of lineage with propagated and inherited column descriptions."/>

## Column-level lineage use cases {#use-cases}

Learn more about why and how you can use CLL in the following sections. 

### Root cause analysis

When there is an unexpected breakage in a data pipeline, column-level lineage can be a valuable tool to understand the exact point where the error occurred in the pipeline. For example, a failing data test on a particular column in your dbt model might've stemmed from an untested column upstream. Using CLL can help quickly identify and fix breakages when they happen.

### Impact analysis

During development, analytics engineers can use column-level lineage to understand the full scope of the impact of their proposed changes. This knowledge empowers them to create higher-quality pull requests that require fewer edits, as they can anticipate and preempt issues that would've been unchecked without column-level insights. 

### Collaboration and efficiency

When exploring your data products, navigating column lineage allows analytics engineers and data analysts to more easily navigate and understand the origin and usage of their data, enabling them to make better decisions with higher confidence.

## Caveats

Refer to the following CLL caveats or limitations as you navigate dbt Explorer.

### Column usage
Column-level lineage reflects the lineage from `select` statements in your models' SQL code. It doesn't reflect other usage like joins and filters. 

### SQL parsing

Column-level lineage relies on SQL parsing. Errors can occur when parsing fails or a column's origin is unknown (like with JSON unpacking, lateral joins, and so on). In these cases, lineage may be incomplete and dbt Cloud will provide a warning about it in the column lineage. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-parsing-error-pill.png" title="Example of warning in the full lineage graph"/>

To review the error details:
1. Click the **Expand** icon in the upper right corner to open the column's lineage graph
1. Select the node to open the column’s details panel

Possible error cases are:

- **Parsing error** &mdash; Error occurs when the SQL is ambiguous or too complex for parsing. An example of ambiguous parsing scenarios are _complex_ lateral joins.
- **Python error** &mdash; Error occurs when a Python model is used within the lineage. Due to the nature of Python models, it's not possible to parse and determine the lineage.
- **Unknown error** &mdash; Error occurs when the lineage can't be determined for an unknown reason. An example of this would be if a dbt best practice is not being followed, like using hardcoded table names instead of `ref` statements.
