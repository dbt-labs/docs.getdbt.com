---
title: "Teradata configurations"
id: "teradata-configs"
---

## General

* *Set `quote_columns`* - to prevent a warning, make sure to explicitly set a value for `quote_columns` in your `dbt_project.yml`. See the [doc on quote_columns](https://docs.getdbt.com/reference/resource-configs/quote_columns) for more information.

  ```yaml
  seeds:
    +quote_columns: false  #or `true` if you have csv column headers with spaces
  ```

* *Enable view column types in docs* - Teradata Vantage has a dbscontrol configuration flag called `DisableQVCI`. This flag instructs the database to create `DBC.ColumnsJQV` with view column type definitions. To enable this functionality you need to:
  1. Enable QVCI mode in Vantage. Use `dbscontrol` utility and then restart Teradata. Run these commands as a privileged user on a Teradata node:
      ```bash
      # option 551 is DisableQVCI. Setting it to false enables QVCI.
      dbscontrol << EOF
      M internal 551=false
      W
      EOF

      # restart Teradata
      tpareset -y Enable QVCI
      ```
  2. Instruct `dbt` to use `QVCI` mode. Include the following variable in your `dbt_project.yml`:
      ```yaml
      vars:
        use_qvci: true
      ```
      For example configuration, see [dbt_project.yml](https://github.com/Teradata/dbt-teradata/blob/main/test/catalog/with_qvci/dbt_project.yml) in `dbt-teradata` QVCI tests.

## Models

### <Term id="table" />
* `table_kind` - define the table kind. Legal values are `MULTISET` (default for ANSI transaction mode required by `dbt-teradata`) and `SET`, e.g.:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            table_kind="SET"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          table_kind: "SET"
      ```
  For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).
* `table_option` - defines table options. The config supports multiple statements. The definition below uses the Teradata syntax definition to explain what statements are allowed. Square brackets `[]` denote optional parameters. The pipe symbol `|` separates statements. Use commas to combine multiple statements as shown in the examples below:
    ```
    { MAP = map_name [COLOCATE USING colocation_name] |
      [NO] FALLBACK [PROTECTION] |
      WITH JOURNAL TABLE = table_specification |
      [NO] LOG |
      [ NO | DUAL ] [BEFORE] JOURNAL |
      [ NO | DUAL | LOCAL | NOT LOCAL ] AFTER JOURNAL |
      CHECKSUM = { DEFAULT | ON | OFF } |
      FREESPACE = integer [PERCENT] |
      mergeblockratio |
      datablocksize |
      blockcompression |
      isolated_loading
    }
    ```
    where:
    * mergeblockratio:
      ```
      { DEFAULT MERGEBLOCKRATIO |
        MERGEBLOCKRATIO = integer [PERCENT] |
        NO MERGEBLOCKRATIO
      }
      ```
    * datablocksize:
      ```
      DATABLOCKSIZE = {
        data_block_size [ BYTES | KBYTES | KILOBYTES ] |
        { MINIMUM | MAXIMUM | DEFAULT } DATABLOCKSIZE
      }
      ```
    * blockcompression:
      ```
      BLOCKCOMPRESSION = { AUTOTEMP | MANUAL | ALWAYS | NEVER | DEFAULT }
        [, BLOCKCOMPRESSIONALGORITHM = { ZLIB | ELZS_H | DEFAULT } ]
        [, BLOCKCOMPRESSIONLEVEL = { value | DEFAULT } ]
      ```
    * isolated_loading:
      ```
      WITH [NO] [CONCURRENT] ISOLATED LOADING [ FOR { ALL | INSERT | NONE } ]
      ```

  Examples:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            table_option="NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
              NO MERGEBLOCKRATIO,
              WITH CONCURRENT ISOLATED LOADING FOR ALL"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option:"NO FALLBACK, NO JOURNAL"
      ```
      ```yaml
      seeds:
        <project-name>:
          table_option: "NO FALLBACK, NO JOURNAL, CHECKSUM = ON,
            NO MERGEBLOCKRATIO,
            WITH CONCURRENT ISOLATED LOADING FOR ALL"
      ```

  For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).

* `with_statistics` - should statistics be copied from the base table, e.g.:
    ```yaml
    {{
      config(
          materialized="table",
          with_statistics="true"
      )
    }}
    ```
    For details, see [CREATE TABLE documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/B6Js16DRQVwPDjgJ8rz7hg).

* `index` - defines table indices:
    ```
    [UNIQUE] PRIMARY INDEX [index_name] ( index_column_name [,...] ) |
    NO PRIMARY INDEX |
    PRIMARY AMP [INDEX] [index_name] ( index_column_name [,...] ) |
    PARTITION BY { partitioning_level | ( partitioning_level [,...] ) } |
    UNIQUE INDEX [ index_name ] [ ( index_column_name [,...] ) ] [loading] |
    INDEX [index_name] [ALL] ( index_column_name [,...] ) [ordering] [loading]
    [,...]
    ```
    where:
    * partitioning_level:
      ```
      { partitioning_expression |
        COLUMN [ [NO] AUTO COMPRESS |
        COLUMN [ [NO] AUTO COMPRESS ] [ ALL BUT ] column_partition ]
      } [ ADD constant ]
      ```
    * ordering:
      ```
      ORDER BY [ VALUES | HASH ] [ ( order_column_name ) ]
      ```
    * loading:
      ```
      WITH [NO] LOAD IDENTITY
      ```

  Examples:
    * in sql materialization definition file:
      ```yaml
      {{
        config(
            materialized="table",
            index="UNIQUE PRIMARY INDEX ( GlobalID )"
        )
      }}
      ```
      > :information_source: Note, unlike in `table_option`, there are no commas between index statements!
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
        )
      }}
      ```
      ```yaml
      {{
        config(
            materialized="table",
            index="PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
        )
      }}
      ```
    * in seed configuration:
      ```yaml
      seeds:
        <project-name>:
          index: "UNIQUE PRIMARY INDEX ( GlobalID )"
      ```
      > :information_source: Note, unlike in `table_option`, there are no commas between index statements!
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)"
      ```
      ```yaml
      seeds:
        <project-name>:
          index: "PRIMARY INDEX(id)
            PARTITION BY RANGE_N(create_date
                          BETWEEN DATE '2020-01-01'
                          AND     DATE '2021-01-01'
                          EACH INTERVAL '1' MONTH)
            INDEX index_attrA (attrA) WITH LOAD IDENTITY"
      ```
## Seeds

:::info Using seeds to load raw data

As explained in [dbt seeds documentation](/docs/build/seeds), seeds should not be used to load raw data (for example, large CSV exports from a production database).

Since seeds are version controlled, they are best suited to files that contain business-specific logic, for example a list of country codes or user IDs of employees.

Loading CSVs using dbt's seed functionality is not performant for large files. Consider using a different tool to load these CSVs into your <Term id="data-warehouse" />.

:::

* `use_fastload` - use [fastload](https://github.com/Teradata/python-driver#FastLoad) when handling `dbt seed` command. The option will likely speed up loading when your seed files have hundreds of thousands of rows. You can set this seed configuration option in your `project.yml` file, e.g.:

    ```yaml
    seeds:
      <project-name>:
        +use_fastload: true
    ```

## Snapshots

Snapshots use the [HASHROW function](https://docs.teradata.com/r/Enterprise_IntelliFlex_VMware/SQL-Functions-Expressions-and-Predicates/Hash-Related-Functions/HASHROW/HASHROW-Function-Syntax) of the Teradata database to generate a unique hash value for the `dbt_scd_id` column. 

To use your own hash UDF, there is a configuration option in the snapshot model called `snapshot_hash_udf`, which defaults to HASHROW. You can provide a value like `<database_name.hash_udf_name>`. If you only provide `hash_udf_name`, it uses the same schema as the model runs.

For example, in the `snapshots/snapshot_example.sql` file:

  ```sql
  {% snapshot snapshot_example %}
  {{
    config(
      target_schema='snapshots',
      unique_key='id',
      strategy='check',
      check_cols=["c2"],
      snapshot_hash_udf='GLOBAL_FUNCTIONS.hash_md5'
    )
  }}
  select * from {{ ref('order_payments') }}
  {% endsnapshot %}
  ```

#### Grants

Grants are supported in dbt-teradata adapter with release version 1.2.0 and above. You can use grants to manage access to the datasets you're producing with dbt. To implement these permissions, define grants as resource configs on each model, seed, or snapshot. Define the default grants that apply to the entire project in your `dbt_project.yml`, and define model-specific grants within each model's SQL or YAML file.

for e.g. :
  models/schema.yml
  ```yaml
  models:
    - name: model_name
      config:
        grants:
          select: ['user_a', 'user_b']
  ```

Another e.g. for adding multiple grants:

  ```yaml
  models:
  - name: model_name
    config:
      materialized: table
      grants:
        select: ["user_b"]
        insert: ["user_c"]
  ```
> :information_source: `copy_grants` is not supported in Teradata.

Refer to [grants](/reference/resource-configs/grants) for more information on Grants.

## Query Band
Query Band in dbt-teradata can be set on three levels:
1. Profiles level: In the `profiles.yml` file, the user can provide `query_band` using the following example:

    ```yaml 
    query_band: 'application=dbt;'
   ```

2. Project level: In the `dbt_project.yml` file, the user can provide `query_band` using the following example:

   ```yaml
     models:
     Project_name:
        +query_band: "app=dbt;model={model};"
   ```
4. Model level: It can be set on the model SQL file or model level configuration on YAML files:

   ```sql
   {{ config( query_band='sql={model};' ) }}
   ```

Users can set `query_band` at any level or on all levels. With profiles-level `query_band`, dbt-teradata will set the `query_band` for the first time for the session, and subsequently for model and project level query band will be updated with respective configuration.

If a user sets some key-value pair with value as `'{model}'`, internally this `'{model}'` will be replaced with model name, which can be useful for telemetry tracking of sql/ dbql logging. 

  ```yaml
  models:
  Project_name:
    +query_band: "app=dbt;model={model};"
  ````

- For example, if the model the user is running is `stg_orders`, `{model}` will be replaced with `stg_orders` in runtime.
- If no `query_band` is set by the user, the default query_band used will be: ```org=teradata-internal-telem;appname=dbt;```

## valid_history incremental materialization strategy (early access) {#valid-history-incremental-materialization-strategy}
    
This strategy is designed to manage historical data efficiently within a Teradata environment, leveraging dbt features to ensure data quality and optimal resource usage.
In temporal databases, valid time is crucial for applications like historical reporting, ML training datasets, and forensic analysis.

```yaml
  {{
      config(
          materialized='incremental',
          unique_key='id',
          on_schema_change='fail',
          incremental_strategy='valid_history',
          valid_from='valid_from_column',
          history_column_in_target='history_period_column'
  )
  }}
  ```

The `valid_history` incremental strategy requires the following parameters:
* `valid_from` &mdash; Column in the source table of **timestamp** datatype indicating when each record became valid.
* `history_column_in_target` &mdash; Column in the target table of **period** datatype that tracks history.

The valid_history strategy in dbt-teradata involves several critical steps to ensure the integrity and accuracy of historical data management:
* Remove duplicates and conflicting values from the source data:
  * This step ensures that the data is clean and ready for further processing by eliminating any redundant or conflicting records.
  * The process of removing duplicates and conflicting values from the source data involves using a ranking mechanism to ensure that only the highest-priority records are retained. This is accomplished using the SQL RANK() function.
* Identify and adjust overlapping time slices:
  * Overlapping time periods in the data are detected and corrected to maintain a consistent and non-overlapping timeline.
* Manage records needing to be overwritten or split based on the source and target data:
  * This involves handling scenarios where records in the source data overlap with or need to replace records in the target data, ensuring that the historical timeline remains accurate.
* Utilize the TD_NORMALIZE_MEET function to compact history:
  * This function helps to normalize and compact the history by merging adjacent time periods, improving the efficiency and performance of the database.
* Delete existing overlapping records from the target table:
  * Before inserting new or updated records, any existing records in the target table that overlap with the new data are removed to prevent conflicts.
* Insert the processed data into the target table:
  * Finally, the cleaned and adjusted data is inserted into the target table, ensuring that the historical data is up-to-date and accurately reflects the intended timeline.

 
These steps collectively ensure that the valid_history strategy effectively manages historical data, maintaining its integrity and accuracy while optimizing performance.

  ```sql
    An illustration demonstrating the source sample data and its corresponding target data:  
  
    -- Source data
        pk |       valid_from          | value_txt1 | value_txt2
        ======================================================================
        1  | 2024-03-01 00:00:00.0000  | A          | x1
        1  | 2024-03-12 00:00:00.0000  | B          | x1
        1  | 2024-03-12 00:00:00.0000  | B          | x2
        1  | 2024-03-25 00:00:00.0000  | A          | x2
        2  | 2024-03-01 00:00:00.0000  | A          | x1
        2  | 2024-03-12 00:00:00.0000  | C          | x1
        2  | 2024-03-12 00:00:00.0000  | D          | x1
        2  | 2024-03-13 00:00:00.0000  | C          | x1
        2  | 2024-03-14 00:00:00.0000  | C          | x1
    
    -- Target data
        pk | valid_period                                                       | value_txt1 | value_txt2
        ===================================================================================================
        1  | PERIOD(TIMESTAMP)[2024-03-01 00:00:00.0, 2024-03-12 00:00:00.0]    | A          | x1
        1  | PERIOD(TIMESTAMP)[2024-03-12 00:00:00.0, 2024-03-25 00:00:00.0]    | B          | x1
        1  | PERIOD(TIMESTAMP)[2024-03-25 00:00:00.0, 9999-12-31 23:59:59.9999] | A          | x2
        2  | PERIOD(TIMESTAMP)[2024-03-01 00:00:00.0, 2024-03-12 00:00:00.0]    | A          | x1
        2  | PERIOD(TIMESTAMP)[2024-03-12 00:00:00.0, 9999-12-31 23:59:59.9999] | C          | x1
  ```
  

:::info
The target table must already exist before running the model. Ensure the target table is created and properly structured with the necessary columns, including a column that tracks the history with period datatype, before running a dbt model.
:::

## Common Teradata-specific tasks
* *collect statistics* - when a table is created or modified significantly, there might be a need to tell Teradata to collect statistics for the optimizer. It can be done using `COLLECT STATISTICS` command. You can perform this step using dbt's `post-hooks`, e.g.:

  ```yaml
  {{ config(
    post_hook=[
      "COLLECT STATISTICS ON  {{ this }} COLUMN (column_1,  column_2  ...);"
      ]
  )}}
  ```
  See [Collecting Statistics documentation](https://docs.teradata.com/r/76g1CuvvQlYBjb2WPIuk3g/RAyUdGfvREwbO9J0DMNpLw) for more information.
