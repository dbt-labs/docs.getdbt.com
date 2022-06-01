---
title: Running Airflow and dbt Cloud
id: 3-running-airflow-and-dbt-cloud
---

<WistiaVideo id="wgy7wvgqof" />

Now you have all the working pieces to get up and running with Airflow + dbt Cloud. Let’s dive into make this all work together.  We will **set up a connection** and **run a DAG in Airflow** that kicks off a dbt Cloud job.

## 1. Add your dbt Cloud API token as a secure connection

1. Navigate to Admin and click on **Connections**

    ![Airflow connections menu](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-connections-menu.png)

2. Click on the `+` sign to add a new connection, then click on the drop down to search for the dbt Cloud Connection Type

    ![Create connection](/img/guides/orchestration/airflow-and-dbt-cloud/create-connection.png)

    ![Connection type](/img/guides/orchestration/airflow-and-dbt-cloud/connection-type.png)

3. Add in your connection details and your default dbt Cloud account id. This is found in your dbt Cloud URL after the accounts route section (`/accounts/{YOUR_ACCOUNT_ID}`), for example the account with id 16173 would see this in their URL: `https://cloud.getdbt.com/#/accounts/16173/projects/36467/jobs/65767/`

![https://lh3.googleusercontent.com/sRxe5xbv_LYhIKblc7eiY7AmByr1OibOac2_fIe54rpU3TBGwjMpdi_j0EPEFzM1_gNQXry7Jsm8aVw9wQBSNs1I6Cyzpvijaj0VGwSnmVf3OEV8Hv5EPOQHrwQgK2RhNBdyBxN2](https://lh3.googleusercontent.com/sRxe5xbv_LYhIKblc7eiY7AmByr1OibOac2_fIe54rpU3TBGwjMpdi_j0EPEFzM1_gNQXry7Jsm8aVw9wQBSNs1I6Cyzpvijaj0VGwSnmVf3OEV8Hv5EPOQHrwQgK2RhNBdyBxN2)

## 2. Add your `job_id` and `account_id` config details to the python file: [dbt_cloud_provider_eltml.py](https://github.com/sungchun12/airflow-dbt-cloud/blob/main/dags/dbt_cloud_provider_eltml.py)

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

2. Turn on the DAG and verify the job succeeded after running. Note: screenshots taken from different job runs, but the user experience is consistent.

    ![https://lh6.googleusercontent.com/p8AqQRy0UGVLjDGPmcuGYmQ_BRodyL0Zis-eQgSmp69EHbKW51o4S-bCl1fXHlOmwpYEBxD0A-O1Q1hwt-VDVMO1wWH-AIeaoelBx06JXRJ0m1OcHaPpFKH0xDiduIhNlQhhbLiy](https://lh6.googleusercontent.com/p8AqQRy0UGVLjDGPmcuGYmQ_BRodyL0Zis-eQgSmp69EHbKW51o4S-bCl1fXHlOmwpYEBxD0A-O1Q1hwt-VDVMO1wWH-AIeaoelBx06JXRJ0m1OcHaPpFKH0xDiduIhNlQhhbLiy)

    ![Airflow DAG](/img/guides/orchestration/airflow-and-dbt-cloud/airflow-dag.png)

    ![Task run instance](/img/guides/orchestration/airflow-and-dbt-cloud/task-run-instance.png)

    ![https://lh6.googleusercontent.com/S9QdGhLAdioZ3x634CChugsJRiSVtTTd5CTXbRL8ADA6nSbAlNn4zV0jb3aC946c8SGi9FRTfyTFXqjcM-EBrJNK5hQ0HHAsR5Fj7NbdGoUfBI7xFmgeoPqnoYpjyZzRZlXkjtxS](https://lh6.googleusercontent.com/S9QdGhLAdioZ3x634CChugsJRiSVtTTd5CTXbRL8ADA6nSbAlNn4zV0jb3aC946c8SGi9FRTfyTFXqjcM-EBrJNK5hQ0HHAsR5Fj7NbdGoUfBI7xFmgeoPqnoYpjyZzRZlXkjtxS)

## How do I rerun the dbt Cloud job and downstream tasks in my pipeline?

If you have worked with dbt Cloud before, you have likely encountered cases where a job fails. In those cases, you have likely logged into dbt Cloud, investigated the error, and then manually restarted the job.

This section of the guide will show you how to restart the job directly from Airflow.  This will specifically run *just* the `trigger_dbt_cloud_job_run` and downstream tasks of the Airflow DAG and not the entire DAG.  If only the transformation step fails, you don’t need to re-run the extract and load processes. Let’s jump into how to do that in Airflow.

1. Click on the task

    ![Task DAG view](/img/guides/orchestration/airflow-and-dbt-cloud/task-dag-view.png)

2. Clear the task instance

    ![Clear task instance](/img/guides/orchestration/airflow-and-dbt-cloud/clear-task-instance.png)

    ![Approve clearing](/img/guides/orchestration/airflow-and-dbt-cloud/approve-clearing.png)

3. Watch it rerun in real time

    ![Re-run](/img/guides/orchestration/airflow-and-dbt-cloud/re-run.png)

## Cleaning up

At the end of this guide, make sure you shut down your docker container.  When you’re done using Airflow, use the following command to stop the container:

```bash
$ astrocloud dev stop

[+] Running 3/3
 ⠿ Container airflow-dbt-cloud_e3fe3c-webserver-1  Stopped                                                                                   7.5s
 ⠿ Container airflow-dbt-cloud_e3fe3c-scheduler-1  Stopped                                                                                   3.3s
 ⠿ Container airflow-dbt-cloud_e3fe3c-postgres-1   Stopped                                                                                   0.3s
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

<WistiaVideo id="u83nuqegn9" />
