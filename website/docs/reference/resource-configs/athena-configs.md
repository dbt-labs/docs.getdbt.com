---
title: "Amazon Athena configurations"
description: "Reference guide for the Amazon Athena adapter for dbt Core and dbt Cloud."
id: "athena-configs"
---

## Models

### Table configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `external_location` | None | The full S3 path to where the table is saved. It only works with incremental models. It doesn't work with Hive tables with `ha` set to `true`. |
| `partitioned_by` | None | An array list of columns by which the table will be partitioned. Currently limited to 100 partitions. |
| `bucketed_by` | None | An array list of the columns to bucket data. Ignored if using Iceberg. |
| `bucket_count` | None | The number of buckets for bucketing your data. This parameter is ignored if using Iceberg. |
| `table_type` | Hive | The type of table. Supports `hive` or `iceberg`. |
| `ha` | False | Build the table using the high-availability method. Only available for Hive tables. |
| `format` | Parquet | The data format for the table. Supports `ORC`, `PARQUET`, `AVRO`, `JSON`, and `TEXTFILE`. |
| `write_compression` | None | The compression type for any storage format that allows compressions. |
| `field_delimeter` | None | Specify the custom field delimiter to use when the format is set to `TEXTFIRE`. |
| `table_properties` | N/A | The table properties to add to the table. This is only for Iceberg. |
| `native_drop` | N/A | Relation drop operations will be performed with SQL, not direct Glue API calls. No S3 calls will be made to manage data in S3. Data in S3 will only be cleared up for Iceberg tables. See the [AWS docs](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-managing-tables.html) for more info. Iceberg DROP TABLE operations may timeout if they take longer than 60 seconds.|
| `seed_by_insert` | False | Creates seeds using an SQL insert statement. Large seed files can't exceed the Athena 262144 bytes limit. |
| `force_batch` | False | Run the table creation directly in batch insert mode. Useful when the standard table creation fails due to partition limitation. |
| `unique_tmp_table_suffix` | False | Replace the "__dbt_tmp table" suffix with a unique UUID for incremental models using insert overwrite on Hive tables. |
| `temp_schema` | None | Defines a schema to hold temporary create statements used in incremental model runs. Scheme will be created in the models target database if it does not exist. |
| `lf_tags_config` | None | [AWS Lake Formation](#aws-lake-formation-integration) tags to associate with the table and columns. Existing tags will be removed. <br />* `enabled` (`default=False`) whether LF tags management is enabled for a model <br />* `tags` dictionary with tags and their values to assign for the model <br /> * `tags_columns` dictionary with a tag key, value and list of columns they must be assigned to |
| `lf_inherited_tags` | None | List of the Lake Formation tag keys that are to be inherited from the database level and shouldn't be removed during the assignment of those defined in `ls_tags_config`. |
| `lf_grants` | None | Lake Formation grants config for `data_cell` filters. |

#### Configuration examples

<Tabs>

<TabItem value="schema.yml">

<File name="models/schema.yml">

```sql
{{
  config(
    materialized='incremental',
    incremental_strategy='append',
    on_schema_change='append_new_columns',
    table_type='iceberg',
    schema='test_schema',
    lf_tags_config={
          'enabled': true,
          'tags': {
            'tag1': 'value1',
            'tag2': 'value2'
          },
          'tags_columns': {
            'tag1': {
              'value1': ['column1', 'column2'],
              'value2': ['column3', 'column4']
            }
          },
          'inherited_tags': ['tag1', 'tag2']
    }
  )
}}
```
</File>

</TabItem>

<TabItem value="dbt_project.yml" >

<File name='dbt_project.yml' >

```yaml
  +lf_tags_config:
    enabled: true
    tags:
      tag1: value1
      tag2: value2
    tags_columns:
      tag1:
        value1: [ column1, column2 ]
    inherited_tags: [ tag1, tag2 ]
```

</File>

</TabItem>

<TabItem value="Lake formation grants" >

```python
lf_grants={
        'data_cell_filters': {
            'enabled': True | False,
            'filters': {
                'filter_name': {
                    'row_filter': '<filter_condition>',
                    'principals': ['principal_arn1', 'principal_arn2']
                }
            }
        }
    }
```

</TabItem>

</Tabs>

There are some limitations and recommendations that should be considered: 

- `lf_tags` and `lf_tags_columns` configs support only attaching lf tags to corresponding resources.
- We recommend managing LF Tags permissions somewhere outside dbt. For example, [terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions) or [aws cdk](https://docs.aws.amazon.com/cdk/api/v1/docs/aws-lakeformation-readme.html).
- `data_cell_filters` management can't be automated outside dbt because the filter can't be attached to the table, which doesn't exist. Once you `enable` this config, dbt will set all filters and their permissions during every dbt run. Such an approach keeps the actual state of row-level security configuration after every dbt run and applies changes if they occur: drop, create, and update filters and their permissions.
- Any tags listed in `lf_inherited_tags` should be strictly inherited from the database level and never overridden at the table and column level.
- Currently, `dbt-athena` does not differentiate between an inherited tag association and an override it made previously.
   - For example,  If a `lf_tags_config` value overrides an inherited tag in one run, and that override is removed before a subsequent run, the prior override will linger and no longer be encoded anywhere (for example, Terraform where the inherited value is configured nor in the DBT project where the override previously existed but now is gone).


### Table location

The saved location of a table is determined in precedence by the following conditions:

1. If `external_location` is defined, that value is used.
2. If `s3_data_dir` is defined, the path is determined by that and `s3_data_naming`.
3. If `s3_data_dir` is not defined, data is stored under `s3_staging_dir/tables/`.

The following options are available for `s3_data_naming`:

- `unique`: `{s3_data_dir}/{uuid4()}/`
- `table`: `{s3_data_dir}/{table}/`
- `table_unique`: `{s3_data_dir}/{table}/{uuid4()}/`
- `schema_table`: `{s3_data_dir}/{schema}/{table}/`
- `s3_data_naming=schema_table_unique`: `{s3_data_dir}/{schema}/{table}/{uuid4()}/`

To set the `s3_data_naming` globally in the target profile, overwrite the value in the table config, or set up the value for groups of the models in dbt_project.yml.

Note: If you're using a workgroup with a default output location configured, `s3_data_naming` ignores any configured buckets and uses the location configured in the workgroup.

### Incremental models

The following [incremental models](https://docs.getdbt.com/docs/build/incremental-models) strategies are supported:

- `insert_overwrite` (default): The insert-overwrite strategy deletes the overlapping partitions from the destination table and then inserts the new records from the source. This strategy depends on the `partitioned_by` keyword! dbt will fall back to the `append` strategy if no partitions are defined.
- `append`: Insert new records without updating, deleting or overwriting any existing data. There might be duplicate data (great for log or historical data).
- `merge`: Conditionally updates, deletes, or inserts rows into an Iceberg table. Used in combination with `unique_key`.It is only available when using Iceberg.


### On schema change

`on_schema_change` is an option to reflect changes of schema in incremental models.
The following options are supported:

- `ignore` (default)
- `fail`
- `append_new_columns`
- `sync_all_columns`

For details, please refer to the [incremental models](https://docs.getdbt.com/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change) article.

### Iceberg

The adapter supports table materialization for Iceberg.

Take the following model as an example:

```sql
{{ config(
    materialized='table',
    table_type='iceberg',
    format='parquet',
    partitioned_by=['bucket(user_id, 5)'],
    table_properties={
     'optimize_rewrite_delete_file_threshold': '2'
     }
) }}

select 'A'          as user_id,
       'pi'         as name,
       'active'     as status,
       17.89        as cost,
       1            as quantity,
       100000000    as quantity_big,
       current_date as my_date
```

Iceberg supports bucketing as hidden partitions. Use the `partitioned_by` config to add specific bucketing
conditions.

Iceberg supports several table formats for data : `PARQUET`, `AVRO` and `ORC`.

It is possible to use Iceberg in an incremental fashion, specifically two strategies are supported:

- `append`: New records are appended to the table (this can lead to duplicates).
- `merge`: Perform an update and insert (and optional delete), where new and existing records are added. It is only available with Athena engine version 3.
  - `unique_key`(required): Columns defining a unique source and target table record.
  - `incremental_predicates` (optional): SQL conditions that enable custom join clauses in the merge statement. This can
    help improve performance via predicate pushdown on the target table.
  - `delete_condition` (optional): SQL condition used to identify records that should be deleted.
  - `update_condition` (optional): SQL condition used to identify records that should be updated.
  - `insert_condition` (optional): SQL condition used to identify records that should be inserted.
    - `incremental_predicates`, `delete_condition`, `update_condition` and `insert_condition` can include any column of the incremental table (`src`) or the final table (`target`). Column names must be prefixed by either `src` or `target` to prevent a `Column is ambiguous` error.
    
Example of `delete_condition`:

```sql
{{ config(
    materialized='incremental',
    table_type='iceberg',
    incremental_strategy='merge',
    unique_key='user_id',
    incremental_predicates=["src.quantity > 1", "target.my_date >= now() - interval '4' year"],
    delete_condition="src.status != 'active' and target.my_date < now() - interval '2' year",
    format='parquet'
) }}

select 'A' as user_id,
       'pi' as name,
       'active' as status,
       17.89 as cost,
       1 as quantity,
       100000000 as quantity_big,
       current_date as my_date
```

`update_condition` example:

```sql
{{ config(
        materialized='incremental',
        incremental_strategy='merge',
        unique_key=['id'],
        update_condition='target.id > 1',
        schema='sandbox'
    )
}}

{% if is_incremental() %}

select * from (
    values
    (1, 'v1-updated')
    , (2, 'v2-updated')
) as t (id, value)

{% else %}

select * from (
    values
    (-1, 'v-1')
    , (0, 'v0')
    , (1, 'v1')
    , (2, 'v2')
) as t (id, value)

{% endif %}
```

Example of `insert_condition`:

```sql
{{ config(
        materialized='incremental',
        incremental_strategy='merge',
        unique_key=['id'],
        insert_condition='target.status != 0',
        schema='sandbox'
    )
}}

select * from (
    values
    (1, 0)
    , (2, 1)
) as t (id, status)

```

### High availablity table (HA)

The current implementation of table materialization can lead to downtime, as the target table is dropped and re-created. To have less destructive behavior, it's possible to use the `ha` config on your `table` materialized models. It leverages the table versions feature of the glue catalog, creating a temp table and swapping the target table to the location of the temp table. This materialization is only available for `table_type=hive` and requires using unique locations. For Iceberg, high availability is the default.


```sql
{{ config(
    materialized='table',
    ha=true,
    format='parquet',
    table_type='hive',
    partitioned_by=['status'],
    s3_data_naming='table_unique'
) }}

select 'a'      as user_id,
       'pi'     as user_name,
       'active' as status
union all
select 'b'        as user_id,
       'sh'       as user_name,
       'disabled' as status
```

By default, the materialization keeps the last 4 table versions,but you can change it by setting `versions_to_keep`.

#### HA known issues

- When swapping from a table with partitions to a table without (and the other way around), there could be a little
  downtime. If high performances is needed consider bucketing instead of partitions.
- By default, Glue "duplicates" the versions internally, so the last two versions of a table point to the same location.
- It's recommended to set `versions_to_keep` >= 4, as this will avoid having the older location removed.

### Update glue data catalog

Persist resource descriptions as column and relation comments to the glue data catalog, and meta as [glue table properties](https://docs.aws.amazon.com/glue/latest/dg/tables-described.html#table-properties) and [column parameters](https://docs.aws.amazon.com/glue/latest/webapi/API_Column.html). By default, documentation persistence is disabled, but it can be enabled for specific resources or groups of resources as needed.

For example:

```yaml
models:
  - name: test_deduplicate
    description: another value
    config:
      persist_docs:
        relation: true
        columns: true
      meta:
        test: value
    columns:
      - name: id
        meta:
          primary_key: true
```

See [persist docs](https://docs.getdbt.com/reference/resource-configs/persist_docs) for more details.

## Snapshots

The adapter supports snapshot materialization. It supports both timestamp and check strategy. To create a snapshot
create a snapshot file in the snapshots directory. If the directory does not exist create one.

### Timestamp strategy

To use the timestamp strategy refer to
the [dbt docs](https://docs.getdbt.com/docs/build/snapshots#timestamp-strategy-recommended)

### Check strategy

To use the check strategy refer to the [dbt docs](https://docs.getdbt.com/docs/build/snapshots#check-strategy)

### Hard-deletes

The materialization also supports invalidating hard deletes. Check
the [docs](https://docs.getdbt.com/docs/build/snapshots#hard-deletes-opt-in) to understand usage.

### Working example

seed file - employent_indicators_november_2022_csv_tables.csv

```csv
Series_reference,Period,Data_value,Suppressed
MEIM.S1WA,1999.04,80267,
MEIM.S1WA,1999.05,70803,
MEIM.S1WA,1999.06,65792,
MEIM.S1WA,1999.07,66194,
MEIM.S1WA,1999.08,67259,
MEIM.S1WA,1999.09,69691,
MEIM.S1WA,1999.1,72475,
MEIM.S1WA,1999.11,79263,
MEIM.S1WA,1999.12,86540,
MEIM.S1WA,2000.01,82552,
MEIM.S1WA,2000.02,81709,
MEIM.S1WA,2000.03,84126,
MEIM.S1WA,2000.04,77089,
MEIM.S1WA,2000.05,73811,
MEIM.S1WA,2000.06,70070,
MEIM.S1WA,2000.07,69873,
MEIM.S1WA,2000.08,71468,
MEIM.S1WA,2000.09,72462,
MEIM.S1WA,2000.1,74897,
```

model.sql

```sql
{{ config(
    materialized='table'
) }}

select row_number() over() as id
       , *
       , cast(from_unixtime(to_unixtime(now())) as timestamp(6)) as refresh_timestamp
from {{ ref('employment_indicators_november_2022_csv_tables') }}
```

timestamp strategy - model_snapshot_1

```sql
{% snapshot model_snapshot_1 %}

{{
    config(
      strategy='timestamp',
      updated_at='refresh_timestamp',
      unique_key='id'
    )
}}

select *
from {{ ref('model') }} {% endsnapshot %}
```

invalidate hard deletes - model_snapshot_2

```sql
{% snapshot model_snapshot_2 %}

{{
    config
    (
        unique_key='id',
        strategy='timestamp',
        updated_at='refresh_timestamp',
        invalidate_hard_deletes=True,
    )
}}
select *
from {{ ref('model') }} {% endsnapshot %}
```

check strategy - model_snapshot_3

```sql
{% snapshot model_snapshot_3 %}

{{
    config
    (
        unique_key='id',
        strategy='check',
        check_cols=['series_reference','data_value']
    )
}}
select *
from {{ ref('model') }} {% endsnapshot %}
```

### Snapshots known issues

- Incremental Iceberg models - Sync all columns on schema change can't remove columns used for partitioning. The only way, from a dbt perspective, is to do a full-refresh of the incremental model.
- Tables, schemas and database names should only be lowercase
- In order to avoid potential conflicts, make sure [`dbt-athena-adapter`](https://github.com/Tomme/dbt-athena) is not installed in the target environment.
- Snapshot does not support dropping columns from the source table. If you drop a column make sure to drop the column from the snapshot as well. Another workaround is to NULL the column in the snapshot definition to preserve history

## AWS Lake Formation integration

The following is how the adapter implements AWS Lake Formation tag management:

- You can enable or disable lf-tags management via [config](#table-configuration) (disabled by default)
- Once you enable the feature, lf-tags will be updated on every dbt run
- First, all lf-tags for columns are removed to avoid inheritance issues
- Then, all redundant lf-tags are removed from tables and actual tags from table configs are applied
- Finally, lf-tags for columns are applied

It's important to understand the following points:

- dbt does not manage `lf-tags` for databases
- dbt does not manage Lake Formation permissions

That's why you should handle this by yourself manually or using an automation tool like terraform, AWS CDK, etc. You may find the following links useful to manage that:

* [terraform aws_lakeformation_permissions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions)
* [terraform aws_lakeformation_resource_lf_tags](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_resource_lf_tags)

## Python models

The adapter supports Python models using [`spark`](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).

### Setup

- A Spark-enabled workgroup created in Athena
- Spark execution role granted access to Athena, Glue and S3
- The Spark workgroup is added to the `~/.dbt/profiles.yml` file and the profile to be used
  is referenced in `dbt_project.yml`

### Spark-specific table configuration

- `timeout` (`default=43200`)
  - Time out in seconds for each Python model execution. Defaults to 12 hours/43200 seconds.
- `spark_encryption` (`default=false`)
  - If this flag is set to true, encrypts data in transit between Spark nodes and also encrypts data at rest stored locally by Spark.
- `spark_cross_account_catalog` (`default=false`)
  - When using the Spark Athena workgroup, queries can only be made against catalogs located on the same AWS account by default. However, sometimes you want to query another catalog located on an external AWS account. Setting this additional Spark properties parameter to true will enable querying external catalogs. You can use the syntax `external_catalog_id/database.table` to access the external table on the external catalog (For example, `999999999999/mydatabase.cloudfront_logs` where 999999999999 is the external catalog ID)
- `spark_requester_pays` (`default=false`)
  - When an Amazon S3 bucket is configured as requester pays, the account of the user running the query is charged for data access and data transfer fees associated with the query.
  - If this flag is set to true, requester pays S3 buckets are enabled in Athena for Spark.

### Spark notes

- A session is created for each unique engine configuration defined in the models that are part of the invocation.
- A session's idle timeout is set to 10 minutes. Within the timeout period, if there is a new calculation (Spark Python model) ready for execution and the engine configuration matches, the process will reuse the same session.
- The number of Python models running at a time depends on the `threads`. The number of sessions created for the entire run depends on the number of unique engine configurations and the availability of sessions to maintain thread concurrency.
- For Iceberg tables, it is recommended to use `table_properties` configuration to set the `format_version` to 2. This is to maintain compatibility between Iceberg tables created by Trino with those created by Spark.

### Example models

#### Simple pandas model

```python
import pandas as pd


def model(dbt, session):
    dbt.config(materialized="table")

    model_df = pd.DataFrame({"A": [1, 2, 3, 4]})

    return model_df
```

#### Simple spark

```python
def model(dbt, spark_session):
    dbt.config(materialized="table")

    data = [(1,), (2,), (3,), (4,)]

    df = spark_session.createDataFrame(data, ["A"])

    return df
```

#### Spark incremental

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

#### Config spark model

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

#### Create pySpark udf using imported external python files

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

### Known issues in Python models

- Python models cannot [reference Athena SQL views](https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark.html).
- Third-party Python libraries can be used, but they must be [included in the pre-installed list][pre-installed list] or [imported manually][imported manually].
- Python models can only reference or write to tables with names meeting the regular expression: `^[0-9a-zA-Z_]+$`. Dashes and special characters are not supported by Spark, even though Athena supports them.
- Incremental models do not fully utilize Spark capabilities. They depend partially on existing SQL-based logic which runs on Trino.
- Snapshot materializations are not supported.
- Spark can only reference tables within the same catalog.
- For tables created outside of the dbt tool, be sure to populate the location field or dbt will throw an error when trying to create the table.

[pre-installed list]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-spark-preinstalled-python-libraries.html
[imported manually]: https://docs.aws.amazon.com/athena/latest/ug/notebooks-import-files-libraries.html

## Contracts

The adapter partly supports contract definitions:

- `data_type` is supported but needs to be adjusted for complex types. Types must be specified entirely (for instance `array<int>`) even though they won't be checked. Indeed, as dbt recommends, we only compare the broader type (array, map, int, varchar). The complete definition is used in order to check that the data types defined in Athena are ok (pre-flight check).
- The adapter does not support the constraints since there is no constraint concept in Athena.

