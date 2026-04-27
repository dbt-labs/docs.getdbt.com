---
title: "About env_var function"
sidebar_label: "env_var"
id: "env_var"
description: "Incorporate environment variables using `env_var` function."
---

import Envvarsecrets from '/snippets/_env-var-secrets.md';
import EnvFileBeta from '/snippets/_env-file-beta.md';
import EnvFileConsiderations from '/snippets/_env-file-considerations.md';

<Envvarsecrets />

If the `DBT_USER` and `DBT_ENV_SECRET_PASSWORD` environment variables are present when dbt is invoked, dbt will use these variables in your connection configuration &mdash; for example, in `profiles.yml` when running locally, or in [deployment credentials](/docs/deploy/deploy-environments#deployment-credentials) if you have a <Constant name="dbt_platform" /> project. If your project references environment variables that aren't set, dbt will raise a compilation error.


<VersionBlock firstVersion="1.12">

### Using the `.env` file

<EnvFileBeta />

When running dbt locally ([<Constant name="fusion"/> CLI](/docs/local/install-dbt?version=2#get-started), dbt VS Code extension, and <Constant name="core"/> v1.12), dbt automatically loads environment variables from a `.env` file in your current working directory (where you run the dbt command). Shell environment variables take precedence over values in `.env` &mdash; `.env` values will not override variables already set in your shell.

Create a `.env` file (typically at the root of your dbt project) and define variables using `KEY=value` syntax. For example:

<File name='.env'>

```bash
DBT_USER=user
DBT_PASSWORD=password
DBT_SCHEMA=dbt_schema
```

</File>

Reference them in your `profiles.yml` using `env_var()`:

<File name='~/.dbt/profiles.yml'>

```yaml
my_profile:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASSWORD') }}"
      schema: "{{ env_var('DBT_SCHEMA') }}"
      port: 5432
      threads: 4
```

</File>

<EnvFileConsiderations />

</VersionBlock>

### Converting env_vars

Environment variables are always strings. When using them for configurations that expect integers or booleans, you must explicitly convert the value to the correct type.

Use a Jinja filter to convert the string to the correct type:

- **Integers** &mdash; Convert the string to a number using the `int` or [`as_number`](/reference/dbt-jinja-functions/as_number) filter to avoid errors like `'1' is not of type 'integer'`. For example, `"{{ env_var('DBT_THREADS') | int }}"` or `"{{ env_var('DB_PORT') | as_number }}"`.

- **Booleans** &mdash; Convert the string to a boolean explicitly using the [`as_bool`](/reference/dbt-jinja-functions/as_bool) filter. For example, `"{{ env_var('DBT_PERSIST_DOCS_RELATION', False) | as_bool }}"`.

For boolean defaults, use capitalized `True` or `False`. Using lowercase `true` or `false` will be treated as a string and can result in unexpected results.

For example, to disable [`persist_docs`](/reference/resource-configs/persist_docs) using environment variables:

<File name='dbt_project.yml'>

```yml
+persist_docs:
  relation: "{{ env_var('DBT_PERSIST_DOCS_RELATION', False) | as_bool }}"
  columns: "{{ env_var('DBT_PERSIST_DOCS_COLUMNS', False) | as_bool }}"
```
</File>

:::caution Quoting, curly brackets, & you

Be sure to quote the entire Jinja string. Otherwise, the YAML parser will be confused by the Jinja curly brackets.

:::

### Default values

You can also provide a default value as a second argument:

<File name='dbt_project.yml'>

```yaml
...
models:
  jaffle_shop:
    +materialized: "{{ env_var('DBT_MATERIALIZATION', 'view') }}"
```

</File>

 This can be useful to avoid compilation errors when the environment variable isn't available.


### Secrets

For certain configurations, you can use "secret" env vars. Any env var named with the prefix `DBT_ENV_SECRET` will be:
- Available for use in `profiles.yml` + `packages.yml`, via the same `env_var()` function
- Disallowed everywhere else, including `dbt_project.yml` and model SQL, to prevent accidentally writing these secret values to the <Term id="data-warehouse" /> or metadata artifacts
- Scrubbed from dbt logs and replaced with `*****`, any time its value appears in those logs (even if the env var was not called directly)

The primary use case of secret env vars is git access tokens for [private packages](/docs/build/packages#private-packages).

**Note:** When dbt is loading profile credentials and package configuration, secret env vars will be replaced with the string value of the environment variable. You cannot modify secrets using Jinja filters, including type-casting filters such as [`as_number`](/reference/dbt-jinja-functions/as_number) or [`as_bool`](/reference/dbt-jinja-functions/as_bool), or pass them as arguments into other Jinja macros. You can only use _one secret_ per configuration:
```yml
# works
host: "{{ env_var('DBT_ENV_SECRET_HOST') }}"

# does not work
host: "www.{{ env_var('DBT_ENV_SECRET_HOST_DOMAIN') }}.com/{{ env_var('DBT_ENV_SECRET_HOST_PATH') }}"
```

### Custom metadata

Any env var named with the prefix `DBT_ENV_CUSTOM_ENV_` will be included in two places, with its prefix-stripped name as the key:
- [dbt artifacts](/reference/artifacts/dbt-artifacts#common-metadata): `metadata` -> `env`
- [events and structured logs](/reference/events-logging#info-fields): `info` -> `extra`

A dictionary of these prefixed env vars will also be available in a `dbt_metadata_envs` context variable:
```sql
-- {{ dbt_metadata_envs }}

select 1 as id
```
```shell
$ DBT_ENV_CUSTOM_ENV_MY_FAVORITE_COLOR=indigo DBT_ENV_CUSTOM_ENV_MY_FAVORITE_NUMBER=6 dbt compile
```
Compiles to:
```sql
-- {'MY_FAVORITE_COLOR': 'indigo', 'MY_FAVORITE_NUMBER': '6'}

select 1 as id
```

### dbt platform usage

If you're using <Constant name="dbt_platform" />, environment variables must be:
- Prefixed with `DBT_` (including `DBT_ENV_CUSTOM_ENV_` or `DBT_ENV_SECRET`)
- Uppercase
- Case-sensitive

When referencing `{{env_var('DBT_KEY')}}` in your project's code, the key must exactly match the variable defined in the <Constant name="dbt_platform" /> user interface.

