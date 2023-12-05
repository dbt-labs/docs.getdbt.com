---
title: "Model performance"
sidebar_label: "Model performance"
description: "Learn about ."
---

dbt Explorer provides metadata on dbt Cloud runs for in-depth model performance and quality analysis. This feature assists in reducing infrastructure costs and saving time for data teams by highlighting where to fine-tune projects and deployments &mdash; such as model refactoring or job configuration adjustments.

<LoomVideo id='98f33b3b7a374df0b7c04747eae6ef44' />

:::tip Public preview 

The model performance feature is now available in dbt Explorer! Check it out! 
:::

## The Performance overview page 

You can pinpoint areas for performance enhancement by using the Performance overview page. This page presents a comprehensive analysis across all project models and displays the longest-running models, those most frequently executed, and the ones with the highest failure rates during runs/tests. Data can be segmented by environment and job type which can offer insights into:

- Most executed models (total count).
- Models with the longest execution time (average duration).
- Models with the most failures, detailing run failures (percentage and count) and test failures (percentage and count).

Each data point links to individual models in Explorer. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-performance-overview-page.png" width="80%" title="Example of Performance overview page"/>

You can view historical metadata for up to the past three months. Select the time horizon using the filter, which defaults to a two-week lookback.

<Lightbox src="/img/docs/collaborate/dbt-explorer/ex-2-week-default.png" title="Example of dropdown"/>

## The Model performance tab

The Model performance tab allows for historical performance analysis, showing trends in execution times, counts, and failures. Daily execution data includes:

- Average model execution time.
- Model execution counts, including failures/errors (total sum).

Clicking on a data point reveals a table listing all job runs for that day, with each row providing a direct link to the details of a specific run.

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-model-performance-tab.png" title="Example of the Model performance tab"/>