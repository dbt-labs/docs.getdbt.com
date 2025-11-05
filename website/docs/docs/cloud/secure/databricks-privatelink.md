---
title: "Configuring Databricks and AWS PrivateLink"
id: databricks-privatelink
description: "Configuring AWS PrivateLink for Databricks"
sidebar_label: "AWS PrivateLink for Databricks"
pagination_next: null
---

# Configuring Databricks PrivateLink <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

The following steps will walk you through the setup of a Databricks AWS PrivateLink endpoint in the <Constant name="cloud" /> multi-tenant environment.

<CloudProviders type='Databricks'/>

## Configure AWS PrivateLink

1. Locate your [Databricks instance name](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids)
    - Example: `cust-success.cloud.databricks.com`

1. Add the required information to the following template and submit your AWS PrivateLink request to [dbt Support](/docs/dbt-support#dbt-cloud-support): 
    ```
    Subject: New AWS Multi-Tenant PrivateLink Request
    - Type: Databricks
    - Databricks instance name:
    - Databricks cluster AWS Region (for example, us-east-1, eu-west-2):
    - dbt AWS multi-tenant environment (US, EMEA, AU):
    ```
    <PrivateLinkSLA />

1. Once <Constant name="cloud" /> support has notified you that setup is complete, [register the VPC endpoint in Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) and attach it to the workspace:
    - [Register your VPC endpoint](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; Register the VPC endpoint using the VPC endpoint ID provided by dbt Support.
    - [Create a Private Access Settings object](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; Create a Private Access Settings (PAS) object with your desired public access settings, and setting Private Access Level to **Endpoint**. Choose the registered endpoint created in the previous step.
    - [Create or update your workspace](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; Create a workspace, or update an existing workspace. Under **Advanced configurations → Private Link** choose the private access settings object created in the previous step.

    :::warning
    If using an existing Databricks workspace, all workloads running in the workspace need to be stopped to enable Private Link. Workloads also can't be started for another 20 minutes after making changes. From the [Databricks documentation](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    "After creating (or updating) a workspace, wait until it’s available for using or creating clusters. The workspace status stays at status RUNNING and the VPC change happens immediately. However, you cannot use or create clusters for another 20 minutes. If you create or use clusters before this time interval elapses, clusters do not launch successfully, fail, or could cause other unexpected behavior."

    :::

## Create Connection in dbt

Once you've completed the setup in the Databricks environment, you will be able to configure a private endpoint in <Constant name="cloud" />:

1. Navigate to **Settings** → **Create new project** → select **Databricks**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.