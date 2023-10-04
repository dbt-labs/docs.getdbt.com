---
title: "About environments"
id: "environments-in-dbt"
hide_table_of_contents: true
---

In software engineering, environments are used to enable engineers to develop and test code without impacting the users of their software. Typically, there are two types of environments in dbt:

- **Deployment or Production** (or _prod_) &mdash; Refers to the environment that end users interact with. 

- **Development** (or _dev_) &mdash; Refers to the environment that engineers work in. This means that engineers can work iteratively when writing and testing new code in _development_. Once they are confident in these changes, they can deploy their code to _production_.

In traditional software engineering, different environments often use completely separate architecture. For example, the dev and prod versions of a website may use different servers and databases. <Term id="data-warehouse">Data warehouses</Term> can also be designed to have separate environments &mdash; the _production_ environment refers to the relations (for example, schemas, tables, and <Term id="view">views</Term>) that your end users query (often through a BI tool).

Configure environments to tell dbt Cloud or dbt Core how to build and execute your project in development and production:

<div className="grid--2-col">

<Card
    title="Environments in dbt Cloud"
    body="Seamlessly configure development and deployment environments in dbt Cloud to control how your project runs in both the dbt Cloud IDE, dbt Cloud CLI, and dbt jobs."
    link="/docs/dbt-cloud-environments"
    icon="dbt-bit"/>

<Card
    title="Environments in dbt Core"
    body="Setup and maintain separate deployment and development environments through the use of targets within a profile file"
    link="/docs/core/dbt-core-environments"
    icon="command-line"/>

</div> <br />

## Related docs

- [dbt Cloud environment best practices](https://docs.getdbt.com/guides/best-practices/environment-setup/1-env-guide-overview)
- [Deployment environments](/docs/deploy/deploy-environments)
- [About dbt Core versions](/docs/dbt-versions/core)
- [Set Environment variables in dbt Cloud](/docs/build/environment-variables#special-environment-variables)
- [Use Environment variables in jinja](/reference/dbt-jinja-functions/env_var)
