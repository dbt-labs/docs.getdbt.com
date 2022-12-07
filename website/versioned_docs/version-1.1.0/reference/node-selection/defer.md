---
title: "Defer"
---

<Changelog>

- **v0.18.0**: Introduced `--defer` and `--state` flags as beta features.
- **v0.19.0**: Changed `--defer` to use the current environment's resource, if it exists, and only fall back to the other environment's resource if the first does not. Also added support for `dbt test --defer`.

</Changelog>

**N.B.** Deferral is a powerful, complex feature that enables compelling workflows. We reserve the right to change the name and syntax in a future version of dbt to make the behavior clearer and more intuitive. For details, see [dbt#2968](https://github.com/dbt-labs/dbt-core/issues/2968).

Defer is a powerful feature that makes it possible to run a subset of models or tests in a [sandbox environment](docs/collaborate/environments), without having to first build their upstream parents. This can save time and computational resources when you want to test a small number of models in a large project.

Defer requires that a manifest from a previous dbt invocation be passed to the `--state` flag or env var. Together with the `state:` selection method, these features enable "Slim CI". Read more about [state](understanding-state).
### Usage

<VersionBlock firstVersion="0.21">

```shell
$ dbt run --select [...] --defer --state path/to/artifacts
$ dbt test --select [...] --defer --state path/to/artifacts
```

</VersionBlock>

<VersionBlock lastVersion="0.20">

```shell
$ dbt run --models [...] --defer --state path/to/artifacts
$ dbt test --models [...] --defer --state path/to/artifacts
```

</VersionBlock>

When the `--defer` flag is provided, dbt will resolve `ref` calls differently depending on two criteria:
1. Is the referenced node included in the model selection criteria of the current run?
2. Does the reference node exist as a database object in the current environment?

If the answer to both is **no**—a node is not included _and_ it does not exist as a database object in the current environment—references to it will use the other namespace instead, provided by the state manifest.

Ephemeral models are never deferred, since they serve as "passthroughs" for other `ref` calls.

When using defer, you may be selecting from production datasets, development datasets, or a mix of both. Note that this can yield unexpected results
- if you apply env-specific limits in dev but not prod, as you may end up selecting more data than you expect
- when executing tests that depend on multiple parents (e.g. `relationships`), since you're testing "across" environments

Deferral requires both `--defer` and `--state` to be set, either by passing flags explicitly or by setting environment variables (`DBT_DEFER_TO_STATE` and `DBT_ARTIFACT_STATE_PATH`). If you use dbt Cloud, read about [how to set up CI jobs](/docs/deploy/cloud-ci-job).

### Example

In my local development environment, I create all models in my target schema, `dev_alice`. In production, the same models are created in a schema named `prod`.

I access the dbt-generated [artifacts](artifacts) (namely `manifest.json`) from a production run, and copy them into a local directory called `prod-run-artifacts`.

### run
I've been working on `model_b`:

<File name='models/model_b.sql'>

```sql
select

    id,
    count(*)

from {{ ref('model_a') }}
group by 1
```

I want to test my changes. Nothing exists in my development schema, `dev_alice`.

### test
:::info
Before dbt v0.21, use the `--models` flag instead of `--select`.
:::
</File>

<Tabs
  defaultValue="no_defer"
  values={[
    { label: 'Standard run', value: 'no_defer', },
    { label: 'Deferred run', value: 'yes_defer', },
  ]
}>

<TabItem value="no_defer">

```shell
$ dbt run --select model_b
```

<File name='target/run/my_project/model_b.sql'>

```sql
create or replace view dev_me.model_b as (

    select

        id,
        count(*)

    from dev_alice.model_a
    group by 1

)
```

Unless I had previously run `model_a` into this development environment, `dev_alice.model_a` will not exist, thereby causing a database error.

</File>
</TabItem>

<TabItem value="yes_defer">

```shell
$ dbt run --select model_b --defer --state prod-run-artifacts
```

<File name='target/run/my_project/model_b.sql'>

```sql
create or replace view dev_me.model_b as (

    select

        id,
        count(*)

    from prod.model_a
    group by 1

)
```

</File>

Because `model_a` is unselected, dbt will check to see if `dev_alice.model_a` exists. If it doesn't exist, dbt will resolve all instances of `{{ ref('model_a') }}` to `prod.model_a` instead.

</TabItem>
</Tabs>

I also have a `relationships` test that establishes referential integrity between `model_a` and `model_b`:

<File name='models/resources.yml'>

```yml
version: 2

models:
  - name: model_b
    columns:
      - name: id
        tests:
          - relationships:
              to: ref('model_a')
              field: id
```

(A bit silly, since all the data in `model_b` had to come from `model_a`, but suspend your disbelief.)

:::info
Before dbt v0.21, use the `--models` flag instead of `--select`.
:::

</File>

<Tabs
  defaultValue="no_defer"
  values={[
    { label: 'Without defer', value: 'no_defer', },
    { label: 'With defer', value: 'yes_defer', },
  ]
}>

<TabItem value="no_defer">

```shell
dbt test --select model_b
```

<File name='target/compiled/.../relationships_model_b_id__id__ref_model_a_.sql'>

```sql
select count(*) as validation_errors
from (
    select id as id from dev_alice.model_b
) as child
left join (
    select id as id from dev_alice.model_a
) as parent on parent.id = child.id
where child.id is not null
  and parent.id is null
```

The `relationships` test requires both `model_a` and `model_b`. Because I did not build `model_a` in my previous `dbt run`, `dev_alice.model_a` does not exist and this test query fails.

</File>
</TabItem>

<TabItem value="yes_defer">

```shell
dbt test --select model_b --defer --state prod-run-artifacts
```

<File name='target/compiled/.../relationships_model_b_id__id__ref_model_a_.sql'>

```sql
select count(*) as validation_errors
from (
    select id as id from dev_alice.model_b
) as child
left join (
    select id as id from prod.model_a
) as parent on parent.id = child.id
where child.id is not null
  and parent.id is null
```

</File>

dbt will check to see if `dev_alice.model_a` exists. If it doesn't exist, dbt will resolve all instances of `{{ ref('model_a') }}`, including those in schema tests, to use `prod.model_a` instead. The query succeeds. Whether I really want to test for referential integrity across environments is a different question.

</TabItem>
</Tabs>
