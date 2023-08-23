---
title: "Configuring materializations"
id: materializations-guide-3-configuring-materializations
slug: 3-configuring-materializations
description: Read this guide to understand how to configure materializations in dbt.
displayText: Materializations best practices
hoverSnippet: Read this guide to understand how to configure materializations in dbt.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Configuring materializations

Choosing which materialization is as simple as setting any other configuration in dbt. We’ll look first at how we select our materializations for individual models, then at more powerful ways of setting materializations for entire folders of models.

### Configuring tables and views

Let’s look at how we can use tables and views to get started with materializations:

- ⚙️ We can configure an individual model’s materialization using a **Jinja `config` block**, and passing in the **`materialized` argument**. This tells dbt what materialization to use.
- 🚰 The underlying specifics of what is run depends on [which **adapter** you’re using](/docs/supported-data-platforms), but the end results will be equivalent.
- 😌 This is one of the many valuable aspects of dbt: it lets us use a **declarative** approach, specifying the _outcome_ that we want in our code, rather than _specific steps_ to achieve it (the latter is an _imperative_ approach if you want to get computer science-y about it 🤓).
- 🔍 In the below case, we want to create a **view**, and can **declare** that in a **single line of code**.

<Tabs>
<TabItem value="sql" label="SQL" default>

```sql
    {{
        config(
            materialized='view'
        )
    }}

    select ...
```

</TabItem>
<TabItem value="python" label="Python">

```python
def model(dbt, session):

    dbt.config(materialized="view")

    # model logic

    return model_df
```

</TabItem>
</Tabs>

:::info
🐍 **Not all adapters support python yet**, check the [docs here to be sure](/docs/build/python-models#specific-data-platforms) before spending time writing python models.
:::

- Configuring a model to materialize as a `table` is simple, and the same as a `view` for both SQL and python models.

<Tabs>
<TabItem value="sql" label="SQL">

```sql
{{
    config(
        materialized='table'
    )
}}

select ...
```

</TabItem>
<TabItem value="python" label="Python">

```python
def model(dbt, session):

    dbt.config(materialized="table")

    # model logic

    return model_df
```

</TabItem>
</Tabs>

Go ahead and try some of these out!
