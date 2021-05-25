---
title: "Setting up production jobs"
---

For more general information about jobs, take a look at [Running dbt in Production](https://docs.getdbt.com/docs/running-a-dbt-project/running-dbt-in-production).

## Creating a Deployment Environment

If you don’t already have one set up, you’ll need to create a deployment environment in your dbt Cloud account before setting up a job. This can be done by clicking &quot;New Environment&quot; in the upper right corner of the Environments page.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/general_settings.png"/>

When setting this up, you’ll need to provide a name for the environment, ensure that the environment type is set to “deployment”, and select which version of dbt you’d like this environment to run on. Optionally, you can turn on the custom branch option and select an alternative branch for your jobs to run on.

In the Credentials section, make sure that your **deployment** credentials are entered correctly. In the “schema” field, specify the name of the schema you’d like your models to be built into. **Note**: Do not leave this field empty! This will cause errors down the road.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deployment_credentials.png"/>

Once all the correct information is entered, click “Save” in the top right corner of the page.

## Creating a Job

Now you’re ready to set up a new job! Navigate either to the homepage for the deployment environment that you’d like to create a job in (this can be accessed via the &quot;Environments&quot; page), or go directly to the Jobs homepage. Click &quot;New Job&quot; on the right.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/deployment_environment_home.png"/>

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/jobs_home.png"/>

On the next screen, you can configure your job. Provide a unique name for the job and ensure that the correct environment is selected. Optionally, you can select a different version of dbt for this job to run on, as well as increasing the number of threads on the job. You can also specify a target name, and select whether or not you’d like for this job to generate documentation.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job_environment_settings.png"/>

**Documentation, Source Freshness, Run Timeouts, and CI Deferral**

Under &quot;Execution Settings&quot; you have the option to configure your job to generate documentation, run source freshness, set a run timeout, or to defer to a production job. Setting a run timeout will instruct dbt Cloud to cancel a job that has started running after a specified period of time. If you don’t want to set a run timeout, leave this field set to zero.

**Note**: The run timeout should be configured in seconds. For example, if you’d like your job to time out after 5 minutes, you’ll need to input 300 (5 minutes * 60 seconds/minute = 300 seconds).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/execution_settings.png"/>

**Commands**

The &quot;Commands&quot; section is where you’ll be able to configure which commands you want your job to run. You can add more commands by clicking the &quot;add command&quot; button.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job_commands.png"/>

**Notifications**

Below that, you’ll see a &quot;Notifications&quot; section. These can be configured within your profile settings. You can learn more about how to set up Slack notifications [here]().

**Triggers**

Lastly, you’ll find the &quot;Triggers&quot; section. Here you’ll find a &quot;schedule&quot; tab, a &quot;webhooks&quot; tab, and an &quot;API&quot; tab.

The &quot;Schedule&quot; tab allows you to set the schedule for how often you would like the job to run.

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job_triggers.png"/>

If you want to utilize the custom cron schedule option, take a look at our documentation on this [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-using-a-custom-cron-schedule)].

The “Webhooks” tab is where you can configure webhooks such as running a job on pull requests or running a job on a custom branch. You can read more on Continuous Integration [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration-with-github).

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/job_triggers_webhooks.png"/>

**Note**: The repo connected to your dbt Cloud project must be connected via the &quot;Github app&quot; strategy in order to configure webhooks. If you don’t have the option to enable webhooks, check to make sure that your repo is connected to your project via the Github app in your project settings.

The &quot;API&quot; tab includes a link to our API docs as well as to your profile settings, where the API key can be found (under &quot;API Access&quot;).


Once the job is configured properly, click the &quot;Save&quot; button in the top right corner.
