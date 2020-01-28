* Optional
* available context?
* 

## Usage:
```yml
sources:
  - name: source_name
    database: database_name
```

```yml
sources:
  - name: source_name
    tables:
      - name: table_name
        database: database_name
```
By default, dbt will assume your source is in the same database.

Use the `database` parameter if your source database differs from your [`target.database`](a-link-to-nowhere)

You can configure a `database` for a table within a source, or an entire source. If both configurations are supplied, the table-level configuration will override the source-level configuration.

## Warehouse usage notes
* Redshift -- nope, can't do cross database joins
* BigQuery: optionally use `project`, right?
* Snowflake: v useful tyvm

## Examples
nah bro pretty easy to figure out

## Common challenges