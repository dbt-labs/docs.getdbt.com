---
title: "Model configuration"
sidebar_label: "Models"
description: "Table, incremental, Iceberg, and high-availability configurations for models built with the Amazon Athena adapter."
---

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
| `lf_tags_config` | None | [AWS Lake Formation](/reference/resource-configs/athena-configs/aws-lake-formation-integration) tags to associate with the table and columns. Existing tags will be removed. <br />* `enabled` (`default=False`) whether LF tags management is enabled for a model <br />* `tags` dictionary with tags and their values to assign for the model <br /> * `tags_columns` dictionary with a tag key, value and list of columns they must be assigned to |
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

Consider these limitations and recommendations: 

- `lf_tags` and `lf_tags_columns` configs support only attaching lf tags to corresponding resources.
- We recommend managing LF Tags permissions somewhere outside dbt. For example, [terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lakeformation_permissions) or [aws cdk](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lakeformation-readme.html).
- `data_cell_filters` management can't be automated outside dbt because the filter can't be attached to the table, which doesn't exist. Once you `enable` this config, dbt will set all filters and their permissions during every dbt run. Such an approach keeps the actual state of row-level security configuration after every dbt run and applies changes if they occur: drop, create, and update filters and their permissions.
- Any tags listed in `lf_inherited_tags` should be strictly inherited from the database level and never overridden at the table and column level.
- Currently, `dbt-athena` does not differentiate between an inherited tag association and an override it made previously.
   - For example,  If a `lf_tags_config` value overrides an inherited tag in one run, and that override is removed before a subsequent run, the prior override will linger and no longer be encoded anywhere (for example, Terraform where the inherited value is configured nor in the dbt project where the override previously existed but now is gone).
  
### Table location

The saved location of a table is determined in precedence by the following conditions:

1. If `external_location` is defined, that value is used.
2. If `s3_data_dir` is defined, the path is determined by that and `s3_data_naming`.
3. If `s3_data_dir` is not defined, data is stored under `{s3_staging_dir}/tables/`.

The following options are available for `s3_data_naming`:

- `unique`: `{s3_data_dir}/{uuid4()}/`
- `table`: `{s3_data_dir}/{table}/`
- `table_unique`: `{s3_data_dir}/{table}/{uuid4()}/`
- `schema_table`: `{s3_data_dir}/{schema}/{table}/`
- `schema_table_unique`: `{s3_data_dir}/{schema}/{table}/{uuid4()}/`

To set the `s3_data_naming` globally in the target profile, overwrite the value in the table config, or set up the value for groups of the models in dbt_project.yml.

Note: If you're using a workgroup with a default output location configured, `s3_data_naming` ignores any configured buckets and uses the location configured in the workgroup.

### Incremental models

The following [incremental models](/docs/build/incremental-models) strategies are supported:

- `insert_overwrite` (default): The insert-overwrite strategy deletes the overlapping partitions from the destination table and then inserts the new records from the source. This strategy depends on the `partitioned_by` keyword! dbt will fall back to the `append` strategy if no partitions are defined.
- `append`: Insert new records without updating, deleting or overwriting any existing data. There might be duplicate data (great for log or historical data).
- `merge`: Conditionally updates, deletes, or inserts rows into an Iceberg table. Used in combination with `unique_key`.It is only available when using Iceberg.

Consider this limitation when using Iceberg models:

- Incremental Iceberg models &mdash; Sync all columns on schema change. You can't remove columns used for partitioning with an incremental refresh; you must fully refresh the model.

### On schema change

The `on_schema_change` option reflects changes of the schema in incremental models. The values you can set this to are:

- `ignore` (default)
- `fail`
- `append_new_columns`
- `sync_all_columns`

To learn more, refer to [What if the columns of my incremental model change](/docs/build/incremental-models#what-if-the-columns-of-my-incremental-model-change).

### Iceberg

The adapter supports table materialization for Iceberg.

For example:

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

Iceberg supports the `PARQUET`, `AVRO` and `ORC` table formats for data .

The following are the supported strategies for using Iceberg incrementally:

- `append`: New records are appended to the table (this can lead to duplicates).
- `merge`: Perform an update and insert (and optional delete) where new and existing records are added. This is only available with Athena engine version 3.
  - `unique_key`(required): Columns that define a unique source and target table record.
  - `incremental_predicates` (optional): The SQL conditions that enable custom join clauses in the merge statement. This helps improve performance via predicate pushdown on target tables. 
  - `delete_condition` (optional): SQL condition that identifies records that should be deleted.
  - `update_condition` (optional): SQL condition that identifies records that should be updated.
  - `insert_condition` (optional): SQL condition that identifies records that should be inserted.

`incremental_predicates`, `delete_condition`, `update_condition` and `insert_condition` can include any column of the incremental table (`src`) or the final table (`target`). Column names must be prefixed by either `src` or `target` to prevent a `Column is ambiguous` error.

<Tabs>

<TabItem value="delete_condition">

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

</TabItem>

<TabItem value="update_condition" >

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

</TabItem>

<TabItem value="insert_condition" >

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

</TabItem>

</Tabs>

### High availability (HA) table

The current implementation of table materialization can lead to downtime, as the target table is dropped and re-created. For less destructive behavior, you can use the `ha` config on your `table` materialized models. It leverages the table versions feature of the glue catalog, which creates a temporary table and swaps the target table to the location of the temporary table. This materialization is only available for `table_type=hive` and requires using unique locations. For Iceberg, high availability is the default.

By default, the materialization keeps the last 4 table versions,but you can change it by setting `versions_to_keep`.

```sql
{{ config(
    materialized='table',
    ha=true,
    format='parquet',
    table_type='hive',
    partitioned_by=['status'],
    s3_data_naming='table_unique'
) }}

select 'a' as user_id,
       'pi'     as user_name,
       'active' as status
union all
select 'b'        as user_id,
       'sh'       as user_name,
       'disabled' as status
```


### HA known issues

- There could be a little downtime when swapping from a table with partitions to a table without (and the other way around). If higher performance is needed, consider bucketing instead of partitions.
- By default, Glue "duplicates" the versions internally, so the last two versions of a table point to the same location.
- It's recommended to set `versions_to_keep` >= 4, as this will avoid having the older location removed.

### Avoid deleting parquet files

If a dbt model has the same name as an existing table in the AWS Glue catalog, the `dbt-athena` adapter deletes the files in that table’s S3 location before recreating the table using the SQL from the model.

The adapter may also delete data if a model is configured to use the same S3 location as an existing table. In this case, it clears the folder before creating the new table to avoid conflicts during setup.

When dropping a model, the `dbt-athena` adapter performs two cleanup steps for both Iceberg and Hive tables: 

- It deletes the table from the AWS Glue catalog using Glue APIs.
- It removes the associated S3 data files using a delete operation.

However, for Iceberg tables, using standard SQL like [`DROP TABLE`](https://docs.aws.amazon.com/athena/latest/ug/querying-iceberg-drop-table.html) may not remove all related S3 objects. To ensure proper cleanup in a dbt workflow, the adapter includes a workaround that explicitly deletes these S3 objects. Alternatively, users can enable [`native_drop`](/reference/resource-configs/athena-configs/models#table-configuration) to let Iceberg handle the cleanup natively.

### Update glue data catalog

You can persist your column and model level descriptions to the Glue Data Catalog as [glue table properties](https://docs.aws.amazon.com/glue/latest/dg/tables-described.html#table-properties) and [column parameters](https://docs.aws.amazon.com/glue/latest/webapi/API_Column.html). To enable this, set the configuration to `true` as shown in the following example. By default, documentation persistence is disabled, but it can be enabled for specific resources or groups of resources as needed.


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
        config:
          meta: # changed to config in v1.10 and backported to 1.9
            primary_key: true
```

Refer to [persist_docs](/reference/resource-configs/persist_docs) for more details.
