---
title: "dbt environments"
id: "dbt-core-environments"
pagination_next: "docs/running-a-dbt-project/run-your-dbt-projects"
availability: local_free
---

dbt makes it easy to maintain separate production and development environments through the use of [targets](/reference/dbt-jinja-functions/target.md) within a [profile](/docs/local/profiles.yml). A typical profile, when using dbt locally (for example, running from your command line), will have a target named `dev` and have this set as the default. This means that while making changes, your objects will be built in your _development_ target without affecting production queries made by your end users. Once you are confident in your changes, you can deploy the code to _production_, by running your dbt project with a _prod_ target.

:::info Running dbt in production

You can learn more about different ways to run dbt in production in [this article](/docs/deploy/deployments).

:::

Targets offer the flexibility to decide how to implement your separate environments – whether you want to use separate schemas, databases, or entirely different clusters altogether! We recommend using _different schemas within one database_ to separate your environments. This is the easiest to set up and is the most cost-effective solution in a modern cloud-based data stack.

In practice, this means that most of the details in a target will be consistent across all targets, except for the `schema` and user credentials. If you have multiple dbt users writing code, it often makes sense for _each user_ to have their own _development_ environment. A pattern we've found useful is to set your dev target schema to be `dbt_<username>`. User credentials should also differ across targets so that each dbt user is using their own data warehouse user.

## Configure a target for each environment

Define one target per environment inside the same profile, then pick between them with the `--target` flag. The following profile shares a single connection and varies only the schema, the credentials, and the thread count:

<File name='~/.dbt/profiles.yml'>

```yaml
jaffle_shop:
  target: dev  # the target dbt uses when you don't pass --target
  outputs:
    dev:
      type: snowflake
      account: abc123
      database: analytics
      warehouse: transforming
      schema: "{{ env_var('DBT_DEV_SCHEMA') }}"  # for example, dbt_alice
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_ENV_SECRET_PASSWORD') }}"
      threads: 4
    ci:
      type: snowflake
      account: abc123
      database: analytics
      warehouse: transforming
      schema: "{{ env_var('DBT_CI_SCHEMA') }}"  # for example, ci_pr_142
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_ENV_SECRET_PASSWORD') }}"
      threads: 8
    prod:
      type: snowflake
      account: abc123
      database: analytics
      warehouse: transforming
      schema: analytics
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_ENV_SECRET_PASSWORD') }}"
      threads: 16
```

</File>

Select a target by name when you run dbt:

```bash
dbt run                # uses the default target, dev
dbt build --target ci
dbt run --target prod
```

## Set environment variables for each environment

Because the targets differ by only a few values, supply those values with the [`env_var`](/reference/dbt-jinja-functions/env_var) function instead of hardcoding them. One `profiles.yml` file then works for every developer and every deployment.

- **Development** &mdash; Each developer sets `DBT_DEV_SCHEMA` to their own schema, such as `dbt_alice`, so that no two developers build into the same relations.
- **Continuous integration** &mdash; Set `DBT_CI_SCHEMA` to a value that is unique per run, such as one derived from the pull request number, so that concurrent CI runs don't overwrite each other. Drop the schema when the pull request closes.
- **Production** &mdash; Store production credentials as secrets in whichever tool runs dbt on a schedule. Prefix any variable holding a credential with `DBT_ENV_SECRET_` so that dbt scrubs the value from logs.

dbt combines your target schema with a model's custom schema when it generates the final schema name, so confirm how your project generates schema names before you rely on this pattern. Refer to [how does dbt generate a model's schema name](/docs/build/custom-schemas#how-does-dbt-generate-a-models-schema-name).

## Related docs

- [Connection profiles](/docs/local/profiles.yml) to learn how dbt resolves `profiles.yml`
- [Custom schemas](/docs/build/custom-schemas) to learn how dbt builds schema names
- [About the `env_var` function](/reference/dbt-jinja-functions/env_var) to learn how to reference environment variables
- [Get started with continuous integration tests](/guides/set-up-ci) to learn how to run dbt against a CI environment
