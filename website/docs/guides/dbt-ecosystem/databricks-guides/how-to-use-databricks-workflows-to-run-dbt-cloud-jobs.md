# How to use Databricks workflows to run dbt Cloud Jobs

## Why

Using Databricks workflows to call the dbt Cloud Job API can be useful for a few reasons:

1. **Integration with other ETL processes**: If you have other ETL processes running in Databricks, you can use a Databricks workflow to trigger a dbt Cloud job once the ETL processes have completed.
2. **Utilises dbt Cloud Jobs features:** dbt Cloud gives the ability to monitor jobs, manage historical logs and documentation, optimise model timing and much more.
3. **Separation of concerns:** detailed logs for dbt jobs will be stored in the dbt Cloud environment which means more modularity and efficient debugging. You will be able to isolate the bugs faster whilst still being able to see the overall status in Databricks.
4. **Customisable job triggering:** If you want to trigger dbt Cloud jobs based on custom conditions or logic that are not natively supported by dbt Cloud's scheduling feature, you can use a Databricks workflow to trigger the job with a custom script. This gives you more flexibility in how and when your dbt Cloud jobs run.

## Pre-requisites

- Active Databricks Account with access to [Data Science and Engineering workspace](https://docs.databricks.com/workspace-index.html) and [Manage secrets](https://docs.databricks.com/security/secrets/index.html)
- Existing [dbt Cloud Job](https://docs.getdbt.com/docs/deploy/dbt-cloud-job)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)

## How

To use Databricks workflows to run dbt Cloud Jobs, you will need to follow these steps:

### Setup Secrets

1. Retrieve [User API Token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens#user-api-tokens) or [Service Account Token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens) from dbt Cloud
2. Set up a Databricks secret scope. This is used to securely store your dbt Cloud API key. You can create a new secret scope by using [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html). Enter the following commands in your terminal:

```bash
# In this example we set up a secret scope and key called "dbt-cloud" and "api-key" respectively.
databricks secrets create-scope --scope dbt-cloud
databricks secrets put --scope dbt-cloud --key api-key --string-value **"<YOUR_DBT_CLOUD_API_KEY>"**
```

Replace **`<YOUR_DBT_CLOUD_API_KEY>`** with the actual API key value that you copied from dbt Cloud in step 1.

### Create Databricks Notebook

1. [Create a Databricks Python notebook](https://docs.databricks.com/notebooks/notebooks-manage.html). This notebook will execute a Python script that calls the dbt Cloud Job API. 
2. Create a Python script that calls the dbt Cloud Job API. This script should use the `requests` library to make an `HTTP POST` request to the dbt Cloud Job API endpoint with the appropriate parameters. Here's an example script:

```python
import enum
import os
import time
import json
import requests
from getpass import getpass
     
dbutils.widgets.text("base_url", "Enter the Base URL")
dbutils.widgets.text("job_id", "Enter the Job ID")
dbutils.widgets.text("account_id", "Enter your Account ID")

job_id = dbutils.widgets.get("job_id")
account_id = dbutils.widgets.get("account_id")
base_url =  dbutils.widgets.get("base_url")
#You may need to change the scope and key below if you stored your secret in another location
api_key =  dbutils.secrets.get(scope = "dbt-cloud", key = "api-key")

# These are documented on the dbt Cloud API docs
class DbtJobRunStatus(enum.IntEnum):
    QUEUED = 1
    STARTING = 2
    RUNNING = 3
    SUCCESS = 10
    ERROR = 20
    CANCELLED = 30

def _trigger_job() -> int:
    res = requests.post(
        url=f"https://{base_url}/api/v2/accounts/{account_id}/jobs/{job_id}/run/",
        headers={'Authorization': f"Token {api_key}"},
        json={
            # Optionally pass a description that can be viewed within the dbt Cloud API.
            # See the API docs for additional parameters that can be passed in,
            # including `schema_override` 
            'cause': f"Triggered by Databricks Workflows.",
        }
    )

    try:
        res.raise_for_status()
    except:
        print(f"API token (last four): ...{api_key[-4:]}")
        raise

    response_payload = res.json()
    return response_payload['data']['id']

def _get_job_run_status(job_run_id):
    res = requests.get(
        url=f"https://{base_url}/api/v2/accounts/{account_id}/runs/{job_run_id}/",
        headers={'Authorization': f"Token {api_key}"},
    )

    res.raise_for_status()
    response_payload = res.json()
    return response_payload['data']['status']

def run():
    job_run_id = _trigger_job()
    print(f"job_run_id = {job_run_id}")   
    while True:
        time.sleep(5)
        status = _get_job_run_status(job_run_id)
        print(DbtJobRunStatus(status))
        if status == DbtJobRunStatus.SUCCESS:
            break
        elif status == DbtJobRunStatus.ERROR or status == DbtJobRunStatus.CANCELLED:
            raise Exception("Failure!")

if __name__ == '__main__':
    run()
```

3. Run the Notebook. This will fail however you should now see  widgets at the top of your notebook for the following parameters: `account_id`, `base_url` , `job_id`
4. Enter your  `account_id`, `base_url` , `job_id`

To find out those values, navigate to dbt Cloud and click Deploy>Jobs and select the Job you want to run. Your URL will be structured like so:

`https://**<YOUR_BASE_URL>**/deploy/**<YOUR_ACCOUNT_ID>**/projects/**<YOUR_DBT_PROJECT_ID>**/jobs/**<YOUR_DBT_CLOUD_JOB_ID>**`

For example:

`https://cloud.getdbt.com/deploy/000000/projects/111111/jobs/222222`

Therefore the following can be extracted:
| Parameter | Value  |
|---|---|
| base_url | cloud.getdbt.com |
| account_id | 000000 |
| job_id | 222222 |

5. Run the Notebook again to kick off the dbt Cloud job. Your results should look similar to the following
```bash
job_run_id = 123456
DbtJobRunStatus.QUEUED
DbtJobRunStatus.QUEUED
DbtJobRunStatus.QUEUED
DbtJobRunStatus.STARTING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.RUNNING
DbtJobRunStatus.SUCCESS
```
- If needed the job can be cancelled from dbt cloud.

### Setup Workflows

You can set up workflows directly from the notebook OR by adding this notebook to one of your existing workflows

To create a workflow from an existing Notebook:

1. Click Schedule on the top right
2. Click Add a schedule
3. Configure Job name, Schedule, Cluster
4. Add the following Parameters: `job_id` ,`account_id` and `base_url` and add the appropriate values. Refer to Step 4 of Create Databricks Notebook for details.
5. Click Create
6. To test the Job, Click Run Now

To add the notebook to an existing Workflow 

1. Open Existing Workflow
2. Click Tasks
3. Press “+” icon to add a new task
4. Enter the following:
| Field | Value |
|---|---|
| Task name | <unique_task_name> |
| Type | Notebook |
| Source | Workspace |
| Path | </path/to/notebook> |
| Cluster | <your_compute_cluster> |
| Parameters | job_id - <your-dbt-job-id>
account_id - <your-dbt-account-id>
base_url - <your-base-url> |
5. Select Save Task
6. Click Run now to test the workflow

## Wrap up

Overall, using Databricks workflows to call the dbt Cloud Job API can help you better integrate your data pipeline processes and schedule more complex workflows.
