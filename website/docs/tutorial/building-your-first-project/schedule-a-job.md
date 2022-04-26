---
title: Schedule a job
id: schedule-a-job
description: In this part of the tutorial, we'll go through how you can schedule a job in dbt Cloud.
---

As the `jaffle_shop` business gains more customers, and those customers create more orders, there will be more records added to your source data. Since the `customers` model is materialized as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

Scheduling a job to be run in your production environment might also be called "deploying a project" or "[running a project in production](/docs/running-a-dbt-project/running-dbt-in-production)."

## Commit your changes

Now that you've built your customer modelYou need to commit the changes you made to the project so that the repository has your latest code.

1. Click the `commit` button, with a message like "Add customers model, tests, docs"
2. Click the `merge to master` button

<LoomVideo id="afd55d89abdc4a77b34deaee90da0813" />

## Create a deployment environment

1. Click the hamburger menu, and then `Home`
2. Under "Deployment Environments" select "Create a new one"
3. Name your deployment environment (e.g. "Production")
4. Add a target dataset (e.g. "analytics") -- this is the dataset that dbt will build into. For other warehouses this is usually named "schema"

<LoomVideo id="bb6ea5b628ef4d019f9167f6ddf738cc" />

## Create and run a job

Jobs are a set of dbt commands (e.g. `dbt run`, `dbt test`) that you want to run on a schedule.

1. After creating your deployment environment, you should be directed to the page for new environment. If not, select the hamburger menu, and then `Jobs`.
2. Click `New Job` giving it a name (e.g. "Production run"), and linking it to the Environment you just created.
3. Check the box for "Generate docs".
4. Ensure you have the following commands as part of your job:
      * `dbt run`
      * `dbt test`
5. For this exercise, **do NOT** set a schedule for your project to run -- while your organization's project **should** run regularly, there's no need to run this project on a schedule. You might use up your BigQuery credits if you schedule it.
6. Select `Save`, and then `Run now` to run your job.
7. Click into the run to see the progress — once the run is complete, click "View Documentation" to see the docs for your project.

:::tip
Congratulations 🎉! You've just deployed your first dbt project!
:::

### FAQs

<FAQ src="failed-prod-run" />

## Next steps

Congratulations! Now that you've got a working dbt project, you can read about dbt [best practices](/docs/guides/best-practices).

You can improve your dbt skills with these fun exercises:

* Turn your raw data references (for example, turn `` `dbt-tutorial`.jaffle_shop.orders``) into [sources](/docs/building-a-dbt-project/using-sources).
* Build a new models for `orders`, that uses the `payments` table to calculate the total order amount.
* Reorganize your project into [how we structure dbt projects](/blog/how-we-structure-our-dbt-projects).

Here are some ways to [level up your dbt skills](leveling-up):

* Learn how to use Jinja in your project by reading the [Jinja tutorial](using-jinja).
* Learn how to [connect to dbt Core using the CLI](connecting-to-dbt-core).
* Refactor [legacy SQL to dbt SQL](refactoring-legacy-sql).
