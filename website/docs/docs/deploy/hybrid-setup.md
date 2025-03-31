---
title: "Hybrid setup"
sidebar_label: "Hybrid setup"
description: "Learn how to set up hybrid projects in dbt Cloud."
pagination_next: "docs/deploy/deployment-tools"
pagination_prev: "docs/deploy/hybrid-projects"
---

# Hybrid setup <Lifecycle status='beta,enterprise'/>

<IntroText>
Set up Hybrid projects to upload dbt Core artifacts into dbt Cloud for better collaboration and visibility.
</IntroText>

:::tip Available in private beta
Hybrid project is available in private beta to [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). To register your interest in the beta, reach out to your account representative.
:::

## Set up Hybrid projects

In a hybrid project, you use dbt Core locally and can upload artifacts of that dbt Core project to dbt Cloud for central visibility, cross-project referencing, and easier collaboration. 

This setup requires connecting your dbt Core project to a dbt Cloud project and configuring a few environment variables and access settings.

Follow these steps to set up a dbt Cloud Hybrid project and upload dbt Core artifacts into dbt Cloud:

<!--no toc --> 
    - [Make dbt Core models public](#make-dbt-core-models-public)
    - [Create hybrid project](#create-hybrid-project)
    - [Generate service token and artifact upload values](#generate-service-token-and-artifact-upload-values)
    - [Configure dbt Core project and upload artifacts](#configure-dbt-core-project-and-upload-artifacts)
    - [Review artifacts in dbt Cloud](#review-artifacts-in-dbt-cloud)

### Make dbt Core models public

Before connecting your dbt Core project a dbt Cloud project, you should make sure the dbt Core project is up to date.

1. Make sure models that you want to share use `access: public` in their model configuration. This setting makes those models visible to other dbt Cloud projects for better collaboration, such as [cross-project referencing](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref).

   The easiest way to set this would be in your `dbt_project.yml` file, however you can set this in the following places:
   - `dbt_project.yml` (project-level)
   - `properties.yml` (for individual models)
   - A model's `.sql` file using a `config` block

   Here's an example using a `dbt_project.yml` file where the marts directory is set as public so they can be consumed by downstream tools:
  
   <File name='dbt_project.yml'>

   ```yaml
   models:
   define_public_models: # This is my project name, remember it must be specified
   marts:
      +access: public
   ```
   </File>

2. After defining `access: public`, rerun a dbt execution in the command line interface (CLI) (like `dbt run`) to apply the change.

For more details on how to set this up, see Learn more about [access modifier](/docs/collaborate/govern/model-access#access-modifiers) and how to set the [`access` config](/reference/resource-configs/access). 

### Create hybrid project

Create a hybrid project in dbt Cloud to allow you to upload your dbt Core artifacts to dbt Cloud. 

A [dbt Cloud account admin](/docs/cloud/manage-access/enterprise-permissions#permission-sets) should perform the following steps and share the artifacts information with a dbt Core user:

1. To create a new project in dbt Cloud, navigate to **Account home**.
2. Click on **+New project**. 
3. Select the **Advanced settings** toggle and fill out the **Project name**. Name the project something that allows you to recognize it's a dbt Core project. 
   - You don't need to set up a data warehouse or Git connection, however to upgrade the hybrid project to a full dbt Cloud project, you'd need to set up data warehouse and Git.
4. Select the **Hybrid development** checkbox and click **Continue**.
   - The hybrid project will have a visible **Hybrid** indicator in the project list to help you identify it.
<Lightbox src="/img/docs/deploy/hp-new-project.jpg" title="Hybrid project new project" />

5. Create a [production environment](/docs/deploy/deploy-environments#create-a-deployment-environment) and click **Save**.
6. (Optional) For existing dbt projects, navigate to **Account settings** and then select the **Project**. Click **Edit** and then check the **Hybrid development** checkbox.
<Lightbox src="/img/docs/deploy/hp-existing-project.jpg" title="Hybrid project for an existing project" />

### Generate service token and artifact upload values
A dbt Cloud admin should perform these steps to generate a [service token](/docs/dbt-cloud-apis/service-tokens) and copy the values needed to configure a dbt Core project so it's ready to upload generated artifacts to dbt Cloud. The dbt Cloud admin should share the values with a dbt Core user.

1. Go to the Hybrid project environment you created in the previous step by navigating to **Deploy** > **Environments** and selecting the environment.
2. Select the **Artifact upload** button and copy the following values, which the dbt Core user will need to reference in their dbt Core's `dbt_project.yml` configuration:
   - [Tenant URL](/docs/cloud/about-cloud/access-regions-ip-addresses)
   - Account ID
   - Environment ID
   - Create a service token
     - dbt Cloud creates a service token with **Job Runner** or **Job Viewer** permissions.
<Lightbox src="/img/docs/deploy/hp-artifact-upload.png" title="Generate hybrid project service token" />
1. Make sure to copy and save the values as they're needed to configure your dbt Core project in the next step. Once the service token is created, you can't access it again.

### Configure dbt Core project and upload artifacts

Once you have the values from the previous step, you can prepare your dbt Core project for artifact upload by following these steps:

1. Check your dbt version by running `dbt --version` and you should see the following:
   ```bash
      Core:
      - installed: 1.10.0-b1
      - latest:    1.9.3     - Ahead of latest version!
   ```
2. If you don't have the latest version, [upgrade](/docs/core/pip-install#change-dbt-core-versions) your dbt Core project by running `python -m pip install --upgrade dbt-core`.
3. Set the following environment variables in your dbt Core project by running the following commands in the CLI. Replace the `your_account_id`, `your_environment_id`, and `your_token` with the actual values you copied in the previous step.

   ```bash
   export DBT_CLOUD_ACCOUNT_ID=your_account_id
   export DBT_CLOUD_ENVIRONMENT_ID=your_environment_id
   export DBT_CLOUD_TOKEN=your_token
   export DBT_UPLOAD_TO_ARTIFACTS_INGEST_API=True
   ```

   - Set the environment variables in whatever way you use them in your project.
   - To unset an environment variable you run `unset environment_variable_name`, replace `environment_variable_name` with the actual name of the environment variable.

4. In your local dbt Core project, add the following items you copied in the [previous section](/docs/deploy/hybrid-setup#enable-artifact-upload) to the dbt Core's `dbt_project.yml` file:
   - [Tenant_hostname](/docs/cloud/about-cloud/access-regions-ip-addresses) URL
   - Account ID (using the `DBT_CLOUD_ACCOUNT_ID` environment variable prefix)
   - Environment ID (using the `DBT_CLOUD_ENVIRONMENT_ID` environment variable prefix)
   ```yaml
   name: "jaffle_shop"
   version: "3.0.0"
   require-dbt-version: ">=1.5.0"
   ....rest of dbt_project.yml configuration...

   dbt-cloud:
   project-id: 123456 # Your dbt Cloud project ID
   tenant_hostname: cloud.getdbt.com # Replace with your tenant URL
   DBT_CLOUD_ACCOUNT_ID: 1 # Replace with your account ID
   DBT_CLOUD_ENVIRONMENT_ID: 173 # Replace with your environment ID
   ```
5. Once you set the environment variables using the `export` command in the same CLI session, you can execute a `dbt run` in the CLI. 
   ```bash
    dbt run
    ```

   To override the environment variables set, execute a `dbt run` with the environment variable prefix. For example, to use a different account ID and environment ID:
   ```bash
    DBT_CLOUD_ACCOUNT_ID=2 DBT_CLOUD_ENVIRONMENT_ID=133 dbt run
   ```

6. After the run completes, you should see a `Artifacts uploaded successfully to artifact ingestion API: command run completed successfully` message and a run in dbt Cloud under your production environment.

### Review artifacts in dbt Cloud
Now that you've uploaded dbt Core artifacts into dbt Cloud and executed a `dbt run`, you can view the artifacts job run:
1. Navigate to **Deploy**
2. Click on **Jobs** and then the **Runs** tab.
3. You should see a job run with the status **Success** with a `</> Artifact ingestion` indicator.
4. Click on the job run to review the logs to confirm a successfully artifacts upload message. If there are any errors, resolve them by checking out the debug logs.

<Lightbox src="/img/docs/deploy/hp-artifact-job.jpg" width="70%" title="Hybrid project job run with artifact ingestion" />

## Benefits of using Hybrid projects

Now that you've integrated dbt Core artifacts with you dbt Cloud project, you can now:

- Collaborate with dbt Cloud users by enabling them to visualize and perform [cross-project references](/docs/collaborate/govern/project-dependencies#how-to-write-cross-project-ref) to dbt models that live in Core projects.
- (Coming soon) New users interested in the [Visual Editor](/docs/cloud/visual-editor) can build off of dbt models already created by a central data team in dbt Core rather than having to start from scratch.
- dbt Core users can navigate to [dbt Explorer](/docs/collaborate/explore-projects) and view their models and assets. To view dbt Explorer, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).
