## Commit your changes

Now that you've built your customer model, you need to commit the changes you made to the project so that the repository has your latest code.

1. Under **Version Control** on the left, click **Commit and sync** and add a message. For example, "Add customers model, tests, docs."
2. Click **Merge this branch to main** to add these changes to the main branch on your repo.

## Deploy dbt

Use dbt Cloud's Scheduler to deploy your production jobs confidently and build observability into your processes. You'll learn to create a deployment environment and run a job in the following steps.

### Create a deployment environment

1. In the upper left, select **Deploy**, then click **Environments**.
2. Click **Create Environment**.
3. In the **Name** field, write the name of your deployment environment. For example, "Production."
4. In the **dbt Version** field, select the latest version from the dropdown.
5. Under **Deployment Credentials**, enter the name of the dataset you want to use as the target, such as "Analytics". This will allow dbt to build and work with that dataset. For some data warehouses, the target dataset may be referred to as a "schema".
6. Click **Save**.

### Create and run a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, `dbt build`.

As the `jaffle_shop` business gains more customers, and those customers create more orders, you will see more records added to your source data. Because you materialized the `customers` model as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

1. After creating your deployment environment, you should be directed to the page for new environment. If not, select **Deploy** in the upper left, then click **Jobs**.
2. Click **Create one** and provide a name, for example "Production run", and link to the Environment you just created.
3. Scroll down to "Execution Settings" and select **Generate docs on run**.
4. Under "Commands," add this command as part of your job if you don't see them:
      * `dbt build`
5. For this exercise, do _not_ set a schedule for your project to run &mdash; while your organization's project should run regularly, there's no need to run this example project on a schedule. Scheduling a job is sometimes referred to as _deploying a project_.
6. Select **Save**, then click **Run now** to run your job.
7. Click the run and watch its progress under "Run history."
8. Once the run is complete, click **View Documentation** to see the docs for your project.

:::tip
Congratulations 🎉! You've just deployed your first dbt project!
:::

#### FAQs

<FAQ path="Runs/failed-prod-run" />


