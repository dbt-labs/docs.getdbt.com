---
title: "Caveats to state comparison"
---

The [`state:` selection method](methods#the-state-method) is a wildly powerful feature, with a lot of underlying complexity. Here are two big things to consider when setting up automated jobs  that leverage state comparison.

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

As long as you're adding or changing tests at the same time that you're adding or changing the resources (models, seeds, snapshots) they select from, all should work the way you expect.

That said, there are some implications when running in a development or CI context:
- When you add a test, or modify an existing test (such as its `severity` level), that selects from an otherwise unmodified resource. That test, but not its parent resource, will be included in the selection criteria of `state:modified`. The test will fail because its parent is "missing" in the sandbox schema, on account of not having been included in the selection criteria of `dbt run -m state:modified`, `dbt seed -s state:modified`, etc.
- When you have an unmodified `relationships` test, data test, or custom schema test that depends on multiple resources, only one of which is modified. That test will be included in the selection criteria of `state:modified`, on account of its parent. There's no guarantee, however, that _all_ first-order parents of that test are included in the selection criteria of `state:modified`. When dbt executes the  test, one or more of its parents will be "missing" and the test will fail.

Given the way that test selection works today, these sets of test difficult to disambiguate. If you're a frequent user of `relationships` tests or data tests, or frequently find yourself adding tests without modifying their underlying models, consider tweaking  the selection criteria of your CI job. For instance:

```bash
$ dbt run -m state:modified
$ dbt test -m state:modified --exclude test_name:relationships
```

"Run all modified models, then execute all modified tests _except_ relationships tests."

```bash
$ dbt run -m state:modified 1+state:modified,1+test_type:data
$ dbt test -m state:modified
```

"Run all modified models _and_ all first-order parents of modified data tests, then execute all modified tests." This is a "safe not sorry" approach: you may find an extra model along for the ride, if it is the first-order parent of an modified model and the first-order parent of a data test, but not the first-order parent of a modified data test. ([For more on this phenomenon.](https://youtu.be/bWOfT45DShU?t=73))

When your selection syntax gets too verbose, consider defining a [YAML selector](node-selection/yaml-selectors).

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
