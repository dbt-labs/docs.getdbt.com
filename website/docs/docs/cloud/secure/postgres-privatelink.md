---
title: "Configure AWS PrivateLink for Postgres"
id: postgres-privatelink
description: "Configuring PrivateLink for Postgres"
sidebar_label: "PrivateLink for Postgres"
---

A Postgres database, hosted either in AWS or in a properly connected on-prem data center, can be accessed via a private network connection using AWS Interface-type PrivateLink. The type of Target Group connected to the Network Load Balancer (NLB) may vary based on the location and type of Postgres instance being connected, as is noted in the steps below.

## Configuring Postgres Interface-type PrivateLink

### 1. Provision AWS Resources

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in the account containing, or connected to, the Postgres instance:

- **Security Group (AWS hosted only)** &mdash; If you are connecting to an existing Postgres instance, this likely already exists, however, you may need to add or modify Security Group rules to accept traffic from the Network Load Balancer (NLB) created for this Endpoint Service.
- **Target Group** &mdash; The Target Group will be attached to the NLB to tell it where to route requests. There are various target types available for NLB Target Groups, so choose the one appropriate for your Postgres setup.
    
    - Target Type:

        - _[Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/)_ -  **IP**

            - Find the IP address of your RDS instance using a command line tool such as `nslookup <endpoint>` or `dig +short <endpoint>` with your RDS DNS endpoint

            - _Note_: With RDS Multi-AZ failover capabilities the IP address of your RDS instance can change, at which point your Tagrat Group would need to be updated. See [this AWS blog post](https://aws.amazon.com/blogs/database/access-amazon-rds-across-vpcs-using-aws-privatelink-and-network-load-balancer/) for more details and a possible solution. 

        - _On-prem Postgres server_ -  **IP**

            - Use the IP address of the on-prem Postgres server linked to AWS through AWS Direct Connect or a Site-to-Site VPN connection

        - _Postgres on EC2_ - **Instance/ASG** (or **IP**)

            - If your Postgres instance is hosted on EC2 the _instance_ Target Group type (or ideally [using the instance type to connect to an auto-scaling group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/attach-load-balancer-asg.html)) can be used to attach the instance without needing a static IP address

            - The IP type can also be used, with the understanding that the IP of the EC2 instance can change if the instance is relaunched for any reason

    - Target Group protocol: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Requires creating a Listener that attaches to the newly created Target Group for port `5432`
- **VPC Endpoint Service** &mdash; Attach to the newly created NLB.
    - Acceptance required (optional) &mdash; Requires you to [accept our connection request](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) after dbt creates the endpoint.

### 2. Grant dbt AWS Account access to the VPC Endpoint Service

On the provisioned VPC endpoint service, click the **Allow principals** tab. Click **Allow principals** to grant access. Enter the ARN of the root user in the appropriate production AWS account and save your changes.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin` (_or_ `arn:aws:iam::346425330055:root`)

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink5.png" title="Enter ARN"/>

### 3. Obtain VPC Endpoint Service Name

Once the VPC Endpoint Service is provisioned, you can find the service name in the AWS console by navigating to **VPC** → **Endpoint Services** and selecting the appropriate endpoint service. You can copy the service name field value and include it in your communication to dbt Cloud support.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink6.png" title="Get service name field value"/>

### 4. Add the required information to the template below, and submit your request to [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Subject: New Multi-Tenant PrivateLink Request
- Type: Postgres Interface-type
- VPC Endpoint Service Name:
- Postgres server AWS Region (e.g., us-east-1, eu-west-2):
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```

dbt Labs will work on your behalf to complete the PrivateLink setup. Please allow 1-2 business days for this process to complete. Support will contact you when the endpoint is available.

## Create Connection in dbt Cloud

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink.

1. Navigate to **settings** → **Create new project** → select **PostgreSQL**
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.
