---
title: "About var function"
sidebar_label: "var"
id: "var"
description: "Pass variables from `dbt_project.yml` file into models."
---

import VarsYmlBeta from '/snippets/_vars-yml-beta.md';

<VersionBlock lastVersion="1.11">

Variables can be passed from your [`dbt_project.yml`](/reference/dbt_project.yml) file into models during compilation. These variables allow you to make your models configurable instead of hardcoding values directly in SQL. For example, you might define a default reporting date, region, or feature flag once in your project and reference it across multiple models.

Variables defined in your `dbt_project.yml` file act as project-wide defaults. You can override them at runtime using the `--vars` command-line argument. For example, to test a different date range or run models with environment-specific settings without modifying your model logic.

</VersionBlock>

<VersionBlock firstVersion="1.12">

You can provide variables from `vars.yml` or `dbt_project.yml` to models during compilation. These variables are useful for configuring packages for deployment in multiple environments, or for defining values that should be used across multiple models within a package.

Variables defined in `vars.yml` or `dbt_project.yml` act as project-wide defaults. You can override them at runtime using the `--vars` command-line argument. For example, when testing with a different date range or running models with environment-specific settings without changing your model logic.

</VersionBlock>

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

<VersionBlock lastVersion="1.11">

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

</VersionBlock>

<VersionBlock firstVersion="1.12">

To define a variable in your project, add the `vars:` config to a dedicated `vars.yml` file or to your `dbt_project.yml` file. `vars.yml` is parsed _before_ `dbt_project.yml`, so you can reference variables from `vars.yml` in `dbt_project.yml` using `{{ var('...') }}`.

<Tabs>
<TabItem value="vars.yml" label="vars.yml">

<File name='vars.yml'>

```yaml
vars:
  event_type: activation
```

</File>
<VarsYmlBeta />

</TabItem>
<TabItem value="dbt_project.yml" label="dbt_project.yml">

You can define variables in `dbt_project.yml`, or reference variables from `vars.yml` (for example, in your `models` config):

<File name='dbt_project.yml'>

```yaml
name: my_dbt_project
version: 1.0.0
config-version: 2

# Option 1: Define variables here
vars:
  event_type: activation

# Option 2: Reference a variable from vars.yml
models:
  my_dbt_project:
    +schema: "{{ var('event_type') }}"
```

</File>

</TabItem>
</Tabs>

You cannot define variables in both `vars.yml` and `dbt_project.yml`; you can only use one or the other. If both files contain a `vars` block with definitions, dbt raises an error.

See the docs on [using variables](/docs/build/project-variables) for more information on how to define variables in your dbt project.

</VersionBlock>

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

