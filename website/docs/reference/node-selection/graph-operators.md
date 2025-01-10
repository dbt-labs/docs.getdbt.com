---
title: "Graph operators"
---

### The "plus" operator
The `+` operator expands your selection to include ancestors (upstream dependencies) or descendants (downstream dependencies) of a resource. This operator works for individual models, tags, and other resources.

- Placed after a model/resource &mdash; Includes the resource itself and all its descendants (downstream dependencies).
- Placed before a model/resource &mdash; Includes the resource itself and all its ancestors (upstream dependencies).
- Placed on both sides of a model/resource &mdash; Includes the resource itself, all its ancestors, and all its descendants.

```bash
dbt run --select "my_model+"         # select my_model and all descendants
dbt run --select "+my_model"         # select my_model and all ancestors
dbt run --select "+my_model+"        # select my_model, and all of its ancestors and descendants
```

You can use it with selectors for a more specific scope in your commands. You can also combine it with [`--exclude`](/reference/node-selection/exclude) flag for even more finer control over what gets included in your command.

### The "n-plus" operator

You can adjust the behavior of the `+` operator by quantifying the number of edges
to step through.


  ```bash
dbt run --select "my_model+1"        # select my_model and its first-degree descendants
dbt run --select "2+my_model"        # select my_model, its first-degree ancestors ("parents"), and its second-degree ancestors ("grandparents")
dbt run --select "3+my_model+4"      # select my_model, its ancestors up to the 3rd degree, and its descendants down to the 4th degree
  ```


### The "at" operator
The `@` operator is similar to `+`, but will also include _all ancestors of all descendants of the selected model_. This is useful in continuous integration environments where you want to build a model and all of its descendants, but the _ancestors_ of those descendants might not exist in the schema yet. The `@` operator (which can only be placed at the front of the model name) will select as many degrees of ancestors ("parents," "grandparents," and so on) as is needed to successfully build all descendants of the specified model. 

The selector `@snowplow_web_page_context` will build all three models shown in the diagram below.

<Lightbox src="/img/docs/running-a-dbt-project/command-line-interface/1643e30-Screen_Shot_2019-03-11_at_7.18.20_PM.png" title="@snowplow_web_page_context will select all of the models shown here"/>

```bash
dbt run --select "@my_model"         # select my_model, its descendants, and the ancestors of its descendants
```
