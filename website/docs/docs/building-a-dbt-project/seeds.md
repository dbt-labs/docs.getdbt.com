---
title: "Seeds"
id: "seeds"
---
## Related reference docs
* [Seed configurations](reference/seed-configs.md)
* [Seed properties](reference/seed-properties.md)
* The `dbt seed` [command](docs/running-a-dbt-project/command-line-interface/seed.md)

## Getting started
Seeds are CSV files in your dbt project (typically in your `data` directory), that dbt can load into your data warehouse using the `dbt seed` command.

Seeds can be referenced in downstream models the same way as referencing models — by using the `ref` [function](docs/writing-code-in-dbt/jinja-context/ref.md).

Because these CSV files are located in your dbt repository, they are version controlled and code reviewable. Seeds are best suited to static data which changes infrequently.

Good use-cases for seeds:
* A list of mappings of country codes to country names
* A list of test emails to exclude from analysis
* A list of employee account IDs

Poor use-cases of dbt seeds:
* Loading raw data that has been exported to CSVs


## Example
To load a seed file in your dbt project:
1. Add the file to your `data` directory, with a `.csv` file extension, e.g. `data/country_codes.csv`

<File name='data/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Run the `dbt seed` [command](docs/running-a-dbt-project/command-line-interface/seed.md) — a new table will be created in your warehouse in your target schema, named `country_codes`
```
$ dbt seed

Found 2 models, 3 tests, 0 archives, 0 analyses, 53 macros, 0 operations, 1 seed file

14:46:15 | Concurrency: 1 threads (target='dev')
14:46:15 |
14:46:15 | 1 of 1 START seed file analytics.country_codes........................... [RUN]
14:46:15 | 1 of 1 OK loaded seed file analytics.country_codes....................... [INSERT 3 in 0.01s]
14:46:16 |
14:46:16 | Finished running 1 seed in 0.14s.

Completed successfully

Done. PASS=1 ERROR=0 SKIP=0 TOTAL=1
```

3. Refer to seeds in downstream models using the `ref` function.

<File name='models/orders.csv'>

```sql
-- This refers to the table created from data/country_codes.csv
select * from {{ ref('country_codes') }}
```

</File>

## Configuring seeds
Seeds are configured in your `dbt_project.yml`, check out the [seed configurations](reference/seed-configs.md) docs for a full list of available configurations.


## Documenting and testing seeds
You can document and test seeds in yaml by declaring properties — check out the docs on [seed properties](seed-properties) for more information.

## FAQs
<FAQ src="load-raw-data-with-seed" />
<FAQ src="configurable-data-path" />
<FAQ src="full-refresh-seed" />
<FAQ src="testing-seeds" />
<FAQ src="seed-datatypes" />
<FAQ src="run-downstream-of-seed" />
<FAQ src="leading-zeros-in-seed" />
<FAQ src="build-one-seed" />
<FAQ src="seed-hooks" />
