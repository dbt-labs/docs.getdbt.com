---
title: "Hybrid setup"
sidebar_label: "Hybrid setup"
description: "Learn how to set up hybrid projects in the dbt platform."
pagination_next: "docs/deploy/deployment-tools"
pagination_prev: "docs/deploy/hybrid-projects"
---

# Hybrid setup <Lifecycle status='managed_plus'/>

<IntroText>
Set up Hybrid projects to upload <Constant name="core" /> artifacts into <Constant name="cloud" /> for better collaboration and visibility.
</IntroText>

:::tip Available in private beta
Hybrid project is available in private beta to [<Constant name="cloud" /> Enterprise accounts](https://www.getdbt.com/pricing). To register your interest in the beta, reach out to your account representative.
:::

## Set up Hybrid projects

In a hybrid project, you use <Constant name="core" /> locally and can upload artifacts of that <Constant name="core" /> project to <Constant name="cloud" /> for central visibility, cross-project referencing, and easier collaboration. 

This setup requires connecting your <Constant name="core" /> project to a <Constant name="cloud" /> project and configuring a few environment variables and access settings. 

Follow these steps to set up a <Constant name="cloud" /> Hybrid project and upload <Constant name="core" /> artifacts into <Constant name="cloud" />:

<!--no toc --> 
    - [Make <Constant name="core" /> models public](#make-dbt-core-models-public) (optional)
    - [Create hybrid project](#create-hybrid-project)
    - [Generate service token and artifact upload values](#generate-service-token-and-artifact-upload-values)
    - [Configure <Constant name="core" /> project and upload artifacts](#configure-dbt-core-project-and-upload-artifacts)
    - [Review artifacts in <Constant name="cloud" />](#review-artifacts-in-dbt-cloud)

Make sure to enable the hybrid projects toggle in <Constant name="cloud" />’s **Account settings** page.

### Make dbt Core models public (optional) {#make-dbt-core-models-public}

This step is optional and and only needed if you want to share your <Constant name="core" /> models with other <Constant name="cloud" /> projects using the [cross-project referencing](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) feature.

Before connecting your dbt Core project to a <Constant name="cloud" /> project, make sure models that you want to share have `access: public` in their model configuration. This setting makes those models visible to other <Constant name="cloud" /> projects for better collaboration, such as [cross-project referencing](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref).

1. The easiest way to set this would be in your `dbt_project.yml` file, however you can also set this in the following places:
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

2. After defining `access: public`, rerun a dbt execution in the dbt Core command line interface (CLI) (like `dbt run`) to apply the change.

3. For more details on how to set this up, see [access modifier](/docs/mesh/govern/model-access#access-modifiers) and [`access` config](/reference/resource-configs/access). 

### Create hybrid project

Create a hybrid project in <Constant name="cloud" /> to allow you to upload your <Constant name="core" /> artifacts to <Constant name="cloud" />. 

A [<Constant name="cloud" /> account admin](/docs/cloud/manage-access/enterprise-permissions#permission-sets) should perform the following steps and share the artifacts information with a <Constant name="core" /> user:

1. To create a new project in <Constant name="cloud" />, navigate to **Account home**.
2. Click on **+New project**. 
3. Fill out the **Project name**. Name the project something that allows you to recognize it's a <Constant name="core" /> project. 
   - You don't need to set up a [data warehouse](/docs/supported-data-platforms) or [<Constant name="git" /> connection](/docs/cloud/git/git-configuration-in-dbt-cloud), however to upgrade the hybrid project to a full <Constant name="cloud" /> project, you'd need to set up data warehouse and <Constant name="git" /> connection.
4. Select the **Advanced settings** toggle and then select the **Hybrid development** checkbox. Click **Continue**.
   - The hybrid project will have a visible **Hybrid** indicator in the project list to help you identify it.
<Lightbox src="/img/docs/deploy/hp-new-project.jpg" title="Hybrid project new project" />

5. After creating a project, create a corresponding [production environment](/docs/deploy/deploy-environments#create-a-deployment-environment) and click **Save**. Note that you can leave the **Connection** field blank.
6. (Optional) To update an existing dbt project to a hybrid project, navigate to **Account settings** and then select the **Project**. Click **Edit** and then check the **Hybrid development** checkbox.
<Lightbox src="/img/docs/deploy/hp-existing-project.jpg" width="80%" title="Hybrid project for an existing project" />

### Generate service token and artifact upload values
A <Constant name="cloud" /> admin should perform these steps to generate a [service token](/docs/dbt-cloud-apis/service-tokens#enterprise-plans-using-service-account-tokens) (with both **Job Runner** _and_ **Job Viewer** permissions) and copy the values needed to configure a <Constant name="core" /> project so it's ready to upload generated artifacts to <Constant name="cloud" />.

The <Constant name="cloud" /> admin should share the values with a <Constant name="core" /> user.

1. Go to the Hybrid project environment you created in the previous step by navigating to **Deploy** > **Environments** and selecting the environment.
2. Select the **Artifact upload** button and copy the following values, which the dbt Core user will need to reference in their dbt Core's `dbt_project.yml` configuration:
   - **[Tenant URL](/docs/cloud/about-cloud/access-regions-ip-addresses)**
   - **Account ID**
   - **Environment ID**
   - **Create a service token**
     - <Constant name="cloud" /> creates a service token with both **Job Runner** _and_ **Job Viewer** permissions.
     - Note if you don't see the **Create service token** button, it's likely you don't have the necessary permissions to create a service token. Contact your <Constant name="cloud" /> admin to either get the necessary permissions or create the service token for you.
<Lightbox src="/img/docs/deploy/hp-artifact-upload.png" title="Generate hybrid project service token" />

3. Make sure to copy and save the values as they're needed to configure your <Constant name="core" /> project in the next step. Once the service token is created, you can't access it again.

### Configure dbt Core project and upload artifacts

Once you have the values from the previous step, you can prepare your <Constant name="core" /> project for artifact upload by following these steps:

1. Check your dbt version by running `dbt --version` and you should see the following:
   ```bash
      Core:
      - installed: 1.10.0-b1
      - latest:    1.9.3     - Ahead of latest version!
   ```
2. If you don't have the latest version (1.10 or later), [upgrade](/docs/core/pip-install#change-dbt-core-versions) your dbt Core project by running `python -m pip install --upgrade dbt-core`.
3. Set the following environment variables in your dbt Core project by running the following commands in the CLI. Replace the `your_account_id`, `your_environment_id`, and `your_token` with the actual values in the [previous step](#generate-service-token-and-artifact-upload-values).

   ```bash
   export DBT_CLOUD_ACCOUNT_ID=your_account_id
   export DBT_CLOUD_ENVIRONMENT_ID=your_environment_id
   export DBT_CLOUD_TOKEN=your_token
   export DBT_UPLOAD_TO_ARTIFACTS_INGEST_API=True
   ```

   - Set the environment variables in whatever way you use them in your project.
   - To unset an environment variable, run `unset environment_variable_name`, replacing `environment_variable_name` with the actual name of the environment variable.

4. In your local dbt Core project, add the following items you copied in the [previous section](/docs/deploy/hybrid-setup#enable-artifact-upload) to the dbt Core's `dbt_project.yml` file:
   - `tenant_hostname`
   ```yaml
   name: "jaffle_shop"
   version: "3.0.0"
   require-dbt-version: ">=1.5.0"
   ....rest of dbt_project.yml configuration...

   dbt-cloud:
     tenant_hostname: cloud.getdbt.com # Replace with your Tenant URL
   ```
5. Once you set the environment variables using the `export` command in the same dbt Core CLI session, you can execute a `dbt run` in the CLI. 
   ```bash
    dbt run
    ```

   To override the environment variables set, execute a `dbt run` with the environment variable prefix. For example, to use a different account ID and environment ID:
   ```bash
    DBT_CLOUD_ACCOUNT_ID=1 DBT_CLOUD_ENVIRONMENT_ID=123 dbt run
   ```

6. After the run completes, you should see a `Artifacts uploaded successfully to artifact ingestion API: command run completed successfully` message and a run in <Constant name="cloud" /> under your production environment.

### Review artifacts in the dbt platform
Now that you've uploaded dbt Core artifacts into the <Constant name="dbt_platform" /> and executed a `dbt run`, you can view the artifacts job run:
1. Navigate to **Deploy**
2. Click on **Jobs** and then the **Runs** tab.
3. You should see a job run with the status **Success** with a `</> Artifact ingestion` indicator.
4. Click on the job run to review the logs to confirm a successfully artifacts upload message. If there are any errors, resolve them by checking out the debug logs.

<Lightbox src="/img/docs/deploy/hp-artifact-job.jpg" width="70%" title="Hybrid project job run with artifact ingestion" />

## Benefits of using Hybrid projects


Now that you've integrated <Constant name="core" /> artifacts with your <Constant name="cloud" /> project, you can now:


- Collaborate with <Constant name="cloud" /> users by enabling them to visualize and perform [cross-project references](/docs/mesh/govern/project-dependencies#how-to-write-cross-project-ref) to dbt models that live in Core projects.
- (Coming soon) New users interested in the [<Constant name="visual_editor" />](/docs/cloud/canvas) can build off of dbt models already created by a central data team in <Constant name="core" /> rather than having to start from scratch.
- <Constant name="core" /> users can navigate to [<Constant name="explorer" />](/docs/explore/explore-projects) and view their models and assets. To view <Constant name="explorer" />, you must have a [read-only seat](/docs/cloud/manage-access/seats-and-users).
