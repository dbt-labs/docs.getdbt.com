---
title: "Python models"
sidebar_label: "Python models"
description: "How to build Python models on Amazon Athena using Spark, including configuration, examples, and known limitations."
---

The adapter supports Python models using [`spark`](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).

### Prerequisites

- A Spark-enabled workgroup created in Athena.
- Spark execution role granted access to Athena, Glue and S3.
- The Spark workgroup is added to the `~/.dbt/profiles.yml` file and the profile to be used
  is referenced in `dbt_project.yml`.

### Spark-specific table configuration

| Configuration | Default |  Description |
|---------------|---------|--------------|
| `timeout`     | 43200   | Time out in seconds for each Python model execution. Defaults to 12 hours/43200 seconds. |
| `spark_encryption` | False | When set to `true,` it encrypts data stored locally by Spark and in transit between Spark nodes. |
| `spark_cross_account_catalog` | False | When using the Spark Athena workgroup, queries can only be made against catalogs on the same AWS account by default. Setting this parameter to true will enable querying external catalogs if you want to query another catalog on an external AWS account. <br></br> Use the syntax `external_catalog_id/database.table` to access the external table on the external catalog (For example, `999999999999/mydatabase.cloudfront_logs` where 999999999999 is the external catalog ID).|
| `spark_requester_pays` | False | When set to true, if an Amazon S3 bucket is configured as `requester pays`, the user account running the query is charged for data access and data transfer fees associated with the query. | 


### Spark notes

- A session is created for each unique engine configuration defined in the models that are part of the invocation.
A session's idle timeout is set to 10 minutes. Within the timeout period, if a new calculation (Spark Python model) is ready for execution and the engine configuration matches, the process will reuse the same session.
- The number of Python models running simultaneously depends on the `threads`. The number of sessions created for the entire run depends on the number of unique engine configurations and the availability of sessions to maintain thread concurrency.
- For Iceberg tables, it's recommended to use the `table_properties` configuration to set the `format_version` to `2`. This helps maintain compatibility between the Iceberg tables Trino created and those Spark created.

### Example models

<Tabs>

<TabItem value="Simple pandas">

```python
import pandas as pd


def model(dbt, session):
    dbt.config(materialized="table")

    model_df = pd.DataFrame({"A": [1, 2, 3, 4]})

    return model_df
```

</TabItem>

<TabItem value="Simple Spark" >

```python
def model(dbt, spark_session):
    dbt.config(materialized="table")

    data = [(1,), (2,), (3,), (4,)]

    df = spark_session.createDataFrame(data, ["A"])

    return df
```
</TabItem>

<TabItem value="Spark incremental" >

```python
def model(dbt, spark_session):
    dbt.config(materialized="incremental")
    df = dbt.ref("model")

    if dbt.is_incremental:
        max_from_this = (
            f"select max(run_date) from {dbt.this.schema}.{dbt.this.identifier}"
        )
        df = df.filter(df.run_date >= spark_session.sql(max_from_this).collect()[0][0])

    return df
```

</TabItem>

<TabItem value="Config Spark model">

```python
def model(dbt, spark_session):
    dbt.config(
        materialized="table",
        engine_config={
            "CoordinatorDpuSize": 1,
            "MaxConcurrentDpus": 3,
            "DefaultExecutorDpuSize": 1
        },
        spark_encryption=True,
        spark_cross_account_catalog=True,
        spark_requester_pays=True
        polling_interval=15,
        timeout=120,
    )

    data = [(1,), (2,), (3,), (4,)]

    df = spark_session.createDataFrame(data, ["A"])

    return df
```

</TabItem>

<TabItem value="PySpark UDF" >

Using imported external python files:

```python
def model(dbt, spark_session):
    dbt.config(
        materialized="incremental",
        incremental_strategy="merge",
        unique_key="num",
    )
    sc = spark_session.sparkContext
    sc.addPyFile("s3://athena-dbt/test/file1.py")
    sc.addPyFile("s3://athena-dbt/test/file2.py")

    def func(iterator):
        from file2 import transform

        return [transform(i) for i in iterator]

    from pyspark.sql.functions import udf
    from pyspark.sql.functions import col

    udf_with_import = udf(func)

    data = [(1, "a"), (2, "b"), (3, "c")]
    cols = ["num", "alpha"]
    df = spark_session.createDataFrame(data, cols)

    return df.withColumn("udf_test_col", udf_with_import(col("alpha")))
```

</TabItem>

</Tabs>

### Known issues in Python models

- Python models can't [reference Athena SQL views](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).
- You can use third-party Python libraries; however, they must be [included in the pre-installed list][pre-installed list] or [imported manually][imported manually].
- Python models can only reference or write to tables with names matching the regular expression: `^[0-9a-zA-Z_]+$`. Spark doesn't support dashes or special characters, even though Athena supports them.
- Incremental models don't fully utilize Spark capabilities. They depend partially on existing SQL-based logic that runs on Trino.
- Snapshot materializations are not supported.
- Spark can only reference tables within the same catalog.
- For tables created outside of the dbt tool, be sure to populate the location field, or dbt will throw an error when creating the table.


[pre-installed list]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark-preinstalled-python-libraries.html
[imported manually]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-import-files-libraries.html
