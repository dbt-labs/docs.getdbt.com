---
title: "Legacy dbt Semantic Layer migration guide"
id: sl-migration
sidebar_label: "Legacy dbt Semantic Layer migration"
description: "This migration guide will help you migrate from the legacy dbt Semantic Layer to the new one."
tags: [Semantic Layer]
---

The dbt Semantic Layer has undergone a [significant revamp](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), making it more efficient to define and query metrics. The new dbt Semantic Layer is in [public beta](/docs/dbt-versions/release-notes/July-2023/sl-revamp-beta#public-beta) and supported on dbt v1.6 or higher. It's available to all dbt Cloud plans (Developer, Team, and Enterprise) and introduces new semantic components, improved governance, enhanced efficiency, data accessibility, and new Semantic Layer APIs.

This guide is for users who have the legacy dbt Semantic Layer set up and would like to migrate to the new and revamped  [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl). The legacy dbt Semantic Layer is supported on dbt v1.5 or lower, uses the dbt_metrics package, and will be deprecated. 

**Note**: Migrating to the new Semantic Layer will require downtime and this guide will explain how to minimize it.

## Migration components

In order to migrate from the legacy Semantic Layer to the new one, there are three migration components you'll need to complete: 

- Create semantic models and migrate metric definitions
- Setup the new dbt Semantic Layer in dbt Cloud
- Update any applicable downstream integrations

This guide assumes you have an environment with the legacy Semantic Layer enabled. There are two migration options for you to choose from, **both of which involve some downtime**:

1. [Migrating an existing environment](#migrate-an-existing-environment) over to the new dbt Semantic Layer
2. [Creating and configure a brand new environment](#creating-a-new-environment-running-the-new-semantic-layer) for the new dbt Semantic Layer


## Migrate an existing environment

Switching to th new Semantic Layer requires a complete transition. This is because the legacy Semantic Layer will no longer work once you update your metrics to the new specifications in dbt v1.6 or higher. 

To avoid any disruptions or downtime, you _must_ set up the new Semantic Layer in your deployment environment after upgrading to the new metrics spec.

### Step 1: Migrate metrics

Starting from dbt v1.6, the metrics specification dbt Core has been updated to support the integration of MetricFlow. This introduces two new components that are essential for building a semantic graph:

- [Semantic Models](/docs/build/semantic-models)  
- [Metrics](/docs/build/metrics-overview)

To migrate to the new specification, you'll need to:

- Create net new semantic model configs using YAML files in your dbt project
- Upgrade your existing metrics configs to the new spec

To help ensure a smooth transition, use our [custom-built migration tool](https://github.com/dbt-labs/dbt-converter/blob/master/README.md) that automates this process. 

**Note**, this doesn't support [derived metrics](/docs/build/derived) and you'll need to migrate them over manually. 

For detailed instructions on how to configure semantic models and metrics, refer to our [getting started guide](/docs/use-dbt-semantic-layer/quickstart-sl). 

:::info
If you're developing in metrics and semantic models in the dbt Cloud IDE, make sure to update your development environment to dbt version 1.6 or newer. This update will affect other analysts on your team who use the IDE for the same project. If they have metrics defined using dbt version 1.5 or older, it might cause errors.
:::

#### Test your metrics

Once you’ve created your semantic models and created or updated your metrics, you can test your updated configs using the MetricFlow CLI tools. Note, this is only available to users developing metrics locally:

1. Install the CLI via `pip install "dbt-metricflow[your_adapter_name]`.
2. Run `dbt parse`. This will parse your project and create a `semantic_manifest.json` file in your target directory.
3. Run `mf list metrics` to view the metrics in your project.
4. Run `mf validate-configs` to run semantic and warehouse validations. This ensures are configs are valid, and the underlying objects exist in your warehouse. 
5. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>`

If you migrate using the dbt Cloud IDE, we will perform semantic validations every time we parse or compile your project. This will ensure correct configuration of your metrics and semantic models. You will need to test querying metrics values in downstream tools. 

Once you've thoroughly tested and verified the accuracy of your metrics, commit and push the change to your dbt repository. After you merge the new configurations, **the legacy Semantic Layer will no longer work**. To minimize downtime, we recommend you promptly complete step 2 and set up your environment on the new Semantic Layer.

### Step 2: Switch to the new Semantic Layer

Now that you've migrated your metrics and created semantic models, it's time to set up your environment using the new Semantic Layer configuration. 

To upgrade your dbt Cloud environment to use the new Semantic Layer:

1. [Upgrade](/docs/dbt-versions/upgrade-core-in-cloud) the existing deployment environment for your project to v1.6 or higher.
Ensure that all jobs run successfully with the new version.
2. Run a dbt job in your deployment environment to set up the new Semantic Layer. You can use any dbt command, as long as it completes successfully. 
3. To activate the new Semantic Layer, go to the **Account Settings** page and select the specific project you want to enable the Semantic Layer for.
3. On the **Project Details** page, select **Configure Semantic Layer** 
4. Enter the connection details for the data platform and select the environment where you want to enable the Semantic Layer. It's recommended to use a set of credentials with limited privileges, granting SELECT and CREATE TABLE permissions.
5. After you’ve entered your credentials, you should see a **JDBC URL** connection string. Copy this string and save it in your password manager. You can use this to connect to the Semantic Layer JDBC interface, which you will use in the next step. This interface allows you to connect and query your metrics in downstream tools.
6. Go back to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. Save this token for later.
7. You’re done 🎉! The new dbt Semantic Layer is now enabled for your project an you can start querying metrics.

### Step 3: Update connection in downstream integrations

Now that your Semantic Layer is set up, you will need to update any downstream integrations that relied on the legacy Semantic Layer. To set up a new connection or update an existing connection, you should do so in the downstream tool and not in dbt Cloud.

<!---
@mirnawong1 commenting out until these are available

 **Link to migration guide for Hex**


**Link to migration guide for Mode**
----->

## Create environment for the new Semantic Layer

This approach allows you to run the legacy Semantic Layer in your existing environment, while you stage the metrics spec changes to your dbt project. 

In this approach, you’ll set up a brand new deployment environment on dbt v1.6 or higher, which is a clone of your current Semantic Layer environment. When you’re ready to merge your changes, the new environment will be prepared, allowing you to safely deprecate the old Semantic Layer environment. Although some downtime may still be involved, this approach helps mitigate it.

### Step 1: Setup a new environment

You'll need to create a new environment for the new Semantic Layer and migrate your existing jobs to this environment:

1. In dbt Cloud, select **Deploy** and then **Environments** to create a new [deployment environment](/docs/deploy/deploy-environments).
2. Select **dbt Version 1.6** (or the latest) and enter your deployment credentials.
    * There needs to be a successful run in your new environment to configure the  Semantic Layer. We recommend running `dbt ls`, since `dbt build` won’t succeed until you’ve updated your metrics configs.
3. You'll need to migrate your jobs from your old deployment environment. You can do this by manually creating and configuring the new jobs in the new environment.
4. To activate the new Semantic Layer, go to the Account Settings page and select the specific project you want to enable the Semantic Layer for.
5. On the **Project Details** page, select **Configure Semantic Layer**.
6. Enter the connection details for the data platform and select the environment where you want to enable the Semantic Layer. It's recommended to use a set of credentials with limited privileges, granting SELECT and CREATE TABLE permissions.
7. After you’ve entered you’re credentials, you should see a **JDBC URL** connection string. Copy this string and save it in your password manager. This can be used to connect to the Semantic Layer JDBC.
7. Go back to **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. Save this token for later.
8. You’re done ✨ ! The Semantic Layer should now be enabled for your project! 

The legacy Semantic Layer will still be running in your old environment so make sure you complete step two to migrate your metrics configs to the new spec. Once you’ve migrated your metrics configs, you can safely deprecate the old environment.

### Step 2: Migrate metric configs to the new spec

Starting from dbt v1.6, the metrics specification dbt Core has been updated to support the integration of MetricFlow. This introduces two new components that are essential for building a semantic graph:

- [Semantic Models](/docs/build/semantic-models)  
- [Metrics](/docs/build/metrics-overview)

To migrate to the new specification, you'll need to:
- Create net new semantic model configs using YAML files in your dbt project
- Upgrade your existing metrics configs to the new spec

To help ensure a smooth transition, you can use our [custom-built migration tool](https://github.com/dbt-labs/dbt-converter/blob/master/README.md) that automates this process. 
**Note:** this tool doesn't support [derived metrics](/docs/build/derived) and you'll need to migrate them over manually. 

For detailed instructions on how to configure semantic models and metrics, refer to our [getting started guide](/docs/use-dbt-semantic-layer/quickstart-sl). 


If you're developing in metrics and semantic models in the dbt Cloud IDE, make sure to update your development environment to dbt version 1.6 or newer. This update will affect other analysts on your team who use the IDE for the same project. If they have metrics defined using dbt version 1.5 or older, it might cause errors.

#### Test your metrics

Once you’ve created your semantic models and created or updated your metrics, you can test your updated configs using the MetricFlow CLI tools:

1. Install the CLI via `pip install "dbt-metricflow[your_adapter_name]`.
2. Run `dbt parse`. This will parse your project and create a `semantic_manifest.json` file in your target directory.
3. Run `mf list metrics` to view the metrics in your project.
4. Run `mf validate-configs` to run semantic and warehouse validations. This ensures are configs are valid, and the underlying objects exist in your warehouse. 
5. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>`

If you migrate using the dbt Cloud IDE, we will perform semantic validations every time we parse or compile your project. This will ensure correct configuration of your metrics and semantic models. You will need to test querying metrics values in downstream tools. 

Once you've thoroughly tested and verified the accuracy of your metrics, commit and push the changes to your dbt repository. After you merge the new configurations, **the legacy Semantic Layer will no longer work**. 

### Step 3: Update connection in downstream integrations

Now that your Semantic Layer is set up, you will need to update any downstream integrations that relied on the legacy Semantic Layer. To set up a new connection or update an existing connection, you should do so in the downstream tool and not in dbt Cloud.

<!---
@mirnawong1 commenting out until these are available

 **Link to migration guide for Hex**

**Link to migration guide for Mode**
----->


## Resources

- [Get started with the dbt Semantic Layer](/docs/use-dbt-semantic-layer/quickstart-sl)
- [Example dbt project](https://github.com/dbt-labs/jaffle-sl-template)
- [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl)
- [Semantic Layer API](/docs/dbt-cloud-apis/sl-api-overview)
- [dbt metrics converter](https://github.com/dbt-labs/dbt-converter)
