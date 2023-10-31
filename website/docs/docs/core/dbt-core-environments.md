---
title: "dbt Core environments"
id: "dbt-core-environments"
pagination_next: "docs/running-a-dbt-project/run-your-dbt-projects"
---

dbt makes it easy to maintain separate production and development environments through the use of [targets](/reference/dbt-jinja-functions/target.md) within a [profile](/docs/core/connect-data-platform/profiles.yml). A typical profile, when using dbt locally (for example, running from your command line), will have a target named `dev` and have this set as the default. This means that while making changes, your objects will be built in your _development_ target without affecting production queries made by your end users. Once you are confident in your changes, you can deploy the code to _production_, by running your dbt project with a _prod_ target.

:::info Running dbt in production

You can learn more about different ways to run dbt in production in [this article](/docs/deploy/deployments).

:::

Targets offer the flexibility to decide how to implement your separate environments – whether you want to use separate schemas, databases, or entirely different clusters altogether! We recommend using _different schemas within one database_ to separate your environments. This is the easiest to set up and is the most cost-effective solution in a modern cloud-based data stack.

In practice, this means that most of the details in a target will be consistent across all targets, except for the `schema` and user credentials. If you have multiple dbt users writing code, it often makes sense for _each user_ to have their own _development_ environment. A pattern we've found useful is to set your dev target schema to be `dbt_<username>`. User credentials should also differ across targets so that each dbt user is using their own data warehouse user.
