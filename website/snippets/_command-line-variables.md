The `dbt_project.yml` file is a great place to define variables that rarely change. 

When you need to override a variable for a specific run, use the `--vars` command line option. For example, when you want to test with a different date range, run models with environment-specific settings, or adjust behavior dynamically.

Use `--vars` to pass one or more variables to a dbt command. Provide the argument as a YAML dictionary string.

For example:

```
$ dbt run --vars '{"event_type": "signup"}'
```

You can use the same `--vars` syntax with other dbt commands, such as `dbt snapshot`:

```shell
$ dbt snapshot --select my_snapshot --vars '{"cutoff_date": "2026-01-01"}'
```

Inside a model, snapshot, or macro, access the value using the `var()` function:

```
select '{{ var("event_type") }}' as event_type
```

When you pass variables using `--vars`, you can access them anywhere you use the `var()` function in your project.

You can pass multiple variables at once:
```
$ dbt run --vars '{event_type: signup, region: us}'
```

If only one variable is being set, the brackets are optional:
```
$ dbt run --vars 'event_type: signup'
```

The `--vars` argument accepts a YAML dictionary as a string on the command line.
YAML is convenient because it does not require strict quoting as with <Term id="json" />.

Both of the following are valid and equivalent:
```
$ dbt run --vars '{"key": "value", "date": 20180101}'
$ dbt run --vars '{key: value, date: 20180101}'
```

Variables defined using `--var`, override values defined in `dbt_project.yml`. This makes `--vars` useful for temporarily overriding configuration without changing your committed project files. For the complete order of precedence (including package-scoped variables and default values defined in `var()`), see [Variable precedence](/docs/build/project-variables#variable-precedence).
