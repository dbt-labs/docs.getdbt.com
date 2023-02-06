---
title: "Configuring materializations"
id: materializations-guide-3-configuring-materializations
description: Learn how to utilize materializations in dbt.
displayText: Materializations best practices
hoverSnippet: Learn how to utilize materializations in dbt.
---

## Configuring materializations

Choosing which materialization is as simple as setting any other configuration in dbt. We’ll look first at how we select our materializations for individual models, then at more powerful ways of setting materializations for entire folders of models.

### Configuring tables and views

Let’s look at how we can use tables and views to get started with materializations:

- ⚙️ We can configure an individual model’s materialization using a **Jinja `config` block**, and passing in the **`materialized` argument**. This tells dbt what materialization to use.
- 🚰 The underlying specifics of what is run depends on [which **adapter** you’re using](https://docs.getdbt.com/docs/supported-data-platforms), but the end results will be equivalent.
- 😌 This is one of the many valuable aspects of dbt: it lets us use a **declarative** approach, specifying the _outcome_ that we want in our code, rather than _specific steps_ to achieve it (the latter is an _imperative_ approach if you want to get computer science-y about it 🤓).
- 🔍 In the below case, we want to create a **view**, and can **declare** that in a **single line of code**.

```sql
{{
    config(
        materialized='view'
    )
}}

select ...
```

In a very similar way, when in a python model (not all adapters support python yet, check the [docs here to be sure](https://docs.getdbt.com/docs/build/python-models#specific-data-platforms) before spending time writing python models), we can configure an individual model’s materialization with the `dbt.config()` method, and passing in the `materialized` keyword argument.

TODO: tab the above example and the below

```python
def model(dbt, session):

    dbt.config(materialized="view")

    # model logic

    return model_df
```

Configuring a model to materialize as a `table` is simple, and the same as a `view` for both SQL and python models.

```sql
{{
    config(
        materialized='table'
    )
}}

select ...
```

```python
def model(dbt, session):

    dbt.config(materialized="table")

    # model logic

    return model_df
```

Go ahead and try some of these out!
