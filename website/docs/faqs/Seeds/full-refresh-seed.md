---
title: The columns of my seed changed, and now I get an error when running the `seed` command, what should I do?
description: "Rerun the command with a `--full-refresh` flag"
sidebar_label: 'debug error when columns of seed changes'
id: full-refresh-seed

---
If you changed the columns of your seed, you may get a `Database Error`:

<Tabs
  defaultValue="snowflake"
  values={[
    { label: 'Snowflake', value: 'snowflake', },
    { label: 'Redshift', value: 'redshift', }
  ]
}>
<TabItem value="snowflake">

```shell
$ dbt seed
Running with dbt=0.16.0-rc2
Found 0 models, 0 tests, 0 snapshots, 0 analyses, 130 macros, 0 operations, 1 seed file, 0 sources

12:12:27 | Concurrency: 8 threads (target='dev_snowflake')
12:12:27 |
12:12:27 | 1 of 1 START seed file dbt_claire.country_codes...................... [RUN]
12:12:30 | 1 of 1 ERROR loading seed file dbt_claire.country_codes.............. [ERROR in 2.78s]
12:12:31 |
12:12:31 | Finished running 1 seed in 10.05s.

Completed with 1 error and 0 warnings:

Database Error in seed country_codes (seeds/country_codes.csv)
  000904 (42000): SQL compilation error: error line 1 at position 62
  invalid identifier 'COUNTRY_NAME'

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1

```

</TabItem>
<TabItem value="redshift">

```shell
$ dbt seed
Running with dbt=0.16.0-rc2
Found 0 models, 0 tests, 0 snapshots, 0 analyses, 149 macros, 0 operations, 1 seed file, 0 sources

12:14:46 | Concurrency: 1 threads (target='dev_redshift')
12:14:46 |
12:14:46 | 1 of 1 START seed file dbt_claire.country_codes...................... [RUN]
12:14:46 | 1 of 1 ERROR loading seed file dbt_claire.country_codes.............. [ERROR in 0.23s]
12:14:46 |
12:14:46 | Finished running 1 seed in 1.75s.

Completed with 1 error and 0 warnings:

Database Error in seed country_codes (seeds/country_codes.csv)
  column "country_name" of relation "country_codes" does not exist

Done. PASS=0 WARN=0 ERROR=1 SKIP=0 TOTAL=1
```

</TabItem>

</Tabs>

In this case, you should rerun the command with a `--full-refresh` flag, like so:

```shell
dbt seed --full-refresh
```

**Why is this the case?**

When you typically run dbt seed, dbt truncates the existing <Term id="table" /> and reinserts the data. This pattern avoids a `drop cascade` command, which may cause downstream objects (that your BI users might be querying!) to get dropped.

However, when column names are changed, or new columns are added, these statements will fail as the table structure has changed.

The `--full-refresh` flag will force dbt to `drop cascade` the existing table before rebuilding it.
