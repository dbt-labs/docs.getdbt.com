---
title: "Putting it together"
---

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select my_package.*+      # select all models in my_package and their children
  $ dbt run --select +some_model+       # select some_model and all parents and children

  $ dbt run --select tag:nightly+       # select "nightly" models and all children
  $ dbt run --select +tag:nightly+      # select "nightly" models and all parents and children

  $ dbt run --select @source:snowplow   # build all models that select from snowplow sources, plus their parents

  $ dbt test --select config.incremental_strategy:insert_overwrite,test_name:unique   # execute all `unique` tests that select from models using the `insert_overwrite` incremental strategy
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models my_package.*+      # select all models in my_package and their children
  $ dbt run --models +some_model+       # select some_model and all parents and children

  $ dbt run --models tag:nightly+       # select "nightly" models and all children
  $ dbt run --models +tag:nightly+      # select "nightly" models and all parents and children

  $ dbt run --models @source:snowplow   # build all models that select from snowplow sources, plus their parents

  $ dbt test --models config.incremental_strategy:insert_overwrite,test_name:unique   # execute all `unique` tests that select from models using the `insert_overwrite` incremental strategy
  ```

</TabItem>
</Tabs>

This can get complex! Let's say I want a nightly run of models that build off snowplow data
and feed exports, while _excluding_ the biggest incremental models (and one other model, to boot).


<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models @source:snowplow,tag:nightly models/export --exclude package:snowplow,config.materialized:incremental export_performance_timing
  ```

</TabItem>
</Tabs>

This command selects all models that:
* Select from snowplow sources, plus their parents, _and_ are tagged "nightly"
* Are defined in the `export` model subfolder

Except for models that are:
* Defined in the snowplow package and materialized incrementally
* Named `export_performance_timing`
