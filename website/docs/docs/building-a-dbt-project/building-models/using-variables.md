---
title: "Using variables"
id: "using-variables"
---

dbt provides a mechanism, [variables](var), to provide data to models for compilation. Variables can be used to [configure timezones](https://github.com/fishtown-analytics/snowplow/blob/0.3.9/dbt_project.yml#L22), [avoid hardcoding table names](https://github.com/fishtown-analytics/quickbooks/blob/v0.1.0/dbt_project.yml#L23) or otherwise provide data to models to configure how they are compiled.

To use a variable in a model, hook, or macro, use the `{{ var('...') }}` function. More information on the `var` function can be found [here](var).

Variables can defined in two ways:

1. In the `dbt_project.yml` file
2. On the command line

### Defining variables in `dbt_project.yml`

To supply a variable to a given model, add a `vars` dictionary to the `models:`
config in your `dbt_project.yml` file. These `vars` are in-scope for all models at or below where they are defined, so place them where they make the most sense.

<File name='dbt_project.yml'>

```yaml
models:
  my_project:
    materialized: view
    # Configure a start date for the models in the events/ directory.
    # This will avoid the need to hardcode '2016-06-01' in all of your models!
    events:
      vars:
        start_date: '2016-06-01'
```

</File>

### Defining variables on the command line

The `dbt_project.yml` file is a great place to define variables that rarely change. Other types of variables, like date ranges, will change frequently. To define (or override) variables for a run of dbt, use the `--vars` command line option. In practice, this looks like:

```
$ dbt run --vars '{"key": "value"}'
```

The `--vars` argument accepts a YAML dictionary as a string on the command line. YAML is convenient because it does not require strict quoting as with JSON.

Both of the following are valid and equivalent:

```
$ dbt run --vars '{"key": "value", "date": 20180101}'
$ dbt run --vars '{key: value, date: 20180101}'
```

If only one variable is being set, the brackets are optional, eg:

```
$ dbt run --vars 'key: value'
```

You can find more information on defining dictionaries with YAML [here](https://github.com/Animosity/CraftIRC/wiki/Complete-idiot%27s-introduction-to-yaml).

### Variable precedence

Variables defined with the `--vars` command line argument are applied at the "root" level, as though they were defined directly under `models:` in the `dbt_project.yml` file. Variables defined on the command line will take precedence over **all** variable declarations defined anywhere else in your project or its dependencies.

The order of precedence for variable declaration is as follows (highest priority first):

1. The variables defined on the command line with `--vars`.
2. The most specific variable definition in the root `dbt_project.yml` file.
3. The most specific variable definition in the model's own `dbt_project.yml` file (if this model or macro is in a package).
4. The variable's default argument (if one is provided).

If dbt is unable to find a definition for a variable after checking these four places, then a compilation error will be raised.
