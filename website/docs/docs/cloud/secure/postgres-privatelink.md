---
title: "Configure AWS PrivateLink for Postgres"
id: postgres-privatelink
description: "Configuring PrivateLink for Postgres"
sidebar_label: "PrivateLink for Postgres"
---
import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

A Postgres database, hosted either in AWS or in a properly connected on-prem data center, can be accessed through a private network connection using AWS Interface-type PrivateLink. The type of Target Group connected to the Network Load Balancer (NLB) may vary based on the location and type of Postgres instance being connected, as explained in the following steps.

<CloudProviders type='Postgres' />

## Configuring Postgres interface-type PrivateLink

### 1. Provision AWS resources

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in the account containing, or connected to, the Postgres instance:

- **Security Group (AWS hosted only)** &mdash; If you are connecting to an existing Postgres instance, this likely already exists, however, you may need to add or modify Security Group rules to accept traffic from the Network Load Balancer (NLB) created for this Endpoint Service.
- **Target Group** &mdash; The Target Group will be attached to the NLB to tell it where to route requests. There are various target types available for NLB Target Groups, so choose the one appropriate for your Postgres setup.
    
    - Target Type:

        - _[Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)_ -  **IP**

            - Find the IP address of your RDS instance using a command line tool such as `nslookup <endpoint>` or `dig +short <endpoint>` with your RDS DNS endpoint

            - _Note_: With RDS Multi-AZ failover capabilities the IP address of your RDS instance can change, at which point your Target Group would need to be updated. See [this AWS blog post](https://aws.amazon.com/blogs/database/access-amazon-rds-across-vpcs-using-aws-privatelink-and-network-load-balancer/) for more details and a possible solution. 

        - _On-prem Postgres server_ -  **IP**

            - Use the IP address of the on-prem Postgres server linked to AWS through AWS Direct Connect or a Site-to-Site VPN connection

        - _Postgres on EC2_ - **Instance/ASG** (or **IP**)

            - If your Postgres instance is hosted on EC2 the _instance_ Target Group type (or ideally [using the instance type to connect to an auto-scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)) can be used to attach the instance without needing a static IP address

            - The IP type can also be used, with the understanding that the IP of the EC2 instance can change if the instance is relaunched for any reason

    - Target Group protocol: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Requires creating a Listener that attaches to the newly created Target Group for port `5432`
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Choose the VPC that the VPC Endpoint Service and NLB are being deployed in, and choose subnets from at least two Availability Zones.
    - **Security Groups:** The Network Load Balancer (NLB) associated with the VPC endpoint service must either not have an associated security group, or the security group must have a rule that allows requests from the appropriate dbt Cloud **private CIDR(s)**. Note that _this is different_ than the static public IPs listed on the dbt Cloud [Access, Regions, & IP addresses](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses) page. dbt Support can provide the correct private CIDR(s) upon request. If necessary, until you can refine the rule to the smaller CIDR provided by dbt, allow connectivity by temporarily adding an allow rule of `10.0.0.0/8`.
    - **Listeners:** Create one listener per target group that maps the appropriate incoming port to the corresponding target group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Attach to the newly created NLB.
    - Acceptance required (optional) &mdash; Requires you to [accept our connection request](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) after dbt creates the endpoint.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Grant dbt AWS account access to the VPC Endpoint Service

On the provisioned VPC endpoint service, click the **Allow principals** tab. Click **Allow principals** to grant access. Enter the ARN of the root user in the appropriate production AWS account and save your changes.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" width="70%" title="Enter ARN"/>

### 3. Obtain VPC Endpoint Service Name

Once the VPC Endpoint Service is provisioned, you can find the service name in the AWS console by navigating to **VPC** → **Endpoint Services** and selecting the appropriate endpoint service. You can copy the service name field value and include it in your communication to dbt Cloud support.

<Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" width="70%" title="Get service name field value"/>

### 4. Add the required information to the template below, and submit your request to [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Subject: New Multi-Tenant PrivateLink Request
- Type: Postgres Interface-type
- VPC Endpoint Service Name:
- Postgres server AWS Region (e.g., us-east-1, eu-west-2):
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```


import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

### 5. Accepting the connection request

When you have been notified that the resources are provisioned within the dbt Cloud environment, you must accept the endpoint connection (unless the VPC Endpoint Service is set to auto-accept connection requests). Requests can be accepted through the AWS console, as seen below, or through the AWS CLI.

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/accept-request.png" width="80%" title="Accept the connection request" />

## Create Connection in dbt Cloud

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink.

1. Navigate to **settings** → **Create new project** → select **PostgreSQL**
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
