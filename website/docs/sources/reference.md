Thoughts
- how do we show that something is a required vs optional config?
- Can we pull this from the docs?

```yml
version: 2

sources:
    - name: source_name
      (database | project): database_name
      (schema | dataset): schema_name # optionally use dataset on bigquery
      description: description
      loader: loader_name
      loaded_at_field: sql 

      quoting:
        database: true | false
        schema: true | false
        identifier: true | false

      tables:
        - name: table_name
          description: description
          identifier: identifier_name
          quoting:
            database: true | false
            schema: true | false
            identifier: true | false
          tests: []
          columns: {}
```

- indicate required via bolding

```
version: 2

sources:
    - **[name](reference/source-name)**: source_name
      [(database | project)](reference/source-database): database_name
      (schema | dataset): schema_name # optionally use dataset on bigquery
      description: description
      loader: loader_name
      loaded_at_field: sql 

      quoting:
        database: true | false
        schema: true | false
        identifier: true | false

      tables:
        - name: table_name
          description: description
          identifier: identifier_name
          quoting:
            database: true | false
            schema: true | false
            identifier: true | false
          tests: []
          columns: {}
```

