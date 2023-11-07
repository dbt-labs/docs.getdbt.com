---
title: Set up your dbt project with Databricks
id: set-up-your-databricks-dbt-project
description: "Learn more about setting up your dbt project with Databricks"
displayText: Setting up your dbt project with Databricks
hoverSnippet: Learn how to set up your dbt project with Databricks.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt Cloud']
level: 'Intermediate'
recently_updated: true
---

## Introduction

Databricks and dbt Labs are partnering to help data teams think like software engineering teams and ship trusted data, faster. The dbt-databricks adapter enables dbt users to leverage the latest Databricks features in their dbt project. Hundreds of customers are now using dbt and Databricks to build expressive and reliable data pipelines on the Lakehouse, generating data assets that enable analytics, ML, and AI use cases throughout the business.

In this guide, we discuss how to set up your dbt project on the Databricks Lakehouse Platform so that it scales from a small team all the way up to a large organization.

## Configuring the Databricks Environments

To get started, we will use Databricks’s Unity Catalog. Without it, we would not be able to design separate [environments](https://docs.getdbt.com/docs/collaborate/environments) for development and production per our [best practices](https://docs.getdbt.com/best-practices/how-we-structure/1-guide-overview). It also allows us to ensure the proper access controls have been applied using SQL. You will need to be using the dbt-databricks adapter to use it (as opposed to the dbt-spark adapter).

We will set up two different *catalogs* in Unity Catalog: **dev** and **prod**. A catalog is a top-level container for *schemas* (previously known as databases in Databricks), which in turn contain tables and views.

Our dev catalog will be the development environment that analytics engineers interact with through their IDE. Developers should have their own sandbox to build and test objects in without worry of overwriting or dropping a coworker’s work; we recommend creating personal schemas for this purpose. In terms of permissions, they should only have access to the **dev** catalog.

Only production runs will have access to data in the **prod** catalog. In a future guide, we will discuss a **test** catalog where our continuous integration/continuous deployment (CI/CD) system can run `dbt test`.

For now, let’s keep things simple and [create two catalogs](https://docs.databricks.com/sql/language-manual/sql-ref-syntax-ddl-create-catalog.html)  either using the Data Explorer or in the SQL editor with these commands:

```sql
create catalog if not exists dev;
create catalog if not exists prod;
```

As long as your developer is given write access to the dev data catalog, there is no need to create the sandbox schemas ahead of time.

## Setting up Service Principals

When an analytics engineer runs a dbt project from their IDE, it is perfectly fine for the resulting queries to execute with that user’s identity. However, we want production runs to execute with a *service principal's* identity. As a reminder, a service principal is a headless account that does not belong to an actual person.

Service principals are used to remove humans from deploying to production for convenience and security. Personal identities should not be used to build production pipelines because they could break if the user leaves the company or changes their credentials. Also, there should not be ad hoc commands modifying production data. Only scheduled jobs and running code that has passed CI tests and code reviews should be allowed to modify production data. If something breaks, there is an auditable trail of changes to find the root cause, easily revert to the last working version of the code, and minimize the impact on end users.

[Let’s create a service principal](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-your-databricks-account) in Databricks:

1. Have your Databricks Account admin [add a service principal](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-your-databricks-account) to your account. The service principal’s name should differentiate itself from a user ID and make its purpose clear (eg dbt_prod_sp).
2. Add the service principal added to any groups it needs to be a member of at this time. There are more details on permissions in our ["Unity Catalog best practices" guide](dbt-unity-catalog-best-practices).
3. [Add the service principal to your workspace](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-a-workspace) and apply any [necessary entitlements](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#add-a-service-principal-to-a-workspace-using-the-admin-console), such as Databricks SQL access and Workspace access.

## Setting up Databricks Compute

When you run a dbt project, it generates SQL, which can run on All Purpose Clusters or SQL warehouses. We strongly recommend running dbt-generated SQL on a Databricks SQL warehouse. Since SQL warehouses are optimized for executing SQL queries, you can save on the cost with lower uptime needed for the cluster to run the queries. If you need to debug, you will also have access to a Query Profile. We recommend using a serverless cluster if you want to minimize the time spent on spinning up a cluster and removing the need to change cluster sizes depending on workflows.

Let’s [create a Databricks SQL warehouse](https://docs.databricks.com/sql/admin/sql-endpoints.html#create-a-sql-warehouse):

1. Click **SQL Warehouses** in the sidebar.
2. Click *Create SQL Warehouse*.
3. Enter a name for the warehouse.
4. Accept the default warehouse settings or edit them.
5. Click *Create*
6. Configure warehouse permissions to ensure our service principal and developer have the right access.

We are not covering python in this post but if you want to learn more, check out these [docs](https://docs.getdbt.com/docs/build/python-models#specific-data-platforms). Depending on your workload, you may wish to create a larger SQL Warehouse for production workflows while having a smaller development SQL Warehouse (if you’re not using Serverless SQL Warehouses).

## Configure your dbt project

Now that the Databricks components are in place, we can configure our dbt project. This involves connecting dbt to our Databricks SQL warehouse to run SQL queries and using a version control system like GitHub to store our transformation code.

If you are migrating an existing dbt project from the dbt-spark adapter to dbt-databricks, follow this [migration guide](https://docs.getdbt.com/guides/migration/tools/migrating-from-spark-to-databricks#migration) to switch adapters without needing to update developer credentials and other existing configs.

If you’re starting a new dbt project, follow the steps below. For a more detailed setup flow, check out our [quickstart guide.](/guides/databricks)

### Connect dbt to Databricks

First, you’ll need to connect your dbt project to Databricks so it can send transformation instructions and build objects in Unity Catalog. Follow the instructions for [dbt Cloud](/guides/databricks?step=4) or [Core](https://docs.getdbt.com/reference/warehouse-setups/databricks-setup) to configure your project’s connection credentials.

Each developer must generate their Databricks PAT and use the token in their development credentials. They will also specify a unique developer schema that will store the tables and views generated by dbt runs executed from their IDE. This provides isolated developer environments and ensures data access is fit for purpose.

Let’s generate a [Databricks personal access token (PAT)](https://docs.databricks.com/sql/user/security/personal-access-tokens.html) for Development:

1. In Databricks, click on your Databricks username in the top bar and select User Settings in the drop down.
2. On the Access token tab, click Generate new token.
3. Click Generate.
4. Copy the displayed token and click Done. (don’t lose it!)


For your development credentials/profiles.yml:

1. Set your default catalog to dev.
2. Your developer schema should be named after yourself. We recommend dbt_<first_name_initial><last_name>.

During your first invocation of `dbt run`, dbt will create the developer schema if it doesn't already exist in the dev catalog.

## Defining your dbt deployment environment

We need to give dbt a way to deploy code outside of development environments. To do so, we’ll use dbt [environments](https://docs.getdbt.com/docs/collaborate/environments) to define the production targets that end users will interact with.

Core projects can use [targets in profiles](https://docs.getdbt.com/docs/core/connection-profiles#understanding-targets-in-profiles) to separate environments. [dbt Cloud environments](https://docs.getdbt.com/docs/cloud/develop-in-the-cloud#set-up-and-access-the-cloud-ide) allow you to define environments via the UI and [schedule jobs](/guides/databricks#create-and-run-a-job) for specific environments.

Let’s set up our deployment environment:

1. Follow the Databricks instructions to [set up your service principal’s token](https://docs.databricks.com/dev-tools/service-principals.html#use-curl-or-postman). Note that the `lifetime_seconds` will define how long this credential stays valid. You should use a large number here to avoid regenerating tokens frequently and production job failures.
2. Now let’s pop back over to dbt Cloud to fill out the environment fields. Click on environments in the dbt Cloud UI or define a new target in your profiles.yml.
3. Set the Production environment’s *catalog* to the **prod** catalog created above. Provide the [service token](https://docs.databricks.com/administration-guide/users-groups/service-principals.html#manage-access-tokens-for-a-service-principal) for your **prod** service principal and set that as the *token* in your production environment’s deployment credentials.
4. Set the schema to the default for your prod environment. This can be overridden by [custom schemas](https://docs.getdbt.com/docs/build/custom-schemas#what-is-a-custom-schema) if you need to use more than one.
5. Provide your Service Principal token.

## Connect dbt to your git repository

Next, you’ll need somewhere to store and version control your code that allows you to collaborate with teammates. Connect your dbt project to a git repository with [dbt Cloud](/guides/databricks#set-up-a-dbt-cloud-managed-repository). [Core](/guides/manual-install#create-a-repository) projects will use the git CLI.

### Next steps

Now that your project is configured, you can start transforming your Databricks data with dbt. To help you scale efficiently, we recommend you follow our best practices, starting with the [Unity Catalog best practices](/best-practices/dbt-unity-catalog-best-practices), then you can [Optimize dbt models on Databricks](/guides/how_to_optimize_dbt_models_on_databricks) .
