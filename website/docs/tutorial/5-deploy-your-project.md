---
title: Deploy your project
id: deploy-your-project
description: In this part of the tutorial, we'll go through how you can deploy your project with dbt Cloud.
---

As the `jaffle_shop` business gains more customers, and those customers create more orders, there will be more records added to your source data. Since the `customers` model is materialized as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date.

This is often referred to as "deploying a project" or "[running a project in production](https://docs.getdbt.com/docs/running-dbt-in-production)". In this part of the tutorial, we'll go through how you can deploy your project with dbt Cloud.

## Commit your changes
First off, we need to commit the changes we made to our project so that our repository has our latest code.

### dbt Cloud
<LoomVideo id="afd55d89abdc4a77b34deaee90da0813" />

1. Click the `commit` button, with a message like "Add customers model"
2. Click the `merge to master` button

### dbt CLI
<LoomVideo id="b07d7efe3f054e3bb357b4bccd805e70" />

1. Add all your changes to git: `git add -a`
2. Commit your changes: `git commit -m "Add customers models"`
3. Push your changes to your repository: `git push`
4. Navigate to your repository, and open a Pull Request to merge the code into your master branch.

## Connect dbt Cloud to your repository
Connecting dbt Cloud to your repository will allow you to have the latest code whenever your dbt project runs.

:::info 
This step only applies to folks who use the dbt CLI to develop their project. <strong>If you developed your project in dbt Cloud, you can skip this step!</strong>
:::

<LoomVideo id="48abd56ec909405cbc76f4946e930a43" />

1. Create a dbt Cloud account [here](https://cloud.getdbt.com/signup/). If your organization already has a dbt Cloud account, ask an admin to add you as a Developer.
2. If you created a new account, a new project should automatically be created. If you were added to an existing account:
    * Click the hamburger menu, then `Account Settings`, then `Projects`.
    * Name your project "dbt Tutorial", and click `Save`. There's no need to fill
    in the other details.
    * Click the hamburger menu, and then `Home`.
    * Switch the project in the header bar to your new "dbt Tutorial" project.
3. Complete the onboarding flow:
    * Connect to BigQuery using the credentials file from the [Setting Up](1-setting-up.md) instructions.
    * Add a repository — choose the GitHub integration, and connect to your `dbt-tutorial` repository that we set up on the [Create a Project](create-a-project-dbt-cli) instructions.


## Create a deployment environment
<LoomVideo id="bb6ea5b628ef4d019f9167f6ddf738cc" />

1. Click the hamburger menu, and then `Home`
2. Under "Deployment Environments" select "Create a new one"
3. Name your deployment environment (e.g. "Production")
4. Add a target dataset (e.g. "analytics") -- this is the dataset that dbt will build into. For other warehouses this is usually named "schema"

## Create and run a job
_See above video_

Jobs are a set of dbt commands (e.g. `dbt run`, `dbt test`) that you want to run on a schedule.

1. After creating your deployment environment, you should be directed to the page for new environment. If not, select the hamburger menu, and then `Jobs`.
2. Click `New Job` giving it a name (e.g. "Production run"), and linking it to the Environment you just created.
3. Check the box for "Generate docs".
4. Ensure you have the following commands as part of your job:
      * `dbt run`
      * `dbt test`
5. **Do not** set a schedule for your project to run -- while your organization's project **should** run regularly, there's no need to run this project on a schedule, and doing so could result in using up your BigQuery credits.
6. Select `Save`, and then `Run now` to run your job.
7. Click into the run to see the progress — once the run is complete, click "View Documentation" to see the docs for your project.

### FAQs
<FAQ src="failed-prod-run" />

## Next steps

:::tip 
Congratulations 🎉! You've just deployed your first dbt project!
:::

Here's a few suggestions to keep learning:

### Start working on your own project
Ready to get started with your own project? We recommend doing the tutorial a second time to create a new project. You should use your own warehouse, along with a query that you frequently run, to build your first models!

### Learn some best practices
Now that you've got a working dbt project, read more about some of our [best practices](https://docs.getdbt.com/docs/best-practices), or go back this tutorial and read some of the FAQs.

### Keep building this project
Here's some suggested exercises to level-up your dbt skills:
* Try turning your raw data references (e.g. `` `dbt-tutorial`.jaffle_shop.orders``) into [sources](https://docs.getdbt.com/docs/using-sources).
* Build a new models for `orders`, that uses the `payments` table to calculate the total order amount.
* Reorganize your project into our [recommended structure](https://discourse.getdbt.com/t/how-we-structure-our-dbt-projects/355)
* Use some Jinja in your project — check out the [Jinja tutorial](https://docs.getdbt.com/docs/using-jinja).
