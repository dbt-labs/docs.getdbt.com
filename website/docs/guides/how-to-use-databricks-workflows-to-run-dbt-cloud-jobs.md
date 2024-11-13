---
title: "Use Databricks workflows to run dbt Cloud jobs"
id: how-to-use-databricks-workflows-to-run-dbt-cloud-jobs
description: Learn how to use Databricks workflows to run dbt Cloud jobs
displayText: "Use Databricks workflows to run dbt Cloud jobs"
hoverSnippet: Learn how to use Databricks workflows to run dbt Cloud jobs
# time_to_complete: '30 minutes' commenting out until we test
icon: 'databricks'
hide_table_of_contents: true
tags: ['Databricks', 'dbt Core','dbt Cloud','Orchestration']
level: 'Intermediate'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

Using Databricks workflows to call the dbt Cloud job API can be useful for several reasons:

1. **Integration with other ETL processes** &mdash; If you're already running other ETL processes in Databricks, you can use a Databricks workflow to trigger a dbt Cloud job after those processes are done.
2. **Utilizes dbt Cloud jobs features &mdash;** dbt Cloud gives the ability to monitor job progress, manage historical logs and documentation, optimize model timing, and much [more](/docs/deploy/deploy-jobs).
3. [**Separation of concerns &mdash;**](https://en.wikipedia.org/wiki/Separation_of_concerns) Detailed logs for dbt jobs in the dbt Cloud environment can lead to more modularity and efficient debugging. By doing so, it becomes easier to isolate bugs quickly while still being able to see the overall status in Databricks.
4. **Custom job triggering &mdash;** Use a Databricks workflow to trigger dbt Cloud jobs based on custom conditions or logic that aren't natively supported by dbt Cloud's scheduling feature. This can give you more flexibility in terms of when and how your dbt Cloud jobs run.

### Prerequisites

- Active [Teams or Enterprise dbt Cloud account](https://www.getdbt.com/pricing/)
- You must have a configured and existing [dbt Cloud deploy job](/docs/deploy/deploy-jobs)
- Active Databricks account with access to [Data Science and Engineering workspace](https://docs.databricks.com/workspace-index.html) and [Manage secrets](https://docs.databricks.com/security/secrets/index.html)
- [Databricks CLI](https://docs.databricks.com/dev-tools/cli/index.html)
  - **Note**: You only need to set up your authentication. Once you have set up your Host and Token and are able to run `databricks workspace ls /Users/<someone@example.com>`, you can proceed with the rest of this guide.

## Set up a Databricks secret scope

1. Retrieve **[personal access token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) **or **[Service account token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens#generating-service-account-tokens) **from dbt Cloud
2. Set up a **Databricks secret scope**, which is used to securely store your dbt Cloud API key. 

3. Enter the **following commands** in your terminal:

```bash
# In this example we set up a secret scope and key called "dbt-cloud" and "api-key" respectively.
databricks secrets create-scope --scope <YOUR_SECRET_SCOPE>
databricks secrets put --scope  <YOUR_SECRET_SCOPE> --key  <YOUR_SECRET_KEY> --string-value "<YOUR_DBT_CLOUD_API_KEY>"
```

4. Replace **`<YOUR_SECRET_SCOPE>`** and **`<YOUR_SECRET_KEY>`** with your own unique identifiers. Click [here](https://docs.databricks.com/security/secrets/index.html) for more information on secrets.

5. Replace **`<YOUR_DBT_CLOUD_API_KEY>`** with the actual API key value that you copied from dbt Cloud in step 1.


## Create a Databricks Python notebook

1. [Create a **Databricks Python notebook**](https://docs.databricks.com/notebooks/notebooks-manage.html), which executes a Python script that calls the dbt Cloud job API. 

2. Write a **Python script** that utilizes the `requests` library to make an HTTP POST request to the dbt Cloud job API endpoint using the required parameters. Here's an example script:

```python
import enum
import os
import time
import json
import requests
from getpass import getpass
     
dbutils.widgets.text("job_id", "Enter the Job ID")
job_id = dbutils.widgets.get("job_id")

account_id = <YOUR_ACCOUNT_ID>
base_url =  "<YOUR_BASE_URL>"
api_key =  dbutils.secrets.get(scope = "<YOUR_SECRET_SCOPE>", key = "<YOUR_SECRET_KEY>")

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

3. Replace **`<YOUR_SECRET_SCOPE>`** and **`<YOUR_SECRET_KEY>`** with the values you used [previously](#set-up-a-databricks-secret-scope)

4. Replace **`<YOUR_BASE_URL>`** and **`<YOUR_ACCOUNT_ID>`** with the correct values of your environment and [Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan.

    * To find these values, navigate to **dbt Cloud**, select **Deploy -> Jobs**.  Select the Job you want to run and copy the URL. For example: `https://YOUR_ACCESS_URL/deploy/000000/projects/111111/jobs/222222`
    and therefore valid code would be:

Your URL is structured `https://<YOUR_BASE_URL>/deploy/<YOUR_ACCOUNT_ID>/projects/<YOUR_PROJECT_ID>/jobs/<YOUR_JOB_ID>`
    account_id = 000000
    job_id = 222222
    base_url =  "cloud.getdbt.com"


5. Run the Notebook.  It will fail, but you should see **a `job_id` widget** at the top of your notebook.

6. In the widget, **enter your `job_id`** from step 4.

7. **Run the Notebook again** to trigger the dbt Cloud job. Your results should look similar to the following:

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

You can cancel the job from dbt Cloud if necessary.

## Configure the workflows to run the dbt Cloud jobs

You can set up workflows directly from the notebook OR by adding this notebook to one of your existing workflows: 

<Tabs>

<TabItem value="createexisting" label="Create a workflow from existing Notebook">

1. Click **Schedule** on the upper right side of the page
2. Click **Add a schedule**
3. Configure Job name, Schedule, Cluster
4. Add a new parameter called: `job_id` and fill in your job ID. Refer to [step 4 in previous section](#create-a-databricks-python-notebook) to find your job ID.
5. Click **Create**
6. Click **Run Now** to test the job

</TabItem>

<TabItem value="addexisting" label="Add the Notebook to existing workflow">

1. Open Existing **Workflow**
2. Click **Tasks**
3. Press **“+” icon** to add a new task
4. Enter the **following**:

| Field | Value |
|---|---|
| Task name | `<unique_task_name>` |
| Type | Notebook |
| Source | Workspace |
| Path | `</path/to/notebook>` |
| Cluster | `<your_compute_cluster>` |
| Parameters | `job_id`: `<your_dbt_job_id>` |

5. Select **Save Task**
6. Click **Run Now** to test the workflow

</TabItem>
</Tabs>

Multiple Workflow tasks can be set up using the same notebook by configuring the `job_id` parameter to point to different dbt Cloud jobs. 

Using Databricks workflows to access the dbt Cloud job API can improve integration of your data pipeline processes and enable scheduling of more complex workflows.

</div>