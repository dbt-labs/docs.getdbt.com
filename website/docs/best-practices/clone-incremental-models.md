---
title: "Clone incremental models as the first step of your CI job"
id: "clone-incremental-models"
description: Learn how to define clone incremental models as the first step of your CI job.
displayText: Clone incremental models as the first step of your CI job
hoverSnippet: Learn how to clone incremental models for CI jobs.
---

### Main content

Imagine that you've created a [Slim CI job](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration#slim-ci) in dbt Cloud. 

img width="1332" alt="Screenshot 2023-10-27 at 10 37 28 AM" src="https://github.com/dbt-labs/docs.getdbt.com/assets/53586774/3574bce0-cad2-44f6-8e22-8cbf33b61cf8"

Your CI job:
- defers to your production environment
- runs the command `dbt build --select state:modified+` to run and test all of the models you've modified and their downstream dependencies
- is triggered whenever a developer on your team opens a PR against the main branch

Now imagine your dbt project looks like this:

img width="1074" alt="Screenshot 2023-10-27 at 10 39 43 AM" src="https://github.com/dbt-labs/docs.getdbt.com/assets/53586774/30d4dab9-1d6a-460e-b3d8-867f29d1c0db"

When you open a PR that modifies `dim_wizards`, your CI job will kickoff and build _only the modified models and their downstream dependencies_ (in this case: `dim_wizards` and `fct_orders`) into a temporary schema that's unique to your PR. 

This build mimics the behavior of what _will_ happen once the PR is merged into the main branch (so you have confidence that you're not introducing breaking changes), without requiring a build of your _entire_ dbt project. 

**But what happens when one of the modified models (or one of their downstream dependencies) is an incremental model?**

Because your CI job is building modified models into a PR-specific schema, on the first execution of `dbt build --select state:modified+` the modified incremental model will be built in its entirety **because it does not yet exist in the PR-specific schema** aka [is_incremental will be false](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#understanding-the-is_incremental-macro). You're running in `full-refresh` mode.

This can be suboptimal because:
- typically incremental models are your largest datasets, so they take a long time to build in their entirety which can slow down development time and incur warehouse $$$
- there are situations where a `full-refresh` of the incremental model passes successfully in your CI job but an _incremental_ build of that same table in prod would **fail** when the PR is merged into main (think schema drift where [on_schema_change](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#what-if-the-columns-of-my-incremental-model-change) config is set to `fail`)

We can alleviate the above problems by zero copy cloning the relevant, pre-exisitng incremental models into our PR-specific schema as the first step of the CI job using the `dbt clone` command. This way, the incremental models already exist in the PR-specific schema when you first execute the command `dbt build --select state:modified+` so the `is_incremental` flag will be `true`. 

Now, we'll have 2 commands for our dbt Cloud CI check to execute:
1. Clone all of the pre-existing, incremental models that have been modified or are downstream of another model that has been modified -> `dbt clone --select state:modified+,config.materialized:incremental,state:old`
2. Build all of models that have been modified and their downstream dependencies `dbt build --select state:modified+`

Because of our first clone step, the incremental models selected in our `dbt build` in the second step will run in incremental mode.

img width="768" alt="Screenshot 2023-10-27 at 10 47 22 AM" src="https://github.com/dbt-labs/docs.getdbt.com/assets/53586774/7a5feed1-9665-4c30-9ee9-e1d63dc75fe5"

Your CI jobs will run faster, and you're more accurately mimicking the behavior of "what will happen once the PR has been merged into main". 

Disclaimers:
- `dbt clone` is only available with dbt version 1.6+
- this strategy only works for warehouse that support zero copy cloning (otherwise `dbt clone` will just create pointer views)
- some teams may want to test that their incremental models run in _both_ incremental mode _and_ full-refresh mode


### Additional information

**Relevant slack thread:** https://dbt-labs.slack.com/archives/C05FWBP9X1U/p1692830261651829

**From my "Better CI for better data quality coalesce talk:**
If you use the incremental materialization in your dbt project, you should consider cloning your relevant, pre-existing incremental models into your PR-specific schema as the first step of your CI check. This will force your second step to run in incremental mode (where is_incremental is true) because now the models already exist in your PR-specific schema (via cloning). This is beneficial because it more accurately mimics what will happen when you merge your changes into production and it will save time and money by not rebuilding your incremental models (which are often large data sets) from scratch for every PR that modifies them. 

**Expansion on "think schema drift where [on_schema_change](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models#what-if-the-columns-of-my-incremental-model-change) config is set to `fail`" from above:**
Let’s imagine you have an incremental model my_incremental_model with the following config:

```sql

{{
    config(
        materialized='incremental',
        unique_key='unique_id',
        on_schema_change='fail'
    )
}}

```

Now, let’s say I open up a PR that adds a new column to `my_incremental_model` - in this case:
- an incremental build will fail
- a `full-refresh` will succeed

If you have a daily production job that just executes a `dbt build` (without a `--full-refresh` flag), once the PR is merged into main and the job kicks off, you will get a failure. So the question is - what do you want to happen in CI?
- Do you want to also get a failure in CI, so that you know that once this PR is merged into main you need to immediately execute a `dbt build --full-refresh --select my_incremental_model` in production in order to avoid a failure in prod? This will block your CI check from passing.
- Do you want your CI check to succeed, because once you do run a `full-refresh` for this model in prod you will be in a successful state? This may lead to you being surprised that your production job is suddenly failing when you merge this PR into main because you didn’t realize you would need to execute a `dbt build --full-refresh --select my_incremental_model` in production.

Probably not a perfect solution here, it’s all just tradeoffs! Personally, I'd rather have the failing CI job and have to manually override the blocking branch protection rule so that I'm not surprised and can proactively run the appropriate command in production once I merge the PR in. 

**Expansion on "why `state:old`"**

For brand new incremental models we actually want those to run in `full-refresh` mode in CI, because they will run in `full-refresh` mode in production when the PR is merged into `main` because they also don't exist yet in the production environment... they're brand new!
If you don't specify this, you won't get an error just a “No relation found in state manifest for…” - so it technically works with our without specifying `state:old`. But adding `state:old` is more explicit and means it won't even try to clone the brand new incremental models.