---
title: Airflow and dbt Cloud
id: airflow-and-dbt-cloud
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['dbt Cloud', 'Orchestration']
level: 'Intermediate'
recently_updated: true
---

## Introduction

Many organization already use [Airflow](https://airflow.apache.org/) to orchestrate their data workflows. dbt Cloud works great with Airflow, letting you execute your dbt code in dbt Cloud while keeping orchestration duties with Airflow. This ensures your project's metadata (important for tools like dbt Explorer) is available and up-to-date, while still enabling you to use Airflow for general tasks such as:

- Scheduling other processes outside of dbt runs
- Ensuring that a [dbt job](/docs/dbt-cloud/cloud-overview#schedule-and-run-dbt-jobs-in-production) kicks off before or after another process outside of dbt Cloud
- Triggering a dbt job only after another has completed

In this guide, you'll learn how to:

1. Create a working local Airflow environment
2. Invoke a dbt Cloud job with Airflow
3. Reuse tested and trusted Airflow code for your specific use cases

You’ll also gain a better understanding of how this will:

- Reduce the cognitive load when building and maintaining pipelines
- Avoid dependency hell (think: `pip install` conflicts)
- Define clearer handoff of workflows between data engineers and analytics engineers

## Prerequisites

- [dbt Cloud Teams or Enterprise account](https://www.getdbt.com/pricing/) (with [admin access](/docs/cloud/manage-access/enterprise-permissions)) in order to create a service token. Permissions for service tokens can be found [here](/docs/dbt-cloud-apis/service-tokens#permissions-for-service-account-tokens).
- A [free Docker account](https://hub.docker.com/signup) in order to sign in to Docker Desktop, which will be installed in the initial setup.
- A local digital scratchpad for temporarily copy-pasting API keys and URLs

🙌 Let’s get started! 🙌

## Install the Astro CLI

Astro is a managed software service that includes key features for teams working with Airflow. In order to use Astro, we’ll install the Astro CLI, which will give us access to useful commands for working with Airflow locally. You can read more about Astro [here](https://docs.astronomer.io/astro/).

In this example, we’re using Homebrew to install Astro CLI. Follow the instructions to install the Astro CLI for your own operating system [here](https://docs.astronomer.io/astro/install-cli).

```bash
brew install astro
```

<WistiaVideo id="uosszw1qul" paddingTweak="62.25%" />

## Install and start Docker Desktop

Docker allows us to spin up an environment with all the apps and dependencies we need for this guide.

Follow the instructions [here](https://docs.docker.com/desktop/) to install Docker desktop for your own operating system. Once Docker is installed, ensure you have it up and running for the next steps.

<WistiaVideo id="qr84pa8k9f" paddingTweak="62.25%" />

## Clone the airflow-dbt-cloud repository

Open your terminal and clone the [airflow-dbt-cloud repository](https://github.com/sungchun12/airflow-dbt-cloud). This contains example Airflow DAGs that you’ll use to orchestrate your dbt Cloud job. Once cloned, navigate into the `airflow-dbt-cloud` project.

```bash
git clone https://github.com/sungchun12/airflow-dbt-cloud.git
cd airflow-dbt-cloud
```

<WistiaVideo id="oo1yel115i" paddingTweak="62.25%" />

## Start the Docker container

1. From the `airflow-dbt-cloud` directory you cloned and opened in the prior step, run the following command to start your local Airflow deployment:

   ```bash
   astro dev start
   ```

   When this finishes, you should see a message similar to the following:

   ```bash
   Airflow is starting up! This might take a few minutes…

   Project is running! All components are now available.

   Airflow Webserver: http://localhost:8080
   Postgres Database: localhost:5432/postgres
   The default Airflow UI credentials are: admin:admin
   The default Postgres DB credentials are: postgres:postgres
   ```

2. Open the Airflow interface. Launch your web browser and navigate to the address for the **Airflow Webserver** from your output above (for us, `http://localhost:8080`).

   This will take you to your local instance of Airflow. You’ll need to log in with the **default credentials**:

   - Username: admin
   - Password: admin

   ![Airflow login screen](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-login.png)

<WistiaVideo id="2rzsjo0uml" paddingTweak="62.25%" />

## Create a dbt Cloud service token

[Create a service token](/docs/dbt-cloud-apis/service-tokens) with `Job Admin` privileges from within dbt Cloud. Ensure that you save a copy of the token, as you won’t be able to access this later.

<WistiaVideo id="amubh6qmwq" paddingTweak="62.25%" />

## Create a dbt Cloud job

[Create a job in your dbt Cloud account](/docs/deploy/deploy-jobs#create-and-schedule-jobs), paying special attention to the information in the bullets below.

- Configure the job with the full commands that you want to include when this job kicks off. This sample code has Airflow triggering the dbt Cloud job and all of its commands, instead of explicitly identifying individual models to run from inside of Airflow.
- Ensure that the schedule is turned **off** since we’ll be using Airflow to kick things off.
- Once you hit `save` on the job, make sure you copy the URL and save it for referencing later. The url will look similar to this:

```html
https://cloud.getdbt.com/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
```

<WistiaVideo id="qiife5rzlp" paddingTweak="62.25%" />

## Connect dbt Cloud to Airflow

Now you have all the working pieces to get up and running with Airflow + dbt Cloud. It's time to **set up a connection** and **run a DAG in Airflow** that kicks off a dbt Cloud job.

1. From the Airflow interface, navigate to Admin and click on **Connections**

    ![Airflow connections menu](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-connections-menu.png)

2. Click on the `+` sign to add a new connection, then click on the drop down to search for the dbt Cloud Connection Type

    ![Connection type](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type.png)

3. Add in your connection details and your default dbt Cloud account id. This is found in your dbt Cloud URL after the accounts route section (`/accounts/{YOUR_ACCOUNT_ID}`), for example the account with id 16173 would see this in their URL: `https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/`

    ![Connection type](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type-configured.png)

## Update the placeholders in the sample code

 Add your `account_id` and `job_id` to the python file [dbt_cloud_provider_eltml.py](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/dags/dbt_cloud_provider_eltml.py).

Both IDs are included inside of the dbt Cloud job URL as shown in the following snippets:

```python
# For the dbt Cloud Job URL https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/
# The account_id is 16173

# Update line 28
default_args={"dbt_cloud_conn_id": "dbt_cloud", "account_id": 16173},
```

```python
# For the dbt Cloud Job URL https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/
# The job_id is 65767

# Update line 39
trigger_dbt_cloud_job_run = DbtCloudRunJobOperator(
        task_id="trigger_dbt_cloud_job_run",
        job_id=65767,
        check_interval=10,
        timeout=300,
    )
```

<WistiaVideo id="wgy7wvgqof" paddingTweak="62.25%" />

## Run the Airflow DAG

Turn on the DAG and trigger it to run. Verify the job succeeded after running.

![Airflow DAG](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-dag.png)

Click Monitor Job Run to open the run details in dbt Cloud.
![Task run instance](/img/guides/orchestration/airflow-and-dbt-cloud/task-run-instance.png)

## Cleaning up

At the end of this guide, make sure you shut down your docker container.  When you’re done using Airflow, use the following command to stop the container:

```bash
$ astrocloud dev stop

[+] Running 3/3
 ⠿ Container airflow-dbt-cloud_e3fe3c-webserver-1  Stopped    7.5s
 ⠿ Container airflow-dbt-cloud_e3fe3c-scheduler-1  Stopped    3.3s
 ⠿ Container airflow-dbt-cloud_e3fe3c-postgres-1   Stopped    0.3s
```

To verify that the deployment has stopped, use the following command:

```bash
astrocloud dev ps
```

This should give you an output like this:

```bash
Name                                    State   Ports
airflow-dbt-cloud_e3fe3c-webserver-1    exited
airflow-dbt-cloud_e3fe3c-scheduler-1    exited
airflow-dbt-cloud_e3fe3c-postgres-1     exited
```

<WistiaVideo id="u83nuqegn9" paddingTweak="62.25%"/>

## Frequently asked questions

### How can we run specific subsections of the dbt DAG in Airflow?

Because the Airflow DAG references dbt Cloud jobs, your analytics engineers can take responsibility for configuring the jobs in dbt Cloud.

For example, to run some models hourly and others daily, there will be jobs like `Hourly Run` or `Daily Run` using the commands `dbt run --select tag:hourly` and `dbt run --select tag:daily` respectively. Once configured in dbt Cloud, these can be added as steps in an Airflow DAG as shown in this guide. Refer to our full [node selection syntax docs here](/reference/node-selection/syntax).

### How can I re-run models from the point of failure?  

You can trigger re-run from point of failure with the `rerun` API endpoint. See the docs on [retrying jobs](/docs/deploy/retry-jobs) for more information.

### Should Airflow run one big dbt job or many dbt jobs?

dbt jobs are most effective when a build command contains as many models at once as is practical. This is because dbt manages the dependencies between models and coordinates running them in order, which ensures that your jobs can run in a highly parallelized fashion. It also streamlines the debugging process when a model fails and enables re-run from point of failure.

As an explicit example, it's not recommended to have a dbt job for every single node in your DAG. Try combining your steps according to desired run frequency, or grouping by department (finance, marketing, customer success...) instead.

### We want to kick off our dbt jobs after our ingestion tool (such as Fivetran) / data pipelines are done loading data. Any best practices around that?

Astronomer's DAG registry has a sample workflow combining Fivetran, dbt Cloud and Census [here](https://registry.astronomer.io/dags/fivetran-dbt_cloud-census/versions/3.0.0).
  
### How do you set up a CI/CD workflow with Airflow?

Check out these two resources for accomplishing your own CI/CD pipeline:

- [Continuous Integration with dbt Cloud](/docs/deploy/continuous-integration)
- [Astronomer's CI/CD Example](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)

### Can dbt dynamically create tasks in the DAG like Airflow can?

As discussed above, we prefer to keep jobs bundled together and containing as many nodes as are necessary. If you must run nodes one at a time for some reason, then review [this article](https://www.astronomer.io/blog/airflow-dbt-1/) for some pointers.

### Can you trigger notifications if a dbt job fails with Airflow?

Yes, either through [Airflow's email/slack](https://www.astronomer.io/guides/error-notifications-in-airflow/) functionality, or [dbt Cloud's notifications](/docs/deploy/job-notifications), which support email and Slack notifications. You could also create a [webhook](/docs/deploy/webhooks).

### How should I plan my dbt Cloud + Airflow implementation?

Check out [this recording](https://www.youtube.com/watch?v=n7IIThR8hGk) of a dbt meetup for some tips.
