## Getting started
> ℹ️ We also have a tutorial on this

`dbt seed` loads data from csv files into your data warehouse. Because these csv files are located in your dbt repository, they are version controlled and code reviewable. Thus, `dbt seed` is appropriate for loading static data which changes infrequently.

The `dbt seed` command will load `csv` files located in the `data-paths` directory of your dbt project into your data warehouse. You can configure the `data-paths` directory by adding the following line to your `dbt_project.yml` file:
```csv
country_code,country_name
US,United States
CA,Canada
GB,United Kingdom
```

Running `dbt seed` with the above csv located at `data/country_codes.csv` will create a table in your data warehouse with two columns: `country_code` and `country_name`.

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

Check out the full documentation for the `seed` function [here](link-to-nowhere)

## Building on top of seed files

Seed files can be used with the `ref()` function in models. In practice, this looks like:
```sql
-- This refers to the table created from data/country_codes.csv
select * from {{ ref('country_codes') }}
```

### FAQs:
* Can I use seeds to load my raw data? **NO!**
* Can I place my seeds in a different directory? Yes just update the `data-paths` value in your `dbt_project.yml` file
* Can I use a format other than CSV (e.g. TSV)? No
* How do I escape comma characters?
* The columns of my seed changed, and now I can't rerun `seed`, what do I do? Use `--full-refresh`
* Can I name my table a different name to the CSV file? Umm I think aliases apply, but, like, why would you tho?
* Can I test seeds? (Yes, cheekily)
* Can I document seeds? (I think so)
* Can I run models downstream of a seed? Yes, use the model selection syntax


## Configuring seeds
### Basic configuration

Seed files can be configured using the same semantics as models. With these configurations, you can selectively enable or disabled seed files, or configure them to materialize in a [custom schema](doc:using-custom-schemas). To configure seed files, use the `seeds:` option in your `dbt_project.yml file`. To load seeds into the default schema (as defined in `profiles.yml`), leave the schema field blank.
```yml
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

```
Check out the reference section for more details on available configurations!

## FAQs:
* My seed was loaded with the wrong datatype. Can I force a datatype?
* Do hooks run when running seeds?
* Can I load one seed a time?
