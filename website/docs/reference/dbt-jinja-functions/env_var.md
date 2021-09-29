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

### Special env var prefixes

<Changelog>

  - **v0.19.0:** Introduced `DBT_ENV_CUSTOM_ENV_` prefix and artifact `metadata.env`
  - **v0.21.0:** Introduced `DBT_ENV_SECRET_` and log scrubbing

</Changelog>

If environment variables are named with one of two prefixes, it will have special behavior in dbt:
- `DBT_ENV_CUSTOM_ENV_`: Any env var named with this prefix will be included in [dbt artifacts](dbt-artifacts#common-metadata), in a `metadata.env` dictionary, with its prefix-stripped name as its key.
- `DBT_ENV_SECRET_`: Any env var named with this prefix will be scrubbed from dbt logs and replaced with `*****`, any time its value appears in those logs (even if the env var was not called directly). While dbt already avoids logging database credentials, this is useful for other types of secrets, such as git tokens for [private packages](package-management#private-packages), or AWS keys for querying data in S3.
