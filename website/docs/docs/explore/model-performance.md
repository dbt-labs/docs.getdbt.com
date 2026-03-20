---
title: "Model performance"
sidebar_label: "Model performance"
description: "Learn about the performance of your models so you can make improvements to save time and money."
---

# Model performance <Lifecycle status="managed,managed_plus" />

<Constant name="catalog" /> provides metadata on <Constant name="dbt" /> runs for in-depth model performance and quality analysis. This feature assists in reducing infrastructure costs and saving time for data teams by highlighting where to fine-tune projects and deployments &mdash; such as model refactoring or job configuration adjustments.

<Lightbox src="/img/docs/collaborate/dbt-explorer/explorer-model-performance.gif" width="100%" title="Overview of Performance page navigation."/>

import ExplorerCourse from '/snippets/_explorer-course-link.md';

<ExplorerCourse />

## The Performance overview page 

You can pinpoint areas for performance enhancement by using the Performance overview page. This page presents a comprehensive analysis across all project models and displays the longest-running models, those most frequently executed, and the ones with the highest failure rates during runs/tests. Data can be segmented by environment and job type which can offer insights into:

- Most executed models (total count).
- Models with the longest execution time (average duration).
- Models with the most failures, detailing run failures (percentage and count) and test failures (percentage and count).

Each data point links to individual models in <Constant name="catalog" />. 

<Lightbox src="/img/docs/collaborate/dbt-explorer/example-performance-overview-page.png" width="90%" title="Example of Performance overview page"/>

You can view historical metadata for up to the past three months. Select the time horizon using the filter, which defaults to a two-week lookback.

<Lightbox src="/img/docs/collaborate/dbt-explorer/ex-2-week-default.png" width="55%" title="Example of dropdown"/>

## The Model performance tab

import ModelPerfIntro from '/snippets/_model-perf-intro.md';

<ModelPerfIntro />

import ModelPerformance from '/snippets/_model-performance.md';

<ModelPerformance />

