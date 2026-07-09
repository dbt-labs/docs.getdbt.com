---
title: "Configuring tables"
sidebar_label: "Configuring tables"
description: "Configure Databricks table materializations with options like table_format, file_format, partitioning, clustering, and tags."
---

When materializing a model as `table`, you may include several optional configs that are specific to the dbt-databricks plugin, in addition to the standard [model configs](/reference/model-configs).

dbt-databricks v1.9 adds support for the `table_format: iceberg` config. Try it now on the [<Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks). All other table configurations were also supported in 1.8.


| Option    | Description| Required?     | Model support   | Example      |
|-------------|--------|-----------|-----------------|---------------|
| table_format   | Whether or not to provision [Iceberg](https://docs.databricks.com/en/delta/uniform.html) compatibility for the materialization     | Optional     | SQL, Python     | `iceberg`    |
| file_format <sup>†</sup>        | The file format to use when creating tables (`parquet`, `delta`, `hudi`, `csv`, `json`, `text`, `jdbc`, `orc`, `hive` or `libsvm`).   | Optional     | SQL, Python     | `delta`     |
| location_root       | The created table uses the specified directory to store its data. The table alias is appended to it.     | Optional  | SQL, Python     | `/mnt/root`  |
| include_full_name_in_path   | Whether to use the full table path to qualify the location root. If this is set, the database, schema, and table alias are all appended to the location root. | Optional  | SQL, Python     | `true`  |
| partition_by        | Partition the created table by the specified columns. A directory is created for each partition. | Optional   | SQL, Python     | `date_day`  |
| liquid_clustered_by<sup>^</sup>  | Cluster the created table by the specified columns. Clustering method is based on [Delta's Liquid Clustering feature](https://docs.databricks.com/en/delta/clustering.html). Available since dbt-databricks 1.6.2. | Optional          | SQL, Python     | `date_day` |
| auto_liquid_cluster\+ | The created table is [automatically clustered by Databricks](https://docs.databricks.com/aws/en/delta/clustering#automatic-liquid-clustering).  Available since dbt-databricks 1.10.0 | Optional | SQL, Python | `auto_liquid_cluster: true` |
| clustered_by        | Each partition in the created table will be split into a fixed number of buckets by the specified columns.      | Optional     | SQL, Python     | `country_code`           |
| buckets    | The number of buckets to create while clustering   | Required if `clustered_by` is specified   | SQL, Python     | `8`        |
| tblproperties   | [Tblproperties](https://docs.databricks.com/en/sql/language-manual/sql-ref-syntax-ddl-tblproperties.html) to be set on the created table   | Optional     | SQL, Python*    | `{'this.is.my.key': 12}` |
| databricks_tags     | [Tags](https://docs.databricks.com/en/data-governance/unity-catalog/tags.html) to be set on the created table     | Optional    | SQL <sup>‡</sup> , Python <sup>‡</sup> | `{'my_tag': 'my_value'}` |
| compression   | Set the compression algorithm.   | Optional    | SQL, Python     | `zstd`    |

\* We do not yet have a PySpark API to set tblproperties at table creation, so this feature is primarily to allow users to anotate their python-derived tables with tblproperties.

† When `table_format` is `iceberg`, `file_format` must be `delta`.

‡ `databricks_tags` are applied via `ALTER` statements. Tags cannot be removed via dbt-databricks once applied. To remove tags, use Databricks directly or a post-hook. Starting in `dbt-databricks` v1.12, `databricks_tags` set at multiple config hierarchy levels [merge additively](/reference/resource-configs/databricks-configs/materialized-views-and-streaming-tables#databricks_tags) instead of the lower (more specific) level fully replacing the higher one.

<sup>^</sup> When `liquid_clustered_by` is enabled, dbt-databricks issues an `OPTIMIZE` (Liquid Clustering) operation after each run. To disable this behavior, set the variable `DATABRICKS_SKIP_OPTIMIZE=true`, which can be passed into the dbt run command (`dbt run --vars "{'databricks_skip_optimize': true}"`) or set as an environment variable. See [issue #802](https://github.com/databricks/dbt-databricks/issues/802).

\+ Do not use `liquid_clustered_by` and `auto_liquid_cluster` on the same model.

In dbt-databricks v1.10, there are several new model configurations options gated behind the `use_materialization_v2` flag.
For details, see the [documentation of Databricks behavior flags](/reference/global-configs/databricks-changes).

### Python submission methods
_Available in versions 1.9 or higher_

In dbt-databricks v1.9 (try it now in [the <Constant name="dbt" /> **Latest** release track](/docs/dbt-versions/dbt-release-tracks)), you can use these four options for `submission_method`: 

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
