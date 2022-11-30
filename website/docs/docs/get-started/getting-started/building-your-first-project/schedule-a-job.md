---
title: Schedule a job
id: schedule-a-job
description: In this part of the guide, we'll go through how you can schedule a job in dbt Cloud.
---

In this part of the guide, you will learn how to schedule a job to be run in your production environment. Scheduling a job is sometimes called _deploying a project_.

As the `jaffle_shop` business gains more customers, and those customers create more orders, you will see more records added to your source data. Because you materialized the `customers` model as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

## Commit your changes

Now that you've built your customer model, you need to commit the changes you made to the project so that the repository has your latest code.

1. Click **Commit** and add a message. For example, "Add customers model, tests, docs."
2. Click **merge to main** To add these changes to the main branch on your repo.

## Create a deployment environment

1. In the upper left, select **Deploy**, then click **Environments**.
2. Click **Create Environment**.
3. Name your deployment environment. For example, "Production."
4. Add a target dataset, for example, "Analytics." dbt will build into this dataset. For some warehouses this will be named "schema."
5. Click **Save**.

## Create and run a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, `dbt run` and `dbt test`.

1. After creating your deployment environment, you should be directed to the page for new environment. If not, select **Deploy** in the upper left, then click **Jobs**.
2. Click **Create one** and provide a name, for example "Production run", and link to the Environment you just created.
3. Scroll down to "Execution Settings" and select **Generate docs on run**.
4. Under "Commands," add these commands as part of your job if you don't see them:
      * `dbt run`
      * `dbt test`
5. For this exercise, **do NOT** set a schedule for your project to run -- while your organization's project **should** run regularly, there's no need to run this project on a schedule.
6. Select **Save**, then click **Run now** to run your job.
7. Click the run and watch its progress under "Run history."
8. Once the run is complete, click **View Documentation** to see the docs for your project.

:::tip
Congratulations 🎉! You've just deployed your first dbt project!
:::

### FAQs

<FAQ src="Runs/failed-prod-run" />

## Next steps

Congratulations! Now that you've got a working dbt project, you can read about dbt [best practices](/guides/best-practices).

You can improve your dbt skills with these fun exercises:

* Turn your raw data references (for example, turn `` `dbt-tutorial`.jaffle_shop.orders``) into [sources](/docs/build/sources).
* Build a new models for `orders`, that uses the `payments` table to calculate the total order amount.
* Reorganize your project into [how we structure dbt projects](/blog/how-we-structure-our-dbt-projects).
* If you want a more in-depth learning experience, we recommend taking the [dbt Fundamentals on our dbt Learn online courses site](https://courses.getdbt.com/courses/fundamentals).


Here are some ways to learn more essential dbt skills:

* Learn how to use Jinja in your project by reading the [Jinja tutorial](/docs/get-started/learning-more/using-jinja).
* Learn how to [connect to dbt Core using the CLI](/docs/get-started/getting-started-dbt-core).
* Refactor [legacy SQL to dbt SQL](/docs/get-started/learning-more/refactoring-legacy-sql).
