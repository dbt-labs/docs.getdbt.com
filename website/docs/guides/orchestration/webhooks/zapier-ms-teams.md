---
title: "Sending run completion notifications from dbt Cloud to Microsoft Teams"
id: webhooks-guide-zapier-ms-teams
slug: guides/orchestration/webhooks/zapier-ms-teams
---

This guide assumes familiarity with:
- dbt Cloud webhooks
- Zapier

## What does this integration do? 
When a dbt Cloud job completes, extract the run results from the dbt Cloud admin API and post a summary to a Microsoft Teams channel. 

_example screenshot here_

## Integration steps:
### Set up the connection between Zapier and Microsoft Teams 

Install the [Zapier app in Microsoft Teams](https://appsource.microsoft.com/en-us/product/office/WA200002044) and [grant Zapier access to your account](https://zapier.com/blog/how-to-automate-microsoft-teams/). 

Note that when you install the Zapier app, it needs to be added to the team (unless you plan to have Zapier post to chats instead of team channels.)

### Create a new Zap in Zapier
Use _Webhooks by Zapier_ as the Trigger, and _Catch Raw Hook_ as the Event. If you don't intend to [validate the authenticity of your webhook](docs/deploy/webhooks#validate-a-webhook) (not recommended!) then you can choose _Catch Hook_ instead. 

Press _Continue_, then copy the webhook URL and put it into dbt Cloud. 

### Configure a new webhook in dbt Cloud
See docs here. Choose job completed. 

Once you've tested the endpoint, go back to Zapier and click _Test Trigger_, which will create a sample webhook body for you to work with. 

The sample body's values are hard-coded and not reflective of your project, but they give Zapier a correctly-shaped object during development. 

### Store secrets 
In the next step, you will need the Webhook Secret Key from the prior step, and a dbt Cloud [user token](https://docs.getdbt.com/docs/dbt-cloud-apis/user-tokens) or [service account token](https://docs.getdbt.com/docs/dbt-cloud-apis/service-tokens). 

Zapier allows you to [store secrets](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps), you should consider doing this to prevent your keys from being displayed in plaintext in the Zap code. You will be able to access them via the [StoreClient utility](https://help.zapier.com/hc/en-us/articles/8496293969549-Store-data-from-code-steps-with-StoreClient).

### Add a code action
Select _Code by Zapier_ as the App, and _Run Python_ as the Event. 

In the _Set up action_ area, add two items to _Input Data_: `raw_body` and `auth_header`. Map those to the `1. Raw Body` and `1. Headers Http Authorization` fields from the _Catch Raw Hook_ step above.

_screenshot here_

In the _Code_ field, paste the following code: 

```python
import hashlib
import hmac
import json
import re


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

# Steps derived from these commands will have their error details extracted and shown inline
commands_to_show_logs = ['dbt build', 'dbt run', 'dbt test']

# When testing, you will want to hardcode run_id and account_id to IDs that exist; the sample webhook won't work. 
run_id = hook_data['runId']
account_id = full_body['accountId']

# Fetch run info from the dbt Cloud Admin API
url = f'https://cloud.getdbt.com/api/v2/accounts/{account_id}/runs/{run_id}/?include_related=["run_steps"]'
headers = {'Authorization': f'Token {api_token}'}
run_data_response = requests.get(url, headers=headers)
run_data_response.raise_for_status()
run_data_results = run_data_response.json()['data']

# Overall run summary
outcome_message = f"""
**[{hook_data['runStatus']} for Run #{run_id} on Job \"{hook_data['jobName']}\"]({run_data_results['href']})**


**Environment:** {hook_data['environmentName']} | **Trigger:** {hook_data['runReason']} | **Duration:** {run_data_results['duration_humanized']}

"""

# Step-specific summaries
for step in run_data_results['run_steps']:
  if step['status_humanized'] == 'Success':
    outcome_message += f"""
✅ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""
  else:
    outcome_message += f"""
❌ {step['name']} ({step['status_humanized']} in {step['duration_humanized']})
"""
    show_logs = any(cmd in step['name'] for cmd in commands_to_show_logs)
    if show_logs:
      full_log = step['logs']
      # Remove timestamp and any colour tags
      full_log = re.sub('\x1b?\[[0-9]+m[0-9:]*', '', full_log)
    
      summary_start = re.search('(?:Completed with \d+ errors? and \d+ warnings?:|Database Error|Compilation Error)', full_log)
    
      line_items = re.findall('(^.*(?:Failure|Error) in .*\n.*\n.*)', full_log, re.MULTILINE)
    
      if len(line_items) == 0:
        relevant_log = f'```{full_log[summary_start.start() if summary_start else 0:]}```'
      else:
        relevant_log = summary_start[0]
        for item in line_items:
          relevant_log += f'\n```\n{item.strip()}\n```\n'
      outcome_message += f"""
{relevant_log}
"""

# Zapier looks for the `output` dictionary for use in subsequent steps
output = {'outcome_message': outcome_message}
```