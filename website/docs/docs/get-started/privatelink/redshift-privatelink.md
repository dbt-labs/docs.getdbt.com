---
title: "Configure AWS PrivateLink for Redshift"
id: redshift-privatelink
description: "Configuring PrivateLink for Redshift"
sidebar_label: "PrivateLink for Redshift"
---


The first step is to grant access to dbt Cloud in the Redshift database cluster:

1. On the running Redshift cluster, select the **Properties** tab.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink1.png" title="Redshift Properties tab"/>

2. In the **Granted accounts** section, click **Grant access**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink2.png" title="Redshift granted accounts"/>

3. Enter the AWS account ID:

- Use `346425330055` for multi-tenant deployment environments in dbt Cloud
- Use `952445382732` for single-tenant deployment environments in dbt Cloud

Optionally, provide the VPC ID for the single-tenant instance or regional multi-tenant PrivateLink VPC. Otherwise, choose **Grant access to all VPCs**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink3.png" title="Redshift grant access"/>

4. Then, contact the dbt Cloud support team and provide them with your:

- Cluster name
- AWS account ID (where the Redshift cluster is hosted)
- Cluster AWS region

## Configuring Interface VPC PrivateLink

### Provisioning the VPC

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in the account containing the Redshift cluster:

- **Security Group** &mdash; If connecting to an existing Redshift cluster this likely already exists, however Security Group rules may need to be added or modified to accept traffic from the Network Load Balancer (NLB) created for this Endpoint Service.
- **Target Group** &mdash; The Target Group gets attached to the NLB to tell it where to route requests. There are various target types available for NLB Target Groups, but you will use IP address.

::: Important: 
        
    1. Use IP addresses from the Redshift cluster’s **Network Interfaces**, _not_ IPs listed in the **Node IP addresses** section as those can change.

    2. There is likely only one Network Interface (NI) to start, but if the cluster fails over to another availability zone (AZ), a new NI will be created for that AZ as well. The NI IP from the original AZ should still work, but the new NI IP can also be added to the Target Group if desired. Just note that the NLB will need to add that AZ as well. Once created, an NI shouldn't change (this is our observation from testing, but is not officially documented anywhere).

    3. Must be set to TCP protocol.
    
    :::

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink4.png" title="Target type: IP address"/>

- Network Load Balancer (NLB) &mdash; Requires creating a Listener that attaches to the newly created Target Group for port `5439`
- Endpoint Service &mdash; Attach to the newly created NLB.
    - Acceptance required (optional) &mdash; Requires you to [accept our connection request](https://www.notion.so/Redshift-Interface-PrivateLink-Setup-Guide-dabac5da3f7c4b0b91716b37820f5aeb) after dbt creates the endpoint.
    - Private DNS name (optional) &mdash; This hasn't been tested and might not be supported. Please contact dbt Cloud support if you require this field. 

### Grant AWS account access to the VPC

On the provisioned VPC endpoint service, click the **Allow principals** tab. Click **Allow principals** to grant access. Enter the ARN of the root user in the appropriate production AWS account and save your changes.

| Type | Principal |
| --- | --- |
| Single-Tenant Prod | arn:aws:iam::952445382732:root |
| Multi-Tenant Prod | arn:aws:iam::346425330055:root |

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink5.png" title="Enter ARN"/>

Once the VPC Endpoint Service is provisioned, you can find the service name in the AWS console by navigating to **VPC** → **Endpoint Services** and selecting the appropriate endpoint service. You can copy the service name field value and include it in your communication to dbt Cloud support.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink6.png" title="Get service name field value"/>

## Configuring new endpoints with PrivateLink

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink.

1. Navigate to **settings** → **Create new project** → select **Redshift**
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining DWH details. 
5. Test your connection and save it.
