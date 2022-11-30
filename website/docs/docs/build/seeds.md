---
title: "Seeds"
id: "seeds"
---
## Related reference docs
* [Seed configurations](seed-configs)
* [Seed properties](seed-properties)
* [`seed` command](seed)

## Overview
Seeds are CSV files in your dbt project (typically in your `seeds` directory), that dbt can load into your <Term id="data-warehouse" /> using the `dbt seed` command.

Seeds can be referenced in downstream models the same way as referencing models — by using the [`ref` function](/reference/dbt-jinja-functions/ref).

Because these CSV files are located in your dbt repository, they are version controlled and code reviewable. Seeds are best suited to static data which changes infrequently.

Good use-cases for seeds:
* A list of mappings of country codes to country names
* A list of test emails to exclude from analysis
* A list of employee account IDs

Poor use-cases of dbt seeds:
* Loading raw data that has been exported to CSVs
* Any kind of production data containing sensitive information. For example
personal identifiable information (PII) and passwords.


## Example
To load a seed file in your dbt project:
1. Add the file to your `seeds` directory, with a `.csv` file extension, e.g. `seeds/country_codes.csv`

<File name='seeds/country_codes.csv'>

```text
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
...
```

</File>

2. Run the `dbt seed` [command](seed) command — a new <Term id="table" /> will be created in your warehouse in your target schema, named `country_codes`
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

<File name='models/orders.sql'>

```sql
-- This refers to the table created from seeds/country_codes.csv
select * from {{ ref('country_codes') }}
```

</File>

## Configuring seeds
Seeds are configured in your `dbt_project.yml`, check out the [seed configurations](reference/seed-configs.md) docs for a full list of available configurations.


## Documenting and testing seeds
You can document and test seeds in yaml by declaring properties — check out the docs on [seed properties](seed-properties) for more information.

## FAQs
<FAQ src="Seeds/load-raw-data-with-seed" />
<FAQ src="Tests/configurable-data-path" />
<FAQ src="Seeds/full-refresh-seed" />
<FAQ src="Tests/testing-seeds" />
<FAQ src="Seeds/seed-datatypes" />
<FAQ src="Runs/run-downstream-of-seed" />
<FAQ src="Seeds/leading-zeros-in-seed" />
<FAQ src="Seeds/build-one-seed" />
<FAQ src="Seeds/seed-hooks" />