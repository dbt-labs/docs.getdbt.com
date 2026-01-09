---
title: "About dbt show command"
sidebar_label: "show"
id: "show"
---

Use `dbt show` to:
- Compile the dbt-SQL definition of a single `model`, `test`, `analysis`, or an arbitrary dbt-SQL query passed `--inline`
  - `dbt show` does not support [Python (dbt-py)](/docs/build/python-models) models.
  - Only selecting a single node is supported. [Selector methods](/reference/node-selection/methods), [graph operators](/reference/node-selection/graph-operators), and other methods that select multiple nodes will not be utilized.
- Run that query against the data warehouse
- Preview the results in the terminal

## How it works

By default, `dbt show` will display the first 5 rows from the query result. This can be customized by passing the `limit` or the `inline` flags , where `n` is the number of rows to display.

If previewing a model, dbt will always compile and run the compiled query from source. It will not select from the already-materialized database relation, even if you've just run the model. (We may support that in the future; if you're interested, upvote or comment on [dbt-core#7391](https://github.com/dbt-labs/dbt-core/issues/7391).)

#### `limit` flag
- The `--limit` flag modifies the underlying SQL and not just the number of rows displayed. By using the `--limit n` flag, it means `n` is the number of rows to display and retrieved from the data warehouse. 
- This means dbt wraps your model's query in a subquery or CTE and applies a SQL `limit n` clause so that your data warehouse only processes and returns that number of rows, making it significantly faster for large datasets.

#### `inline` flag
- The results of the preview query are only included in dbt's logs and displayed in the terminal and aren't materialized in the data warehouse or stored in any dbt file, except if you use `dbt show --inline`.
- The `--inline` flags enables you to run ad-hoc SQL, which means dbt can't ensure the query doesn't modify the data warehouse. To ensure no changes are made, use a profile or role with read-only permissions, which are managed directly in your data warehouse. For example: `dbt show --inline "select * from my_table" --profile my-read-only-profile`.

## Example

```
dbt show --select "model_name.sql"
```

or

```
dbt show --inline "select * from {{ ref('model_name') }}"
```

The following is an example of `dbt show` output for a model named `stg_orders`:

```bash
dbt show --select "stg_orders"
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
$ dbt build -s "my_model_with_duplicates"
13:22:47 .0
...
13:22:48 Completed with 1 error and 0 warnings:
13:22:48
13:22:48 Failure in test unique_my_model_with_duplicates (models/schema.yml)
13:22:48   Got 1 result, configured to fail if not 0
13:22:48
13:22:48   compiled code at target/compiled/my_dbt_project/models/schema.yml/unique_my_model_with_duplicates_id.sql
13:22:48
13:22:48 Done. PASS=1 WARN=0 ERROR=1 SKIP=0 TOTAL=2

$ dbt show -s "unique_my_model_with_duplicates_id"
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
