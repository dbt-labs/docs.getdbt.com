---
title: "Clone incremental models as the first step of your CI job"
id: "clone-incremental-models"
description: Learn how to define clone incremental models as the first step of your CI job.
displayText: Clone incremental models as the first step of your CI job
hoverSnippet: Learn how to clone incremental models for CI jobs.
---

Before you begin, you must be aware of a few conditions:
- `dbt clone` is only available with dbt version 1.6 and newer. Refer to our [upgrade guide](/docs/dbt-versions/upgrade-core-in-cloud) for help enabling newer versions in dbt Cloud
- This strategy only works for warehouse that support zero copy cloning (otherwise `dbt clone` will just create pointer views).
- Some teams may want to test that their incremental models run in both incremental mode and full-refresh mode.

Imagine you've created a [Slim CI job](/docs/deploy/continuous-integration) in dbt Cloud and it is configured to: 

- Defer to your production environment.
- Run the command `dbt build --select state:modified+` to run and test all of the models you've modified and their downstream dependencies.
- Trigger whenever a developer on your team opens a PR against the main branch.

<Lightbox src="/img/best-practices/slim-ci-job.png" width="70%" title="Example of a slim CI job with the above configurations" />

Now imagine your dbt project looks something like this in the DAG:

<Lightbox src="/img/best-practices/dag-example.png" width="70%" title="Sample project DAG" />

When you open a pull request (PR) that modifies `dim_wizards`, your CI job will kickoff and build _only the modified models and their downstream dependencies_ (in this case, `dim_wizards` and `fct_orders`) into a temporary schema that's unique to your PR. 

This build mimics the behavior of what will happen once the PR is merged into the main branch. It ensures you're not introducing breaking changes, without needing to build your entire dbt project. 

## What happens when one of the modified models (or one of their downstream dependencies) is an incremental model?

Because your CI job is building modified models into a PR-specific schema, on the first execution of `dbt build --select state:modified+`, the modified incremental model will be built in its entirety _because it does not yet exist in the PR-specific schema_ and [is_incremental will be false](/docs/build/incremental-models#understanding-the-is_incremental-macro). You're running in `full-refresh` mode.

This can be suboptimal because:
- Typically incremental models are your largest datasets, so they take a long time to build in their entirety which can slow down development time and incur high warehouse costs.
- There are situations where a `full-refresh` of the incremental model passes successfully in your CI job but an _incremental_ build of that same table in prod would fail when the PR is merged into main (think schema drift where [on_schema_change](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) config is set to `fail`)

You can alleviate these problems by zero copy cloning the relevant, pre-exisitng incremental models into your PR-specific schema as the first step of the CI job using the `dbt clone` command. This way, the incremental models already exist in the PR-specific schema when you first execute the command `dbt build --select state:modified+` so the `is_incremental` flag will be `true`. 

You'll have two commands for your dbt Cloud CI check to execute:
1. Clone all of the pre-existing incremental models that have been modified or are downstream of another model that has been modified: `dbt clone --select state:modified+,config.materialized:incremental,state:old`
2. Build all of the models that have been modified and their downstream dependencies: `dbt build --select state:modified+`

Because of your first clone step, the incremental models selected in your `dbt build` on the second step will run in incremental mode.

<Lightbox src="/img/best-practices/clone-command.png" width="70%" title="Clone command in the CI config" />

Your CI jobs will run faster, and you're more accurately mimicking the behavior of what will happen once the PR has been merged into main. 

### Expansion on "think schema drift" where [on_schema_change](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) config is set to `fail`" from above

Imagine you have an incremental model `my_incremental_model` with the following config:

```sql

{{
    config(
        materialized='incremental',
        unique_key='unique_id',
        on_schema_change='fail'
    )
}}

```

Now, let’s say you open up a PR that adds a new column to `my_incremental_model`. In this case:
- An incremental build will fail.
- A `full-refresh` will succeed.

If you have a daily production job that just executes `dbt build` without a `--full-refresh` flag, once the PR is merged into main and the job kicks off, you will get a failure. So the question is - what do you want to happen in CI?
- Do you want to also get a failure in CI, so that you know that once this PR is merged into main you need to immediately execute a `dbt build --full-refresh --select my_incremental_model` in production in order to avoid a failure in prod? This will block your CI check from passing.
- Do you want your CI check to succeed, because once you do run a `full-refresh` for this model in prod you will be in a successful state? This may lead unpleasant surprises if your production job is suddenly failing when you merge this PR into main if you don’t remember you need to execute a `dbt build --full-refresh --select my_incremental_model` in production.

There’s probably no perfect solution here; it’s all just tradeoffs! Our preference would be to have the failing CI job and have to manually override the blocking branch protection rule so that there are no surprises and we can proactively run the appropriate command in production once the PR is merged. 

### Expansion on "why `state:old`"

For brand new incremental models, you want them to run in `full-refresh` mode in CI, because they will run in `full-refresh` mode in production when the PR is merged into `main`. They also don't exist yet in the production environment... they're brand new!
If you don't specify this, you won't get an error just a “No relation found in state manifest for…”. So, it technically works without specifying `state:old` but adding `state:old` is more explicit and means it won't even try to clone the brand new incremental models.
