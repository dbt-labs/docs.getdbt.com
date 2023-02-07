---
title: "dbt Cloud environments"
id: "dbt-cloud-environments"
---


An environment determines how dbt Cloud will execute your project in both the dbt Cloud IDE and scheduled jobs. Critically, in order to execute dbt, environments define three variables:

1. The version of dbt Core that will be used to run your project
2. The warehouse connection information (including the target database/schema settings)
3. The version of your code to execute

For users familiar with development on the CLI, each environment is roughly analogous to an entry in your `profiles.yml` file, with some additional information about your repository to ensure the proper version of code is executed. More info on dbt core environments [here](/docs/collaborate/environments/dbt-core-environments.md).

## Types of environments

In dbt Cloud, there are two types of environments: deployment and development. Deployment environments determine the settings used when jobs created within that environment are executed. Development environments determine the settings used in the dbt Cloud IDE for that particular dbt Cloud Project. Each dbt Cloud project can only have a single development environment but can have any number of deployment environments.

|  | Development Environments | Deployment Environments |
| --- | --- | --- |
| Determines settings for | dbt Cloud IDE | dbt Cloud Job runs |
| How many can I have in my project? | 1 | Any number |

## Common environment settings

Both development and deployment environments have a section called **General Settings**, which has some basic settings that all environments will define:

| Setting | Example Value | Definition | Accepted Values |
| --- | --- | --- | --- |
| Name | Production  | The environment name  | Any string! |
| Environment Type | Deployment | The type of environment | [Deployment, Development] |
| dbt Version | 1.4 (latest) | The dbt version used  | Any dbt version in the dropdown |
| Default to Custom Branch | ☑️ | Determines whether to use a branch other than the repository’s default  | See below |
| Custom Branch | dev | Custom Branch name | See below |

**dbt Version notes**

- dbt Cloud allows users to select any dbt release. At this time, **environments must use a dbt version greater than v1.0.0;** [lower versions are no longer supported](/docs/dbt-versions/upgrade-core-in-cloud).
- If you select a current version with `(latest)` in the name, your environment will automatically install the latest stable version of the minor version selected.

**Custom Branch Behavior**

By default, all environments will use the default branch in your repository (usually the `main` branch) when accessing your dbt code. This is overridable within each dbt Cloud Environment using the `Default to Custom Branch` option. This setting have will have slightly different behavior depending on the environment type:

- **Development**: determines which branch in the dbt Cloud IDE developers create branches from and open PRs against
- **Deployment:** determines the branch is cloned during job executions for each environment.

For more info, check out this [FAQ page on this topic](/docs/faqs/Environments/custom-branch-settings)!

## Create a development environment

To create a new dbt Cloud development environment, navigate to the `Environments` page under the `Deploy` header menu, and click `Create Environment` . Select `Development` as the environemnt type.

After setting the `General Settings` as above, there’s nothing more that needs to be done on the environments page. Click `Save` to create the environment.

### Setting developer credentials

To use the IDE, each developer will need to set up [personal development credentials](/docs/get-started/develop-in-the-cloud#developer-credentials) to your warehouse connection in their `Profile Settings`. This allows users to set separate target information, as well as maintain individual credentials to connect to your warehouse via the dbt Cloud IDE.


<Lightbox src="/img/docs/dbt-cloud/refresh-ide/new-environment-fields.png" width="100" height="100" title="Creating a development environment"/>

## Create a deployment environment

To create a new dbt Cloud development environment, navigate to the `Environments` page under the `Deploy` header menu, and click `Create Environment` . Select `Deployment` as the environemnt type.

### Semantic Layer

For Semantic Layer-eligible customers, the next section of environment settings is the Semantic Layer configurations. [The Semantic Layer setup guide](/docs/use-dbt-semantic-layer/setup-dbt-semantic-layer) has the most up-to-date setup instructions!

### Deployment Connection

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

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-connection.png" title="Snowflake Deployment Connection Settings"/>

#### Editable fields

- `Role`: Snowflake Role
- `Database`: Target Database
- `Warehouse`: Snowflake Warehouse

</div>

<div warehouse="Bigquery">

This section will not appear if you are using Bigquery, as all values are inferred from the project's connection.

</div>

<div warehouse="Spark">

This section will not appear if you are using Spark, as all values are inferred from the project's connection.

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/databricks-deploy-env-deploy-connection.png" title="Databricks Deployment Connection Settings"/>

This section will not appear if you are using BigQuery, as all values are inferred from the project's connection. The `dataset` will be set in the `Deployment Credentials` section below.

#### Editable fields

- `Catalog` (optional): [Unity Catalog namespace](/reference/warehouse-setups/databricks-setup.md)

</div>

</WHCode>


### Deployment Credentials

This section allows you to determine the credentials that should be used when connecting to your warehouse. The authentication methods may differ depending on the warehouse and dbt Cloud tier you are on.

<WHCode>

<div warehouse="Postgres">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" title="Postgres Deployment Credentials Settings"/>

#### Editable fields

- `Username`: Postgres username to use (most likely a service account)
- `Password`: Postgres password for the listed user
- `Schema`: Target schema

</div>

<div warehouse="Redshift">

<Lightbox src="/img/docs/collaborate/postgres-deploy-env-deploy-credentials.png" title="Redshift Deployment Credentials Settings"/>

#### Editable fields

- `Username`: Redshift username to use (most likely a service account)
- `Password`: Redshift password for the listed user
- `Schema`: Target schema

</div>

<div warehouse="Snowflake">

<Lightbox src="/img/docs/collaborate/snowflake-deploy-env-deploy-credentials.png" title="Snowflake Deployment Credentials Settings"/>

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

<Lightbox src="/img/docs/collaborate/bigquery-deploy-env-deploy-credentials.png" title="Bigquery Deployment Credentials Settings"/>

#### Editable fields

- `Dataset`: Target dataset

</div>

<div warehouse="Spark">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" title="Spark Deployment Credentials Settings"/>

#### Editable fields

- `Token`: Access Token
- `Schema`: Target schema

</div>

<div warehouse="Databricks">

<Lightbox src="/img/docs/collaborate/spark-deploy-env-deploy-credentials.png" title="Databricks Deployment Credentials Settings"/>

#### Editable fields

- `Token`: Access Token
- `Schema`: Target schema

</div>

</WHCode>


## Related docs

- [Upgrade Core version in Cloud](/docs/dbt-versions/upgrade-core-in-cloud)
- [Delete a job or environment in dbt Cloud](/docs/faqs/Environments/delete-environment-job)
- [Develop in Cloud](/docs/get-started/develop-in-the-cloud)
