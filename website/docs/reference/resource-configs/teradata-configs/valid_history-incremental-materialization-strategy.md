---
title: "valid_history incremental strategy"
sidebar_label: "valid_history strategy"
description: "Manage temporal, valid-time historical data in Teradata using the valid_history incremental strategy in dbt."
---

_This is available in early access_
    
This strategy is designed to manage historical data efficiently within a Teradata environment, leveraging dbt features to ensure data quality and optimal resource usage.
In temporal databases, valid time is crucial for applications like historical reporting, ML training datasets, and forensic analysis.

```yaml
  {{
      config(
          materialized='incremental',
          unique_key='id',
          on_schema_change='fail',
          incremental_strategy='valid_history',
          valid_period='valid_period_col',
          use_valid_to_time='no',
  )
  }}
  ```

The `valid_history` incremental strategy requires the following parameters:
* `unique_key`: The primary key of the model (excluding the valid time components), specified as a column name or list of column names.
* `valid_period`: Name of the model column indicating the period for which the record is considered to be valid. The datatype must be `PERIOD(DATE)` or `PERIOD(TIMESTAMP)`. 
* `use_valid_to_time`: Whether the end bound value of the valid period in the input is considered by the strategy when building the valid timeline. Use `no` if you consider your record to be valid until changed (and supply any value greater to the begin bound for the end bound of the period. A typical convention is `9999-12-31` of ``9999-12-31 23:59:59.999999`). Use `yes` if you know until when the record is valid (typically this is a correction in the history timeline).

The valid_history strategy in dbt-teradata involves several critical steps to ensure the integrity and accuracy of historical data management:
* Remove duplicates and conflicting values from the source data:
  * This step ensures that the data is clean and ready for further processing by eliminating any redundant or conflicting records.
  * The process of removing primary key duplicates (two or more records with the same value for the `unique_key` and BEGIN() bond of the `valid_period` fields) in the dataset produced by the model. If such duplicates exist, the row with the lowest value is retained for all non-primary-key fields (in the order specified in the model). Full-row duplicates are always de-duplicated.
* Identify and adjust overlapping time slices:
  * Overlapping or adjacent time periods in the data are corrected to maintain a consistent and non-overlapping timeline. To achieve this, the macro adjusts the valid period end bound of a record to align with the begin bound of the next record (if they overlap or are adjacent) within the same `unique_key` group. If `use_valid_to_time = 'yes'`, the valid period end bound provided in the source data is used. Otherwise, a default end date is applied for missing bounds, and adjustments are made accordingly.
* Manage records needing to be adjusted, deleted, or split based on the source and target data:
  * This involves handling scenarios where records in the source data overlap with or need to replace records in the target data, ensuring that the historical timeline remains accurate.
* Compact history:
  * Normalize and compact the history by merging records of adjacent time periods with the same value, optimizing database storage and performance. We use the function TD_NORMALIZE_MEET for this purpose.
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
