---
title: "Graph operators"
---

### The "plus" operator
If placed at the front of the model selector, `+` will select all parents of the selected model. If placed at the end of the string, `+` will select all children of the selected model.

<VersionBlock firstVersion="0.21">

   ```bash
  $ dbt run --select my_model+          # select my_model and all children
  $ dbt run --select +my_model          # select my_model and all parents
  $ dbt run --select +my_model+         # select my_model, and all of its parents and children
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  $ dbt run --models my_model+          # select my_model and all children
  $ dbt run --models +my_model          # select my_model and all parents
  $ dbt run --models +my_model+         # select my_model, and all of its parents and children
  ```

</VersionBlock>

### The "n-plus" operator
<Changelog>New in v0.18.0</Changelog>

You can adjust the behavior of the `+` operator by quantifying the number of edges
to step through.

<VersionBlock firstVersion="0.21">

  ```bash
  $ dbt run --select my_model+1          # select my_model and its first-degree children
  $ dbt run --select 2+my_model          # select my_model, its first-degree parents, and its second-degree parents ("grandparents")
  $ dbt run --select 3+my_model+4        # select my_model, its parents up to the 3rd degree, and its children down to the 4th degree
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  $ dbt run --models my_model+1          # select my_model and its first-degree children
  $ dbt run --models 2+my_model          # select my_model, its first-degree parents, and its second-degree parents ("grandparents")
  $ dbt run --models 3+my_model+4        # select my_model, its parents up to the 3rd degree, and its children down to the 4th degree
  ```

</VersionBlock>

### The "at" operator
The `@` operator is similar to `+`, but will also include _the parents of the children of the selected model_. This is useful in continuous integration environments where you want to build a model and all of its children, but the _parents_ of those children might not exist in the database yet. The selector `@snowplow_web_page_context` will build all three models shown in the diagram below.

<Lightbox src="/img/docs/running-a-dbt-project/command-line-interface/1643e30-Screen_Shot_2019-03-11_at_7.18.20_PM.png" title="@snowplow_web_page_context will select all of the models shown here"/>

```bash
$ dbt run --models @my_model          # select my_model, its children, and the parents of its children
```

### The "star" operator
The `*` operator matches all models within a package or directory.

<VersionBlock firstVersion="0.21">

  ```bash
  $ dbt run --select snowplow.*      # run all of the models in the snowplow package
  $ dbt run --select finance.base.*  # run all of the models in models/finance/base
  ```

</VersionBlock>
<VersionBlock lastVersion="0.20">

  ```bash
  $ dbt run --models snowplow.*      # run all of the models in the snowplow package
  $ dbt run --models finance.base.*  # run all of the models in models/finance/base
  ```

</VersionBlock>
