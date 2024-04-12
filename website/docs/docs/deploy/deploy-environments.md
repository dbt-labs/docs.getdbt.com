---
title: "Deployment environments"
id: "deploy-environments"
description: "Learn about dbt Cloud's deployment environment to seamlessly schedule jobs or enable CI."
---

Deployment environments in dbt Cloud are crucial for deploying dbt jobs in production and using features or integrations that depend on dbt metadata or results. To execute dbt, environments determine the settings used during job runs, including:

- The version of dbt Core that will be used to run your project
- The warehouse connection information (including the target database/schema settings)
- The version of your code to execute

A dbt Cloud project can have multiple deployment environments, providing you the flexibility and customization to tailor the execution of dbt jobs. You can use deployment environments to [create and schedule jobs](/docs/deploy/deploy-jobs#create-and-schedule-jobs), [enable continuous integration](/docs/deploy/continuous-integration), or more based on your specific needs or requirements.

:::tip Learn how to manage dbt Cloud environments
To learn different approaches to managing dbt Cloud environments and recommendations for your organization's unique needs, read [dbt Cloud environment best practices](/guides/set-up-ci).
::: 
 
Learn more about development vs. deployment environments in [dbt Cloud Environments](/docs/dbt-cloud-environments).

There are three types of deployment environments that serve different needs:
- **Production**: Environment for transforming data and building pipelines for production use.
- **Staging**<Lifecycle status='beta' />: Environment for working with production tools while limiting access to production data.
- **General**: General use environment for deployment development. 

We highly recommend using the `Production` environment type for the final, source of truth deployment data. There can be only one environment marked for final production workflows and we don't recommend using a `General` environment for this purpose. 

## Create a deployment environment

To create a new dbt Cloud deployment environment, navigate to **Deploy** -> **Environments** and then click **Create Environment**. Select **Deployment** as the environment type. The option will be greyed out if you already have a development environment.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/create-deploy-env.jpg" width="85%" title="Navigate to Deploy ->  Environments to create a deployment environment" />

### Set as production environment

In dbt Cloud, each project can have one designated deployment environment, which serves as its production environment. This production environment is _essential_ for using features like dbt Explorer and cross-project references. It acts as the source of truth for the project's production state in dbt Cloud.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/prod-settings.jpg" width="70%" title="Set your production environment as the default environment in your Environment Settings"/>

### Semantic Layer

For Semantic Layer-eligible customers, the next section of environment settings is the Semantic Layer configurations. [The Semantic Layer setup guide](/docs/use-dbt-semantic-layer/setup-sl) has the most up-to-date setup instructions!


## Deployment connection

:::info Warehouse Connections

 Warehouse connections are set at the Project level for dbt Cloud accounts, and each Project can have one connection (Snowflake account, Redshift host, Bigquery project, Databricks host, etc.). Some details of that connection (databases/schemas/etc.) can be overridden within this section of the dbt Cloud environment settings.

:::

This section determines the exact location in your warehouse dbt should target when building warehouse objects! This section will look a bit different depending on your warehouse provider.

For all warehouses, use [extended attributes](/docs/deploy/deploy-environments#extended-attributes) to override missing or inactive (grayed-out) settings.

<WHCode>


<div warehouse="Postgres">

This section will not appear if you are using Postgres, as all values are inferred from the project's connection. Use [extended attributes](/docs/deploy/deploy-environments#extended-attributes) to override these values.

</div>

<div warehouse="Redshift">

This section will not appear if you are using Redshift, as all values are inferred from the project's connection. Use [extended attributes](/docs/deploy/deploy-environments#extended-attributes) to override these values.

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-connection.png" width="85%" title="Snowflake Deployment Connection Settings"/>

#### Editable fields

- **Role**: Snowflake role
- **Database**: Target database
- **Warehouse**: Snowflake warehouse

</div>

<div warehouse="Bigquery">

This section will not appear if you are using Bigquery, as all values are inferred from the project's connection. Use [extended attributes](/docs/deploy/deploy-environments#extended-attributes) to override these values.

</div>

<div warehouse="Spark">

This section will not appear if you are using Spark, as all values are inferred from the project's connection. Use [extended attributes](/docs/deploy/deploy-environments#extended-attributes) to override these values.

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/databricks-deploy-env-deploy-connection.png" width="85%" title="Databricks Deployment Connection Settings"/>

#### Editable fields

- **Catalog** (optional): [Unity Catalog namespace](/docs/core/connect-data-platform/databricks-setup)

</div>

</WHCode>


### Deployment credentials

This section allows you to determine the credentials that should be used when connecting to your warehouse. The authentication methods may differ depending on the warehouse and dbt Cloud tier you are on.

<WHCode>

<div warehouse="Postgres">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" width="85%" title="Postgres Deployment Credentials Settings"/>

#### Editable fields

- **Username**: Postgres username to use (most likely a service account)
- **Password**: Postgres password for the listed user
- **Schema**: Target schema

</div>

<div warehouse="Redshift">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" width="85%" title="Redshift Deployment Credentials Settings"/>

#### Editable fields

- **Username**: Redshift username to use (most likely a service account)
- **Password**: Redshift password for the listed user
- **Schema**: Target schema

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-credentials.png" width="85%" title="Snowflake Deployment Credentials Settings"/>

#### Editable fields

- **Auth Method**: This determines the way dbt connects to your warehouse
  - One of: [**Username & Password**, **Key Pair**]
- If **Username & Password**:
  - **Username**: username to use (most likely a service account)
  - **Password**: password for the listed user
- If **Key Pair**:
  - **Username**: username to use (most likely a service account)
  - **Private Key**: value of the Private SSH Key (optional)
  - **Private Key Passphrase**: value of the Private SSH Key Passphrase (optional, only if required)
- **Schema**: Target Schema for this environment

</div>

<div warehouse="Bigquery">

<Lightbox src="/img/docs/collaborate/bigquery-deploy-env-deploy-credentials.png" width="85%" title="Bigquery Deployment Credentials Settings"/>

#### Editable fields

- **Dataset**: Target dataset

</div>

<div warehouse="Spark">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" width="85%" title="Spark Deployment Credentials Settings"/>

#### Editable fields

- **Token**: Access token
- **Schema**: Target schema

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" width="85%" title="Databricks Deployment Credentials Settings"/>

#### Editable fields

- **Token**: Access token
- **Schema**: Target schema

</div>

</WHCode>


## Staging environment <Lifecycle status='beta' />

:::note
Currently in limited availability beta. Contact support or your account team if you're interested in beta access.
:::

Staging environments are useful ways to grant developers access to deployment workflows and tools while controlling access to production data. They are configured with their own long-living branch (for example, `staging`) that may be very similar to `main` in many ways while potentially limiting the data the developers can access. 

Ideally, the workflows would move upstream from the Development environment -> Staging environment -> Production environment with developer branches feeding into the staging branch, then ultimately `main`. In many cases, the `main` and `staging` branches will be identical after a merge and remain until the next batch of changes from the `development` branches are ready to be elevated. We recommend setting branch protection rules on `staging` similar to `main`.

### Create a staging environment 

In the dbt Cloud, navigate to **Deploy** -> **Environments** and then click **Create Environment**. Select **Deployment** as the environment type. The option will be greyed out if you already have a development environment.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/create-staging-environment.png" width="85%" title="Create a staging environment" />


Follow the steps outlined in [deployment credentials](#deployment-connection) to complete the remainder of the environment setup.

We recommend that the data warehouse credentials be for a dedicated user or service principal.

### Why use a staging environment

Staging environments provide a layer of separation between you development and production deployment environment. It isolates the prod and pre-prod data, which aids in protecting sensitive information and limiting access to large data sets. Developers can edit job definitions in the staging environment while production is limited to only those who need access. It also helps to have additional verification steps between development and deployment. 

Let's say you have `Project A` and `Project B` and that `Project B` is downstream of `Project A` with cross-project refs configured in the models. When developers are working in the IDE for `Project B`, those refs will resolve to the staging environment of `Project A`, rather than production. You'll get the same results with those refs when jobs are run in the staging environment (or other non-production deployments). Only the production environment will reference the production data, isolating the environment and reducing the need to duplicate projects. 

It will also resolve refs to the staging environment of `Project B`for schemas that haven't been built yet. When you [defer](/docs/cloud/about-cloud-develop-defer) to a model inside the same project, it will further isolate that production data by resolving to staging.

Additionally, the staging environment has it's own view in [dbt Explorer](/docs/collaborate/explore-projects) enabling you to have a full view of your prod and pre-prod data.


## Related docs

- [dbt Cloud environment best practices](/guides/set-up-ci)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [CI jobs](/docs/deploy/continuous-integration)
- [Delete a job or environment in dbt Cloud](/faqs/Environments/delete-environment-job)

