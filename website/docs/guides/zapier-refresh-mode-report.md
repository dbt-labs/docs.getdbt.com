---
title: "Refresh a Mode dashboard when a job completes"
id: zapier-refresh-mode-report
description: Use Zapier to trigger a Mode dashboard refresh when a dbt Cloud job completes.
hoverSnippet: Learn how to use Zapier to trigger a Mode dashboard refresh when a dbt Cloud job completes.
# time_to_complete: '30 minutes' commenting out until we test
icon: 'guides'
hide_table_of_contents: true
tags: ['Webhooks']
level: 'Advanced'
recently_updated: true
---

<div style={{maxWidth: '900px'}}>

## Introduction

This guide will teach you how to refresh a Mode dashboard when a dbt Cloud job has completed successfully and there is fresh data available. The integration will:

 - Receive a webhook notification in Zapier
 - Trigger a refresh of a Mode report

Although we are using the Mode API for a concrete example, the principles are readily transferrable to your [tool](https://learn.hex.tech/docs/develop-logic/hex-api/api-reference#operation/RunProject) [of](https://learn.microsoft.com/en-us/rest/api/power-bi/datasets/refresh-dataset) [choice](https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api_ref.htm#update_workbook_now). 

### Prerequisites

In order to set up the integration, you should have familiarity with:
- [dbt Cloud Webhooks](/docs/deploy/webhooks)
- Zapier
- The [Mode API](https://mode.com/developer/api-reference/introduction/)

## Create a new Zap in Zapier
Use **Webhooks by Zapier** as the Trigger, and **Catch Raw Hook** as the Event. If you don't intend to [validate the authenticity of your webhook](/docs/deploy/webhooks#validate-a-webhook) (not recommended!) then you can choose **Catch Hook** instead. 

Press **Continue**, then copy the webhook URL. 

![Screenshot of the Zapier UI, showing the webhook URL ready to be copied](/img/guides/orchestration/webhooks/zapier-common/catch-raw-hook.png)

## Configure a new webhook in dbt Cloud
See [Create a webhook subscription](/docs/deploy/webhooks#create-a-webhook-subscription) for full instructions. Your event should be **Run completed**, and you need to change the **Jobs** list to only contain any jobs whose completion should trigger a report refresh.

Make note of the Webhook Secret Key for later.

Once you've tested the endpoint in dbt Cloud, go back to Zapier and click **Test Trigger**, which will create a sample webhook body based on the test event dbt Cloud sent.

The sample body's values are hard-coded and not reflective of your project, but they give Zapier a correctly-shaped object during development. 

## Store secrets 
In the next step, you will need the Webhook Secret Key from the prior step, and a dbt Cloud [personal access token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) or [service account token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens), as well as a [Mode API token and secret](https://mode.com/developer/api-reference/authentication/). 

Zapier allows you to [store secrets](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), which prevents your keys from being displayed in plaintext in the Zap code. You will be able to access them via the [StoreClient utility](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

This guide assumes the names for the secret keys are: `DBT_WEBHOOK_KEY`, `MODE_API_TOKEN`, and `MODE_API_SECRET`. If you are using different names, make sure you update all references to them in the sample code.

This guide uses a short-lived code action to store the secrets, but you can also use a tool like Postman to interact with the [REST API](https://store.zapier.com/) or create a separate Zap and call the [Set Value Action](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps#3-set-a-value-in-your-store-0-3).

### a. Create a Storage by Zapier connection
If you haven't already got one, go to [https://zapier.com/app/connections/storage](https://zapier.com/app/connections/storage) and create a new connection. Remember the UUID secret you generate for later. 

### b. Add a temporary code step
Choose **Run Python** as the Event. Run the following code: 
```python 
store = StoreClient('abc123') #replace with your UUID secret
store.set('DBT_WEBHOOK_KEY', 'abc123') #replace with your dbt Cloud API token
store.set('MODE_API_TOKEN', 'abc123') #replace with your Mode API Token
store.set('MODE_API_SECRET', 'abc123') #replace with your Mode API Secret
```
Test the step. You can delete this Action when the test succeeds. The key will remain stored as long as it is accessed at least once every three months.

## Add a code action
Select **Code by Zapier** as the App, and **Run Python** as the Event. 

In the **Set up action** area, add two items to **Input Data**: `raw_body` and `auth_header`. Map those to the `1. Raw Body` and `1. Headers Http Authorization` fields from the **Catch Raw Hook** step above.

![Screenshot of the Zapier UI, showing the mappings of raw_body and auth_header](/img/guides/orchestration/webhooks/zapier-common/run-python.png)

In the **Code** field, paste the following code, replacing `YOUR_SECRET_HERE` in the StoreClient constructor with the secret you created when setting up the Storage by Zapier integration (not your dbt Cloud secret), and setting the `account_username` and `report_token` variables to actual values.

The code below will validate the authenticity of the request, then send a [`run report` command to the Mode API](https://mode.com/developer/api-reference/analytics/report-runs/#runReport) for the given report token.

```python
import hashlib
import hmac
import json

#replace with the report token you want to run
account_username = 'YOUR_MODE_ACCOUNT_USERNAME_HERE'
report_token = 'YOUR_REPORT_TOKEN_HERE'

auth_header = input_data['auth_header']
raw_body = input_data['raw_body']

# Access secret credentials
secret_store = StoreClient('YOUR_SECRET_HERE')
hook_secret = secret_store.get('DBT_WEBHOOK_KEY')
username = secret_store.get('MODE_API_TOKEN')
password = secret_store.get('MODE_API_SECRET')

# Validate the webhook came from dbt Cloud
signature = hmac.new(hook_secret.encode('utf-8'), raw_body.encode('utf-8'), hashlib.sha256).hexdigest()

if signature != auth_header:
  raise Exception("Calculated signature doesn't match contents of the Authorization header. This webhook may not have been sent from dbt Cloud.")

full_body = json.loads(raw_body)
hook_data = full_body['data'] 

if hook_data['runStatus'] == "Success":

  # Create a report run with the Mode API
  url = f'https://app.mode.com/api/{account_username}/reports/{report_token}/run'

  params = {
    'parameters': {
      "user_id": 123, 
      "location": "San Francisco"
    } 
  }
  headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/hal+json'
  }
  response = requests.post(
    url, 
    json=params, 
    headers=headers, 
    auth=HTTPBasicAuth(username, password)
  )
  response.raise_for_status()

return
```

## Test and deploy
You can iterate on the Code step by modifying the code and then running the test again. When you're happy with it, you can publish your Zap.

</div>
