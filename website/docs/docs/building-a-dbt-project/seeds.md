---
title: "Seeds"
id: "seeds"
---

## Overview
`dbt seed` loads data from csv files into your data warehouse. Because these csv files are located in your dbt repository, they are version controlled and code reviewable. Thus, `dbt seed` is appropriate for loading static data which changes infrequently.

The `dbt seed` command will load `csv` files located in the `data-paths` directory of your dbt project into your data warehouse. You can configure the `data-paths` directory by adding the following line to your `dbt_project.yml` file:

<File name='dbt_project.yml'>

```yaml
data-paths: ["data"] # default is './data'
```

</File>

Assuming you have a `csv` file that looks like this:

<File name='country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

Running `dbt seed` with the above csv located at `data/country_codes.csv` will create a table in your data warehouse with two columns: `country_code` and `country_name`.

To see a sample of the data loaded by dbt, use the `--show` argument to `dbt seed`:

```
$ dbt seed --show

Found 2 models, 3 tests, 0 archives, 0 analyses, 53 macros, 0 operations, 1 seed file

14:46:15 | Concurrency: 1 threads (target='dev')
14:46:15 |
14:46:15 | 1 of 1 START seed file analytics.country_codes........................... [RUN]
14:46:15 | 1 of 1 OK loaded seed file analytics.country_codes....................... [INSERT 3 in 0.01s]
14:46:16 |
14:46:16 | Finished running 1 seed in 0.14s.

Random sample of table: analytics.country_codes
-----------------------------------------------
| country_code | country_name   |
| ------------ | -------------- |
| GB           | United Kingdom |
| CA           | Canada         |
| US           | United States  |

Completed successfully

Done. PASS=1 ERROR=0 SKIP=0 TOTAL=1
```

In addition to the standard `--profile` and `--target` arguments, `dbt seed` also accepts the `--full-refresh` argument. If provided, dbt will drop and re-create the specified table instead of truncating and inserting new data. This is useful if the schema of the csv file changes in a way which is incompatible with the existing table.

Seed files can be used with the `ref()` function in models. In practice, this looks like:

<File name='models/my_model.sql'>

```sql

-- This refers to the table created from data/country_codes.csv
select * from {{ ref('country_codes') }}

```

</File>


## Configuring seeds
### Basic configuration

Seed files can be configured using the same semantics as models. With these configurations, you can selectively enable or disabled seed files, or configure them to materialize in a [custom schema](using-custom-schemas). To configure seed files, use the `seeds:` option in your `dbt_project.yml file`. To load seeds into the default schema (as defined in `profiles.yml`), leave the schema field blank.

```yaml

data-paths: ["data"]

...

models:
  your_package_name:
    materialized: view
    
seeds:
  your_package_name:
    enabled: true
    schema: seed_data
    post-hook: "grant select on {{ this }} to bi_user"
"
```

### Specify column quoting
Whether or not seed columns are quoted can be configured with the `quote_columns`  seed config. When `true`, dbt will quote the column names defined in the seed file when building a table for the seed. When `quote_columns` is set to `false`, dbt will _not_ quote the column names defined in the seed file.

As of dbt v0.15.0, the default value for `quote_columns` is **False**, however this may change in a future release. If you're using seed files, it is recommended that you set the `quote_columns` config explicitly to avoid breaking changes in the future. 

The following example show quoting being explicitly enabled for seed columns.

<File name='dbt_project.yml'>

```yaml

data-paths: ["data"]

...

# Enable quoting of seed columns in your project
seeds:
  quote_columns: True
```

</File>

The following example show quoting being explicitly disabled for seed columns.

<File name='dbt_project.yml'>

```yaml

data-paths: ["data"]

...

# Explicitly disable quoting of seed columns in your project
seeds:
  quote_columns: False
```

</File>

### Override column types

The column types of a seed file can also be configured in the `dbt_project.yml` file. Note that if you change these types, you'll need to run `dbt seed` in `--full-refresh` mode to update the table schema. Example usage:

<File name='dbt_project.yml'>

```yaml

data-paths: ["data"]

...

models:
  your_package_name:
    materialized: view
    
seeds:
  your_package_name:
    enabled: true
    schema: seed_data
    # This configures data/country_codes.csv
    country_codes:
    
      # Override column types
      column_types:
        country_code: varchar(2)
        country_name: varchar(32)
```

</File>

## Considerations

Any operation in dbt which creates resources in the database will execute on-run-start and on-run-end hooks. Operations which create resources in the the database can include dbt run, dbt seed, and dbt snapshot. If you plan to execute dbt seed before executing dbt run, ensure that any on-run-start and on-run-end hooks are idempotent and there are no issues with re-running them for each operation.

Another alternative is pushing particular hooks down to the model level.