---
title: "Configuring Databricks PrivateLink"
id: databricks-privatelink
description: "Configuring PrivateLink for Databricks"
sidebar_label: "PrivateLink for Databricks"
---

Locate your [Databricks Workspace ID](https://kb.databricks.com/en_US/administration/find-your-workspace-id#:~:text=When%20viewing%20a%20Databricks%20workspace,make%20up%20the%20workspace%20ID) and provide it to dbt Cloud support along with your other [PrivateLink setup information](/about-privatelink#set-up). 

Once dbt Cloud support has notified you that setup is complete, [register the VPC endpoint in Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) and attach it to the workspace.


### Configuring new endpoints with PrivateLink

after you've completed the setup in the Databricks environment, you will be able to configure a private endpoint in dbt Cloud:

1. Navigate to **Settings** → **Create new project** → select the **Databricks**. 
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
