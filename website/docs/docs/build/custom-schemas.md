---
title: "Custom schemas"
id: "custom-schemas"
---

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

When first using custom schemas, it's common to assume that a model will be built in a schema that matches the `schema` configuration exactly, for example, a model that has the configuration `schema: marketing`, would be built in the `marketing` schema. However, dbt instead creates it in a schema like `<target_schema>_marketing` by default – there's a good reason for this!

In a typical setup of dbt, each dbt user will use a separate target schema (see [Managing Environments](/docs/build/custom-schemas#managing-environments)). If dbt created models in a schema that matches a model's custom schema exactly, every dbt user would create models in the same schema.

Further, the schema that your development models are built in would be the same schema that your production models are built in! Instead, concatenating the custom schema to the target schema helps create distinct schema names, reducing naming conflicts.

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

## Advanced custom schema configuration

You can customize schema name generation in dbt depending on your needs, such as creating a custom macro named `generate_schema_name` in your project or using the built-in macro for environment-based schema names. The built-in macro follows a pattern of generating schema names based on the environment, making it a convenient alternative.

If your dbt project has a macro that’s also named `generate_schema_name`, dbt will always use the macro in your dbt project instead of the default macro.

### Changing the way dbt generates a schema name

To modify how dbt generates schema names, you should add a macro named `generate_schema_name` to your project and customize it according to your needs:

- Copy and paste the `generate_schema_name` macro into a file named 'generate_schema_name'.

- Modify the target schema by either using [target variables](/reference/dbt-jinja-functions/target) or [env_var](/reference/dbt-jinja-functions/env_var). Check out our [Advanced Deployment - Custom Environment and job behavior](https://courses.getdbt.com/courses/advanced-deployment) course video for more details. 

**Note**: dbt will ignore any custom `generate_schema_name` macros included in installed packages. 

<details>
<summary>❗️ Warning: Don't replace <code>default_schema</code> in the macro.</summary>

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
</details>

### An alternative pattern for generating schema names

A common way to generate schema names is by adjusting the behavior according to the environment in dbt. Here's how it works:

**Production environment**

- If a custom schema is specified, the schema name of a model should match the custom schema, instead of concatenating to the target schema.
- If no custom schema is specified, the schema name of a model should match the target schema.

**Other environments** (like development or quality assurance (QA)):

- Build _all_ models in the target schema, ignoring any custom schema configurations.

dbt ships with a global, predefined macro that contains this logic - `generate_schema_name_for_env`. 

If you want to use this pattern, you'll need a `generate_schema_name` macro in your project that points to this logic. You can do this by creating a file in your `macros` directory (typically named `get_custom_schema.sql`), and copying/pasting the following code:

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
| [target](/reference/dbt-jinja-functions/target) | Variable | ✅ |
| [env_var](/reference/dbt-jinja-functions/env_var) | Variable | ✅ |
| [var](/reference/dbt-jinja-functions/var) | Variable | Limited, see below |
| [exceptions](/reference/dbt-jinja-functions/exceptions) | Macro | ✅ |
| [log](/reference/dbt-jinja-functions/log) | Macro | ✅ |
| Other macros in your project | Macro | ✅ |
| Other macros in your packages | Macro | ✅ |

### Which vars are available in generate_schema_name?

<Changelog>

Variable semantics have changed in dbt v0.17.0. See the [migration guide](/guides/migration/versions)
for more information on these changes.

</Changelog>

Globally-scoped variables and variables defined on the command line with
[--vars](/docs/build/project-variables) are accessible in the `generate_schema_name` context.

<VersionBlock firstVersion="1.6">

### Managing different behaviors across packages

See docs on macro `dispatch`: ["Managing different global overrides across packages"](/reference/dbt-jinja-functions/dispatch)

</VersionBlock>

## Managing environments

In the `generate_schema_name` macro examples shown above, the `target.name` context variable is used to change the schema name that dbt generates for models. If the `generate_schema_name` macro in your project uses the `target.name` context variable, you must additionally ensure that your different dbt environments are configured appropriately. While you can use any naming scheme you'd like, we typically recommend:
 - **dev**: Your local development environment; configured in a `profiles.yml` file on your computer.
* **ci**:  A [continuous integration](/docs/cloud/git/connect-github) environment running on Pull Requests in GitHub, GitLab, etc.
 - **prod**: The production deployment of your dbt project, like in dbt Cloud, Airflow, or [similar](/docs/deploy/deployments).

If your schema names are being generated incorrectly, double check your target name in the relevant environment.

For more information, consult the [managing environments in dbt Core](/docs/core/dbt-core-environments) guide.
