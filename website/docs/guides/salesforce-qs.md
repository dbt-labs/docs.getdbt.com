---
title: "Quickstart for dbt and Salesforce Data Cloud"
id: "salesforce-data-cloud"
level: 'Beginner'
icon: 'salesforce'
hide_table_of_contents: true
tags: ['Salesforce', 'Data Cloud', 'platform','Quickstart']
---

<div style={{maxWidth: '900px'}}>

## Introduction

In this quickstart guide, you'll learn how to use <Constant name="cloud" /> with **Salesforce Data Cloud** using the new dbt Salesforce Data Cloud adapter (powered by dbt Fusion). You'll learn how to:

- Install Fusion and the Salesforce adapter
- Connect <Constant name="cloud" /> or your local dbt environment to Salesforce Data Cloud
- Run and test dbt models using Data Cloud objects
- Understand key limitations and Data Cloud–specific model requirements

:::tip Note
This adapter is currently in **Alpha**. It is not production-ready and should only be used in sandbox or test environments. Features, commands, and workflows are subject to change.
:::

### Prerequisites​

- You have a [<Constant name="cloud" /> account](https://www.getdbt.com/signup/) or a local dbt Fusion setup.  
- You have access to a **Salesforce Data Cloud instance** with API access and credentials (OAuth and service token).  
- You have a code editor such as **VS Code** (or [Cursor](https://cursor.sh/)) with permissions to install extensions.  
- You have a connected Git provider with repository access.  

You’ll need the following Salesforce credentials:
- **Client ID (Consumer Key)** from your connected app secrets  
- **Private Key Path** (the full file path to your downloaded `server.key`)  
- **Salesforce username**

### Related content

- Learn more with [dbt Learn courses](https://learn.getdbt.com)
- [CI jobs](/docs/deploy/continuous-integration)
- [Deploy jobs](/docs/deploy/deploy-jobs)
- [Job notifications](/docs/deploy/job-notifications)
- [Source freshness](/docs/deploy/source-freshness)

## Install Fusion

The Salesforce adapter is available through **dbt Fusion**, a next-generation dbt binary. Follow the installation steps for your platform.

### macOS & Linux
```bash
curl -fsSL https://public.cdn.getdbt.com/fs/install/install.sh | sh -s -- --update
exec $SHELL
```
### Windows (Powershell)
```bash
irm https://public.cdn.getdbt.com/fs/install/install.ps1 | iex
Start-Process powershell
```

To verify Fusion installation run
```bash
dbtf --version
```
Installing Fusion automatically provides the Salesforce adapter and its ADBC driver.

## Install the dbt Extension for VS Code

1. In VS Code, navigate to the Extensions tab.
2. Search for dbt and locate the extension published by dbtLabsInc or dbt Labs Inc.
3. Click Install.
4. Once installed, look for the dbt Extension label in your VS Code status bar.
- Hover over it to see diagnostic info.
- Register and activate the extension.

After activation, the extension will automatically download the correct dbt Language Server for your OS.
You can learn more about how to use the dbt VS Code extension in the [dbt Extension documentation](https://docs.getdbt.com/docs/install-dbt-extension)
.

## Set up a dbt Project

1. Upload the provided dbt Salesforce Data Cloud example project (zip file) to your Git repository.
2. Clone the repository locally through VS Code.
3. Follow the instructions in the project’s README, starting from Step 3:
- Create a profiles.yml
- Confirm your connection
- Compile and execute the sample Jaffle Shop dbt project
- Run data tests to validate your models

You should now be able to run dbtf run and dbtf test successfully against your Salesforce Data Cloud instance.

## Connection Configuration
Your profiles.yml file will look similar to the following:
```yaml
salesforce_data_cloud:
  target: dev
  outputs:
    dev:
      type: salesforce_data_cloud
      method: oauth
      client_id: "<YOUR_CLIENT_ID>"
      private_key_path: "<YOUR_PATH>/server.key"
      user: "<YOUR_USERNAME>"
      database: "<YOUR_DATA_SPACE>"
      schema: "default"
      threads: 4
```
Then run:
```bash
dbtf debug
```
If successful, you should see:
```sql
Connection test: OK connection
```

## Execute Your First dbt Run
1. Open your cloned dbt Salesforce project in VS Code.
2. Run the following command in the terminal:
```bash
dbtf run --static-analysis off
```
This disables static analysis (required due to current Data Cloud limitations).
If successful, your models will be built in Salesforce Data Cloud as Data Lake Objects (DLOs).

## Known Limitations
| Feature | Timeline | Notes |
|----------|-----------|-------|
| **Running `dbt run` twice** | Coming soon | Due to Data Cloud’s architecture, rerunning the same model is not currently supported. Manually delete dependencies before rerunning. |
| **Materializations supported** | — | Only `table` materializations are supported. Incremental, snapshot, view, and ephemeral are not. |
| **Static Analysis** | Ongoing | Must include `--static-analysis off` in every dbt command. Impacts column-level lineage and VS Code dbt buttons. |
| **dbt Seeds** | Coming soon | Not yet supported. |
| **dbt Docs** | N/A | Not currently available in Fusion for Data Cloud. |
| **Arbitrary Queries** | Not on roadmap | All queries must be tied to defined dbt sources. |
| **`SELECT *`** | Coming | Standard metadata queries currently fail due to injected system columns. |
| **Multi-dataspace writes** | Coming soon | Future support for writing to multiple dataspaces. |
| **Configurable timeout** | Coming soon | Defaults to 5 minutes; not configurable yet. |
| **Canceling dbt runs** | Coming soon | Future support planned. |


## VS Code Callouts
- The Problems table in VS Code may show namespace errors due to Data Cloud’s lack of schema support.
- Models must end with __dll. If omitted, it is appended automatically (for example, model_name → model_name__dll).
- Columns must end with __c. Omitting this suffix causes syntax errors.
- Model names cannot include double underscores (__) except before __dll.
- For category=profile, all models must include:
```yaml
config:
  category: profile
  primary_key: id
```

## Example: Simple Model in Salesforce Data Cloud
Create file in models folder
```sql
select
    id__c as customer_id__c,
    first_name__c,
    last_name__c
from {{ source('jaffle_shop', 'customers') }}
```
Run the model:
```bash
dbtf run --models customers__dll --static-analysis off
```
You should see the Data Lake Object created successfully in your Salesforce Data Cloud environment.

#### FAQs {#faq-2}

<FAQ path="Runs/run-one-model" />
<FAQ path="Project/unique-resource-names" />
<FAQ path="Project/structure-a-project" alt_header="As I create more models, how should I keep my project organized? What should I name my models?" />

</div>

<Snippet path="quickstarts/test-and-document-your-project" />

<Snippet path="quickstarts/schedule-a-job" />

