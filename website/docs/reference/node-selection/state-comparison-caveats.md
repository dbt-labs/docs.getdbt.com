---
title: "Caveats to state comparison"
---

import StateModified from '/snippets/_state-modified-compare.md';

The [`state:` selection method](/reference/node-selection/methods#the-state-method) is a powerful feature, with a lot of underlying complexity. Below are a handful of considerations when setting up automated jobs that leverage state comparison.

### Seeds

dbt stores a file hash of seed files that are &lt;1 MiB in size. If the contents of these seeds is modified, the seed will be included in `state:modified`.

If a seed file is >1 MiB in size, dbt cannot compare its contents and will raise a warning as such. Instead, dbt will use only the seed's file path to detect changes. If the file path has changed, the seed will be included in `state:modified`; if it hasn't, it won't.

### Macros

dbt will mark modified any resource that depends on a changed macro, or on a macro that depends on a changed macro.

### Vars

If a model uses a `var` or `env_var` in its definition, dbt is unable today to identify that lineage in such a way that it can include the model in `state:modified` because the `var` or `env_var` value has changed. It's likely that the model will be marked modified if the change in variable results in a different configuration.

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

### False positives

<VersionBlock firstVersion="1.9">

To reduce false positives during `state:modified` selection due to env-aware logic, you can set the `state_modified_compare_more_unrendered_values` [behavior flag](/reference/global-configs/behavior-changes#behavior-change-flags) to `True`.

<StateModified features={'/snippets/_state-modified-compare.md'}/>

</VersionBlock>

<VersionBlock lastVersion="1.8">
State comparison works by identifying discrepancies between two manifests.  Those discrepancies could be the result of:

1. Changes made to a project in development
2. Env-aware logic that causes different behavior based on the `target`, env vars, etc., which can be avoided if you upgrade to dbt Core 1.9 and set the `state_modified_compare_more_unrendered_values` [behavior flag](/reference/global-configs/behavior-changes#behavior-change-flags) to `True`.

State comparison detects env-aware config in `dbt_project.yml`. This target-based config won't register as a modification:

<File name='dbt_project.yml'>

```yml
models:
  +materialized: "{{ 'table' if target.name == 'prod' else 'view' }}"
```

</File>

Of course, if the raw Jinja expression is modified, it will be marked as a modification.

Note that, as of now, this improved detection is true _only_ for `dbt_project.yml` configuration. It does not apply to:
- `.yml` resource properties (including `sources`)
- in-file `config()`

That means the following config—functionally identical to the snippet above—_will_ be marked as a modification when comparing across targets:

```sql
{{ config(
    materialized = ('table' if target.name == 'prod' else 'view')
) }}
```
</VersionBlock>

### Final note

State comparison is complex. We hope to reach eventual consistency between all configuration options, as well as providing users with the control they need to reliably return all modified resources, and only the ones they expect. If you're interested in learning more, read [open issues tagged "state"](https://github.com/dbt-labs/dbt-core/issues?q=is%3Aopen+is%3Aissue+label%3Astate) in the dbt repository.
