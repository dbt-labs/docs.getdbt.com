---
title: "fal configurations"
id: "fal-configs"
---

## Setting the `db_profile`

The fal profile configuration needs the `db_profile` property set to the profile configuring your database for SQL models.

fal will wrap around adapter and just handle Python models while letting all the SQL
needs to the underlying database adapter.

fal will inherit the `threads` configuration from the `db_profile` unless explicitly specified.

Example:

<File name='profiles.yml'>

```yaml
jaffle_shop:
  target: dev_with_fal
  outputs:
    dev_with_fal:
      type: fal
      db_profile: dev_pg # This points to your main adapter
    dev_pg:
      type: postgres
      ...
```

</File>

## Using `fal_environment` model configuration

By creating a `fal_project.yml` in the same location as your `dbt_project.yml` and adding environment definitions in there:

<File name='fal_project.yml'>

```yaml
environments:
  - name: clustering
    type: conda
    packages:
      - kmodes==0.12.2

  - name: predict
    type: venv
    requirements:
      - prophet
```

</File>

You can now reference any of these environments in your dbt Python models:

<File name='my_clustering_model.py'>

```py
def model(dbt, fal):
    dbt.config({
        "fal_environment": "clustering"
    })

    import pandas as pd
    # kmodes is available because of the `fal_environment` being used
    from kmodes.kmodes import KModes

    df: pd.DataFrame = dbt.ref("order_detailed")
    df_train = df[["size", "is_vegan", "is_vegetarian", "is_keto", "shape"]]

    km_2 = KModes(n_clusters=3, init="Huang")
    km_2.fit_predict(df_train)
    df["cluster_label"] = km_2.labels_

    return df
```

</File>
