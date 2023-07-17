---
title: "About dbt show command"
sidebar_label: "show"
id: "show"
---

Use `dbt show` to:
- Compile the dbt-SQL definition of a `model`, `test`, `analysis`, or an arbitrary dbt-SQL query passed `--inline`
- Run that query against the data warehouse
- Preview the results in the terminal

By default, `dbt show` will display the first 5 rows from the query result. This can be customized by passing the flag `--limit n`, where `n` is the number of rows to display.

The results of the preview query are not materialized in the data warehouse, or stored in any dbt file. They are only included in dbt's logs and displayed in the terminal. Note also that, if previewing a model, dbt will always compile and run the compiled query from source. It will not select from the already-materialized database relation, even if you've just run the model. (We may support that in the future; if you're interested, upvote or comment on [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

Example:

```
dbt show --select model_name.sql
```
or
```
dbt show --inline "select * from {{ ref('model_name') }}"
```

The following is an example of `dbt show` output for a model named `stg_orders`:

```bash
dbt show --select stg_orders
21:17:38 Running with dbt=1.5.0-b5
21:17:38 Found 5 models, 20 tests, 0 snapshots, 0 analyses, 425 macros, 0 operations, 3 seed files, 0 sources, 0 exposures, 0 metrics, 0 groups
21:17:38
21:17:38 Concurrency: 24 threads (target='dev')
21:17:38
21:17:38 Previewing node 'stg_orders' :
| order_id | customer_id | order_date | status    |
|----------+-------------+------------+--------   |
| 1        |           1 | 2023-01-01 | returned  |
| 2        |           3 | 2023-01-02 | completed |
| 3        |          94 | 2023-01-03 | completed |
| 4        |          50 | 2023-01-04 | completed |
| 5        |          64 | 2023-01-05 | completed |

```

For example, if you've just built a model that has a failing test, you can quickly preview the test failures right in the terminal, to find values of `id` that are duplicated:

```bash
$ dbt build -s my_model_with_duplicates
13:22:47 Running with dbt=1.5.0
...
13:22:48 Completed with 1 error and 0 warnings:
13:22:48
13:22:48 Failure in test unique_my_model_with_duplicates (models/schema.yml)
13:22:48   Got 1 result, configured to fail if not 0
13:22:48
13:22:48   compiled code at target/compiled/my_dbt_project/models/schema.yml/unique_my_model_with_duplicates_id.sql
13:22:48
13:22:48 Done. PASS=1 WARN=0 ERROR=1 SKIP=0 TOTAL=2

$ dbt show -s unique_my_model_with_duplicates_id
13:22:53 Running with dbt=1.5.0
13:22:53 Found 4 models, 2 tests, 0 snapshots, 0 analyses, 309 macros, 0 operations, 0 seed files, 0 sources, 0 exposures, 0 metrics, 0 groups
13:22:53
13:22:53 Concurrency: 5 threads (target='dev')
13:22:53
13:22:53 Previewing node 'unique_my_model_with_duplicates_id':
| unique_field | n_records |
| ------------ | --------- |
|            1 |         2 |

```
