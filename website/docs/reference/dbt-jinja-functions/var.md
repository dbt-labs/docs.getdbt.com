---
title: "About var function"
sidebar_label: "var"
id: "var"
description: "Pass variables from `dbt_project.yml` file into models."
---

Variables can be passed from your [`dbt_project.yml`](/reference/dbt_project.yml) file into models during compilation. These variables allow you to make your models configurable instead of hardcoding values directly in SQL. For example, you might define a default reporting date, region, or feature flag once in your project and reference it across multiple models.

Variables defined in your `dbt_project.yml` file act as project-wide defaults. You can override them at runtime using the `--vars` command-line argument. For example, to test a different date range or run models with environment-specific settings without modifying your model logic.

To retrieve a variable inside a model, hook, or macro, use the `var()` function. The `var()` function returns the value defined in your project or passed using `--vars`, based on precedence.

You can use `var()` anywhere dbt renders Jinja during compilation, including most `.sql` and `.yml` files in your project. It does not work in configuration files that dbt reads before compilation, such as [`profiles.yml`](/reference/dbt-jinja-functions/profiles-yml-context) or [`packages.yml`](/reference/dbt-jinja-functions/packages.yml%20context).

To add a variable to a model, use the `var()` function:

<File name='my_model.sql'>

```sql
select * from events where event_type = '{{ var("event_type") }}'
```

</File>

If you try to run this model without supplying an `event_type` variable, you'll receive
a compilation error that looks like this:

```
Encountered an error:
! Compilation error while compiling model package_name.my_model:
! Required var 'event_type' not found in config:
Vars supplied to package_name.my_model = {
}
```

To define a variable in your project, add the `vars:` config to your `dbt_project.yml` file.
See the docs on [Project variables](/docs/build/project-variables) for more information on
defining variables in your dbt project.

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0

config-version: 2

# Define variables here
vars:
  event_type: activation
```

</File>

### Variable default values

The `var()` function takes an optional second argument, `default`. If this
argument is provided, then it will be the default value for the variable if one
is not explicitly defined.

<File name='my_model.sql'>

```sql
-- Use 'activation' as the event_type if the variable is not defined.
select * from events where event_type = '{{ var("event_type", "activation") }}'
```

</File>

### Command line variables

import Commandlinevariable from '/snippets/_command-line-variables.md';

<Commandlinevariable />

