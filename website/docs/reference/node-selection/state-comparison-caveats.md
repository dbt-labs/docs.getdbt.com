---
title: "Caveats to state comparison"
---

The [`state:` selection method](methods#the-state-method) is a wildly powerful feature, with a lot of underlying complexity. Below are a handful of considerations when setting up automated jobs that leverage state comparison.

### Seeds

dbt stores a file hash of seed files that are <1 MB in size. If the contents of these seeds is modified, the seed will be included in `state:modified`.

If a seed file is >1 MB in size, dbt cannot compare its contents and will raise a warning as such. Instead, dbt will use only the seed's file path to detect changes. If the file path has changed, the seed will be included in `state:modified`; if it hasn't, it won't.

### Macros, vars

Although dbt can observe modifications to macros, it cannot reliably determine  the set of downstream resources that select from a given macro. As such, macro  modifications are not reflected in `state:modified` selection criteria. dbt will raise a warning at top of runs that use the `state:` method if it detects a macro has been modified.

The same principle holds true for `vars` and `env_vars`. If a model uses a `var` in its definition, dbt is unable today to identify that lineage in such a way that it could include the model in `state:modified` when the `var` value changes.

### Tests

The command `dbt test -m state:modified` will include both:
- tests that select from a new/modified resource
- tests that are themselves new or modified

As long as you're adding or changing tests at the same time that you're adding or changing the resources (models, seeds, snapshots) they select from, all should work the way you expect with "simple" state selection:

```shell
$ dbt run -m state:modified
$ dbt test -m state:modified
```

This can get complicated, however. If you add a new test without modifying its underlying model, or add a test that selects from a new model and an old unmodified one, you may need to test a model without having first run it.

In v0.18.0, you needed to handle this by building the unmodified models needed for modified tests:

```shell
$ dbt run -m state:modified @state:modified,1+test_type:data
$ dbt test -m state:modified
```

In v0.19.0, dbt added support for deferring upstream references when testing. If a test selects from a model that doesn't exist as a database object in your current environment, dbt will look to the other environment instead—the one defined in your state manifest. This enables you to use "simple" state selection without risk of query failure, but it may have some surprising consequences for tests with multiple parents. For instance, if you have a `relationships` test that depends on one modified model and one unmodified model, the test query will select from data "across" two different environments. If you limit or sample your data in development and CI, it may not make much sense to test for referential integrity, knowing there's a good chance of mismatch.

If you're a frequent user of `relationships` tests or data tests, or frequently find yourself adding tests without modifying their underlying models, consider tweaking the selection criteria of your CI job. For instance:

```shell
$ dbt run -m state:modified
$ dbt test -m state:modified --exclude test_name:relationships
```

### False positives

State comparison works by identifying discrepancies between two manifests.  Those discrepancies could be the result of:

1. Changes made to a project in development
2. Env-aware logic that causes different behavior based on the `target`, env vars, etc.

dbt will do its best to capture *only* changes that are the result of modifications made in development. In projects with intricate env-aware logic, dbt will err on the side of running too many models (i.e. false positives). Over the next several versions of dbt, We're working on:
- iterative improvements to dbt's built-in dectective abilities
- better options for more complex projects, in the form of more-specific subselectors (see [this issue](https://github.com/fishtown-analytics/dbt/issues/2704))

<Changelog>

- v0.18.0: All env-aware logic results in false positives during state comparison, when comparing against a manifest generated with a different target.
- v0.19.0: dbt stores and compares unrendered Jinja expressions for configurations, allowing it to see past env-aware logic in `dbt_project.yml`.

</Changelog>

State comparison is now able to detect env-aware config in `dbt_project.yml`. For instance, this target-based config would register as a modification in v0.18.0, but in v0.19.0 it no longer will:

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

### Final note

State comparison is complex. We hope to reach eventual consistency between all configuration options, as well as providing users with the control they need to reliably return all modified resources, and only the ones they expect. If you're interested in learning more, read [open issues tagged "state"](https://github.com/fishtown-analytics/dbt/issues?q=is%3Aopen+is%3Aissue+label%3Astate) in the dbt repository.
