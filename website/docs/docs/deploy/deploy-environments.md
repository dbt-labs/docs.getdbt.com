---
title: "Deployment environments"
id: "deploy-environments"
description: "Learn about dbt Cloud's deployment environment to seamlessly schedule jobs or enable CI."
---

Deployment environments in dbt Cloud are crucial for executing scheduled jobs. To execute dbt, environments determine the settings used during job runs, including:

- The version of dbt Core that will be used to run your project
- The warehouse connection information (including the target database/schema settings)
- The version of your code to execute

A dbt Cloud project can have multiple deployment environments, providing you the flexibility and customization to tailor the execution of scheduled jobs. You can use deployment environments to [create and schedule jobs](/docs/deploy/job-settings#create-and-schedule-jobs), [enable continuous integration](/docs/deploy/continuous-integration), or more based on your specific needs or requirements.

This page will go over the different types of environments and how to intuitively configure your deployment environment in dbt Cloud. 

import CloudEnvInfo from '/snippets/_cloud-environments-info.md';

<CloudEnvInfo setup={'/snippets/_cloud-environments-info.md'} />

## Create a deployment environment

To create a new dbt Cloud development environment, navigate to **Deploy** -> **Environments** and then click **Create Environment**. Select **Deployment** as the environment type.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/create-deploy-env.jpg" width="85%" title="Navigate to Deploy ->  Enviornments to create a deployment environment" />

### Semantic Layer

For Semantic Layer-eligible customers, the next section of environment settings is the Semantic Layer configurations. [The Semantic Layer setup guide](/docs/use-dbt-semantic-layer/setup-dbt-semantic-layer) has the most up-to-date setup instructions!

### Deployment connection

:::info Warehouse Connections

 Warehouse connections are set at the Project level for dbt Cloud accounts, and each Project can have one connection (Snowflake account, Redshift host, Bigquery project, Databricks host, etc.). Some details of that connection (databases/schemas/etc.) can be overridden within this section of the dbt Cloud environment settings.

:::

This section determines the exact location in your warehouse dbt should target when building warehouse objects! This section will look a bit different depending on your warehouse provider.

<WHCode>


<div warehouse="Postgres">

This section will not appear if you are using Postgres, as all values are inferred from the project's connection.

</div>

<div warehouse="Redshift">

This section will not appear if you are using Redshift, as all values are inferred from the project's connection.

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-connection.png" width="85%" title="Snowflake Deployment Connection Settings"/>

#### Editable fields

- **Role**: Snowflake role
- **Database**: Target database
- **Warehouse**: Snowflake warehouse

</div>

<div warehouse="Bigquery">

This section will not appear if you are using Bigquery, as all values are inferred from the project's connection.

</div>

<div warehouse="Spark">

This section will not appear if you are using Spark, as all values are inferred from the project's connection.

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


## Related docs

- [Setup dbt Cloud jobs](/docs/deploy/dbt-cloud-job)
- [Continuous integration](/docs/deploy/continuous-integration)
- [Monitor jobs and alerts](/docs/deploy/monitor-jobs)
- [Delete a job or environment in dbt Cloud](/faqs/Environments/delete-environment-job)

