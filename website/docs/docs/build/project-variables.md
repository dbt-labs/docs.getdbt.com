---
title: "Project variables"
description: "Use dbt project variables to configure conditional or reusable logic across models and other resources." 
id: "project-variables"
pagination_next: "docs/build/environment-variables"
---

dbt provides a mechanism called [variables](/reference/dbt-jinja-functions/var) to provide data to models for compilation. You can use variables to [configure timezones](https://github.com/dbt-labs/snowplow/blob/0.3.9/dbt_project.yml#L22), [avoid hardcoding table names](https://github.com/dbt-labs/quickbooks/blob/v0.1.0/dbt_project.yml#L23), or otherwise provide data to models to configure how they are compiled.

To use a variable in a model, hook, or macro, use the `{{ var('...') }}` function. You can find more information on the `var` function [here](/reference/dbt-jinja-functions/var).

<VersionBlock lastVersion="1.11">

You can define variables in two ways:

1. In the `dbt_project.yml` file
2. On the command line

</VersionBlock>

<VersionBlock firstVersion="1.12">

You can define variables in three ways:

1. In the `vars.yml` file (recommended for projects with multiple variables)
2. In the `dbt_project.yml` file
3. On the command line

</VersionBlock>

Note, refer to [YAML tips](/docs/build/dbt-tips#yaml-tips) for more YAML information.

<VersionBlock firstVersion="1.12">

### Defining variables in `vars.yml`<Lifecycle status="beta" />

:::info Beta feature
The `vars.yml` file is a beta feature in <Constant name="core" /> v1.12.
:::

`vars.yml` is a dedicated file for project variables located at the project root. Because dbt parses it _before_ `dbt_project.yml`, you can [reference variables from `vars.yml` in `dbt_project.yml`](#using-varsyml-variables-in-dbt_projectyml) using `{{ var('...') }}`. 

To define variables in a `vars.yml` file, add a `vars` config. These variables can be scoped globally, or to a specific package imported in your project. See the following example of variables in a `vars.yml` file:

<File name='vars.yml'>

```yaml
vars:
  # The `start_date` variable is accessible to all resources
  start_date: '2016-06-01'
  
  # The `platforms` variable is only accessible to resources in the my_dbt_project project
  my_dbt_project:
    platforms: ['web', 'mobile']
  
  # The `app_ids` variable is only accessible to resources in the snowplow package
  snowplow:
    app_ids: ['marketing', 'app', 'landing-page']
```

</File>

You cannot define variables in both `vars.yml` and `dbt_project.yml`; you can only use one or the other. If both files contain a `vars` block with definitions, dbt raises an error.

If `vars.yml` is empty or doesn't exist, variables defined in `dbt_project.yml` are used instead. If `vars.yml` exists but has no top-level `vars` key, variables are resolved from the command line or `dbt_project.yml`.

#### Using `vars.yml` variables in `dbt_project.yml`<Lifecycle status="beta" />

Because `vars.yml` is parsed before `dbt_project.yml`, you can reference variables from `vars.yml` within `dbt_project.yml` using `{{ var('...') }}`. Variables referenced in `dbt_project.yml` are resolved only from `vars.yml` or the `--vars` command-line argument, not from the `vars` block in `dbt_project.yml` itself. If `dbt_project.yml` expects a variable that is defined only in its own `vars` block, dbt raises an error.

For example, you have the following variables defined in `vars.yml`:

<File name='vars.yml'>

```yaml
vars:
  schema_name: analytics
  materialization: table
```

</File>

You can reference them in `dbt_project.yml`:

<File name='dbt_project.yml'>

```yaml
models:
  my_dbt_project:
    +schema: "{{ var('schema_name') }}"
    +materialized: "{{ var('materialization') }}"
```

</File>

</VersionBlock>

### Defining variables in `dbt_project.yml`

:::info

Jinja is not supported within the `vars` config, and all values will be interpreted literally.

:::

To define variables in a dbt project, add a `vars` config to your `dbt_project.yml` file.
These `vars` can be scoped globally, or to a specific package imported in your
project.

<File name='dbt_project.yml'>

```yaml
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

<VersionBlock firstVersion="1.12">

You cannot define variables in both `vars.yml` and `dbt_project.yml`; you can only use one or the other. If both files contain a `vars` block with definitions, dbt raises an error.

</VersionBlock>

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

<VersionBlock lastVersion="1.11">

Variables defined with the `--vars` command line argument override variables defined in the `dbt_project.yml` file. They are globally scoped and accessible to the root project and all installed packages.

The order of precedence for variable declaration is as follows (highest priority first):

1. The variables defined on the command line with `--vars`
2. The package-scoped variable declaration in the root `dbt_project.yml` file
3. The global variable declaration in the root `dbt_project.yml` file
4. If this node is defined in a package: variable declarations in that package's `dbt_project.yml` file
5. The variable's default argument (if one is provided)

</VersionBlock>

<VersionBlock firstVersion="1.12">

Variables defined with the `--vars` command line argument override variables defined in `vars.yml` or `dbt_project.yml`. They are globally scoped and accessible to the root project and all installed packages.

The order of precedence for variable declaration is as follows (highest priority first):

1. The variables defined on the command line with `--vars`
2. The package-scoped variable declaration in the root `vars.yml` file (if present)
3. The global variable declaration in the root `vars.yml` file (if present)
4. The package-scoped variable declaration in the root `dbt_project.yml` file
5. The global variable declaration in the root `dbt_project.yml` file
6. If this node is defined in a package: variable declarations in that package's `dbt_project.yml` file
7. The variable's default argument (if one is provided)

`vars.yml` is parsed _before_ `dbt_project.yml`, so variables defined in `vars.yml` are available when `dbt_project.yml` is parsed. If `vars.yml` is empty or doesn't exist, variables from `dbt_project.yml` are used instead. When any variable (in `vars.yml`, `dbt_project.yml`, or from the command line) changes, partial parsing is disabled for the next run.

</VersionBlock>

If dbt is unable to find a definition for a variable after checking all possible variable declaration places, then a compilation error will be raised.

**Note:** Variable scope is based on the node ultimately using that variable. Imagine the case where a model defined in the root project is calling a macro defined in an installed package. That macro, in turn, uses the value of a variable. The variable will be resolved based on the _root project's_ scope, rather than the package's scope.

<Snippet path="discourse-help-feed-header" />
<DiscourseHelpFeed tags="variables"/>
