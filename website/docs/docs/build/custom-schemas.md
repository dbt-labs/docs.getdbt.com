---
title: "Custom schemas"
id: "custom-schemas"
---

## What is a custom schema?
By default, all dbt models are built in the schema specified in your target. In dbt projects with lots of models, it may be useful to instead build some models in schemas other than your target schema – this can help logically group models together.

For example, you may wish to:
* Group models based on the business unit using the model, creating schemas such as `core`, `marketing`, `finance` and `support`; or,
* Hide intermediate models in a `staging` schema, and only present models that should be queried by an end user in an `analytics` schema.

You can use **custom schemas** in dbt to build models in a schema other than your target schema. It's important to note that by default, dbt will generate the schema name for a model by **concatenating the custom schema to the target schema**, as in: `<target_schema>_<custom_schema>;`.

| Target schema | Custom schema | Resulting schema |
| ------------- | ------------- | ---------------- |
| &lt;target_schema&gt; | None | &lt;target_schema&gt; |
| analytics | None | analytics |
| dbt_alice | None | dbt_alice |
| &lt;target_schema&gt; | &lt;custom_schema&gt; | &lt;target_schema&gt;\_&lt;custom_schema&gt; |
| analytics | marketing | analytics_marketing |
| dbt_alice | marketing | dbt_alice_marketing |

## How do I use custom schemas?
Use the `schema` configuration key to specify a custom schema for a model. As with any configuration, you can either:
* apply this configuration to a specific model by using a config block within a model, or
* apply it to a subdirectory of models by specifying it in your `dbt_project.yml` file

<File name='orders.sql'>

```sql
{{ config(schema='marketing') }}

select ...
```

</File>



<File name='dbt_project.yml'>

```yaml
# models in `models/marketing/ will be rendered to the "*_marketing" schema
models:
  my_project:
    marketing:
      +schema: marketing
```

</File>

## Understanding custom schemas

### Why does dbt concatenate the custom schema to the target schema?
When first using custom schemas, it's common to assume that a model will be built in schema that matches the `schema` configuration exactly, for example, a model that has the configuration `schema: marketing`, would be built in the `marketing` schema. However, dbt instead creates it in a schema like `<target_schema>_marketing` by default – there's good reason for this!

In a typical setup of dbt, each dbt user will use a separate target schema (see [Managing Environments](/docs/build/custom-schemas#managing-environments)). If dbt created models in a schema that matches a model's custom schema exactly, every dbt user would create models in the same schema.

Further, the schema that your development models are built in would be the same schema that your production models are built in! Instead, concatenating the custom schema to the target schema helps create distinct schema names, reducing naming conflicts.

If you prefer to use different logic for generating a schema name, you can change the way dbt generates a schema name (see below).

### How does dbt generate a model's schema name?
Under the hood, dbt uses a macro called `generate_schema_name` to determine the name of the schema that a model should be built in. The code for the macro that expresses the current logic follows:

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

## Advanced custom schema configuration

### Changing the way dbt generates a schema name
If your dbt project includes a macro that is also named `generate_schema_name`, dbt will _always use the macro in your dbt project_ instead of the default macro.

Therefore, to change the way dbt generates a schema name, you should add a macro named `generate_schema_name` to your project, where you can then define your own logic.

Note: dbt ignores any custom `generate_schema_name` macros that are part of a package installed in your project.

### An alternative pattern for generating schema names
A frequently used pattern for generating schema names is to change the behavior based on dbt's environment, such that:

- In prod:
  - If a custom schema is provided, a model's schema name should match the custom schema, rather than being concatenated to the target schema.
  - If no custom schema is provided, a model's schema name should match the target schema.

- In other environments (e.g. `dev` or `qa`):
  - Build _all_ models in the target schema, as in, ignore custom schema configurations.

dbt ships with a global macro that contains this logic – `generate_schema_name_for_env`.

If you want to use this pattern, you'll need a `generate_schema_name` macro in your project that points to this logic. You can do this by creating a file in your `macros` directory (we normally call it `get_custom_schema.sql`), and pasting in the following:

<File name='macros/get_custom_schema.sql'>

```sql
-- put this in macros/get_custom_schema.sql

{% macro generate_schema_name(custom_schema_name, node) -%}
    {{ generate_schema_name_for_env(custom_schema_name, node) }}
{%- endmacro %}
```

</File>

**Note:** When using this macro, you'll need to set the target name in your job specifically to "prod" if you want custom schemas to be applied.

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
| [target](target) | Variable | ✅ |
| [env_var](env_var) | Variable | ✅ |
| [var](var) | Variable | Limited, see below |
| [exceptions](exceptions) | Macro | ✅ |
| [log](log) | Macro | ✅ |
| Other macros in your project | Macro | ✅ |
| Other macros in your packages | Macro | ✅ |

#### Which vars are available in generate_schema_name?

<Changelog>

Variable semantics have changed in dbt v0.17.0. See the [migration guide](/guides/migration/versions)
for more information on these changes.

</Changelog>

Globally-scoped variables and variables defined on the command line with
[--vars](/docs/build/project-variables) are accessible in the `generate_schema_name` context.

## Managing environments

In the `generate_schema_name` macro examples shown above, the `target.name` context variable is used to change the schema name that dbt generates for models. If the `generate_schema_name` macro in your project uses the `target.name` context variable, you must additionally ensure that your different dbt environments are configured appropriately. While you can use any naming scheme you'd like, we typically recommend:
 - **dev**: Your local development environment; configured in a `profiles.yml` file on your computer.
* **ci**:  A [continuous integration](/docs/collaborate/git/connect-github) environment running on Pull Requests in GitHub, GitLab, etc.
 - **prod**: The production deployment of your dbt project, like in dbt Cloud, Airflow, or [similar](/docs/deploy/deployments).

If your schema names are being generated incorrectly, double check your target name in the relevant environment.

For more information, consult the [Managing environments](/docs/collaborate/environments) guide.
