---
title: "AWS PrivateLink for single-tenant ingress"
id: aws-ingress
description: "Configure inbound AWS PrivateLink so your services reach a single-tenant dbt platform instance over a private access URL."
sidebar_label: "Ingress (access URL)"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise_plus
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';

# Configuring AWS PrivateLink for single-tenant ingress <Lifecycle status="beta"/>

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Inbound AWS PrivateLink lets your services reach a single-tenant <Constant name="dbt_platform" /> instance privately over your access URL, without traffic traversing the public internet. You create an interface VPC endpoint in your AWS account that connects to the PrivateLink endpoint service <Constant name="dbt" /> publishes in front of your instance.

:::note Single-tenant only
Ingress PrivateLink is available for single-tenant deployments. Multi-tenant ingress is not currently supported — see the [AWS private connectivity matrix](/docs/platform/secure/private-connectivity/aws/aws-overview).
:::

:::info Setting up ingress PrivateLink for your instance
Ingress PrivateLink is provisioned by dbt Labs for your single-tenant instance. To scope and enable it — and to receive your endpoint service name — reach out to your **dbt Labs account team or Solutions Architect**. If you don't yet have a single-tenant deployment, [contact our sales team](mailto:sales@getdbt.com).
:::

## Roles

This guide uses two roles, matching the AWS PrivateLink model:

- **Provider** — <Constant name="dbt" />, which hosts the VPC endpoint service in front of your single-tenant instance.
- **Customer** — you, who create the interface VPC endpoint in your own AWS account.

## Access URL naming convention

Single-tenant ingress uses the domain convention `<customer_name>.private.dbt.com` for your access URL. When you enable private DNS on the endpoint (see [Step 3](#step-3-select-your-vpc-and-enable-private-dns)), AWS provisions a private hosted zone containing a wildcard record for this domain. The wildcard covers the product subdomains served by your instance, such as the semantic layer and metadata (Discovery) endpoints, so a single endpoint serves all of them.

:::info The provider must verify your custom domain first
Private DNS on the endpoint only works once <Constant name="dbt" /> (the provider) has verified the custom domain on the endpoint service. Confirm with dbt that your instance is ready for ingress PrivateLink before you begin.
:::

## Prerequisites

- A single-tenant <Constant name="dbt_platform" /> instance with ingress PrivateLink enabled by <Constant name="dbt" />.
- The **VPC endpoint service name** for your instance, provided by dbt (for example, `com.amazonaws.vpce.us-east-1.vpce-svc-xxxxxxxxxxxxxxxxx`).
- Your **access URL** for the instance (`<customer_name>.private.dbt.com`).
- An AWS VPC in the same Region as the endpoint service, with **DNS hostnames** and **DNS resolution** enabled (both are required for the private DNS name feature).
- Permissions in your AWS account to create interface VPC endpoints and manage the associated security group.

## Create the interface VPC endpoint

### Step 1: Start creating the endpoint

1. In the AWS console, go to **VPC → Endpoints** and select **Create endpoint**.
2. (Optional) Add a **Name tag** to identify the endpoint.
3. Under **Type**, select **Endpoint services that use NLBs and GWLBs**.

<Lightbox src="/img/docs/dbt-platform/aws-ingress-privatelink/create-endpoint-select-type.png" title="Create endpoint page with 'Endpoint services that use NLBs and GWLBs' selected as the type"/>

### Step 2: Enter and verify the service name

1. In **Service name**, paste the endpoint service name that dbt provided.
2. Leave **Enable Cross Region endpoint** unchecked — the endpoint is created in the same Region as the service.
3. Select **Verify service** and confirm you see **Service name verified**.

<Lightbox src="/img/docs/dbt-platform/aws-ingress-privatelink/verify-service-name.png" title="Service name entered and verified, with Cross Region endpoint left disabled"/>

### Step 3: Select your VPC and enable private DNS

1. Under **Network settings**, select the **VPC** where your workloads run.
2. Expand **Additional settings** and select **Enable private DNS name**.

<Lightbox src="/img/docs/dbt-platform/aws-ingress-privatelink/enable-private-dns-name.png" title="Enable private DNS name selected under Additional settings"/>

:::warning Always enable private DNS name
Selecting **Enable private DNS name** automatically provisions the private hosted zone and record set for your `<customer_name>.private.dbt.com` access URL. This is the standard, recommended configuration. Configuring hostnames manually instead can lead to TLS errors and other issues, so keep this box checked.
:::

### Step 4: Choose subnets and a security group

1. Select the **subnets** for the endpoint. A single subnet is enough for testing; use subnets across multiple Availability Zones for production.
2. Choose a **security group** that allows inbound traffic on **port 443** from your workloads.
3. Select **Create endpoint**.

### Step 5: Wait for the endpoint to become available

The endpoint is created in a **Pending** state while dbt accepts the connection, then moves to **Available**. Once available, the **Private DNS names enabled** field shows **Yes** and the **Private DNS names** list includes your `*.<customer_name>.private.dbt.com` record.

<Lightbox src="/img/docs/dbt-platform/aws-ingress-privatelink/endpoint-available.png" title="Endpoint details page showing status Available, private DNS names enabled, and the private.dbt.com record"/>

## Validate connectivity

From an instance inside the selected VPC, confirm that:

1. Your access URL resolves to a **private** IP address from the endpoint (not a public address).
2. The TLS handshake succeeds and the returned certificate matches your access URL.

:::warning Clients must send the correct TLS SNI
The endpoint selects its certificate by TLS **Server Name Indication (SNI)**. Clients must send your access URL as the SNI. Some PrivateLink clients and libraries do not set SNI by default — without it, the endpoint returns a default certificate that will not match your access URL and the handshake fails.
:::

## Connecting from on-premises networks

Workloads inside the associated VPC resolve the access URL automatically. For clients connecting from on-premises over **AWS VPN** or **AWS Direct Connect**, additional DNS configuration is required so those clients resolve the access URL to the endpoint's private IPs. Refer to the AWS documentation on [Route 53 Resolver inbound endpoints](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolver-forwarding-inbound-queries.html) to forward DNS queries from your on-premises network into the VPC.
