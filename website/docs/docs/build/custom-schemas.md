---
title: "Custom schemas"
id: "custom-schemas"
pagination_next: "docs/build/custom-databases"
---

By default, all dbt models are built in the schema specified in your [environment](/docs/dbt-cloud-environments) (dbt Cloud) or [profile's target](/docs/core/dbt-core-environments) (dbt Core). This default schema is called your _target schema_.

For dbt projects with lots of models, it's common to build models across multiple schemas and group similar models together. For example, you might want to:

* Group models based on the business unit using the model, creating schemas such as `core`, `marketing`, `finance` and `support`.
* Hide intermediate models in a `staging` schema, and only present models that should be queried by an end user in an `analytics` schema.

To do this, specify a custom schema. dbt generates the schema name for a model by appending the custom schema to the target schema. For example, `<target_schema>_<custom_schema>`.

| Target schema | Custom schema | Resulting schema |
| ------------- | ------------- | ---------------- |
| analytics_prod | None | analytics_prod |
| alice_dev | None | alice_dev |
| dbt_cloud_pr_123_456 | None | dbt_cloud_pr_123_456 |
| analytics_prod | marketing | analytics_prod_marketing |
| alice_dev | marketing | alice_dev_marketing |
| dbt_cloud_pr_123_456 | marketing | dbt_cloud_pr_123_456_marketing |

## How do I use custom schemas?

To specify a custom schema for a model, use the `schema` configuration key. As with any configuration, you can do one of the following:

* apply this configuration to a specific model by using a config block within a model
* apply it to a subdirectory of models by specifying it in your `dbt_project.yml` file

<File name='orders.sql'>

```sql
{{ config(schema='marketing') }}

select ...
```

</File>

<File name='dbt_project.yml'>

```yaml
# models in `models/marketing/ will be built in the "*_marketing" schema
models:
  my_project:
    marketing:
      +schema: marketing
```

</File>

## Understanding custom schemas

When first using custom schemas, it's a common misunderstanding to assume that a model _only_ uses the new `schema` configuration; for example, a model that has the configuration `schema: marketing` would be built in the `marketing` schema. However, dbt puts it in a schema like `<target_schema>_marketing`.

There's a good reason for this deviation. Each dbt user has their own target schema for development (refer to [Managing Environments](#managing-environments)). If dbt ignored the target schema and only used the model's custom schema, every dbt user would create models in the same schema and would overwrite each other's work.

By combining the target schema and the custom schema, dbt ensures that objects it creates in your data warehouse don't collide with one another.

If you prefer to use different logic for generating a schema name, you can change the way dbt generates a schema name (see below).

### How does dbt generate a model's schema name?

dbt uses a default macro called `generate_schema_name` to determine the name of the schema that a model should be built in.

The following code represents the default macro's logic:

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}

        {{ default_schema }}_{{ custom_schema_name | trim }}

    {%- endif -%}

{%- endmacro %}
```
<br />

import WhitespaceControl from '/snippets/_whitespace-control.md';

<WhitespaceControl/>


## Changing the way dbt generates a schema name

If your dbt project has a custom macro called `generate_schema_name`, dbt will use it instead of the default macro. This allows you to customize the name generation according to your needs.

To customize this macro, copy the example code in the section [How does dbt generate a model's schema name](#how-does-dbt-generate-a-models-schema-name) into a file named `macros/generate_schema_name.sql` and make changes as necessary.

Be careful. dbt will ignore any custom `generate_schema_name` macros included in installed packages.

<Expandable alt_header="Warning: Don't replace `default_schema` in the macro">

If you're modifying how dbt generates schema names, don't just replace ```{{ default_schema }}_{{ custom_schema_name | trim }}``` with ```{{ custom_schema_name | trim }}``` in the ```generate_schema_name``` macro.

If you remove ```{{ default_schema }}```, it causes developers to override each other's models if they create their own custom schemas. This can also cause issues during development and continuous integration (CI).

❌ The following code block is an example of what your code _should not_ look like:

```sql
{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- if custom_schema_name is none -%}

        {{ default_schema }}

    {%- else -%}
    # The following is incorrect as it omits {{ default_schema }} before {{ custom_schema_name | trim }}. 
        {{ custom_schema_name | trim }} 

    {%- endif -%}

{%- endmacro %}

```

</Expandable>

### generate_schema_name arguments

| Argument | Description | Example |
| -------- | ----------- | ------- |
| custom_schema_name | The configured value of `schema` in the specified node, or `none` if a value is not supplied | `marketing` |
| node | The `node` that is currently being processed by dbt | `{"name": "my_model", "resource_type": "model",...}` |

### Jinja context available in generate_schema_name

If you choose to write custom logic to generate a schema name, it's worth noting that not all variables and methods are available to you when defining this logic. In other words: the `generate_schema_name` macro is compiled with a limited Jinja context.

The following context methods _are_ available in the `generate_schema_name` macro:

| Jinja context | Type | Available |
| ------------- | ---- | --------- |
| [target](/reference/dbt-jinja-functions/target) | Variable | ✅ |
| [env_var](/reference/dbt-jinja-functions/env_var) | Variable | ✅ |
| [var](/reference/dbt-jinja-functions/var) | Variable | Limited, see below |
| [exceptions](/reference/dbt-jinja-functions/exceptions) | Macro | ✅ |
| [log](/reference/dbt-jinja-functions/log) | Macro | ✅ |
| Other macros in your project | Macro | ✅ |
| Other macros in your packages | Macro | ✅ |

### Which vars are available in generate_schema_name?

Globally-scoped variables and variables defined on the command line with
[--vars](/docs/build/project-variables) are accessible in the `generate_schema_name` context.

### Managing different behaviors across packages

See docs on macro `dispatch`: ["Managing different global overrides across packages"](/reference/dbt-jinja-functions/dispatch)

## A built-in alternative pattern for generating schema names

A common customization is to ignore the target schema in production environments, and ignore the custom schema configurations in other environments (such as development and CI).

Production Environment (`target.name == 'prod'`)

| Target schema | Custom schema | Resulting schema |
| ------------- | ------------- | ---------------- |
| analytics_prod | None | analytics_prod |
| analytics_prod | marketing | marketing |

Development/CI Environment (`target.name != 'prod'`)

| Target schema | Custom schema | Resulting schema |
| ------------- | ------------- | ---------------- |
| alice_dev | None | alice_dev |
| alice_dev | marketing | alice_dev |
| dbt_cloud_pr_123_456 | None | dbt_cloud_pr_123_456 |
| dbt_cloud_pr_123_456 | marketing | dbt_cloud_pr_123_456 |

Similar to the regular macro, this approach guarantees that schemas from different environments will not collide.

dbt ships with a macro for this use case &mdash; called `generate_schema_name_for_env` &mdash; which is disabled by default. To enable it, add a custom `generate_schema_name` macro to your project that contains the following code:

<File name='macros/get_custom_schema.sql'>

```sql
-- put this in macros/get_custom_schema.sql

{% macro generate_schema_name(custom_schema_name, node) -%}
    {{ generate_schema_name_for_env(custom_schema_name, node) }}
{%- endmacro %}
```

</File>

When using this macro, you'll need to set the target name in your production job to `prod`.

## Managing environments

In the `generate_schema_name` macro examples shown in the [built-in alternative pattern](#a-built-in-alternative-pattern-for-generating-schema-names) section, the `target.name` context variable is used to change the schema name that dbt generates for models. If the `generate_schema_name` macro in your project uses the `target.name` context variable, you must ensure that your different dbt environments are configured accordingly. While you can use any naming scheme you'd like, we typically recommend:

* **dev** &mdash; Your local development environment; configured in a `profiles.yml` file on your computer.
* **ci** &mdash; A [continuous integration](/docs/cloud/git/connect-github) environment running on pull requests in GitHub, GitLab, and so on.
* **prod** &mdash; The production deployment of your dbt project, like in dbt Cloud, Airflow, or [similar](/docs/deploy/deployments).

If your schema names are being generated incorrectly, double-check your target name in the relevant environment.

For more information, consult the [managing environments in dbt Core](/docs/core/dbt-core-environments) guide.

## Related docs

- [Customize dbt models database, schema, and alias](/guides/customize-schema-alias?step=1) to learn how to customize dbt models database, schema, and alias
- [Custom database](/docs/build/custom-databases) to learn how to customize dbt model database
- [Custom aliases](/docs/build/custom-aliases) to learn how to customize dbt model alias name
