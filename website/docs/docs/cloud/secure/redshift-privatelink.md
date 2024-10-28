---
title: "Configure AWS PrivateLink for Redshift"
id: redshift-privatelink
description: "Configuring PrivateLink for Redshift"
sidebar_label: "PrivateLink for Redshift"
---

import SetUpPages from '/snippets/_available-tiers-privatelink.md';
import PrivateLinkTroubleshooting from '/snippets/_privatelink-troubleshooting.md';
import PrivateLinkCrossZone from '/snippets/_privatelink-cross-zone-load-balancing.md';
import CloudProviders from '/snippets/_privatelink-across-providers.md';

<SetUpPages features={'/snippets/_available-tiers-privatelink.md'}/>

AWS provides two different ways to create a PrivateLink VPC endpoint for a Redshift cluster that is running in another VPC: 
- [Redshift-managed PrivateLink Endpoints](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html)
- [Redshift Interface-type PrivateLink Endpoints](https://docs.aws.amazon.com/redshift/latest/mgmt/security-private-link.html)

dbt Cloud supports both types of endpoints, but there are a number of [considerations](https://docs.aws.amazon.com/redshift/latest/mgmt/managing-cluster-cross-vpc.html#managing-cluster-cross-vpc-considerations) to take into account when deciding which endpoint type to use. Redshift-managed provides a far simpler setup with no additional cost, which might make it the preferred option for many, but may not be an option in all environments. Based on these criteria, you will need to determine which is the right type for your system. Follow the instructions from the section below that corresponds to your chosen endpoint type.

<CloudProviders type='Redshift' />

:::note Redshift Serverless
While Redshift Serverless does support Redshift-managed type VPC endpoints, this functionality is not currently available across AWS accounts. Due to this limitation, an Interface-type VPC endpoint service must be used for Redshift Serverless cluster PrivateLink connectivity from dbt Cloud. 
:::

## Configuring Redshift-managed PrivateLink

1. On the running Redshift cluster, select the **Properties** tab.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink1.png" title="Redshift Properties tab"/>

2. In the **Granted accounts** section, click **Grant access**.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink2.png" title="Redshift granted accounts"/>

3. Enter the AWS account ID: `346425330055` - _NOTE: This account ID only applies to dbt Cloud Multi-Tenant environments. For Virtual Private/Single-Tenant account IDs please contact [Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support)._

4. Choose **Grant access to all VPCs** &mdash;or&mdash; (optional) contact [Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support) for the appropriate regional VPC ID to designate in the **Grant access to specific VPCs** field.

<Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink3.png" title="Redshift grant access"/>

5. Add the required information to the following template, and submit your request to [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):

```
Subject: New Multi-Tenant PrivateLink Request
- Type: Redshift-managed
- Redshift cluster name:
- Redshift cluster AWS account ID:
- Redshift cluster AWS Region (e.g., us-east-1, eu-west-2):
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_PrivateLink-SLA.md';

<PrivateLinkSLA />

## Configuring Redshift Interface-type PrivateLink

### 1. Provision AWS Resources

Creating an Interface VPC PrivateLink connection requires creating multiple AWS resources in the account containing the Redshift cluster:

- **Security Group** &mdash; If you are connecting to an existing Redshift cluster, this likely already exists, however, you may need to add or modify Security Group rules to accept traffic from the Network Load Balancer (NLB) created for this Endpoint Service.
- **Target Group** &mdash; The Target Group will be attached to the NLB to tell it where to route requests. There are various target types available for NLB Target Groups, but you will use the IP address type.
    
    - Target Type: **IP**

        - **Standard Redshift**

            - Use IP addresses from the Redshift cluster’s **Network Interfaces** whenever possible. While IPs listed in the **Node IP addresses** section will work, they are also more likely to change.
            <Lightbox src="/img/docs/dbt-cloud/redshiftprivatelink4.png" title="Target type: IP address"/>

            - There will likely be only one Network Interface (NI) to start, but if the cluster fails over to another availability zone (AZ), a new NI will also be created for that AZ. The NI IP from the original AZ will still work, but the new NI IP can also be added to the Target Group. If adding additional IPs, note that the NLB will also need to add the corresponding AZ. Once created, the NI(s) should stay the same (This is our observation from testing, but AWS does not officially document it).

        - **Redshift Serverless**

            - To find the IP addresses for Redshift Serverless instance locate and copy the endpoint (only the URL listed before the port) in the Workgroup configuration section of the AWS console for the instance.
            <Lightbox src="/img/docs/dbt-cloud/redshiftserverless.png" title="Redshift Serverless endpoint"/>

            - From a command line run the command `nslookup <endpoint>` using the endpoint found in the previous step and use the associated IP(s) for the Target Group.

    - Target Group protocol: **TCP** 

- **Network Load Balancer (NLB)** &mdash; Requires creating a Listener that attaches to the newly created Target Group for port `5439`
    - **Scheme:** Internal
    - **IP address type:** IPv4
    - **Network mapping:** Choose the VPC that the VPC Endpoint Service and NLB are being deployed in, and choose subnets from at least two Availability Zones.
    - **Security Groups:** The Network Load Balancer (NLB) associated with the VPC endpoint service must either not have an associated security group, or the security group must have a rule that allows requests from the appropriate dbt Cloud **private CIDR(s)**. Note that _this is different_ than the static public IPs listed on the dbt Cloud [Access, Regions, & IP addresses](https://docs.getdbt.com/docs/cloud/about-cloud/access-regions-ip-addresses) page. dbt Support can provide the correct private CIDR(s) upon request. If necessary, until you can refine the rule to the smaller CIDR provided by dbt, allow connectivity by temporarily adding an allow rule of `10.0.0.0/8`.
    - **Listeners:** Create one listener per target group that maps the appropriate incoming port to the corresponding target group ([details](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-listeners.html)).
- **VPC Endpoint Service** &mdash; Attach to the newly created NLB.
    - Acceptance required (optional) &mdash; Requires you to [accept our connection request](https://docs.aws.amazon.com/vpc/latest/privatelink/configure-endpoint-service.html#accept-reject-connection-requests) after dbt creates the endpoint.

<PrivateLinkCrossZone features={'/snippets/_privatelink-cross-zone-load-balancing.md'}/>

### 2. Grant dbt AWS Account access to the VPC Endpoint Service

On the provisioned VPC endpoint service, click the **Allow principals** tab. Click **Allow principals** to grant access. Enter the ARN of the root user in the appropriate production AWS account and save your changes.

 - Principal: `arn:aws:iam::346425330055:role/MTPL_Admin`

<Lightbox src="/img/docs/dbt-cloud/privatelink-allow-principals.png" title="Enter ARN"/>

### 3. Obtain VPC Endpoint Service Name

Once the VPC Endpoint Service is provisioned, you can find the service name in the AWS console by navigating to **VPC** → **Endpoint Services** and selecting the appropriate endpoint service. You can copy the service name field value and include it in your communication to dbt Cloud support.

<Lightbox src="/img/docs/dbt-cloud/privatelink-endpoint-service-name.png" title="Get service name field value"/>

### 4. Add the required information to the template below, and submit your request to [dbt Support](https://docs.getdbt.com/community/resources/getting-help#dbt-cloud-support):
```
Subject: New Multi-Tenant PrivateLink Request
- Type: Redshift Interface-type
- VPC Endpoint Service Name:
- Redshift cluster AWS Region (e.g., us-east-1, eu-west-2):
- dbt Cloud multi-tenant environment (US, EMEA, AU):
```

<PrivateLinkSLA />

## Create Connection in dbt Cloud

Once dbt Cloud support completes the configuration, you can start creating new connections using PrivateLink.

1. Navigate to **settings** → **Create new project** → select **Redshift**
2. You will see two radio buttons: **Public** and **Private.** Select **Private**. 
3. Select the private endpoint from the dropdown (this will automatically populate the hostname/account field).
4. Configure the remaining data platform details.
5. Test your connection and save it.

<PrivateLinkTroubleshooting features={'/snippets/_privatelink-troubleshooting.md'}/>
