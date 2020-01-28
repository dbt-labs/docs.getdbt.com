Sources make it possible to name and describe your source data tables. Sources are useful for
1. selecting from source tables in your [base models](doc:best-practices#section-limit-dependencies-on-raw-data)
2. testing your assumptions about your source data
3. calculating the freshness of your source data

Sources can be defined in [schema.yml files](doc:schemayml-files) alongside model definitions. For information about testing sources, check out the docs on [testing](doc:testing) in dbt.

## Defining sources

Sources are defined in `schema.yml` files. If you're not already familiar with these files, be sure to check out [the documentation on schema.yml files](doc:schemayml-files) before proceeding. Use a `sources` block to define sources:
```yml
"
# This example defines a source called `source_1` containing one table
# called `table_1`. This is a minimal example of a source definition.

version: 2

sources:
  - name: source_1
    tables:
      - name: table_1
      - name: table_2

  - name: source_2
    tables:
      - name: table_1"
```

Once a source has been defined, it can be referenced from a model using the [source()](doc:source) function.
```sql
select * from {{ source('source_1', 'table_1') }}
/*
This is compiled to:

    select * from "target_database"."source_1"."table_1"

*/
```

By defalt, dbt will use the `target.database`, `name` of the specified source and table to construct a table name for the source table. 

### FAQs:
* How do I define sources for different databases?
* Can I use a source name that differs from the schema it is placed in?
* Can I store additional metadata in a source description?
* Can I tag sources?


## Selecting sources

Sources can be "selected" in dbt runs with the `--models` flag. While sources themselves cannot be run, it is frequently useful to run all of the models that depend on a source, eg. after that source has finished loading. Sources can be selected by using the `source:` selector coupled with:
1. the name of the source
2. the name of the source and a table, dot-separated

```
Run all of the models downstream of a source
$ dbt run --model source:ecommerce+

Run all of the models downstream of a specific source table
$ dbt run --model source:ecommerce.orders+
```

## Testing sources
You should test your sources as much as possible

### FAQs
* How do I run tests on my source only?
* When should I test my sources?


## Snapshotting source data freshness
With a couple of extra configs, dbt can optionally snapshot the "freshness" of the data in your source tables. This is useful for understanding if your data pipelines are in a healthy state, and is a critical component of defining SLAs for your warehouse.

To configure sources to snapshot freshness information, add a `freshness` block to your source and `loaded_at_field` to your table declaration:
```yml
version: 2

sources:
  - name: snowplow
      database: raw
      loader: emr # optional, informational only
  
      freshness:
        warn_after: {count: 12, period: hour}
        error_after: {count: 24, period: hour}
  
      tables:
      - name: event
        loaded_at_field: collector_tstamp # required for freshness snapshotting

```

Then, run the `snapshot-freshness` command:

```
$ dbt source snapshot-freshness [--select [source_1, ...]]
```

## FAQs:
* Can I run snapshot the freshness for one source a time? (yes use the model selection syntax)
* Can I filter the snapshot query? (yes use the filter)
