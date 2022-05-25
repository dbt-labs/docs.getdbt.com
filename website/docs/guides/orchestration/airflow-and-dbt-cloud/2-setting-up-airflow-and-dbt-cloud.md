---
title: Setting up Airflow and dbt Cloud
id: 2-setting-up-airflow-and-dbt-cloud
---

## 1. Install the Astro CLI

Astro is a managed software service that includes key features for teams working with Airflow. In order to use Astro, we’ll install the Astro CLI, which will give us access to useful commands for working with Airflow locally. You can read more about Astro [here](https://docs.astronomer.io/astro/).

In this example, we’re using Homebrew to install Astro CLI. Follow the instructions to install the Astro CLI for your own operating system [here](https://docs.astronomer.io/astro/install-cli).

```bash
brew install astronomer/cloud/astrocloud
```

<LoomVideo id="d45fb5f61bc4443e9e83e996d46b2f9d" />

## 2. Install and start Docker Desktop

Docker allows us to spin up an environment with all the apps and dependencies we need for the example.

Follow the instructions [here](https://docs.docker.com/desktop/) to install Docker desktop for your own operating system. Once Docker is installed, ensure you have it up and running for the next steps.


<LoomVideo id="43fb0929154c4af9925bc035410e2fa8" />

## 3. Clone the airflow-dbt-cloud repository

Open your terminal and clone the [airflow-dbt-cloud repository](https://github.com/sungchun12/airflow-dbt-cloud.git). This contains example Airflow DAGs that you’ll use to orchestrate your dbt Cloud job. Once cloned, navigate into the `airflow-dbt-cloud` project.

```bash
git clone https://github.com/sungchun12/airflow-dbt-cloud.git
cd airflow-dbt-cloud
```

<LoomVideo id="77309b4375c640198c5557216642df93" />

## 4. Start the Docker container

1. Run the following command to spin up the Docker container and start your local Airflow deployment:

    ```bash
    astrocloud dev start
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

2. Open the Airflow interface. Launch your web browser and navigate to the address for the **Airflow Webserver** from your output in Step 1.

    This will take you to your local instance of Airflow. You’ll need to log in with the **default credentials**:

    - Username: admin
    - Password: admin

    ![Airflow login screen](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-login.png)

<LoomVideo id="c6c5e37f042b48adb25f67f8a0db51cb" />

## 5. Create a dbt Cloud service token

Create a service token from within dbt Cloud using the instructions [found here](https://docs.getdbt.com/docs/dbt-cloud/dbt-cloud-api/service-tokens). Ensure that you save a copy of the token, as you won’t be able to access this later. In this example we use `Account Admin`, but you can also use `Job Admin` instead for token permissions.

<LoomVideo id="6f02f871a3ae4f6bad302d8e03a1aa72" />

## 6. Create a dbt Cloud job

In your dbt Cloud account create a job, paying special attention to the information in the bullets below. Additional information for creating a dbt Cloud job can be found [here](https://docs.getdbt.com/docs/dbt-cloud/cloud-quickstart/#create-a-new-job).

- Configure the job with the commands that you want to include when this job kicks off, as Airflow will be referring to the job’s configurations for this rather than being explicitly coded in the Airflow DAG. This job will run a set of commands rather than a single command.
- Ensure that the schedule is turned **off** since we’ll be using Airflow to kick things off.
- Once you hit `save` on the job, make sure you copy the URL and save it for referencing later. The url will look similar to this:

```html
https://cloud.getdbt.com/#/accounts/{account_id}/projects/{project_id}/jobs/{job_id}/
```

<LoomVideo id="93439be726424bbba43f9b7be64d853d" />
