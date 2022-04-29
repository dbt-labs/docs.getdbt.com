---
title: "dbt Cloud + Airflow"
id: "airflow-dbt-cloud"
---

# dbt Cloud + Airflow Guide

**Authors**: Sung Won Chung, Christine Berger

**Special Thanks**: Kyle Coapman, Alexis Baird, Winnie Winship
## Why does this guide matter?

There are a few reasons your team might be considering using Airflow to orchestrate your dbt jobs:

- Your team is already using Airflow to orchestrate other processes
- Your team needs to ensure that a dbt job kicks off before or after another process outside of dbt Cloud
- Your team needs flexibility to manage more complex scheduling, such as kicking off one dbt job only after another has completed
- Your team wants to own their own orchestration solution
- You need code to work right now without starting from scratch

## How are people using airflow + dbt today?

**Airflow + dbt Core**

There are so many great examples from Gitlab through their open source data engineering work. Example: [here](https://gitlab.com/gitlab-data/analytics/-/blob/master/dags/transformation/dbt_snowplow_backfill.py). This is especially appropriate if you are well-versed in Kubernetes, CI/CD, and docker task management when building your airflow pipelines. If this is you and your team, you’re in good hands reading through more details: [here](https://about.gitlab.com/handbook/business-technology/data-team/platform/infrastructure/#airflow) and [here](https://about.gitlab.com/handbook/business-technology/data-team/platform/dbt-guide/)

**Airflow + dbt Cloud API w/Custom Scripts**

This has honestly served as a bridge until the fabled Astronomer + dbt Labs-built dbt Cloud provider became generally available: [here](https://registry.astronomer.io/providers/dbt-cloud?type=Sensors&utm_campaign=Monthly%20Product%20Updates&utm_medium=email&_hsmi=208603877&utm_content=208603877&utm_source=hs_email)

And honestly, there are so many different permutations of this over time:

- [Custom Python Scripts](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/archive/dbt_cloud_example.py): This is an airflow DAG based on custom python API utilities [here](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/archive/dbt_cloud_utils.py)
- [Make API requests directly through the BashOperator based on the docs](https://docs.getdbt.com/dbt-cloud/api-v2#operation/triggerRun): You can make cURL requests to invoke dbt Cloud to do what you want
- [Other ways to run dbt in airflow](https://docs.getdbt.com/docs/running-a-dbt-project/running-dbt-in-production/#using-airflow): Official dbt Docs on how teams are running dbt in airflow

## What’s missing?

These solutions are great, but can be difficult to trust as your team grows and management for things like: testing, job definitions, secrets, and pipelines increase past your team’s capacity. Roles become blurry (or were never clearly defined at the start!). Both data and analytics engineers start digging through custom logging within each other’s workflows to make heads or tails of where and what the issue really is. Not to mention that when the issue is found, it can be even harder to decide on the best path forward for safely implementing fixes. This complex workflow and unclear delineation on process management results in a lot of misunderstandings and wasted time just trying to get the process to work smoothly! 

## We’ll show you a better way!

**After today’s walkthrough, you’ll get hands-on experience**:

- Creating a working local Airflow environment
- Invoking a dbt Cloud job with Airflow (with proof!)
- Reusing tested and trusted Airflow code for your specific use cases

***and while you’re learning the ropes, you’ll also gain a better understanding of how this helps to***:

- Reduce the cognitive load when building and maintaining pipelines
- Avoid dependency hell (think: pip install conflicts
- Implement better recoveries from failures
- Define clearer workflows so that data and analytics engineers work better, together ♥️

**Prerequisites**

- [dbt Cloud Teams or Enterprise account](https://www.getdbt.com/pricing/) (with [admin access](https://docs.getdbt.com/docs/dbt-cloud/access-control/enterprise-permissions)) in order to create a service token. Permissions for service tokens can be found [here](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens#permissions-for-service-account-tokens).
- A [free Docker account](https://hub.docker.com/signup) in order to sign in to Docker Desktop, which will be installed in the initial setup.
- A local digital scratchpad for temporarily copy-pasting API keys and URLs

🙌   Let’s get started! 🙌

## Initial Setup

1. **Install the Astro CLI**
Astro is a managed software service that includes key features for teams working with Airflow. In order to use Astro, we’ll install the Astro CLI, which will give us access to useful commands for working with Airflow locally. You can read more about Astro [here](https://docs.astronomer.io/astro/).

In this example, we’re using Homebrew to install Astro CLI. Follow the instructions to install the Astro CLI for your own operating system [here](https://docs.astronomer.io/astro/install-cli).

```bash
$ brew install astronomer/cloud/astrocloud
```

<WistiaVideo id="uosszw1qul" />
    
2. **Install and start Docker Desktop**
    
    Docker allows us to spin up an environment with all the apps and dependencies we need for the example. 
    
    Follow the instructions [here](https://docs.docker.com/desktop/) to install Docker desktop for your own operating system. Once Docker is installed, ensure you have it up and running for the next steps.
    
    <WistiaVideo id="qr84pa8k9f" />
    
3. **Clone the airflow-dbt-cloud repository**
Open your terminal and clone the [airflow-dbt-cloud repository](https://github.com/sungchun12/airflow-dbt-cloud.git). This contains example Airflow DAGs that you’ll use to orchestrate your dbt Cloud job. Once cloned, navigate into the `airflow-dbt-cloud` project.
    
    ```bash
    $ git clone https://github.com/sungchun12/airflow-dbt-cloud.git
    $ cd airflow-dbt-cloud
    ```
    
<WistiaVideo id="oo1yel115i" />
    
4. **Start the Docker container**
    1. Run the following command to spin up the Docker container and start your local Airflow deployment:
        
        ```bash
        $ astrocloud dev start
        ```
        
        When this finishes, you should see a message similar to the following:
        
        ```bash
        Airflow is starting up! This might take a few minutes…
        
        Project is running! All components are now available.
        
        Airflow Webserver: http://localhost:8080
        Postgres Database: localhost:5432/postgres
        The default Airflow UI credentials are: admin:admin
        The default Postrgres DB credentials are: postgres:postgres
        ```
        
    2. **Open the Airflow interface**:
    Open up a web browser and navigate to the address for the **Airflow Webserver.**
    This will take you to your local instance of Airflow. You’ll need to log in with the **default credentials.**

        1. Username: admin
        2. Password: admin
        ![Untitled](images/Screen_Shot_2022-04-06_at_3.52.05_PM.png)
    
    <WistiaVideo id="2rzsjo0uml" />
    
5. **Create a dbt Cloud service token**
    
    Create a service token from within dbt Cloud using the instructions [found here](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens). Ensure that you save a copy of the token, as you won’t be able to access this later. In this example we use `Account Admin`, but you can also use `Job Admin` instead for token permissions.
    
    <WistiaVideo id="amubh6qmwq" />
    
6. **Create a dbt Cloud job**
    
    In your dbt Cloud account create a job, paying special attention to the information in the bullets below. Additional information for creating a dbt Cloud job can be found [here](https://docs.getdbt.com/docs/dbt-cloud/cloud-quickstart/#create-a-new-job). 
    
    - Configure the job with the commands that you want to include when this job kicks off, as Airflow will be referring to the job’s configurations for this rather than being explicitly coded in the Airflow DAG. This job will run a set of commands rather than a single command.
    - Ensure that the schedule is turned **off** since we’ll be using Airflow to kick things off.
    - Once you hit `save` on the job, make sure you copy the URL and save it for referencing later. The url will look similar to this:
        
        ```html
        https://cloud.getdbt.com/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
        ```
        
    
    <WistiaVideo id="qiife5rzlp" />
    

## Run the Airflow + dbt Cloud DAG

<WistiaVideo id="wgy7wvgqof" />

Now you have all the working pieces to get up and running with Airflow + dbt Cloud. Let’s dive into make this all work together.  We will **set up a connection** and **run a DAG in Airflow** that kicks off a dbt Cloud.

<WistiaVideo id="oo1yel115i" />

1. Add your dbt Cloud API token as a secure connection
    1. Navigate to Admin and click on Connections
        
        ![Untitled](images/Untitled.png)
        
    2. Click on the + sign to add a new connection >> Click on the drop down to search for the dbt Cloud Connection Type
    
    ![Untitled](images/Untitled_1.png)
    ![Untitled](images/Untitled_2.png)
    
    c. Add in your connection details and your Account ID default: this is found in your dbt Cloud URL(Account ID 16173 example: https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/) 
    
    ![Untitled](images/dbt_cloud_api_token_connection.png)
    
2. Add your job_id and account_id config details to the python file: [dbt_cloud_provider_eltml.py](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/dags/dbt_cloud_provider_eltml.py)
    1. You’ll find these details within the dbt Cloud job URL, see the comments in the code snippet below for an example.
    
    ```python
    # dbt Cloud Job URL: https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/
    # account_id: 16173
    #job_id: 65767
    
    # line 28
    default_args={"dbt_cloud_conn_id": "dbt_cloud", "account_id": 16173},
    
    trigger_dbt_cloud_job_run = DbtCloudRunJobOperator(
            task_id="trigger_dbt_cloud_job_run",
            job_id=65767, # line 39
            check_interval=10,
            timeout=300,
        )
    ```
    
3. Turn on the DAG and verify the job succeeded after running. Note: screenshots taken from different job runs, but the user experience is consistent.
    
    ![image](images/untiled_9.png)
    
    ![Untitled](images/Untitled_3.png)
    
    ![Untitled](images/Untitled_4.png)
    
    ![Untitled](images/dbt_cloud_success.png)
    

## How do I rerun the dbt Cloud job and downstream tasks in my pipeline?

If you have worked with dbt Cloud before, you have likely encountered cases where a job fails. In those cases, you have likely logged into dbt Cloud, investigated the error, and then manually restarted the job.

This section of the tutorial will show you how to restart the job directly from Airflow.  This will specifically run *just* the `trigger_dbt_cloud_job_run` and downstream tasks of the Airflow DAG and not the entire DAG.  If only the transformation step fails, you don’t need to re-run the extract and load processes. Let’s jump into how to do that in Airflow.

1. Click on the task

![Untitled](images/Untitled_5.png)

2. Clear the task instance

![Untitled](images/Untitled_6.png)

![Untitled](images/Untitled_7.png)

3. Watch it rerun in real time

![Untitled](images/Untitled_8.png)

# Ending the Tutorial

At the end of this tutorial, make sure you shut down your docker container.  When you’re done using Airflow, use the following command to stop the container:

```bash
$ astrocloud dev stop

[+] Running 3/3
 ⠿ Container airflow-dbt-cloud_e3fe3c-webserver-1  Stopped                                                                                   7.5s
 ⠿ Container airflow-dbt-cloud_e3fe3c-scheduler-1  Stopped                                                                                   3.3s
 ⠿ Container airflow-dbt-cloud_e3fe3c-postgres-1   Stopped                                                                                   0.3s
```

To verify that the deployment has stopped, use the following command:

```bash
$ astrocloud dev ps
```

This should give you an output like this:

```bash
Name                                    State   Ports
airflow-dbt-cloud_e3fe3c-webserver-1    exited
airflow-dbt-cloud_e3fe3c-scheduler-1    exited
airflow-dbt-cloud_e3fe3c-postgres-1     exited
```

<WistiaVideo id="u83nuqegn9" />

# FAQs

The questions to the Professional Services team aren’t centered around the setup of Airflow - it’s more about how dbt processes can be managed with Airflow and best practices around that implementation. The following are a short list of questions similar to those that have been asked in the past by our clients:

1. How do you run specific subsections of the dbt DAG in Airflow? For example, I need to run my hourly-tagged models every hour and my daily-tagged models daily.
    
    Because of the way we configured the dbt Cloud job to run in Airflow, you can leave this job to your analytics engineers to define in the job configurations from dbt Cloud! This means they can create jobs like `Daily Run` or `Hourly Run` and utilize commands within them using `dbt run -s tag:hourly` or `dbt run -s tag:daily` ! You only need to grab your dbt Cloud `account` and `job id`, configure it in an Airflow DAG with the code provided, and then you can be on your way. See more node selection options: [here](https://docs.getdbt.com/reference/node-selection/syntax)
    
2. I want to be able to re-run models from the point of failure - does dbt have a way to do that in conjunction with Airflow, or do I need to make a task per model to make this work how I want it to in Airflow?
    1. You can’t do this natively in dbt Cloud today (feature coming!), but you can use this custom rerun parser. Watch the video below to see how it works!
    2. The main reason you want to parse the DAG in airflow is to solve for rerun from point of failure. But when you have hundreds of models in your DAG expanded out, it becomes useless for diagnosis and rerunning from point of failure(think: zooming in and out of the airflow DAG to click on the tasks to rerun)
    3. Using a simple python script coupled with the dbt Cloud provider, you can:
        - Avoid managing artifacts in a separate storage bucket(dbt Cloud does this for you)
        - Avoid building your own parsing logic
        - Get clear logs on what models you're rerunning in dbt Cloud(without hard coding step override commands)
    
    <WistiaVideo id="fn3ib5ew8y" />
    
3. Do you have any best practice recommendations for dbt orchestration with Airflow? (+1 from Alexis on this as well)
    1. Should Airflow run one big dbt job or many dbt jobs?
        1. One dbt job as dbt manages the dependencies between all the tables/views to be created in order
    2. We want to kick off our dbt jobs after our ingestion tool (such as Fivetran) / data pipelines are done loading data. Any best practices around that?
        1. Our friends at Astronomer answer this question with this example: [here](https://registry.astronomer.io/dags/fivetran-dbt-cloud-census)
4. How do you set up a CI/CD workflow with Airflow?
    1. Our friends at Astronomer answer this question: [here](https://docs.astronomer.io/software/ci-cd/#example-cicd-workflow)
    2. For CI/CD for dbt Cloud jobs, check out the docs: [here](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-enabling-continuous-integration#overview)
5. Can dbt dynamically create tasks in the DAG like Airflow can?
    1. Related: How do we dynamically create tasks in the Airflow DAG for our dbt models, so that way we don’t have to manage adding new tasks for new models?
    2. Our friends at Astronomer answer this question: [here](https://www.astronomer.io/blog/airflow-dbt-1/)
        1. You can go this route, but if you have hundreds of dbt models, it’s more effective to let dbt Cloud job bundle up all the dbt models vs. unbundling it yourself. What matters is clear observability when things go wrong. If you see hundreds of unbundled models, I have not seen people successful combing through all the task nodes to rerun things elegantly(think: zooming in and out of your DAG to make sense of what failed vs. not)
6. Can you trigger notifications if a dbt job fails with Airflow? Is there any way to access the status of the dbt Job to do that?
    1. Yes, either through [airflow email/slack](https://www.astronomer.io/guides/error-notifications-in-airflow/) functionality AND/OR [dbt Cloud notifications](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-notifications) which supports email and slack notifications
7. Are there decision criteria for how to best work with dbt Cloud and airflow?
    1. Check out this talk: [here](https://www.youtube.com/watch?v=n7IIThR8hGk)