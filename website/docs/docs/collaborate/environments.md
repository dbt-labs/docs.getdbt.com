---
title: "Environments"
id: "environments"
---

## What are environments?
In software engineering, environments are used to enable engineers to develop and test code without impacting the users of their software.

“Production” (or _prod_) refers to the environment that end users interact with, while “development” (or _dev_) is the environment that engineers write code in. This means that engineers can work iteratively when writing and testing new code in _development_, and once they are confident in these changes, deploy their code to _production_.

In traditional software engineering, different environments often use completely separate architecture. For example, the dev and prod versions of a website may use different servers and databases.

<Term id="data-warehouse">Data warehouses</Term> can also be designed to have separate environments – the _production_ environment refers to the relations (i.e. schemas, tables, and <Term id="view">views</Term>) that your end users query (often through a BI tool).

## How do I maintain different environments with dbt?
dbt makes it easy to maintain separate production and development environments through the use of targets within a profile. A typical profile when using dbt locally (i.e. running from your command line) will have a target named `dev`, and have this set as the default. This means that while making changes, your objects will be built in your _development_ target, without affecting production queries made by your end users. Once you are confident in your changes, you can deploy the code to _production_, by running your dbt project with a _prod_ target.

:::info Running dbt in production

You can learn more about different ways to run dbt in production in [this article](/docs/deploy/deployments).

:::

Targets offer the flexibility to decide how to implement your separate environments – whether you want to use separate schemas, databases, or entirely different clusters altogether! We recommend using _different schemas within one data warehouse_ to separate your environments. This is the easiest to set up, and is the most cost effective solution in a modern cloud-based data stack.

In practice, this means that most of the details in a target will be consistent across all targets, except for the `schema` and user credentials. If you have multiple dbt users writing code, it often makes sense for _each user_ to have their own _development_ environment. A pattern we've found useful is to set your dev target schema to be `dbt_<username>`. User credentials should also differ across targets so that each dbt user is using their own data warehouse user.

## Related docs
- [About dbt Core versions](/docs/dbt-versions/core)
- [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-core-in-cloud)
