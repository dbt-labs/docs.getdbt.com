---
title: "Databricks configurations"
id: "databricks-configs"
---

## Configuring tables

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-databricks plugin, in addition to the standard [model configs](/reference/model-configs).

<VersionBlock lastVersion="1.7">

 
| Option              | Description                                                                                                                                                                                                        | Required?                                 | Model Support | Example                  |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|---------------|--------------------------|
| file_format         | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).                                                                                | Optional                                  | SQL, Python   | `delta`                  |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.                                                                                                               | Optional                                  | SQL, Python   | `/mnt/root`              |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition.                                                                                                                   | Optional                                  | SQL, Python   | `date_day`               |
| liquid_clustered_by | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional                                  | SQL           | `date_day`               |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                                                                                                         | Optional                                  | SQL, Python   | `country_code`           |
| buckets             | The number of buckets to create while clustering                                                                                                                                                                   | Required if `clustered_by` is specified | SQL, Python   | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) to be set on the created table                                                                           | Optional                                  | SQL, Python*  | `{'this.is.my.key': 12}` |
| compression         | Set the compression algorithm.                                                                                                                                                                                     | Optional                                  | SQL, Python   | `zstd`                   |

\* Beginning in 1.7.12, we have added tblproperties to Python models via an alter statement that runs after table creation.
We do not yet have a PySpark API to set tblproperties at table creation, so this feature is primarily to allow users to anotate their python-derived tables with tblproperties.

</VersionBlock>

<VersionBlock firstVersion="1.8" lastVersion="1.8">

1.8 introduces support for [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) at the table level, in addition to all table configuration supported in 1.7.

| Option              | Description                                                                                                                                                                                                        | Required?                                 | Model Support | Example                  |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------|---------------|--------------------------|
| file_format         | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).                                                                                | Optional                                  | SQL, Python   | `delta`                  |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.                                                                                                               | Optional                                  | SQL, Python   | `/mnt/root`              |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition.                                                                                                                   | Optional                                  | SQL, Python   | `date_day`               |
| liquid_clustered_by | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional                                  | SQL, Python   | `date_day`               |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                                                                                                         | Optional                                  | SQL, Python   | `country_code`           |
| buckets             | The number of buckets to create while clustering                                                                                                                                                                   | Required if `clustered_by` is specified   | SQL, Python   | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) to be set on the created table                                                                           | Optional                                  | SQL, Python*  | `{'this.is.my.key': 12}` |
| databricks_tags     | [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to be set on the created table                                                                                                      | Optional                                  | SQL+, Python+ | `{'my_tag': 'my_value'}`  |
| compression         | Set the compression algorithm.                                                                                                                                                                                     | Optional                                  | SQL, Python   | `zstd`                   |

\* Beginning in 1.7.12, we have added tblproperties to Python models via an alter statement that runs after table creation.
We do not yet have a PySpark API to set tblproperties at table creation, so this feature is primarily to allow users to anotate their python-derived tables with tblproperties.

\+ `databricks_tags` are currently only supported at the table level, and applied via `ALTER` statements.

</VersionBlock>

<VersionBlock firstVersion="1.9">

dbt Core v.9 and Versionless dbt Clouyd support for `table_format: iceberg`, in addition to all previous table configurations supported in 1.8.

| Option              | Description                 | Required?                                 | Model Support   | Example                  |
|---------------------|-----------------------------|-------------------------------------------|-----------------|--------------------------|
| table_format        | Whether or not to provision [Iceberg](https://docs.databricks.com/en/delta/uniform.html) compatibility for the materialization                                                                                     | Optional                                  | SQL, Python     | `iceberg`                |
| file_format+        | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).                                                                                | Optional                                  | SQL, Python     | `delta`                  |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.                                                                                                               | Optional                                  | SQL, Python     | `/mnt/root`              |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition.                                                                                                                   | Optional                                  | SQL, Python     | `date_day`               |
| liquid_clustered_by | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional          | SQL, Python     | `date_day` |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.                                                                                                         | Optional                                  | SQL, Python     | `country_code`           |
| buckets             | The number of buckets to create while clustering                                                                                                                                                                   | Required if `clustered_by` is specified   | SQL, Python     | `8`                      |
| tblproperties       | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) to be set on the created table                                                                           | Optional                                  | SQL, Python*    | `{'this.is.my.key': 12}` |
| databricks_tags     | [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to be set on the created table                                                                                                      | Optional                                  | SQL++, Python++ | `{'my_tag': 'my_value'}` |
| compression         | Set the compression algorithm.                                                                                                                                                                                     | Optional                                  | SQL, Python     | `zstd`                   |

\* We do not yet have a PySpark API to set tblproperties at table creation, so this feature is primarily to allow users to anotate their python-derived tables with tblproperties.
\+ When `table_format` is `iceberg`, `file_format` must be `delta`.
\++ `databricks_tags` are currently only supported at the table level, and applied via `ALTER` statements.

</VersionBlock>

<VersionBlock firstVersion="1.9">

### Python submission methods

In dbt v1.9 and higher, or in [Versionless](/docs/dbt-versions/versionless-cloud) dbt Cloud, you can use these four options for `submission_method`: 

* `all_purpose_cluster`: Executes the python model either directly using the [command api](https://docs.databricks.com/api/workspace/commandexecution) or by uploading a notebook and creating a one-off job run
* `job_cluster`: Creates a new job cluster to execute an uploaded notebook as a one-off job run
* `serverless_cluster`: Uses a [serverless cluster](https://docs.databricks.com/en/jobs/run-serverless-jobs.html) to execute an uploaded notebook as a one-off job run
* `workflow_job`: Creates/updates a reusable workflow and uploaded notebook, for execution on all-purpose, job, or serverless clusters.
   :::caution 
   This approach gives you maximum flexibility, but will create persistent artifacts in Databricks (the workflow) that users could run outside of dbt.
   :::

We are currently in a transitionary period where there is a disconnect between old submission methods (which were grouped by compute), and the logically distinct submission methods (command, job run, workflow).

As such, the supported config matrix is somewhat complicated:

| Config                | Use                                                                  | Default            | `all_purpose_cluster`* | `job_cluster` | `serverless_cluster` | `workflow_job` |
| --------------------- | -------------------------------------------------------------------- | ------------------ | ---------------------- | ------------- | -------------------- | -------------- |
| `create_notebook`     | if false, use Command API, otherwise upload notebook and use job run | `false`            | ✅                     | ❌             | ❌                   | ❌             |
| `timeout`             | maximum time to wait for command/job to run                          | `0` (No timeout)   | ✅                     | ✅             | ✅                   | ✅             |
| `job_cluster_config`  | configures a [new cluster](https://docs.databricks.com/api/workspace/jobs/submit#tasks-new_cluster) for running the model | `{}` | ❌ | ✅ | ❌            | ✅             |
| `access_control_list` | directly configures [access control](https://docs.databricks.com/api/workspace/jobs/submit#access_control_list) for the job | `{}` | ✅ | ✅ | ✅          | ✅             |
| `packages`            | list of packages to install on the executing cluster                 | `[]`               | ✅                     | ✅             | ✅                   | ✅             |
| `index_url`           | url to install `packages` from                                       | `None` (uses pypi) | ✅                     | ✅             | ✅                   | ✅             |
| `additional_libs`     | directly configures [libraries](https://docs.databricks.com/api/workspace/jobs/submit#tasks-libraries) | `[]` | ✅ | ✅             | ✅                   | ✅             |
| `python_job_config`   | additional configuration for jobs/workflows (see table below)        | `{}`               | ✅                     | ✅             | ✅                   | ✅             |
| `cluster_id`          | id of existing all purpose cluster to execute against                | `None`             | ✅                     | ❌             | ❌                   | ✅             |
| `http_path`           | path to existing all purpose cluster to execute against              | `None`             | ✅                     | ❌             | ❌                   | ❌             |

\* Only `timeout` and `cluster_id`/`http_path` are supported when `create_notebook` is false

With the introduction of the `workflow_job` submission method, we chose to segregate further configuration of the python model submission under a top level configuration named `python_job_config`. This keeps configuration options for jobs and workflows namespaced in such a way that they do not interfere with other model config, allowing us to be much more flexible with what is supported for job execution.

The support matrix for this feature is divided into `workflow_job` and all others (assuming `all_purpose_cluster` with `create_notebook`==true).
Each config option listed must be nested under `python_job_config`:

| Config                     | Use                                                                                                                     | Default | `workflow_job` | All others |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------- | -------------- | ---------- |
| `name`                     | The name to give (or used to look up) the created workflow                                                              | `None`  | ✅             | ❌          |
| `grants`                   | A simplified way to specify access control for the workflow                                                             | `{}`    | ✅             | ✅          |
| `existing_job_id`          | Id to use to look up the created workflow (in place of `name`)                                                          | `None`  | ✅             | ❌          |
| `post_hook_tasks`          | [Tasks](https://docs.databricks.com/api/workspace/jobs/create#tasks) to include after the model notebook execution      | `[]`    | ✅             | ❌          |
| `additional_task_settings` | Additional [task config](https://docs.databricks.com/api/workspace/jobs/create#tasks) to include in the model task     | `{}`    | ✅             | ❌          |
| [Other job run settings](https://docs.databricks.com/api/workspace/jobs/submit) | Config will be copied into the request, outside of the model task  | `None`  | ❌             | ✅          |
| [Other workflow settings](https://docs.databricks.com/api/workspace/jobs/create) | Config will be copied into the request, outside of the model task | `None`  | ✅             | ❌          |

This example uses the new configuration options in the previous table:

<File name='schema.yml'>

```yaml
models:
  - name: my_model
    config:
      submission_method: workflow_job

      # Define a job cluster to create for running this workflow
      # Alternately, could specify cluster_id to use an existing cluster, or provide neither to use a serverless cluster
      job_cluster_config:
        spark_version: "15.3.x-scala2.12"
        node_type_id: "rd-fleet.2xlarge"
        runtime_engine: "{{ var('job_cluster_defaults.runtime_engine') }}"
        data_security_mode: "{{ var('job_cluster_defaults.data_security_mode') }}"
        autoscale: { "min_workers": 1, "max_workers": 4 }

      python_job_config:
        # These settings are passed in, as is, to the request
        email_notifications: { on_failure: ["me@example.com"] }
        max_retries: 2

        name: my_workflow_name

        # Override settings for your model's dbt task. For instance, you can
        # change the task key
        additional_task_settings: { "task_key": "my_dbt_task" }

        # Define tasks to run before/after the model
        # This example assumes you have already uploaded a notebook to /my_notebook_path to perform optimize and vacuum
        post_hook_tasks:
          [
            {
              "depends_on": [{ "task_key": "my_dbt_task" }],
              "task_key": "OPTIMIZE_AND_VACUUM",
              "notebook_task":
                { "notebook_path": "/my_notebook_path", "source": "WORKSPACE" },
            },
          ]

        # Simplified structure, rather than having to specify permission separately for each user
        grants:
          view: [{ "group_name": "marketing-team" }]
          run: [{ "user_name": "other_user@example.com" }]
          manage: []
```

</File>

</VersionBlock>

<VersionBlock lastVersion="1.8">
## Incremental models

dbt-databricks plugin leans heavily on the [`incremental_strategy` config](/docs/build/incremental-strategy). This config tells the incremental materialization how to build models in runs beyond their first. It can be set to one of four values:
 - **`append`**: Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: If `partition_by` is specified, overwrite partitions in the <Term id="table" /> with new data. If no `partition_by` is specified, overwrite the entire table with new data.
 - **`merge`** (default; Delta and Hudi file format only): Match records based on a `unique_key`, updating old records, and inserting new ones. (If no `unique_key` is specified, all new data is inserted, similar to `append`.)
 - **`replace_where`** (Delta file format only): Match records based on `incremental_predicates`, replacing all records that match the predicates from the existing table with records matching the predicates from the new data. (If no `incremental_predicates` are specified, all new data is inserted, similar to `append`.)
 
Each of these strategies has its pros and cons, which we'll discuss below. As with any model config, `incremental_strategy` may be specified in `dbt_project.yml` or within a model file's `config()` block.

</VersionBlock>

<VersionBlock firstVersion="1.9">

## Incremental models

dbt-databricks plugin leans heavily on the [`incremental_strategy` config](/docs/build/incremental-strategy). This config tells the incremental materialization how to build models in runs beyond their first. It can be set to one of five values:
 - **`append`**: Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: If `partition_by` is specified, overwrite partitions in the <Term id="table" /> with new data. If no `partition_by` is specified, overwrite the entire table with new data.
 - **`merge`** (default; Delta and Hudi file format only): Match records based on a `unique_key`, updating old records, and inserting new ones. (If no `unique_key` is specified, all new data is inserted, similar to `append`.)
 - **`replace_where`** (Delta file format only): Match records based on `incremental_predicates`, replacing all records that match the predicates from the existing table with records matching the predicates from the new data. (If no `incremental_predicates` are specified, all new data is inserted, similar to `append`.)
 - **`microbatch`** (Delta file format only): Implements the [microbatch strategy](/docs/build/incremental-microbatch) using `replace_where` with predicates generated based `event_time`.
 
Each of these strategies has its pros and cons, which we'll discuss below. As with any model config, `incremental_strategy` may be specified in `dbt_project.yml` or within a model file's `config()` block.

</VersionBlock>

### The `append` strategy

Following the `append` strategy, dbt will perform an `insert into` statement with all new data. The appeal of this strategy is that it is straightforward and functional across all platforms, file types, connection methods, and Apache Spark versions. However, this strategy _cannot_ update, overwrite, or delete existing data, so it is likely to insert duplicate records for many data sources.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    incremental_strategy='append',
) }}

--  All rows returned by this query will be appended to the existing table

select * from {{ ref('events') }}
{% if is_incremental() %}
  where event_ts > (select max(event_ts) from {{ this }})
{% endif %}
```
</File>
</TabItem>
<TabItem value="run">

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

    select * from analytics.events

    where event_ts >= (select max(event_ts) from {{ this }})

;

insert into table analytics.databricks_incremental
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### The `insert_overwrite` strategy

:::caution
This strategy is currently only compatible with All Purpose Clusters, not SQL Warehouses.
:::

This strategy is most effective when specified alongside a `partition_by` clause in your model config. dbt will run an [atomic `insert overwrite` statement](https://spark.apache.org/docs/3.0.0-preview/sql-ref-syntax-dml-insert-overwrite-table.html) that dynamically replaces all partitions included in your query. Be sure to re-select _all_ of the relevant data for a partition when using this incremental strategy.

If no `partition_by` is specified, then the `insert_overwrite` strategy will atomically replace all contents of the table, overriding all existing data with only the new records. The column schema of the table remains the same, however. This can be desirable in some limited circumstances, since it minimizes downtime while the table contents are overwritten. The operation is comparable to running `truncate` + `insert` on other databases. For atomic replacement of Delta-formatted tables, use the `table` materialization (which runs `create or replace`) instead.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
  ]
}>
<TabItem value="source">

<File name='databricks_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    partition_by=['date_day'],
    file_format='parquet'
) }}

/*
  Every partition returned by this query will be overwritten
  when this model runs
*/

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    date_day,
    count(*) as users

from new_events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='databricks_incremental.sql'>

```sql
create temporary view databricks_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        date_day,
        count(*) as users

    from events
    group by 1

;

insert overwrite table analytics.databricks_incremental
    partition (date_day)
    select `date_day`, `users` from databricks_incremental__dbt_tmp
```

</File>
</TabItem>
</Tabs>

### The `merge` strategy

The `merge` incremental strategy requires:
- `file_format: delta or hudi`
- Databricks Runtime 5.1 and above for delta file format
- Apache Spark for hudi file format

The Databricks adapter will run an [atomic `merge` statement](https://docs.databricks.com/spark/latest/spark-sql/language-manual/merge-into.html) similar to the default merge behavior on Snowflake and BigQuery. If a `unique_key` is specified (recommended), dbt will update old records with values from new records that match on the key column. If a `unique_key` is not specified, dbt will forgo match criteria and simply insert all new records (similar to `append` strategy).

Specifying `merge` as the incremental strategy is optional since it's the default strategy used when none is specified.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta', # or 'hudi'
    unique_key='user_id',
    incremental_strategy='merge'
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

merge into analytics.merge_incremental as DBT_INTERNAL_DEST
    using merge_incremental__dbt_tmp as DBT_INTERNAL_SOURCE
    on DBT_INTERNAL_SOURCE.user_id = DBT_INTERNAL_DEST.user_id
    when matched then update set *
    when not matched then insert *
```

</File>

</TabItem>
</Tabs>

<VersionBlock firstVersion="1.9">

Beginning with 1.9, `merge` behavior can be modified with the following additional configuration options:

- `target_alias`, `source_alias`: Aliases for the target and source to allow you to describe your merge conditions more naturally.  These default to `DBT_INTERNAL_DEST` and `DBT_INTERNAL_SOURCE`, respectively.
- `skip_matched_step`: If set to `true`, the 'matched' clause of the merge statement will not be included.
- `skip_not_matched_step`: If set to `true`, the 'not matched' clause will not be included.
- `matched_condition`: Condition to apply to the `WHEN MATCHED` clause.  You should use the `target_alias` and `source_alias` to write a conditional expression, such as `DBT_INTERNAL_DEST.col1 = hash(DBT_INTERNAL_SOURCE.col2, DBT_INTERNAL_SOURCE.col3)`.  This condition further restricts the matched set of rows.
- `not_matched_condition`: Condition to apply to the `WHEN NOT MATCHED [BY TARGET]` clause.  This condition further restricts the set of rows in the target that do not match the source that will be inserted into the merged table.
- `not_matched_by_source_condition`: Condition to apply to the further filter `WHEN NOT MATCHED BY SOURCE` clause.  Only used in conjunction with `not_matched_by_source_action: delete`.
- `not_matched_by_source_action`: If set to `delete`, a `DELETE` clause is added to the merge statement for `WHEN NOT MATCHED BY SOURCE`.
- `merge_with_schema_evolution`: If set to `true`, the merge statement includes the `WITH SCHEMA EVOLUTION` clause.

For more details on the meaning of each merge clause, please see [the Databricks documentation](https://docs.databricks.com/en/sql/language-manual/delta-merge-into.html).

The following is an example demonstrating the use of these new options:

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='merge_incremental_options.sql'>

```sql
{{ config(
    materialized = 'incremental',
    unique_key = 'id',
    incremental_strategy='merge',
    target_alias='t',
    source_alias='s',
    matched_condition='t.tech_change_ts < s.tech_change_ts',
    not_matched_condition='s.attr1 IS NOT NULL',
    not_matched_by_source_condition='t.tech_change_ts < current_timestamp()',
    not_matched_by_source_action='delete',
    merge_with_schema_evolution=true
) }}

select
    id,
    attr1,
    attr2,
    tech_change_ts
from
    {{ ref('source_table') }} as s
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/merge_incremental_options.sql'>

```sql
create temporary view merge_incremental__dbt_tmp as

    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from upstream.source_table
;

merge 
    with schema evolution
into
    target_table as t
using (
    select
        id,
        attr1,
        attr2,
        tech_change_ts
    from
        source_table as s
)
on
    t.id <=> s.id
when matched
    and t.tech_change_ts < s.tech_change_ts
    then update set
        id = s.id,
        attr1 = s.attr1,
        attr2 = s.attr2,
        tech_change_ts = s.tech_change_ts

when not matched
    and s.attr1 IS NOT NULL
    then insert (
        id,
        attr1,
        attr2,
        tech_change_ts
    ) values (
        s.id,
        s.attr1,
        s.attr2,
        s.tech_change_ts
    )
    
when not matched by source
    and t.tech_change_ts < current_timestamp()
    then delete
```

</File>

</TabItem>
</Tabs>

</VersionBlock>

### The `replace_where` strategy

The `replace_where` incremental strategy requires:
- `file_format: delta`
- Databricks Runtime 12.0 and above

dbt will run an [atomic `replace where` statement](https://docs.databricks.com/en/delta/selective-overwrite.html#arbitrary-selective-overwrite-with-replacewhere) which selectively overwrites data matching one or more `incremental_predicates` specified as a string or array.  Only rows matching the predicates will be inserted.  If no `incremental_predicates` are specified, dbt will perform an atomic insert, as with `append`.  

:::caution

`replace_where` inserts data into columns in the order provided, rather than by column name.  If you reorder columns and the data is compatible with the existing schema, you may silently insert values into an unexpected column.  If the incoming data is incompatible with the existing schema, you will instead receive an error.

:::

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='replace_where_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'replace_where'
    incremental_predicates = 'user_id >= 10000' # Never replace users with ids < 10000
) }}

with new_events as (

    select * from {{ ref('events') }}

    {% if is_incremental() %}
    where date_day >= date_add(current_date, -1)
    {% endif %}

)

select
    user_id,
    max(date_day) as last_seen

from events
group by 1
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from analytics.events


        where date_day >= date_add(current_date, -1)


    )

    select
        user_id,
        max(date_day) as last_seen

    from events
    group by 1

;

insert into analytics.replace_where_incremental
    replace where user_id >= 10000
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>

<VersionBlock firstVersion="1.9">

### The `microbatch` strategy

The Databricks adapter implements the `microbatch` strategy using `replace_where`. Note the requirements and caution statements for `replace_where` above. For more information about this strategy, see the [microbatch reference page](/docs/build/incremental-microbatch).

In the following example, the upstream table `events` have been annotated with an `event_time` column called `ts` in its schema file.

<Tabs
  defaultValue="source"
  values={[
    { label: 'Source code', value: 'source', },
    { label: 'Run code', value: 'run', },
]
}>
<TabItem value="source">

<File name='microbatch_incremental.sql'>

```sql
{{ config(
    materialized='incremental',
    file_format='delta',
    incremental_strategy = 'microbatch'
    event_time='date' # Use 'date' as the grain for this microbatch table
) }}

with new_events as (

    select * from {{ ref('events') }}

)

select
    user_id,
    date,
    count(*) as visits

from events
group by 1, 2
```

</File>
</TabItem>
<TabItem value="run">

<File name='target/run/replace_where_incremental.sql'>

```sql
create temporary view replace_where__dbt_tmp as

    with new_events as (

        select * from (select * from analytics.events where ts >= '2024-10-01' and ts < '2024-10-02')

    )

    select
        user_id,
        date,
        count(*) as visits
    from events
    group by 1, 2
;

insert into analytics.replace_where_incremental
    replace where CAST(date as TIMESTAMP) >= '2024-10-01' and CAST(date as TIMESTAMP) < '2024-10-02'
    table `replace_where__dbt_tmp`
```

</File>

</TabItem>
</Tabs>

</VersionBlock>


## Selecting compute per model

Beginning in version 1.7.2, you can assign which compute resource to use on a per-model basis.
For SQL models, you can select a SQL Warehouse (serverless or provisioned) or an all purpose cluster.
For details on how this feature interacts with python models, see [Specifying compute for Python models](#specifying-compute-for-python-models).

:::note

This is an optional setting. If you do not configure this as shown below,  we will default to the compute specified by http_path in the top level of the output section in your profile. 
This is also the compute that will be used for tasks not associated with a particular model, such as gathering metadata for all tables in a schema.

:::


To take advantage of this capability, you will need to add compute blocks to your profile:

<File name='profile.yml'>

```yaml

profile-name:
  target: target-name # this is the default target
  outputs:
    target-name:
      type: databricks
      catalog: optional catalog name if you are using Unity Catalog
      schema: schema name # Required        
      host: yourorg.databrickshost.com # Required

      ### This path is used as the default compute
      http_path: /sql/your/http/path # Required        
      
      ### New compute section
      compute:

        ### Name that you will use to refer to an alternate compute
       Compute1:
          http_path: '/sql/your/http/path' # Required of each alternate compute

        ### A third named compute, use whatever name you like
        Compute2:
          http_path: '/some/other/path' # Required of each alternate compute
      ...

    target-name: # additional targets
      ...
      ### For each target, you need to define the same compute,
      ### but you can specify different paths
      compute:

        ### Name that you will use to refer to an alternate compute
        Compute1:
          http_path: '/sql/your/http/path' # Required of each alternate compute

        ### A third named compute, use whatever name you like
        Compute2:
          http_path: '/some/other/path' # Required of each alternate compute
      ...

```

</File>

The new compute section is a map of user chosen names to objects with an http_path property.
Each compute is keyed by a name which is used in the model definition/configuration to indicate which compute you wish to use for that model/selection of models. 
We recommend choosing a name that is easily recognized as the compute resources you're using, such as the name of the compute resource inside the Databricks UI. 

:::note

You need to use the same set of names for compute across your outputs, though you may supply different http_paths, allowing you to use different computes in different deployment scenarios.

:::

To configure this inside of dbt Cloud, use the [extended attributes feature](/docs/dbt-cloud-environments#extended-attributes-) on the desired environments:

```yaml

compute:
  Compute1:
    http_path: /SOME/OTHER/PATH
  Compute2:
    http_path: /SOME/OTHER/PATH

```

### Specifying the compute for models

As with many other configuaration options, you can specify the compute for a model in multiple ways, using `databricks_compute`.
In your `dbt_project.yml`, the selected compute can be specified for all the models in a given directory:

<File name='dbt_project.yml'>

```yaml

...

models:
  +databricks_compute: "Compute1"     # use the `Compute1` warehouse/cluster for all models in the project...
  my_project:
    clickstream:
      +databricks_compute: "Compute2" # ...except for the models in the `clickstream` folder, which will use `Compute2`.

snapshots:
  +databricks_compute: "Compute1"     # all Snapshot models are configured to use `Compute1`.

```

</File>

For an individual model the compute can be specified in the model config in your schema file.

<File name='schema.yml'>

```yaml

models:
  - name: table_model
    config:
      databricks_compute: Compute1
    columns:
      - name: id
        data_type: int

```

</File>


Alternatively the warehouse can be specified in the config block of a model's SQL file.

<File name='model.sql'>

```sql

{{
  config(
    materialized='table',
    databricks_compute='Compute1'
  )
}}
select * from {{ ref('seed') }}

```

</File>


To validate that the specified compute is being used, look for lines in your dbt.log like:

```
Databricks adapter ... using default compute resource.
```

or

```
Databricks adapter ... using compute resource <name of compute>.
```

### Specifying compute for Python models

Materializing a python model requires execution of SQL as well as python.
Specifically, if your python model is incremental, the current execution pattern involves executing python to create a staging table that is then merged into your target table using SQL.
<VersionBlock lastVersion="1.8">
The python code needs to run on an all purpose cluster, while the SQL code can run on an all purpose cluster or a SQL Warehouse.
</VersionBlock>
<VersionBlock firstVersion="1.9">
The python code needs to run on an all purpose cluster (or serverless cluster, see [Python Submission Methods](#python-submission-methods)), while the SQL code can run on an all purpose cluster or a SQL Warehouse.
</VersionBlock>
When you specify your `databricks_compute` for a python model, you are currently only specifying which compute to use when running the model-specific SQL.
If you wish to use a different compute for executing the python itself, you must specify an alternate compute in the config for the model.
For example:

<File name="model.py">

 ```python

def model(dbt, session):
    dbt.config(
      http_path="sql/protocolv1/..."
    )

```

</File>

If your default compute is a SQL Warehouse, you will need to specify an all purpose cluster `http_path` in this way.

## Persisting model descriptions

Relation-level docs persistence is supported in dbt v0.17.0. For more
information on configuring docs persistence, see [the docs](/reference/resource-configs/persist_docs).

When the `persist_docs` option is configured appropriately, you'll be able to
see model descriptions in the `Comment` field of `describe [table] extended`
or `show table extended in [database] like '*'`.


## Default file format configurations

To access advanced incremental strategies features, such as 
[snapshots](/reference/commands/snapshot) and the `merge` incremental strategy, you will want to
use the Delta or Hudi file format as the default file format when materializing models as tables.

It's quite convenient to do this by setting a top-level configuration in your
project file:

<File name='dbt_project.yml'>

```yml
models:
  +file_format: delta # or hudi
  
seeds:
  +file_format: delta # or hudi
  
snapshots:
  +file_format: delta # or hudi
```

</File>

<VersionBlock lastVersion="1.7">

## Materialized views and streaming tables
Starting with version 1.6.0, the dbt-databricks adapter supports [materialized views](https://docs.databricks.com/en/sql/user/materialized-views.html) and [streaming tables](https://docs.databricks.com/en/sql/load-data-streaming-table.html), as alternatives to incremental tables that are powered by [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
See [What are Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) for more information and use cases.
These features are still in preview, and the support in the dbt-databricks adapter should, for now, be considered _experimental_.
In order to adopt these materialization strategies, you will need a workspace that is enabled for Unity Catalog and serverless SQL Warehouses.

<File name='materialized_view.sql'>

```sql
{{ config(
   materialized = 'materialized_view'
 ) }}
```

</File>

or

<File name='streaming_table.sql'>

```sql
{{ config(
   materialized = 'streaming_table'
 ) }}
```

</File>

When dbt detects a pre-existing relation of one of these types, it issues a `REFRESH` [command](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-refresh-full.html).

### Limitations

As mentioned above, support for these materializations in the Databricks adapter is still limited.
At this time the following configuration options are not available:

* Specifying a refresh schedule for these materializations
* Specifying `on_configuration_change` settings.

Additionally, if you change the model definition of your materialized view or streaming table, you will need to drop the materialization in your warehouse directly before running dbt again; otherwise, you will get a refresh error.

Please see the latest documentation for updates on these limitations.

</VersionBlock>

<VersionBlock firstVersion="1.8">

 ## Materialized views and streaming tables

[Materialized views](https://docs.databricks.com/en/sql/user/materialized-views.html) and [streaming tables](https://docs.databricks.com/en/sql/load-data-streaming-table.html) are alternatives to incremental tables that are powered by [Delta Live Tables](https://docs.databricks.com/en/delta-live-tables/index.html).
See [What are Delta Live Tables?](https://docs.databricks.com/en/delta-live-tables/index.html#what-are-delta-live-tables-datasets) for more information and use cases.

In order to adopt these materialization strategies, you will need a workspace that is enabled for Unity Catalog and serverless SQL Warehouses.

<File name='materialized_view.sql'>

```sql
{{ config(
   materialized = 'materialized_view'
 ) }}
```

</File>

or

<File name='streaming_table.sql'>

```sql
{{ config(
   materialized = 'streaming_table'
 ) }}
```

</File>

We support [on_configuration_change](https://docs.getdbt.com/reference/resource-configs/on_configuration_change) for most available properties of these materializations.
The following table summarizes our configuration support:

| Databricks Concept | Config Name | MV/ST support |
| ------------------ | ------------| ------------- |
| [PARTITIONED BY](https://docs.databricks.com/en/sql/language-manual/sql-ref-partition.html#partitioned-by) | `partition_by` | MV/ST |
| COMMENT | [`description`](https://docs.getdbt.com/reference/resource-properties/description) | MV/ST |
| [TBLPROPERTIES](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html#tblproperties) | `tblproperties` | MV/ST |
| [SCHEDULE CRON](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-create-materialized-view.html#parameters) | `schedule: { 'cron': '\<cron schedule\>', 'time_zone_value': '\<time zone value\>' }` | MV/ST |
| query | defined by your model sql | on_configuration_change for MV only |

<File name='mv_example.sql'>

```sql

{{ config(
    materialized='materialized_view',
    partition_by='id',
    schedule = {
        'cron': '0 0 * * * ? *',
        'time_zone': 'Etc/UTC'
    },
    tblproperties={
        'key': 'value'
    },
) }}
select * from {{ ref('my_seed') }}

```

</File>

### Configuration Details

#### partition_by
`partition_by` works the same as for views and tables, i.e. can be a single column, or an array of columns to partition by.

#### description
As with views and tables, adding a `description` to your configuration will lead to a table-level comment getting added to your materialization.

#### tblproperties
`tblproperties` works the same as for views and tables with an important exception: the adapter maintains a list of keys that are set by Databricks when making an materialized view or streaming table which are ignored for the purpose of determining configuration changes.

#### schedule
Use this to set the refresh schedule for the model.  If you use the `schedule` key, a `cron` key is required in the associated dictionary, but `time_zone_value` is optional (see the example above).  The `cron` value should be formatted as documented by Databricks.
If a schedule is set on the materialization in Databricks and your dbt project does not specify a schedule for it (when `on_configuration_change` is set to `apply`), the refresh schedule will be set to manual when you next run the project.
Even when schedules are set, dbt will request that the materialization be refreshed manually when run.

#### query
For materialized views, if the compiled query for the model differs from the query in the database, we will the take the configured `on_configuration_change` action.
Changes to query are not currently detectable for streaming tables; see the next section for details.

### on_configuration_change 
`on_configuration_change` is supported for materialized views and streaming tables, though the two materializations handle it different ways.

#### Materialized Views
Currently, the only change that can be applied without recreating the materialized view in Databricks is to update the schedule.
This is due to limitations in the Databricks SQL API.

#### Streaming Tables
For streaming tables, only changes to the partitioning currently requires the table be dropped and recreated.
For any other supported configuration change, we use `CREATE OR REFRESH` (+ an `ALTER` statement for changes to the schedule) to apply the changes.
There is currently no mechanism for the adapter to detect if the streaming table query has changed, so in this case, regardless of the behavior requested by on_configuration_change, we will use a `create or refresh` statement (assuming `partitioned by` hasn't changed); this will cause the query to be applied to future rows without rerunning on any previously processed rows.
If your source data is still available, running with '--full-refresh' will reprocess the available data with the updated current query.

</VersionBlock>

## Setting table properties
[Table properties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) can be set with your configuration for tables or views using `tblproperties`:

<File name='with_table_properties.sql'>

```sql
{{ config(
    tblproperties={
      'delta.autoOptimize.optimizeWrite' : 'true',
      'delta.autoOptimize.autoCompact' : 'true'
    }
 ) }}
```

</File>

:::caution

These properties are sent directly to Databricks without validation in dbt, so be thoughtful with how you use this feature.  You will need to do a full refresh of incremental materializations if you change their `tblproperties`.

:::

One application of this feature is making `delta` tables compatible with `iceberg` readers using the [Universal Format](https://docs.databricks.com/en/delta/uniform.html).

```sql
{{ config(
    tblproperties={
      'delta.enableIcebergCompatV2' = 'true'
      'delta.universalFormat.enabledFormats' = 'iceberg'
    }
 ) }}
```

`tblproperties` can be specified for python models, but they will be applied via an `ALTER` statement after table creation.
This is due to a limitation in PySpark.
