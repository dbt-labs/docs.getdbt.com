---
title: "Configure AWS PrivateLink for Redshift"
id: aws-redshift
description: "Configuring PrivateLink for Redshift."
sidebar_label: "Redshift"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

# Configure AWS PrivateLink for Redshift

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import PrivateLinkCreateConnection from '/snippets/_privatelink-create-connection.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

AWS provides two different ways to create a PrivateLink VPC endpoint for a Redshift cluster that is running in another VPC: 
- [Redshift-managed PrivateLink Endpoints](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html)
- [Redshift Interface-type PrivateLink Endpoints](https://docs.aws.amazon.com/vpc/latest/privatelink/create-endpoint-service.html)

<Constant name="dbt" /> supports both types of endpoints, but there are several [considerations](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html#managing-cluster-cross-vpc-considerations) to take into account when deciding which endpoint type to use. Redshift-managed provides a simpler setup with no additional cost, which might make it the preferred option for many, but may not be an option in all environments. Based on these criteria, determine which type is right for your system. Follow the instructions from the section below that corresponds to your chosen endpoint type.

<CloudProviders type='Redshift' />

You can set up a Redshift AWS PrivateLink endpoint in two ways:

- [Self-serve private endpoints](#self-serve-private-endpoints): Create and manage Redshift PrivateLink endpoints directly in the <Constant name="dbt_platform" /> user interface. Currently in beta.
- [Support-led setup](#support-led-setup): Contact dbt Support to configure your Redshift PrivateLink endpoint.

The AWS-side setup is the same for both paths. You provision your AWS resources (grant access for Redshift-managed, or create the VPC endpoint service for interface-type), then either submit the request in the UI (self-serve) or email dbt Support (support-led).

## Self-serve private endpoints <Lifecycle status="beta" /> {#self-serve-private-endpoints}

_Self-serve private endpoints are currently in beta for Redshift on AWS, and available to all eligible customers. If you don't see **Private endpoints** in your account settings, use the [Support-led setup](#support-led-setup) instead._

With self-serve, you request a Redshift PrivateLink endpoint in <Constant name="dbt_platform" /> without opening a support ticket. If a request fails, you can edit the request and resubmit, or delete the endpoint and retry on your own.

<Constant name="dbt_platform" /> supports all three Redshift types through self-serve:

- **Redshift Managed** &mdash; provisioned Redshift clusters (select **Redshift Managed** in the UI).
- **Redshift Managed Serverless** &mdash; Redshift Serverless (select **Redshift Managed** in the UI, then choose **Serverless**).
- **Redshift interface-type** (select **Redshift** in the UI).

### Prerequisites

- [Account admin](/docs/platform/manage-access/enterprise-permissions?version=2.0#account-admin) or [Project creator](/docs/platform/manage-access/enterprise-permissions?version=2.0#project-creator) permission sets in <Constant name="dbt_platform"/>. Users with an IT license can also create private endpoints.
- Completed the AWS-side setup for your endpoint type. Follow the same steps as the [support-led setup](#support-led-setup) &mdash; grant access for [Redshift-managed](#configuring-redshift-managed-privatelink), or provision the VPC endpoint service for [interface-type](#configuring-redshift-interface-type-privatelink) &mdash; but stop before the **Submit your request to dbt Support** step and use the UI below instead.

### Request a new private endpoint

1. In <Constant name="dbt_platform" />, go to **Account settings → Private endpoints**.
2. In the **Private endpoints** table, review your existing endpoints. The table shows all private endpoints in your account (including non-Redshift ones) with details like **Name**, **Connection type**, **URL**, **Connectivity status**, and the number of **Connections** using the endpoint. You can search by **Name** or **URL**.
3. To request a new endpoint, click **Request new**.
4. Under **Provider type**, select the option that matches your endpoint type, then fill in the fields for that type:

   <Tabs>

   <TabItem value="managed" label="Redshift Managed / Serverless">

   Select **Redshift Managed** for both provisioned Redshift clusters and Redshift Serverless.
   
        1. In **Step 1: Choose your deployment type**, select **Provisioned** or **Serverless**.
        2. In **Step 2: Enter your cluster details**, enter your **Cluster identifier** and **Resource owner AWS account ID**.
        3. In **Step 3: Select your AWS region**, choose the AWS region where your Redshift cluster or workgroup is hosted.
        4. Click **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/redshift-managed-private-endpoint-request.png" title="Redshift Managed endpoint request form showing deployment type, cluster details, and AWS region fields"/>

   </TabItem>

   <TabItem value="interface" label="Redshift (interface-type)">

   Select **Redshift** for an interface-type endpoint.

   1. In **Step 1: Enter your AWS PrivateLink service name**, enter the name of the AWS VPC endpoint service you configured for your Redshift cluster (for example, `com.amazonaws.vpce.us-east-1.vpce-svc-xxxxxxxxxxxxxxxxx`).
   2. In **Step 2: Name your Redshift endpoint**, choose a name to identify the endpoint. This is used as the hostname prefix when it's registered.
   3. Click **Submit request**.

   <Lightbox src="/img/docs/dbt-platform/redshift-interface-private-endpoint-request.png" title="Redshift interface-type endpoint request form showing AWS PrivateLink service name and endpoint name fields"/>

   </TabItem>

   </Tabs>

5. After submission, you'll see the request and its status in the **Private endpoints** table. Once approved, you'll be notified.
6. Proceed to the **Connections** page and follow the steps in the [Create connection in dbt](#create-connection-in-dbt) section to configure PrivateLink. Once configured, the new endpoint appears under **Private endpoints → Associated connections**.

:::note DNS propagation
If the connection test fails immediately after setup, this is expected &mdash; it doesn't mean something is wrong. DNS changes can take a few minutes to propagate. Wait a few minutes, then test again before contacting support.
:::

### Troubleshooting and errors

If an endpoint request fails, <Constant name="dbt_platform"/> displays the error in a banner on the endpoint details page, along with details that are safe to share externally. Review the message, correct the underlying issue (for example, confirm dbt's AWS account has been granted access under the cluster's **Granted accounts** section), then click **Retry**.

<Lightbox src="/img/docs/dbt-platform/redshift-private-endpoint-error.png" title="Provisioning failed banner on a Redshift endpoint details page with a Retry button"/>

If you see a failure state without clear next steps, collect the request details (endpoint name, creation time, and status) and contact [dbt Support](mailto:support@getdbt.com).

## Support-led setup {#support-led-setup}

If **Private endpoints** isn't available in your account settings, configure Redshift PrivateLink by following the steps below and submitting a request to dbt Support.

## Configuring Redshift-managed PrivateLink

1. Locate the **Granted accounts** section of the Redshift configuration
   - **Standard Redshift**
        - On the running Redshift cluster, select the **Properties** tab.
        <Lightbox src="/img/docs/dbt-platform/redshiftprivatelink1.png" title="Redshift Properties tab"/>
     
   - **Redshift Serverless**
       - On the Redshift Serverless **Workgroup configuration** page.  

2. In the **Granted accounts** section, click **Grant access**.

<Lightbox src="/img/docs/dbt-platform/redshiftprivatelink2.png" title="Redshift granted accounts"/>

3. Enter the AWS account ID: `346425330055` - _NOTE: This account ID only applies to <Constant name="dbt" /> Multi-Tenant environments. For Virtual Private/Single-Tenant account IDs please contact [Support](mailto:support@getdbt.com)._

4. Choose **Grant access to all VPCs** &mdash;or&mdash; (optional) contact [Support](mailto:support@getdbt.com) for the appropriate regional VPC ID to designate in the **Grant access to specific VPCs** field.

<Lightbox src="/img/docs/dbt-platform/redshiftprivatelink3.png" title="Redshift grant access"/>

:::caution Per-workgroup authorization required

For Redshift Serverless, **Granted accounts** is scoped to a single workgroup. If your environment has multiple workgroups, you must grant access separately for each workgroup you want to connect to <Constant name="dbt" />. Authorizing one workgroup (for example, `sales`) doesn't extend to any other workgroup (for example, `finance` or `product`) &mdash; repeat steps 1&ndash;4 for each workgroup individually.

:::

5. Add the required information to the following template, and submit your request to [dbt Support](mailto:support@getdbt.com):

   - **Standard Redshift**

     <Expandable alt_header="Support request email template" is_open={true}>

     ```text
     Subject: New Multi-Tenant PrivateLink Request

     - Type: Redshift-managed
     - dbt platform account URL:
     - Redshift cluster name:
     - Redshift cluster AWS account ID:
     - Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
     - dbt multi-tenant environment (US, EMEA, AU, JP):
     ```

     </Expandable>

   - **Redshift Serverless**

     <Expandable alt_header="Support request email template" is_open={true}>

     ```text
     Subject: New Multi-Tenant PrivateLink Request

     - Type: Redshift-managed - Serverless
     - dbt platform account URL:
     - Redshift workgroup name:
     - Redshift workgroup AWS account ID:
     - Redshift workgroup AWS Region (for example, us-east-1, eu-west-2):
     - dbt multi-tenant environment (US, EMEA, AU, JP):
     ```

     </Expandable>

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />

## Configuring Redshift interface-type PrivateLink

### 1. Provision AWS resources

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in the account containing the Redshift cluster:

- **Security Group** &mdash; If you are connecting to an existing Redshift cluster, this likely already exists, however, you may need to add or modify Security Group rules to accept traffic from the Network Load Balancer (NLB) created for this Endpoint Service.
- **Target Group** &mdash; The Target Group will be attached to the NLB to tell it where to route requests. There are various target types available for NLB Target Groups, but you will use the IP address type.
    
    - Target Type: **IP**

        - **Standard Redshift**

            - Use IP addresses from the Redshift cluster’s **Network Interfaces** whenever possible. While IPs listed in the **Node IP addresses** section will work, they are also more likely to change.
            <Lightbox src="/img/docs/dbt-platform/redshiftprivatelink4.png" title="Target type: IP address"/>

            - There will likely be only one Network Interface (NI) to start, but if the cluster fails over to another availability zone (AZ), a new NI will also be created for that AZ. The NI IP from the original AZ will still work, but the new NI IP can also be added to the Target Group. If adding additional IPs, note that the NLB will also need to add the corresponding AZ. Once created, the NI(s) should stay the same (This is our observation from testing, but AWS does not officially document it).

        - **Redshift Serverless**

            - To find the IP addresses for Redshift Serverless instance locate and copy the endpoint (only the URL listed before the port) in the Workgroup configuration section of the AWS console for the instance.
            <Lightbox src="/img/docs/dbt-platform/redshiftserverless.png" title="Redshift Serverless endpoint"/>

            - From a command line run the command `nslookup <endpoint>` using the endpoint found in the previous step and use the associated IP(s) for the Target Group.

    - Target Group protocol: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Requires creating a Listener that attaches to the newly created Target Group (port `5439`is the default)
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Choose the VPC that the VPC Endpoint Service and NLB are being deployed in, and choose subnets from at least two Availability Zones.
    - **Security Groups:** The Network Load Balancer (NLB) associated with the VPC endpoint service must either not have an associated security group, or the security group must have a rule that allows requests from the appropriate <Constant name="dbt" /> **private CIDR(s)**. Note that _this is different_ than the static public IPs listed on the <Constant name="dbt" /> [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses) page. dbt Support can provide the correct private CIDR(s) upon request. If necessary, until you can refine the rule to the smaller CIDR provided by dbt, allow connectivity by temporarily adding an allow rule of `10.0.0.0/8`.
    - **Listeners:** Create one listener per target group that maps the appropriate incoming port to the corresponding target group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Attach to the newly created NLB.
    - Acceptance required (optional) &mdash; Requires you to [accept our connection request](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) after dbt creates the endpoint.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Grant dbt AWS account access to the VPC endpoint service

On the provisioned VPC endpoint service, click the **Allow principals** tab. Click **Allow principals** to grant access. Enter the ARN of the root user in the appropriate production AWS account and save your changes.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-platform/privatelink-allow-principals.png" title="Enter ARN"/>

### 3. Obtain VPC endpoint service name

Once the VPC Endpoint Service is provisioned, you can find the service name in the AWS console by navigating to **VPC** → **Endpoint Services** and selecting the appropriate endpoint service. You can copy the service name field value and include it in your communication to <Constant name="dbt" /> support.

<Lightbox src="/img/docs/dbt-platform/privatelink-endpoint-service-name.png" title="Get service name field value"/>

### 4. Submit your request to dbt Support
Add the required information to the template below and submit your request to [dbt Support](mailto:support@getdbt.com):

<Expandable alt_header="Support request email template" is_open={true}>

```text
Subject: New Multi-Tenant PrivateLink Request

- Type: Redshift Interface-type
- dbt platform account URL:
- VPC Endpoint Service Name:
- Redshift cluster AWS Region (for example, us-east-1, eu-west-2):
- dbt AWS multi-tenant environment (US, EMEA, AU, JP):
```

</Expandable>

<PrivateLinkSLA />

## Create connection in dbt

Once <Constant name="dbt" /> Support completes the configuration, you can start creating new connections using PrivateLink.

<PrivateLinkCreateConnection platform="Redshift" />

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
