---
title: "Configuring Databricks PrivateLink"
id: databricks-privatelink
description: "Configuring PrivateLink for Databricks"
sidebar_label: "PrivateLink for Databricks"
pagination_next: null
---

The following steps will walk you through the setup of a Databricks AWS PrivateLink endpoint in the dbt Cloud multi-tenant environment.

## Configure PrivateLink

1. Locate your [Databricks Workspace ID](https://kb.databricks.com/en_US/administration/find-your-workspace-id#:~:text=When%20viewing%20a%20Databricks%20workspace,make%20up%20the%20workspace%20ID)
2. Add the required information to the template below, and submit your request to [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support): 
```
Subject: New Multi-Tenant PrivateLink Request
- Type: Databricks
- Databricks workspace name:
- Databricks cluster AWS Region (e.g., us-east-1, eu-west-2):
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```
3. Once dbt Cloud support has notified you that setup is complete, [register the VPC endpoint in Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) and attach it to the workspace

## Create Connection in dbt Cloud

Once you've completed the setup in the Databricks environment, you will be able to configure a private endpoint in dbt Cloud:

1. Navigate to **Settings** → **Create new project** → select **Databricks**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
