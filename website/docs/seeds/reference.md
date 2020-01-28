```yml
seeds:
  quote_columns: true | false
  enabled: true | false
  schema: schema_name
  pre-hook: sql-snippet # is this available?
  post-hook: sql-snippet # is this available?
  <seed_name>:
    column_types:
        <column_name>: column-type
```

Note: I'm not convinced that a yaml doc is the best way to show configs for things in the `dbt_project.yml` file (especially re: models, snapshots) since they can:
1. be applied hierarchically
2. can also be set in a `config` block (except for seeds)