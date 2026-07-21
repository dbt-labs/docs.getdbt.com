---
title: "AWS inbound PrivateLink for single-tenant access URLs"
id: aws-ingress
description: "Configure inbound AWS PrivateLink to reach your single-tenant dbt platform instance over a private access URL."
sidebar_label: "Inbound PrivateLink"
---

{/* DRAFT — do not publish. Content to be synthesized from the recorded walkthrough + screenshots. Publishing is gated on application-layer end-to-end validation sign-off. */}

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Inbound AWS PrivateLink lets your users and services reach a single-tenant <Constant name="dbt_platform" /> instance privately, over a dedicated access URL, without traversing the public internet. Traffic originates in your AWS account and reaches the dbt-managed endpoint service through an interface VPC endpoint.

{/* TODO: confirm scope statement — single-tenant only for now; multi-tenant inbound out of scope. */}

## How it works

- <Constant name="dbt" /> publishes a PrivateLink **endpoint service** in front of your single-tenant instance's ingress.
- You create an **interface VPC endpoint** in your AWS account that targets that endpoint service.
- You resolve your private access URL to the endpoint's private IPs using a **private hosted zone** in your VPC.
- Your client must present the private access URL as the **TLS SNI** so the ingress selects the correct certificate.

{/* TODO: add architecture diagram / screenshot from the walkthrough where the flow isn't self-explanatory. */}

## Prerequisites

{/* TODO: confirm exact permission sets + plan tier. */}
- A single-tenant <Constant name="dbt_platform" /> instance with inbound PrivateLink enabled by <Constant name="dbt" />.
- The **VPC endpoint service name** for your instance (provided by dbt), for example `com.amazonaws.vpce.<region>.vpce-svc-xxxxxxxxxxxx`.
- Your private **access URL** for the instance.
- Permissions in your AWS account to create interface VPC endpoints, private hosted zones, and DNS records.

## Step 1: Create the interface VPC endpoint

{/* TODO: fill from walkthrough + screenshots. */}
1. In the AWS console, go to **VPC → Endpoints → Create endpoint**.
2. Choose **Endpoint services that use NLBs and GWLBs** (other endpoint services) and enter the dbt-provided endpoint service name.
3. Select the VPC and subnets that need private access, and a security group allowing outbound `443`.
4. Create the endpoint and wait for dbt to accept the connection request (status becomes **Available**).

## Step 2: Create a private hosted zone and records

{/* TODO: confirm record set — how many records, and whether the endpoint-service private DNS auto-creates them or they are created manually. */}
1. Create a **private hosted zone** for your access URL domain.
2. Add the record(s) pointing your access URL to the interface VPC endpoint.

## Step 3: Associate the hosted zone with your VPC

{/* TODO: fill from walkthrough. */}
1. Associate the private hosted zone with each VPC that needs to resolve the access URL.

## Step 4: Validate connectivity

{/* TODO: fill from walkthrough + screenshots. */}
1. From an instance inside the associated VPC, confirm the access URL resolves to a **private** endpoint IP.
2. Confirm the TLS handshake succeeds and the certificate matches your access URL.

:::warning SNI is required
Clients must send the access URL as the TLS **SNI**. Some PrivateLink clients and libraries do not set SNI by default; without it, the ingress returns a default certificate that will not match your access URL and the handshake fails.
:::
