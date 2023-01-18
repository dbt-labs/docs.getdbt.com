---
title: "Project variables"
id: "project-variables"
---

dbt provides a mechanism, [variables](reference/dbt-jinja-functions/var), to provide data to models for
compilation. Variables can be used to [configure timezones](https://github.com/dbt-labs/snowplow/blob/0.3.9/dbt_project.yml#L22),
[avoid hardcoding table names](https://github.com/dbt-labs/quickbooks/blob/v0.1.0/dbt_project.yml#L23)
or otherwise provide data to models to configure how they are compiled.

To use a variable in a model, hook, or macro, use the `{{ var('...') }}` function. More information on the `var` function can be found [here](/reference/dbt-jinja-functions/var).

Variables can be defined in two ways:

1. In the `dbt_project.yml` file
2. On the command line

### Defining variables in `dbt_project.yml`

:::info New in v0.17.0

The syntax for specifying vars in the `dbt_project.yml` file has changed in
dbt v0.17.0. See the [migration guide](/guides/migration/versions)
for more information on these changes.

:::

To define variables in a dbt project, add a `vars` config to your `dbt_project.yml` file.
These `vars` can be scoped globally, or to a specific package imported in your
project.

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

vars:
  # The `start_date` variable will be accessible in all resources
  start_date: '2016-06-01'

  # The `platforms` variable is only accessible to resources in the my_dbt_project project
  my_dbt_project:
    platforms: ['web', 'mobile']

  # The `app_ids` variable is only accessible to resources in the snowplow package
  snowplow:
    app_ids: ['marketing', 'app', 'landing-page']

models:
    ...
```

</File>

### Defining variables on the command line

The `dbt_project.yml` file is a great place to define variables that rarely
change. Other types of variables, like date ranges, will change frequently. To
define (or override) variables for a run of dbt, use the `--vars` command line
option. In practice, this looks like:

```
$ dbt run --vars '{"key": "value"}'
```

The `--vars` argument accepts a YAML dictionary as a string on the command line.
YAML is convenient because it does not require strict quoting as with <Term id="json" />.

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

Variables defined with the `--vars` command line argument override variables
defined in the `dbt_project.yml` file. They are globally scoped and will be
accessible to all packages included in the project.

The order of precedence for variable declaration is as follows (highest priority first):

1. The variables defined on the command line with `--vars`.
3. The package-scoped variable declaration in the `dbt_project.yml` file
2. The global variable declaration in the `dbt_project.yml` file.
4. The variable's default argument (if one is provided).

If dbt is unable to find a definition for a variable after checking these four places, then a compilation error will be raised.

<Snippet src="discourse-help-feed-header" />
<DiscourseHelpFeed tags="variables"/>
