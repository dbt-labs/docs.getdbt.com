---
title: "Trigger a dbt Cloud job after a run finishes" 
id: webhooks-guide-zapier-new-cloud-job
slug: zapier-new-cloud-job
description: Use Zapier to interact with the dbt Cloud API
---

This guide will show you how to trigger a dbt Cloud job based on the successful completion of a different job. This can be useful when you need to trigger a job in a different project. Remember that dbt works best when it understands the whole context of the <Term id="dag"/> it has been asked to run, so use this ability judiciously.

## Prerequisites

In order to set up the integration, you should have familiarity with:
- [dbt Cloud Webhooks](/docs/deploy/webhooks)
- Zapier

## Integration steps

### 1. Create a new Zap in Zapier
Use **Webhooks by Zapier** as the Trigger, and **Catch Raw Hook** as the Event. If you don't intend to [validate the authenticity of your webhook](/docs/deploy/webhooks#validate-a-webhook) (not recommended!) then you can choose **Catch Hook** instead. 

Press **Continue**, then copy the webhook URL. 

![Screenshot of the Zapier UI, showing the webhook URL ready to be copied](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

### 2. Configure a new webhook in dbt Cloud
See [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription) for full instructions. Your event should be **Run completed**, and you need to change the **Jobs** list to only contain the job you want to trigger the next run.

Make note of the Webhook Secret Key for later.

Once you've tested the endpoint in dbt Cloud, go back to Zapier and click **Test Trigger**, which will create a sample webhook body based on the test event dbt Cloud sent.

The sample body's values are hard-coded and not reflective of your project, but they give Zapier a correctly-shaped object during development. 

### 3. Store secrets 
In the next step, you will need the Webhook Secret Key from the prior step, and a dbt Cloud [user token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) or [service account token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens). 

Zapier allows you to [store secrets](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), which prevents your keys from being displayed in plaintext in the Zap code. You will be able to access them via the [StoreClient utility](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

<Snippet path="webhook_guide_zapier_secret_store" />

### 4. Add a code action
Select **Code by Zapier** as the App, and **Run Python** as the Event. 

In the **Set up action** area, add two items to **Input Data**: `raw_body` and `auth_header`. Map those to the `1. Raw Body` and `1. Headers Http Authorization` fields from the **Catch Raw Hook** step above.

![Screenshot of the Zapier UI, showing the mappings of raw_body and auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

In the **Code** field, paste the following code, replacing `YOUR_SECRET_HERE` with the secret you created when setting up the Storage by Zapier integration. Remember that this is not your dbt Cloud secret.

The code below will validate the authenticity of the request, then send a [`trigger run` command to the dbt Cloud API](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#tag/Jobs/operation/triggerRun) for the given job ID.

```python
import hashlib
import hmac
import json

#replace with the Job ID you want to run
target_job_id = 12345 

auth_header = input_data['auth_header']
raw_body = input_data['raw_body']

# Access secret credentials
secret_store = StoreClient('YOUR_SECRET_HERE')
hook_secret = secret_store.get('DBT_WEBHOOK_KEY')
api_token = secret_store.get('DBT_CLOUD_SERVICE_TOKEN')

# Validate the webhook came from dbt Cloud
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from dbt Cloud.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

if hook_data['runStatus'] == "Success":

  # Trigger a new run with the dbt Cloud Admin API
  url = f'https://cloud.getdbt.com/api/v2/accounts/{full_body['accountId']}/jobs/{target_job_id}/run'

  body = {'cause':  f"Triggered by Zapier because {hook_data['jobName']} Run #{hook_data['runId']} completed successfully"}
  headers = {'Authorization': f'Token {api_token}'}
  response = requests.post(url, json=body, headers=headers)
  response.raise_for_status()

return
```

### 5. Test and deploy
When you're happy with it, remember to ensure that your `account_id` is no longer hardcoded, then publish your Zap.
