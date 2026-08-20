---
title: "Configuring Databricks and AWS PrivateLink"
id: aws-databricks
description: "Configuring AWS PrivateLink for Databricks."
sidebar_label: "Databricks"
pagination_next: null
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Configuring Databricks PrivateLink

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

The following steps walk you through the setup of a Databricks AWS PrivateLink endpoint in the <Constant name="dbt" /> multi-tenant environment.

<CloudProviders type='Databricks'/>

## Configure AWS PrivateLink

You can set up a Databricks AWS PrivateLink endpoint in two ways:

- [Self-serve private endpoints](#self-serve-private-endpoints): Create and manage Databricks PrivateLink endpoints directly in the <Constant name="dbt_platform" /> user interface. Currently in beta.
- [Support-led setup](#support-led-setup): Contact dbt Support to configure your Databricks PrivateLink endpoint.

### Self-serve private endpoints <Lifecycle status="beta" />

_Self-serve private endpoints are currently in beta for Databricks on AWS, and available to all eligible customers. This feature isn't available for Azure or GCP. If you don't see **Private endpoints** in your account settings, use the [Support-led setup](#support-led-setup) instead._

With self-serve, you request a Databricks PrivateLink endpoint in <Constant name="dbt_platform" /> without opening a support ticket. If a request fails, you can delete the endpoint in <Constant name="dbt_platform" /> and retry on your own.

#### Prerequisites

- [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) or [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) permission sets in <Constant name="dbt_platform"/>. Users with an IT license can also create private endpoints.
- Your Databricks workspace name and the AWS region where the workspace is hosted.

#### Request a new private endpoint

1. In <Constant name="dbt_platform" />, go to **Account settings → Private endpoints**.
2. In the **Private endpoints** table, review your existing endpoints. The table shows all private endpoints in your account (including non-Databricks ones) with the following details:
   - **Name**
   - **Connection type** (for example, Databricks)
   - **URL**
   - **Connectivity status** (for example, **Success** or **Unknown**)
   - **Connections** — the number of <Constant name="dbt_platform" /> connections using the endpoint

   You can search by **Name** or **URL**.

   <Lightbox src="/img/docs/dbt-platform/private-endpoint-page.png" title="Private endpoints table showing existing endpoints, connectivity status, and the Request new button"/>

3. To request a new endpoint, click **Request new**.
4. Under **Provider type**, select **Databricks**.
5. In **Step 1: Enter your workspace name**, paste the full workspace URL (for example, `my-workspace.cloud.databricks.com`) or just the workspace name (for example, `my-workspace`).
6. In **Step 2: Select your AWS region**, choose the AWS region where your Databricks workspace is hosted. Only regions that support Databricks private connectivity are listed.
7. Click **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/databricks-private-endpoint-request.png" title="Databricks endpoint request form showing Provider type, workspace name, and AWS region fields"/>

   :::warning Workspace name and region can't be changed
   The workspace name and AWS region are fixed once the endpoint is created &mdash; you can't edit them afterward. If either value is entered incorrectly, provisioning fails. To fix it, delete the failed request and submit a new one with the correct details. No support ticket is needed.
   :::

8. After submission, a confirmation popup appears. From the popup, you can request another endpoint or return to **Private endpoints** to track request status.
9. Proceed to the **Connections** page and follow the steps in the [Create connection in dbt](#create-connection-in-dbt) section to configure PrivateLink. Once you configure PrivateLink on the **Connections** page, the new endpoint appears under **Private endpoints → Associated connections**.

:::note DNS propagation
If the connection test fails immediately after setup, this is expected &mdash; it doesn't mean something is wrong. DNS changes can take a few minutes to propagate. Wait a few minutes, then test again before contacting support.
:::

#### Reuse an existing endpoint

Databricks exposes one predefined endpoint service per AWS region. If you submit a request for a region that already has an interface endpoint, <Constant name="dbt_platform"/> displays an **Endpoint already exists** popup with two options:

- **Re-use an existing interface endpoint** (recommended) — Creates only a new private endpoint, linked to the interface endpoint you select. In most cases this is the better choice, since Databricks shares one endpoint service per region and reusing it avoids duplicating infrastructure.
- **Create a new interface endpoint** — Creates a new interface endpoint alongside the new private endpoint. Use this only if you need a separate interface endpoint.

Select your preferred option and click **Confirm & Submit**.

  <Lightbox src="/img/docs/dbt-platform/endpoint-exists.png" width="70%" title="Endpoint already exists popup with options to create a new interface endpoint or re-use an existing one"/>

#### Edit or delete a private endpoint

<Expandable alt_header="Edit or delete a private endpoint" is_open={true}>

If you don't see **Edit** or **Delete endpoint**, contact your account manager to enable private endpoint updates for your account.

**Edit an endpoint**

You can update the endpoint **Name** and **Port**. The workspace name and AWS region can't be changed after creation.

1. In the **Private endpoints** table, click the endpoint you want to update.
2. On the endpoint details page, click **Edit**.
3. Update **Name** and/or **Port** as needed.
4. Click **Save changes**.
5. In the **Save changes?** modal, click **Save changes** to apply your updates.

**Delete an endpoint**

An endpoint with associated connections can't be deleted. Remove those connections first.

1. In the **Private endpoints** table, click the endpoint you want to delete.
2. On the endpoint details page, click **Edit**.
3. Scroll to the bottom of the page and click **Delete endpoint**.
4. In the **Delete endpoint** modal, type `DELETE` to confirm, then click **Delete endpoint**.

</Expandable>

#### Troubleshooting and errors

If an endpoint request fails, <Constant name="dbt_platform"/> displays error details that are safe to share externally. Because the workspace name and region are locked after creation, a failed request usually means one of those values was incorrect &mdash; delete the request and submit a new one with the correct details.

If you see a failure state without clear next steps, collect the request details (endpoint name, creation time, and status) and contact [dbt Support](mailto:support@getdbt.com).

### Support-led setup {#support-led-setup}

If **Private endpoints** isn't available in your account settings, configure Databricks PrivateLink by following these steps and submitting a request to dbt Support.

1. Locate your [Databricks instance name](https://docs.databricks.com/en/workspace/workspace-details.html#workspace-instance-names-urls-and-ids).
   - Example: `cust-success.cloud.databricks.com`

2. Add the required information to the following template and submit your AWS PrivateLink request to [dbt Support](mailto:support@getdbt.com):

   <Expandable alt_header="Support request email template" is_open={true}>

   ```text
   Subject: New AWS Multi-Tenant PrivateLink Request

   - Type: Databricks
   - dbt platform account URL:
   - Databricks instance name:
   - Databricks cluster AWS Region (for example, us-east-1, eu-west-2):
   - dbt AWS multi-tenant environment (US, EMEA, AU, JP):
   ```

   </Expandable>
    <PrivateLinkSLA />

3. Once <Constant name="dbt" /> Support notifies you that setup is complete, [register the VPC endpoint in Databricks](https://docs.databricks.com/administration-guide/cloud-configurations/aws/privatelink.html#step-3-register-privatelink-objects-and-attach-them-to-a-workspace) and attach it to the workspace:
    - [Register your VPC endpoint](https://docs.databricks.com/en/security/network/classic/vpc-endpoints.html) &mdash; Register the VPC endpoint using the VPC endpoint ID provided by dbt Support.
    - [Create a Private Access Settings object](https://docs.databricks.com/en/security/network/classic/private-access-settings.html) &mdash; Create a Private Access Settings (PAS) object with your desired public access settings, and setting Private Access Level to **Endpoint**. Choose the registered endpoint created in the previous step.
    - [Create or update your workspace](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both) &mdash; Create a workspace, or update an existing workspace. Under **Advanced configurations → Private Link** choose the private access settings object created in the previous step.

    :::warning
    If using an existing Databricks workspace, all workloads running in the workspace need to be stopped to enable Private Link. Workloads also can't be started for another 20 minutes after making changes. From the [Databricks documentation](https://docs.databricks.com/en/security/network/classic/privatelink.html#step-3d-create-or-update-the-workspace-front-end-back-end-or-both):

    "After creating (or updating) a workspace, wait until it’s available for using or creating clusters. The workspace status stays at status RUNNING and the VPC change happens immediately. However, you cannot use or create clusters for another 20 minutes. If you create or use clusters before this time interval elapses, clusters do not launch successfully, fail, or could cause other unexpected behavior."

    :::

## Create connection in dbt

Once you've completed the setup, you can configure a private endpoint in <Constant name="dbt" />:

<PrivateLinkCreateConnection platform="Databricks" />
