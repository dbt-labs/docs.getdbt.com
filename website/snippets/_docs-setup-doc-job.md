
To set up a job to generate docs:

1. In the top left, click **Deploy** and select **Jobs**.
2. Create a new job or select an existing job and click **Settings**.
3. Under **Execution Settings**, select **Generate docs on run** and click **Save**.
   <Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/documentation-job-execution-settings.png" width="60%" title="Setting up a job to generate documentation"/> 

You can also add `dbt docs generate` to the list of commands in the job run steps. However, you can expect different outcomes when adding the command to the run steps compared to configuring a job selecting the **Generate docs on run** checkbox (shown in previous steps).

Review the following options and outcomes:

| Options | Outcomes |
|--------| ------- |
| **Select checkbox** | Select the **Generate docs on run** checkbox to automatically generate updated project docs each time your job runs. If that particular step in your job fails, the job can still be successful if all subsequent steps are successful. |
| **Add as a run step** | Add `dbt docs generate` to the list of commands in the job run steps, in whatever order you prefer. If that particular step in your job fails, the job will fail and all subsequent steps will be skipped.   |

:::tip Tip &mdash; Documentation-only jobs 

To create and schedule documentation-only jobs at the end of your production jobs, add the `dbt compile` command in the **Commands** section.

:::
