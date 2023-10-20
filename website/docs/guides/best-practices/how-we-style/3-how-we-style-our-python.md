---
title: How we style our Python
id: 3-how-we-style-our-python
---

## Python tooling

- 🐍 Python has a more mature and robust ecosystem for formatting and linting (helped by the fact that it doesn't have a million distinct dialects). We recommend using those tools to format and lint your code in the style you prefer.

- 🛠️ Our current recommendations are

  - [black](https://pypi.org/project/black/) formatter
  - [ruff](https://pypi.org/project/ruff/) linter

  :::info
  ☁️ dbt Cloud comes with the [black formatter built-in](https://docs.getdbt.com/docs/cloud/dbt-cloud-ide/lint-format) to automatically lint and format their SQL. You don't need to download or configure anything, just click `Format` in a Python model and you're good to go!
  :::

## Example Python

```python
import pandas as pd


def model(dbt, session):
    # set length of time considered a churn
    pd.Timedelta(days=2)

    dbt.config(enabled=False, materialized="table", packages=["pandas==1.5.2"])

    orders_relation = dbt.ref("stg_orders")

    # converting a DuckDB Python Relation into a pandas DataFrame
    orders_df = orders_relation.df()

    orders_df.sort_values(by="ordered_at", inplace=True)
    orders_df["previous_order_at"] = orders_df.groupby("customer_id")[
        "ordered_at"
    ].shift(1)
    orders_df["next_order_at"] = orders_df.groupby("customer_id")["ordered_at"].shift(
        -1
    )
    return orders_df
```
