---
title: "A checklist for getting the most out of dbt State"
description: "A step-by-step checklist for teams adopting dbt State on a large dbt project, from baselining performance to consolidating jobs."
slug: checklist-get-the-most-from-dbt-state

authors: [joel_labes]

tags: [analytics craft]
hide_table_of_contents: false

date: 2026-11-15
is_featured: false
---

dbt State is designed to be really easy to get started. It drops in alongside your existing dbt deployment, and saves you time, money, and effort by only building things that have changed and skipping the rest. For some teams, that's all they need to know – they're willing to dive in and work out how to optimize as they go.

This article is for the teams who want a bit more guidance on best practices, especially teams who manage large, established dbt projects with a lot of custom behavior.

I'll help you evaluate whether your dbt project and your goals are a good fit for dbt State, how to capture your baseline performance, and provide a structured process for gradually rolling dbt State across your project and team. 

_Note: most of this advice is the same whether your orchestrate on the dbt platform or on your own systems - the parts that differ have toggles to let you choose your own adventure._

<!-- truncate -->

## 1. Decide what you want to improve

Some teams choose dbt State primarily for its cost savings; others are focused on the developer productivity benefits. Before adopting dbt State, it's worth validating that your project is structured in a way that lets you benefit.

### Cost savings

Here are some indicators that normally lead to big benefits:

- **Inconsistently arriving data.** The biggest cost savings in production come from avoiding a rebuild of a model that has no fresh data. If you have sources which update sporadically throughout the day but process them every hour to guarantee SLA conformance, dbt State will be able to skip unnecessary rebuilds while still meeting your SLAs. By contrast, clickstream data that arrives continuously and needs to be processed immediately will never be reusable unless you extend your `lag_tolerance`.
- **Lots of jobs on different cadences.** Overlapping parts of your DAG will be picked up by multiple jobs and executed unnecessarily. dbt State can immediately prevent the second invocation from executing, and in the medium term can make it easier for you to collapse a delicately orchestrated web of job definitions into a more declarative framework.
- **A large team.** As teams grow, it's hard to enforce cost-efficient best practices. dbt State acts as a safety net when someone accidentally runs `dbt build --full-refresh` without any selectors.

On the other hand, here are some scenarios which reduce the potential cost savings:

- **Heavy use of Python models and custom materializations.** Python models can't be reused at all, and custom materializations can be skipped but not cloned from another location.
- **Near-realtime batch processing.** dbt State fetches additional metadata at the start of an invocation to decide whether models can be reused or not. This overhead could negate any performance benefits for models that are already triggered on a very tight loop (every few minutes) and execute very quickly.

### Developer experience and speed

Teams who see significant improvements to their development loop tend to have these characteristics:

- **Colleagues collaborating on the same models.** If you have multiple people collaborating on a single development branch, dbt State is particularly useful compared to standard deferral. It can find models to clone from any environment, so anyone checking out a git branch won't need to rebuild from scratch.
- **Agent-heavy development loops.** When working on multiple git worktrees in parallel, dbt's default behavior would be to rebuild all models from scratch for each worktree. dbt State can populate as many standalone development environments as are necessary, without the time or cost implications.
- **Rapidly-evolving schema.** Deferral reads from the live version of a production table, even if that diverges from the version on a developer's machine. dbt State will zero-copy clone from production which preserves the schema shape and content as expected, instead of getting bogged down in unrelated schema drift.
- **A lot of incremental models.** In development, dbt State can automatically clone incremental models from another environment to prevent slow and costly full refreshes.
- **Many sporadic project contributors.** I don't work in dbt all day every day, so when I go to change our internal analytics project I normally find that my dev schema has been dropped by a cleanup script, or that it's out of sync with production. dbt State lets me get straight back to a development-ready environment.

## 2. Capture your baseline performance

To measure your improvements, make sure you have control measurements for comparison. A week's worth is probably the minimum, but 2-4 weeks of data will provide stronger validation if you can get it. (And it should go without saying, but don't kick off unrelated optimization projects simultaneously.)

<Tabs queryString="orchestrator">

<TabItem value="self-hosted" label="Self-hosted">

Self-hosted users can get cost information from their warehouse by tagging all dbt activity. Each adapter has different ways of tracking use, such as BigQuery's [job labels](/reference/resource-configs/bigquery-configs#applying-labels-to-jobs), Snowflake's [query_tag](/reference/resource-configs/snowflake-configs#query-tags), and Databricks' [automatically attached tags](/reference/resource-configs/databricks-configs#default-query-tags).

To precisely track which models were reused or rebuilt, check `run_results.json`.

<VersionBlock lastVersion="1.99">

The run results file produced by <Constant name="core" /> will show models' `status` as `"success"` and specific information in the `message` field:

| Outcome | `status` | `message` |
| --- | --- | --- |
| Executed | `success` | `SUCCESS 1` |
| Reused (skipped) | `success` | `NO-OP` |
| Reused (cloned) | `success` | `CLONE` |

</VersionBlock>

<VersionBlock firstVersion="2.0">

The run results file produced by <Constant name="fusion" /> will show models' `status` as `"success"` or `"reused"` and specific information in the `message` field:

| Outcome | `status` | `message` |
| --- | --- | --- |
| Executed | `success` | `Succeeded` |
| Reused (skipped) | `reused` | `No new changes on any upstreams` |
| Reused (cloned) | `reused` | `Cloned from other environment` |

Follow [dbt#17226](https://github.com/dbt-labs/dbt/issues/17226) for discussion of different message values in future.

The `run_results.json` file is overwritten on every local invocation, so check the dbt information schema's `dbt_rt.run_results` view instead to see all invocations over time.

</VersionBlock>

</TabItem>

<TabItem value="dbt-platform" label="dbt platform">

Supported dbt platform plans have access to [Cost Insights](/docs/explore/cost-insights), which captures and tracks dbt's usage data for you.

</TabItem>

</Tabs>


Remember to focus on dollars and/or seconds saved – a high reuse percentage doesn't matter if the reused nodes are cheap to execute. Removing a large volume of small queries can still be beneficial though, if preventing that resource contention allows you to downsize to a smaller warehouse.

## 3. Have a contingency plan

You'll almost definitely never need to, but knowing that you _can_ disable dbt State in the face of unexpected behavior will let you experiment with confidence.

<Tabs queryString="orchestrator">

<TabItem value="self-hosted" label="Self-hosted">

The easiest global switch is the `DBT_ENGINE_MANAGE_STATE=0` environment variable, because it can be added/removed without needing to deploy changes to your dbt project itself. Remember that [CLI flags take precedence over environment variables](/reference/global-configs/environment-variable-configs#config-precedence), so `dbt build --manage-state` won't be blocked by an environment variable.

</TabItem>

<TabItem value="dbt-platform" label="dbt platform">

Disable dbt State by unticking the Enable dbt State checkbox on an environment (assuming each job uses the Inherit from environment setting), or setting dbt State to Off on an individual job ([full docs](/docs/deploy/dbt-state-enable-env-jobs)).

</TabItem>

</Tabs>

## 4. Have a couple of users kick the tires

Before putting dbt State into production, test it in a development environment. Ask one developer on your team to spend some time validating each of dbt State's behaviors against your own dbt project. This helps to build a mental model of how dbt State works in practice.

### Installation and setup

<Tabs queryString="orchestrator">

<TabItem value="self-hosted" label="Self-hosted">

Install (for dbt v1.7-1.12) or enable (dbt v1.13 and v2.0+) [dbt State locally](/docs/deploy/dbt-state-setup). Then activate your dbt State trial by creating a new dbt platform account. The easiest way to enter this flow is to invoke a dbt command like `dbt run`, which will trigger an authentication prompt.

:::tip Remember
dbt State isn't a seat-based product and doesn't require a subscription to the rest of the dbt platform's features.

All subsequent dbt State users should be added to this same project - be careful not to create a bunch of standalone accounts.
:::

Check for a log line like `dbt State adapter: dbt-state <version> is enabled` before continuing.

</TabItem>

<TabItem value="dbt-platform" label="dbt platform">

Enable dbt State in the dbt Studio IDE by [following these directions](/docs/deploy/dbt-state-enable-studio).

</TabItem>

</Tabs>

### Workflows to test

1. **Model reuse** – run a model, then immediately run it again. The model should be reused because there are no changes.
2. **Detecting changed logic** – add a comment to the model and run it again. It should still be reused, because comments don't impact the logic of a query. Make a more significant change (such as reordering columns) and try again: this time the model should be executed to apply the changes.
3. **Reuse across users and branches** – commit the change to a new branch, then have a colleague run the checked-out branch themselves. They should get a clone of your table instead of rebuilding it themselves. If they don't, check that their permissions allow them to see your development schema.
4. **Detecting changed data** – change an upstream source and see how the configured `lag_tolerance` prevents or triggers a rebuild. If you don't want to actually load fresh data, the easiest way to simulate it is to specify a custom `loaded_at_field` which is just `current_timestamp()`.

If you get unexpected results from any of these experiments, use [the `explain` command](/reference/commands/state-explain).

## 5. Expand to dev and CI

After the small experiments from the prior section have succeeded, it's time to expand adoption. You can enable the rest of your colleagues to access dbt State by inviting them to the dbt platform organization from earlier, or by providing them with a service token instead.

Remember that to be able to clone from production environments, dbt State needs to be active in production. You can expect your reuse rate to increase after also enabling dbt State in production; in the meantime you can consider temporarily running a "shadow" version of production in a different environment.

If you need to prevent models from being cloned into a given environment, set the `allow_clones` config. Most of the time, this is not necessary because a table can only be used as the source of a clone if it's got the same logic and is the freshest version of a table. Directly modifying the table (such as deleting records) could cause the modified table to be chosen as the freshest version. On the other hand, allowing clones from lower environments is a great way to save in blue/green style deployments, because a CI build can be promoted directly to production. 

## 6. Optimize reuse rates

dbt State is conservative, and will prioritize accuracy over reuse rate when a model's eligibility is ambiguous. If your reuse rate is lower than you'd expect, here are some common causes and the ways to resolve them ([this FAQ page](/faqs/State/views-rebuilt) has more in-depth explanations).

- **Views that `select *`.** If the expected columns from an upstream table aren't enumerated in the query, views will be rebuilt to protect against schema drift causing a failing query. Fix this by listing the column names.
- **Non-deterministic Jinja.** Jinja variables like `{{ invocation_id }}` will prevent reuse unless `compare_unrendered_code` is set to true. We recommend you change this setting to true, with these exceptions:
  - If you use Jinja variables to change the logic in your model (such as adding or removing a `limit 0` for dry run purposes), `compare_unrendered_code` should stay false to capture those logic changes
  - If you use `evaluate_volatile_sql`, the volatile SQL will only be checked if there is also a change to the raw model file, because the unrendered code is checked and excluded first.
- **Inaccurate or missing freshness data.** External sources such as files stored in S3 or as Google Sheets do not provide native freshness metadata, so you need to specify `loaded_at_field` or `loaded_at_query` for best results.
- **Unnecessarily short `lag_tolerance`.** Increasing lag tolerance is the most effective way to reduce build rates. The default is 45 minutes, but we recommend specifying a [different option in development and production](/reference/resource-configs/lag-tolerance#use-different-tolerances-per-environment) instead of keeping the same default everywhere.
- **Rebuilding on fresh data from `any` parent table.** The `require_fresh_data_from` config defaults to `any`. Switching to `all` will increase reuse rate by preventing executions until all input tables have received new data.

## 7. Enable reuse in production 

By this point, you should be confident that dbt State makes the decisions you expect. If you're not completely sold, you may want to run a parallel pipeline first.

<Tabs queryString="orchestrator">

<TabItem value="self-hosted" label="Self-hosted">
To authenticate with dbt State in production, we recommend using a [service token](/docs/deploy/dbt-state-cicd) to avoid the browser login workflow. Also check that your network allows access to [dbt State's URLs](/docs/deploy/dbt-state-cicd#network-requirements).

Unexpected rebuilds stand out easily in logs, but make sure you also check for unexpected reuses. If a model is not rebuilt when you expect it to be, use the [`explain` command](/reference/commands/state-explain) to work out why. You can provide a specific invocation's log file at the CLI instead of simply checking the most recent invocation if you need to look back in time. 

</TabItem>

<TabItem value="dbt-platform" label="dbt platform">
Enable dbt State on [individual jobs](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-individual-jobs) or by turning it on at the [environment level](/docs/deploy/dbt-state-enable-env-jobs#enabling-dbt-state-on-environments). Existing jobs default to having dbt State off, so also update them to **Inherited from environment**.

Unexpected rebuilds stand out easily in logs, but make sure you also check for unexpected reuses. If a model is not rebuilt when you expect it to be, use the [Explain tab](/docs/deploy/dbt-state-interface#explain-tab) to work out why.

</TabItem>

</Tabs>

## 8. Simplify orchestration by consolidating jobs

dbt State enables you to move from a highly imperative scheduling approach (these models should run at these times of day) to a declarative approach (these models should run as frequently as is necessary to meet my SLAs). 

This change means you can remove a lot of complexity from your existing orchestration setup – all of the jobs that used to trigger on different cadences and select a subset of models can be collapsed into a single job. 

Alongside the conceptual simplicity, this also increases reuse potential because some models in the DAG will be split across multiple jobs and be triggered unnecessarily often. 

## Closing advice

<Tabs queryString="orchestrator">

<TabItem value="self-hosted" label="Self-hosted">
The best way to get started is with a 30 day unlimited trial. After the trial ends, you will not be charged; instead you will switch over to a free plan which includes 1000 DATTs per month. Additional invocations will return to standard dbt behaviour, where all selected models execute from scratch every time. 
</TabItem>

<TabItem value="dbt-platform" label="dbt platform">
The best way to get started is with a 30 day unlimited trial. After the trial ends, you will not be charged unless you have an existing paid platform account; instead you will switch over to a free plan which includes at least 1000 DATTs per month. Additional invocations will return to standard dbt behaviour, where all selected models execute from scratch every time. 
</TabItem>

</Tabs>

If you run into questions or have your own advice to share, feel free to leave a comment below or in the `#dbt-state` channel on the dbt Community Slack.
