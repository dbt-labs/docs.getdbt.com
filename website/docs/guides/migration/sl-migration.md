---
title: "dbt Semantic Layer migration guide"
id: sl-migration
sidebar_label: "dbt Semantic Layer migration"
description: "This migration guide will help you migrate from the legacy dbt Semantic Layer to the new one."
tags: ["semantic-layer"]
---

WILL CLEAN THIS UP

add who the audience is, what they need to do, and what they need to know

**Technical resources:**

- [Quickstart guide](/docs/build/sl-getting-started)
- [Example dbt project](https://github.com/dbt-labs/jaffle-sl-template)
- Configuring SL docs
- SL API docs
- [dbt metrics converter](https://github.com/dbt-labs/dbt-converter)
- Developer workflow demo

## Intro

The legacy Semantic Layer is supported in dbt v1.5 or lower and will be deprecated.  The new Semantic Layer is in Beta and supported in dbt v1.6 or higher. If you’re a user of the legacy Semantic Layer and want to use the new one, follow this guide. NOTE: **This requires downtime of your Semantic Layer**

There are 3 migration components: 

- Create semantic models and migrate metric definitions

- Setup new Semantic Layer in dbt Cloud

- Update applicable downstream integrations

This guide assumes you have an environment with the legacy Semantic Layer enabled. There are two migration paths available. **Note: Both migration paths involve some downtime:** 

1. Migrating an existing environment to the new Semantic Layer. 
2. Creating a net new environment running the Semantic Layer.

 

## Migrate an existing environment

This approach will be a hard cut to the new Semantic Layer. Once you update your metrics to the new spec in 1.6, the legacy Semantic Layer will no longer work. You will need to set up the semantic layer in your deployment environment after upgrading to the new metrics spec to avoid unnecessary downtime. 

### **Step 1: Migrate Metric configs to the new spec.**

The metrics specification in dbt core has changed in v1.6 in order to support the integration of MetricFlow. We’ve introduced two new objects that MetricFlow expects in order to build a semantic graph: [Semantic Models](/docs/build/semantic-models) and [Metrics](/docs/build/metrics-overview). You will need to migrate your Metrics configs to the new spec. There are two steps to this process:

- Creating net new Semantic Model configs. These will be YAML files in your dbt project.
- Upgrading the Metrics configs in your project to the new spec.

We’ve built a migration tool that automates this process for you. Check out the [README](https://github.com/dbt-labs/dbt-converter/blob/master/README.md) for installation instructions. Derived metrics are not supported in the migration tool, and will have to be migrated manually.  

To learn how to configure Semantic Models and Metrics, check out our [getting started guide]/docs/build/sl-getting-started). **Note: Developing Metrics and Semantic Models in the IDE is not supported in the Beta release.**

Once you’ve created your Semantic Models and created or updated your Metrics, you can test your updated configs using the MetricFlow CLI tools:

1. Install the CLI via `pip install "dbt-metricflow[your_adapter_name]`
2. Run `dbt parse`. This will parse your project and create a semantic_manifest.json file in your target directory.
3. Run `mf list metrics` to view the metrics in your project.
4. Run `mf validate-configs` to run semantic and warehouse validations. This ensures are configs are valid, and the underlying objects exist in your warehouse. 
5. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>`

When you have tested your metrics and are satisfied that they are correct, commit your changes and push them to your dbt repository. **When you merge the new configurations, the legacy semantic layer will no longer work.** It is recommended that you complete step 2 as soon as you merge the changes to minimize downtime.

### **Step 2: Switch to the new Semantic Layer in your existing Cloud environment**

The suggested workflow for upgrading your Cloud environment to use the new semantic layer is as follows:

- Upgrade the existing deployment environment for your project to v1.6 or higher. Ensure that all jobs are running correctly with the new dbt version. Make any necessary updates to jobs that are impacted by the version upgrade.
- To set up the Semantic Layer, you need to run a dbt job in your deployment environment. You can use any dbt command, but it must be successful.
- To activate the new Semantic Layer, go to the ***Account Settings*** page and then **Project Details.** Select the specific project you want to enable the Semantic Layer for.
- In the **Project Details** page, select **Configure Semantic Layer.** This will prompt you to enter data platform connection credentials for the Semantic Layer and select the environment where you want to enable the Semantic Layer. We recommend using a less privileged set of credentials when setting up your connection. The semantic layer requires SELECT and CREATE TABLE permissions.
- After you’ve entered you’re credentials, you should see a **JDBC URL** connection string. Copy this string and save it in your password manager. You can use this to connect to the Semantic Layer JDBC interface, which you will use in the next step. This interface allows you to connect and query your metrics in downstream tools.
- Next, head back to the **Project Details** page and select **Generate Service Token** to create a semantic layer service token. Save this token for later.
- You’re done! The Semantic Layer should now be enabled for your project! Time to start querying metrics.

## Step 3: Update connection in downstream integrations

Now that your Semantic Layer is set up, you will need to update any downstream integrations that relied on the legacy Semantic Layer. To set up a new connection or update an existing connection, you should do so in the downstream tool and not in dbt Cloud.

**Migration guide for Hex**

…

**Migration guide for Mode**

…

## **Creating a new environment running the new Semantic Layer**

This approach will let you run the legacy Semantic Layer in your existing environment while you stage the metrics spec changes to your dbt project. You’ll set up a brand new deployment environment on dbt v1.6 or higher, which is essentially a clone of your current Semantic Layer environment. When you’re ready to merge your changes, the environment is already set up, and you can safely deprecate your old environment. This approach still involves downtime.

### **Step 1: Setup a new environment running 1.6 and enable the SL**

You will need to create a new environment for the Semantic Layer and migrate your existing jobs to this environment. The workflow is as follows:

- In dbt Cloud, select **Deploy** and then **Environments** to create a new environment.
- Select **dbt Version 1.6** and enter your deployment credentials.
- There needs to be a successful run in your new environment to configure the Semantic Layer. We recommend running `dbt ls` as a `dbt build` won’t succeed until you’ve updated your metrics configs.
- Migrate your jobs from your old deployment environment.
- To activate the new Semantic Layer, go to the **Account Settings** page and then **Project Details.** Select the specific project you want to enable the Semantic Layer for.
- In the **Project Details** page, select **Configure Semantic Layer.** This will prompt you to enter data platform connection credentials for the Semantic Layer and select the environment where you want to enable the Semantic Layer. We recommend using a less privileged set of credentials when setting up your connection. The semantic layer requires SELECT and CREATE TABLE permissions.
- After you’ve entered you’re credentials, you should see a **JDBC URL** connection string. Copy this string and save it in your password manager. This can be used to connect to the semantic layer JDBC.
- Next, head back to the **Project Details** page and select **Generate Service Token** to create a Semantic Layer service token. Save this token for later.
- You’re done! The semantic layer should now be enabled for your project! The legacy Semantic Layer will still be running in your old environment.

### **Step 2: Migrate metric configs to the new spec.**

The metrics specification in dbt core has changed in v1.6 in order to support the integration of MetricFlow. We’ve introduced two new objects that MetricFlow expects in order to build a semantic graph: [Semantic Models](/docs/build/semantic-models) and [Metrics](/docs/build/metrics-overview). You will need to migrate your Metrics configs to the new spec. The process broadly looks:

- Creating net new Semantic Model configs. These will be YAML files in your dbt project.
- Upgrading the Metrics configs in your project to the new spec.

We’ve built a migration tool that automates this process for you. Check out the [README](https://github.com/dbt-labs/dbt-converter/blob/master/README.md) for installation instructions. Derived metrics are not supported in the migration tool, and will have to be migrated manually.  

To learn how to configure Semantic Models and Metrics, check out our [getting started guide](/docs/build/sl-getting-started). **Note: Developing Metrics and Semantic Models in the IDE is not supported in the Beta release.**

Once you’ve created your Semantic Models and created or updated your Metrics, you can test your updated configs using the MetricFlow CLI tools:

1. Install the CLI via `pip install "dbt-metricflow[your_adapter_name]`
2. Run `dbt parse` . This will parse your project, and create a semantic_manifest.json file in your target directory.
3. Run `mf list metrics` to view the metrics in your project.
4. Run `mf validate-configs` to run semantic and warehouse validations. This ensures are configs are valid, and the underlying objects exist in your warehouse. 
5. Test querying a metric by running `mf query --metrics <metric_name> --group-by <dimensions_name>`

When you have tested your metrics and are satisfied that they are correct, commit your changes and push them to your dbt repository. **When you merge the new configurations, the legacy Semantic Layer will no longer work**

## Step 3: Update connection in downstream integrations

Now that your semantic layer is set up, you will need to update any downstream integrations that relied on the legacy Semantic Layer. To set up a new connection or update an existing connection, you should do so in the downstream tool and not in dbt Cloud.

**Migration guide for Hex**

…

**Migration guide for Mode**

…
