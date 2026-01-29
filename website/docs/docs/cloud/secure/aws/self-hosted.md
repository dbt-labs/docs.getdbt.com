---
title: "Configuring AWS PrivateLink to your self-hosted service"
id: aws-self-hosted
description: "Setting up an AWS PrivateLink connection between dbt and your self-hosted service."
sidebar_label: "Self-hosted services"
---

# Configuring AWS PrivateLink for a self-hosted service <Lifecycle status="managed_plus" />

import SetUpPages from '/snippets/_available-tiers-private-connection.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

AWS PrivateLink enables secure, private connectivity between <Constant name="cloud" /> and your self-hosted services. These services may include version control systems (VCS), data warehouses, or any other applications you manage. With PrivateLink, you do not need to expose your service to the public internet. All communication occurs over a private network, significantly enhancing security. For more details, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/).

## What this guide covers
The focus of this guide is not on any particular service or backend architecture, but on the [Endpoint Service](#terminology) that interconnects <Constant name="cloud" /> with your self-hosted service. This process should be standard across most use cases.

<!-- TODO: Add architecture diagram showing scope of guide -->
<Lightbox src="/img/docs/dbt-cloud/aws-self-hosted-privatelink/scope-of-guide.png" width="90%" title="The scope of this guide" />

:::note Out of scope
This guide does not cover the configuration or troubleshooting of your self-hosted service, load balancer, or target group health, due to the virtually limitless ways these environments can be configured. While dbt Support may assist with such issues on a best-effort basis, we recommend engaging [AWS Support](https://aws.amazon.com/support/) to expedite resolution.
:::

## Audience
This guide is intended for cloud network administrators or engineers responsible for configuring and maintaining secure network communications within your organization's AWS environment.

## Terminology
This guide uses several important terms related to AWS PrivateLink. Understanding these definitions will help ensure successful implementation. For a more detailed explanation of these concepts, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html).

- **Consumer:** In this context, the Consumer is <Constant name="cloud" />, which creates a VPC Endpoint to connect to your Endpoint Service.
- **Service provider:** Your organization, which owns and operates the service behind the Network Load Balancer and creates the Endpoint Service.
- **Endpoint Service:** The AWS resource that exposes your service to consumers, allowing them to create VPC Endpoints to access it. This is tied to a Network Load Balancer.
- **Service Name:** A globally unique identifier for your Endpoint Service (format: `com.amazonaws.vpce.region.vpce-svc-xxx`). You share this with dbt Support to establish the connection.
- **Network Load Balancer (NLB):** The required load balancer type (internal) that sits in front of your service. Your application must run behind an NLB to use PrivateLink.
- **Target Group:** Routes traffic from the NLB to your service instances (EC2, IP addresses, or ALB).

## Prerequisites
Before you begin, make sure to review the following requirements:

1. **Supported Load Balancer Types**

    dbt has officially validated PrivateLink functionality with the following load balancer type:
    - Network Load Balancer (Internal)

    > While other configurations may be compatible with AWS PrivateLink, this guide assumes your service is configured behind an Internal Network Load Balancer.
    > For more details, see the [AWS Network Load Balancer documentation](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html).

2. **Service Health**

    - Confirm that your service or application is operational and healthy behind the designated load balancer before proceeding.

3. **dbt AWS Account ARN**

    - Contact [dbt Support](/community/resources/getting-help#dbt-cloud-support) to obtain the dbt AWS account ARN. You will need this in order to allow dbt Cloud to connect to your Endpoint Service.


## Instructions
1. Log in to the [AWS Console](https://console.aws.amazon.com).
2. Navigate to the AWS Account and Region where your self-hosted service is located.

### Create a VPC Endpoint Service

3. In the AWS Console, navigate to **VPC** → **Endpoint Services** → **Create Endpoint Service**

4. In the Create endpoint service page:

    a. **Load balancer type:** Select **Network**

    b. **Available load balancers:** Select the NLB in front of your service

    c. **Acceptance required:** Enable this option (recommended) to manually approve connection requests

    d. Click **Create**

### Grant dbt access to the Endpoint Service

5. After the Endpoint Service is created, select it and go to the **Allow principals** tab

6. Click **Allow principals** and add the dbt AWS account ARN that you obtained from support:

    - Principal: `arn:aws:iam::<dbt-account-id>:root`

### Obtain the Endpoint Service Name

7. On the Endpoint Service details page, copy the **Service name** value (format: `com.amazonaws.vpce.region.vpce-svc-xxx`)

<Lightbox src="/img/docs/dbt-cloud/aws-self-hosted-privatelink/obtain-endpoint-svc-name.png" width="90%" title="Copy the Endpoint Service name" />

### Providing dbt Support with connection details

8. Add the required information to the template below, and submit your request to [dbt Support](/community/resources/getting-help#dbt-cloud-support):

```
Subject: New AWS Self-hosted PrivateLink Request
- Type: Self-hosted PrivateLink
- VPC Endpoint Service Name:
- Custom DNS (if HTTPS/TLS)
    - DNS record:
- Service Region: (for example, us-east-1, eu-west-2)
- dbt AWS environment (US, EMEA, AU):
```

import PrivateLinkSLA from '/snippets/_private-connection-SLA.md';

<PrivateLinkSLA />
