---
title: "Caveats to state comparison"
description: "Learn about caveats to state comparison in dbt."
pagination_prev: "reference/node-selection/configure-state"
---

import StateModified from '/snippets/_state-modified-compare.md';

The [`state:` selection method](/reference/node-selection/methods#state) is a powerful feature, with a lot of underlying complexity. Below are a handful of considerations when setting up automated jobs that leverage state comparison.

### False positives

:::warning False positives are the most common issue with state selection

A false positive occurs when dbt marks a model as `state:modified` even though you didn't change it. This typically happens when your model uses environment-aware logic — like `target.name`, `env_var()`, or `var()` — in its configuration or SQL. Because dbt compares *rendered* values between the current environment and the state manifest, a model compiled in `dev` will look different from the same model compiled in `prod`, triggering a spurious modification.

:::

**Example:** Consider a model that customizes its schema based on the target environment:

```sql
-- models/my_model.sql
{{ config(schema='dbt_' ~ target.name) }}

select * from {{ ref('other_model') }}
```

When this model is compiled in `dev`, the schema resolves to `dbt_dev`. In `prod`, it resolves to `dbt_prod`. If your CI job runs `state:modified` against a production manifest, dbt sees `dbt_dev` vs `dbt_prod` and flags the model as modified — even though nothing actually changed.

The same false-positive behavior can occur with `env_var()` calls in model configs, `var()` values that differ between environments, or any other logic that renders differently depending on where dbt is run.

**Fix:** Set the `state_modified_compare_more_unrendered_values` [behavior flag](/reference/global-configs/behavior-changes#behavior-change-flags) to `true`. This tells dbt to compare the *unrendered* (pre-compiled) config values instead of the rendered ones, eliminating most environment-driven false positives.

<StateModified features={'/snippets/_state-modified-compare.md'}/>

### Seeds

dbt stores a file hash of seed files that are &lt;1 MiB in size. If the contents of these seeds is modified, the seed will be included in `state:modified`.

If a seed file is >1 MiB in size, dbt cannot compare its contents and will raise a warning as such. Instead, dbt will use only the seed's file path to detect changes. If the file path has changed, the seed will be included in `state:modified`; if it hasn't, it won't.

### Macros

dbt will mark modified any resource that depends on a changed macro, or on a macro that depends on a changed macro.

### Vars

If a model uses a `var` or `env_var` in its definition, dbt is unable to identify that lineage in such a way that it can include the model in `state:modified` because the `var` or `env_var` value has changed. It's likely that the model will be marked modified if the change in variable results in a different configuration.

### Tests

The command `dbt test -s state:modified` will include both:
- tests that select from a new/modified resource
- tests that are themselves new or modified

As long as you're adding or changing tests at the same time that you're adding or changing the resources (models, seeds, snapshots) they select from, all should work the way you expect with "simple" state selection:

```shell
dbt run -s "state:modified"
dbt test -s "state:modified"
```

This can get complicated, however. If you add a new test without modifying its underlying model, or add a test that selects from a new model and an old unmodified one, you may need to test a model without having first run it.

You can defer upstream references when testing. For example, if a test selects from a model that doesn't exist as a database object in your current environment, dbt will look to the other environment instead—the one defined in your state manifest. This enables you to use "simple" state selection without risk of query failure, but it may have some surprising consequences for tests with multiple parents. For instance, if you have a `relationships` test that depends on one modified model and one unmodified model, the test query will select from data "across" two different environments. If you limit or sample your data in development and CI, it may not make much sense to test for referential integrity, knowing there's a good chance of mismatch.

If you're a frequent user of `relationships` tests or data tests, or frequently find yourself adding tests without modifying their underlying models, consider tweaking the selection criteria of your CI job. For instance:

```shell
dbt run -s "state:modified"
dbt test -s "state:modified" --exclude "test_name:relationships"
```
### Overwrites the `manifest.json`

import Overwritesthemanifest from '/snippets/_overwrites-the-manifest.md';

<Overwritesthemanifest />

#### Recommendation

import Recommendationoverwritesthemanifest from '/snippets/_recommendation-overwriting-manifest.md'; 

<Recommendationoverwritesthemanifest />

### Final note

State comparison is complex. We hope to reach eventual consistency between all configuration options, as well as providing users with the control they need to reliably return all modified resources, and only the ones they expect. If you're interested in learning more, read [open issues tagged "state"](https://github.com/dbt-labs/dbt-core/issues?q=is%3Aopen+is%3Aissue+label%3Astate) in the dbt repository.

## Related docs
- [About state in dbt](/reference/node-selection/state-selection)
- [Configure state selection](/reference/node-selection/configure-state)
