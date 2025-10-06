## Commit your changes

Now that you've built your customer model, you need to commit the changes you made to the project so that the repository has your latest code.

**If you edited directly in the protected primary branch:**<br />
1. Click the **Commit and sync git** button. This action prepares your changes for commit.
2. A modal titled **Commit to a new branch** will appear.
3. In the modal window, name your new branch `add-customers-model`. This branches off from your primary branch with your new changes.
4. Add a commit message, such as "Add customers model, tests, docs" and and commit your changes.
5. Click **Merge this branch to main** to add these changes to the main branch on your repo.


**If you created a new branch before editing:**<br />
1. Since you already branched out of the primary protected branch, go to  **Version Control** on the left.
2. Click **Commit and sync** to add a message.
3. Add a commit message, such as "Add customers model, tests, docs."
4. Click **Merge this branch to main** to add these changes to the main branch on your repo.

## Deploy dbt

Use <Constant name="cloud" />'s Scheduler to deploy your production jobs confidently and build observability into your processes. You'll learn to create a deployment environment and run a job in the following steps.

### Create a deployment environment

1. From the main menu, go to **Orchestration** > **Environments**.
2. Click **Create environment**.
3. In the **Name** field, write the name of your deployment environment. For example, "Production."
4. In the **dbt Version** field, select the latest version from the dropdown.
5. Under **Deployment connection**, enter the name of the dataset you want to use as the target, such as "Analytics". This will allow dbt to build and work with that dataset. For some data warehouses, the target dataset may be referred to as a "schema".
6. Click **Save**.

### Create and run a job

Jobs are a set of dbt commands that you want to run on a schedule. For example, `dbt build`.

As the `jaffle_shop` business gains more customers, and those customers create more orders, you will see more records added to your source data. Because you materialized the `customers` model as a table, you'll need to periodically rebuild your table to ensure that the data stays up-to-date. This update will happen when you run a job.

1. After creating your deployment environment, you should be directed to the page for a new environment. If not, select **Orchestration** from the main menu, then click **Jobs**.
2. Click **Create job** > **Deploy job**. 
3. Provide a job name (for example, "Production run") and select the environment you just created.
3. Scroll down to the **Execution settings** section.
4. Under **Commands**, add this command as part of your job if you don't see it:
   * `dbt build`
5. Select the **Generate docs on run** option to automatically [generate updated project docs](/docs/explore/build-and-view-your-docs) each time your job runs. 
6. For this exercise, do _not_ set a schedule for your project to run &mdash; while your organization's project should run regularly, there's no need to run this example project on a schedule. Scheduling a job is sometimes referred to as _deploying a project_.
7. Click **Save**, then click **Run now** to run your job.
8. Click the run and watch its progress under **Run summary**.
9. Once the run is complete, click **View Documentation** to see the docs for your project.


Congratulations 🎉! You've just deployed your first dbt project!


#### FAQs

<FAQ path="Runs/failed-prod-run" />


