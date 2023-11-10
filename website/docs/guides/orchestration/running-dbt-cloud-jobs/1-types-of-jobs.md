---
title: "Organizing dbt Cloud jobs"
id: "organizing-dbt-cloud-jobs"
slug: types-of-jobs
description: Learn how to organize your dbt Cloud jobs by category
displayText: The types of jobs in dbt Cloud
hoverSnippet: Learn how to organize your dbt Cloud jobs by category.
---

dbt Cloud jobs perform two main functions:

- Running models in production
- Performing Continuous Integration Testing on models during development

dbt Cloud jobs can optionally run source freshness checks and generate documentation as well.

<callout>
Make sure to leverage the dbt build command to avoid wasteful spend! dbt build enables you to run tests for each individual model, before its downstream dependencies start. When a test on a model fails, the dependences of that model are skipped. This enables you to avoid wasted spend on downstream node runs.
</callout>

### Running Models in Production

#### Organizing models using tags

Organizing your models in groups will allow you to create a successful orchestration strategy. Common classifications that users employ are:

- Frequency: hourly, daily, weekly build schedules
- Sensitivity: PII, GDPR, HIPAA
- Domain: Marketing, Finance, Ops
- Readiness: Staging, Intermediate, Marts / Bronze, Silver, Gold
- dbt Configuration: Tables, Views, Incrementals, Snapshots

<callout>
Frequency is most commonly used to determine run cadence. A good strategy is to tag models at the "end" of the DAG with the update frequency you require (e.g. hourly, daily). Then structure the dbt job command as `dbt build -s +tag:hourly` in order to automatically identify the models upstream of the tagged models which also need to run.
</callout>

#### Running tagged models

##### Production Hourly

`dbt build -s +tag:hourly`

##### Production Daily

`dbt build -s +tag:daily`

##### Managing PII & Masking Policies

Organizations that deal with PII data generally leverage data masking policies to protect it from unintended use. [reference dbt snowmask package]. In this situation, it makes sense to separate the builds include PII data masking policies, in particular because doing so makes it much easier to manage logging and auditing.

`dbt build -s +tag:pii` # builds static data masks
`dbt build -s tag:hourly --exclude tag:pii` # build hourly data downstream of masks

You can also do things like `dbt build -s tag:every_four_hours` for more fine-grained scheduling control.

### Running Models by dbt Configuration

Another approach that works well is to segment dbt Cloud jobs according to model configuration type. Of the items below, `incremental` and `snapshot` models are often the ones which make the most sense to separate from the others onto their own run cadences. 

For `incremental` models, performance is often a concern, which leads dbt Cloud users to create distinct run cadences for that subset. You can also create a second dbt Cloud job to run `incremental` models with the `--full-refresh` flag included to enable periodic full rebuilds.

dbt Labs recommends treating `snapshot` data differently than the rest of the DAG. A good approach is to create a separate dbt Cloud Environment including a different permission set to run snapshots and materialize them into a different schema than the rest of the models. These extra precautions are beneficial because snapshot data is stateful, i.e. can be expensive to recreate if the history is lost! 

##### Tables

`dbt build -s config.materialized:table`

##### Views

`dbt build -s config.materialized:view`

##### Snapshots

`dbt build -s config.materialized:snapshot`

##### Incrementals

`dbt build -s config.materialized:incremental`

<callout>
NOTE: Having `incremental` models broken into a separate job is also beneficial in the event you need to `--full-refresh` them!
</callout>

### Continuous Integration Testing

There are two main operations performed for Continuous Integration Testing in dbt Cloud:

- Compiling the codebase 
- Running dbt tests

#### Compiling the codebase

Set up a dbt Cloud job in the QA environment which runs the `dbt compile` command only

Running this job about once an hour typically works well. Increase the frequency for very active codebases. 

#### Running Tests

Tests are run in a Continuous integration test job which defers to the compilation job. With this setup, you are able to automatically identify *only models whose code changed* in the pull request and run just those models. This keeps test runs fast and 
lowers cost on the data warehouse.

Configure the CI job to run: `dbt build -s @state:modified --fail-fast`

* The `@state:modified` identifies the changed models
* `--fail-fast` causes dbt to abort the first time an error is encountered to avoids wastefully running additional models when you already know there is a problem to resolve before merging the PR.