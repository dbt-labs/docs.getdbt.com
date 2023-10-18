---
title: "Add Seeds to your DAG"
sidebar_label: "Seeds"
description: "Read this tutorial to learn how to use seeds when building in dbt."
id: "seeds"
---
## Related reference docs
* [Seed configurations](/reference/seed-configs)
* [Seed properties](/reference/seed-properties)
* [`seed` command](/docs/build/seeds)

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

2. Run the `dbt seed` [command](/reference/commands/seed) — a new <Term id="table" /> will be created in your warehouse in your target schema, named `country_codes`
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
You can document and test seeds in YAML by declaring properties — check out the docs on [seed properties](/reference/seed-properties) for more information.

## FAQs
<FAQ path="Seeds/load-raw-data-with-seed" />
<FAQ path="Tests/configurable-data-path" />
<FAQ path="Seeds/full-refresh-seed" />
<FAQ path="Tests/testing-seeds" />
<FAQ path="Seeds/seed-datatypes" />
<FAQ path="Runs/run-downstream-of-seed" />
<FAQ path="Seeds/leading-zeros-in-seed" />
<FAQ path="Seeds/build-one-seed" />
<FAQ path="Seeds/seed-hooks" />
