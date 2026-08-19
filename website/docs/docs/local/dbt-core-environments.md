---
title: "dbt environments"
id: "dbt-core-environments"
description: "Learn how to set up and maintain separate development, CI, and production environments in your local dbt installation using targets and environment variables."
pagination_next: "docs/running-a-dbt-project/run-your-dbt-projects"
availability: local_free
---

dbt makes it easy to maintain separate development, CI, and production environments through the use of [targets](/reference/dbt-jinja-functions/target) within a [profile](/docs/local/profiles.yml). A typical profile will have a `dev` target set as the default so that, while making changes, your objects are built in your development environment without affecting production queries made by end users. Once you are confident in your changes, you can deploy the code to production by running your dbt project with a `prod` target.

:::info Running dbt in production

Learn more about different approaches to running dbt in production in [this guide](/docs/deploy/deployments).

:::

## Separation strategies

Targets give you flexibility in _how_ to separate your environments. The three main approaches are:

import EnvironmentSeparation from '/snippets/_environment-separation.md';

<EnvironmentSeparation />

We recommend _separate schemas within one database_ for most teams. It is the easiest to set up and the most cost-effective solution on modern cloud data warehouses.

## Setting up schemas per developer

When multiple developers use dbt, each person should write to their own development schema so they don't overwrite each other's work. A pattern that works well is naming your dev target schema `dbt_<username>`:

<File name='~/.dbt/profiles.yml'>

```yaml
my_project:
  target: dev
  outputs:
    dev:
      type: postgres  # replace with your adapter
      host: localhost
      user: "{{ env_var('DBT_DEV_USER') }}"
      password: "{{ env_var('DBT_DEV_PASSWORD') }}"
      port: 5432
      dbname: analytics
      schema: "dbt_{{ env_var('DBT_USERNAME') }}"  # e.g. dbt_alice, dbt_bob
      threads: 4

    prod:
      type: postgres
      host: prod-warehouse.example.com
      user: "{{ env_var('DBT_PROD_USER') }}"
      password: "{{ env_var('DBT_PROD_PASSWORD') }}"
      port: 5432
      dbname: analytics
      schema: analytics
      threads: 8
```

</File>

:::tip Credentials in profiles.yml

Use [env_var()](/reference/dbt-jinja-functions/env_var) for sensitive values like passwords and usernames — keep them out of version control. See [using environment variables in profiles.yml](#using-environment-variables-in-profilesyml) below.

:::

There is no need to create your target schema ahead of time — dbt checks whether it exists at run time and creates it if it doesn't.

### Setting your local environment variables

Each developer needs to export the variables that their `profiles.yml` references. Add these to your shell profile (for example, `~/.zshrc`, `~/.bashrc`, or `~/.bash_profile`) so they are set automatically:

<Tabs>
<TabItem value="mac-linux" label="macOS / Linux">

```bash
# ~/.zshrc or ~/.bashrc
export DBT_USERNAME="alice"
export DBT_DEV_USER="alice"
export DBT_DEV_PASSWORD="my_dev_password"
```

After editing, reload your shell:

```bash
source ~/.zshrc
```

</TabItem>
<TabItem value="windows" label="Windows">

```powershell
# In PowerShell, set for current user permanently:
[System.Environment]::SetEnvironmentVariable("DBT_USERNAME", "alice", "User")
[System.Environment]::SetEnvironmentVariable("DBT_DEV_USER", "alice", "User")
[System.Environment]::SetEnvironmentVariable("DBT_DEV_PASSWORD", "my_dev_password", "User")
```

Or use **System Properties → Environment Variables** in the Windows UI.

</TabItem>
</Tabs>

Verify the variables are set:

```bash
echo $DBT_USERNAME
# alice
```

## Using environment variables in profiles.yml

Any field in `profiles.yml` can reference an environment variable using the `{{ env_var('VAR_NAME') }}` Jinja function. You can also supply a default value as the second argument to avoid compilation errors in environments where a variable isn't set:

```yaml
schema: "dbt_{{ env_var('DBT_USERNAME', 'default') }}"
```

This approach follows the [twelve-factor app methodology](https://12factor.net/config) — credentials and environment-specific values live in the environment, not in code.

For more, see the [env_var reference](/reference/dbt-jinja-functions/env_var).

## Setting up a CI environment

In a CI pipeline (such as GitHub Actions, GitLab CI, or CircleCI), set environment variables at the pipeline level so that dbt can connect to your warehouse and build into an isolated schema.

A recommended CI schema naming pattern is `dbt_cloud_pr_<PR_NUMBER>` or simply `ci` — this prevents CI runs from writing over production or development schemas.

<Tabs>
<TabItem value="github-actions" label="GitHub Actions">

```yaml
# .github/workflows/dbt-ci.yml
name: dbt CI

on:
  pull_request:

jobs:
  dbt-check:
    runs-on: ubuntu-latest
    env:
      DBT_USERNAME: ci
      DBT_DEV_USER: ${{ secrets.DBT_PROD_USER }}
      DBT_DEV_PASSWORD: ${{ secrets.DBT_PROD_PASSWORD }}

    steps:
      - uses: actions/checkout@v3

      - name: Install dbt
        run: pip install dbt-postgres  # replace with your adapter

      - name: Run dbt
        run: dbt build --target dev --profiles-dir .
```

</TabItem>
<TabItem value="gitlab-ci" label="GitLab CI">

```yaml
# .gitlab-ci.yml
dbt-check:
  stage: test
  image: python:3.11
  variables:
    DBT_USERNAME: "ci"
    DBT_DEV_USER: $DBT_PROD_USER   # set as CI/CD variable in GitLab UI
    DBT_DEV_PASSWORD: $DBT_PROD_PASSWORD
  script:
    - pip install dbt-postgres  # replace with your adapter
    - dbt build --target dev --profiles-dir .
  only:
    - merge_requests
```

</TabItem>
</Tabs>

Store secrets (passwords, tokens) in your CI platform's secret store — GitHub Actions Secrets, GitLab CI/CD Variables, etc. — rather than in your repository.

## Separating environments at the database or account level

Sometimes schema-level separation is insufficient. For example:

- Your warehouse enforces different network policies per account.
- Compliance requirements prevent dev and prod data from sharing an account.
- You want to use a lower-spec warehouse tier for development.

To target a different database, update the `dbname` (Postgres/Redshift) or `database` (Snowflake/BigQuery) field per target in your profile:

```yaml
my_project:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      database: analytics_dev       # separate database for dev
      schema: "dbt_{{ env_var('DBT_USERNAME') }}"
      warehouse: dev_warehouse
      ...

    prod:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      database: analytics           # production database
      schema: analytics
      warehouse: prod_warehouse
      ...
```

To target a different account or cluster entirely, change the `account` (Snowflake), `host` (Postgres/Redshift), or `project` (BigQuery) value per target:

```yaml
my_project:
  target: dev
  outputs:
    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_DEV_ACCOUNT') }}"   # separate dev account
      ...

    prod:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_PROD_ACCOUNT') }}"  # production account
      ...
```

## How dbt names schemas across environments

By default, dbt builds all models into the schema defined in `target.schema`. When you use [custom schemas](/docs/build/custom-schemas) (for example, `+schema: marketing`), dbt appends the custom schema to the target schema: `<target_schema>_<custom_schema>`.

This means:

| Environment | target.schema | Custom schema config | Resulting schema |
|---|---|---|---|
| Dev (alice) | `dbt_alice` | none | `dbt_alice` |
| Dev (alice) | `dbt_alice` | `marketing` | `dbt_alice_marketing` |
| Prod | `analytics` | none | `analytics` |
| Prod | `analytics` | `marketing` | `analytics_marketing` |

The target schema prefix ensures that no two environments write to the same location, even when custom schemas are in use.

For advanced patterns — such as using the raw custom schema in production while using only the target schema in dev and CI — refer to [Custom schemas](/docs/build/custom-schemas#a-built-in-alternative-pattern-for-generating-schema-names).

## Related docs

- [About profiles.yml](/docs/local/profiles.yml)
- [Custom schemas](/docs/build/custom-schemas)
- [Custom databases](/docs/build/custom-databases)
- [env_var Jinja function](/reference/dbt-jinja-functions/env_var)
- [dbt environment best practices](/guides/set-up-ci)
- [Running dbt in production](/docs/deploy/deployments)
- [Deployment environments](/docs/deploy/deploy-environments)
