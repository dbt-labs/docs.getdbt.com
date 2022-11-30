---
title: "env_var"
id: "env_var"
---

The `env_var` function can be used to incorporate Environment Variables from the system into your dbt project. This `env_var` function can be used in your `profiles.yml` file, the `dbt_project.yml` file, the `sources.yml` file, your `schema.yml` files, and in model `.sql` files. Essentially `env_var` is available anywhere dbt processes jinja code.

When used in a `profiles.yml` file (to avoid putting credentials on a server), it can be used like this:

<File name='profiles.yml'>

```yaml
profile:
  target: prod
  outputs:
    prod:
      type: postgres
      host: 127.0.0.1
      # IMPORTANT: Make sure to quote the entire Jinja string here
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASSWORD') }}"
      ....
```

</File>

If the `DBT_USER` and `DBT_PASSWORD` environment variables are present when dbt is invoked, then these variables will be pulled into the profile as expected. If any environment variables are not set, then dbt will raise a compilation error.

:::info Integer Environment Variables
If passing an environment variable for a property that uses an integer type (for example, `port`, `threads`), be sure to add a filter to the Jinja expression, as shown here. Otherwise, dbt will raise an `['threads']: '1' is not of type 'integer'` error.
`{{ env_var('DBT_THREADS') | int }}` or `{{ env_var('DB_PORT') | as_number }}` 

:::

:::caution Quoting, Curly Brackets, & You

Be sure to quote the entire jinja string (as shown above), or else the yaml parser will be confused by the Jinja curly brackets.

:::

`env_var` accepts a second, optional argument for default value, like so:

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

<Changelog>

  - **v0.21.0:** Introduced `DBT_ENV_SECRET_` and log scrubbing
  - **v1.0.0:** Restricted use of secret env vars to `profiles.yml` and `packages.yml`

</Changelog>

For certain configurations, you can use "secret" env vars. Any env var named with the prefix `DBT_ENV_SECRET_` will be:
- Available for use in `profiles.yml` + `packages.yml`, via the same `env_var()` function
- Disallowed everywhere else, including `dbt_project.yml` and model SQL, to prevent accidentally writing these secret values to the <Term id="data-warehouse" /> or metadata artifacts
- Scrubbed from dbt logs and replaced with `*****`, any time its value appears in those logs (even if the env var was not called directly)

The primary use case of secret env vars is git access tokens for [private packages](/docs/build/packages#private-packages).

**Note:** When dbt is loading profile credentials and package configuration, secret env vars will be replaced with the string value of the environment variable. You cannot modify secrets using Jinja filters, including type-casting filters such as [`as_number`](as_number) or [`as_bool`](as_bool), or pass them as arguments into other Jinja macros.

### Custom metadata

<Changelog>

  - **v0.19.0:** Introduced `DBT_ENV_CUSTOM_ENV_` prefix and artifact `metadata.env`

</Changelog>

Any env var named with the prefix `DBT_ENV_CUSTOM_ENV_` will be included in [dbt artifacts](dbt-artifacts#common-metadata), in a `metadata.env` dictionary, with its prefix-stripped name as its key.

<VersionBlock firstVersion="1.3">

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
-- {'MY_FAVORITE_COLOR': 'indigo', 'DBT_ENV_CUSTOM_ENV_MY_FAVORITE_NUMBER': '6'}

select 1 as id
```

</VersionBlock>

:::info dbt Cloud Usage
If you are using dbt Cloud, you must adhere to the naming conventions for environment variables. Environment variables in dbt Cloud must be prefixed with `DBT_` (including `DBT_ENV_CUSTOM_ENV_` or `DBT_ENV_SECRET_`). Environment variables keys are uppercased and case sensitive. When referencing `{{env_var('DBT_KEY')}}` in your project's code, the key must match exactly the variable defined in dbt Cloud's UI.
:::
