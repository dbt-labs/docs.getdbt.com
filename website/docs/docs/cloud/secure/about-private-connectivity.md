---
title: "Network security"
id: about-private-connectivity
description: "Learn about network security options for dbt Cloud"
sidebar_label: "Network security"
pagination_next: "docs/cloud/secure/ip-restrictions"
pagination_prev: null
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

## How do you want to connect to dbt Cloud?

<div className="grid--2-col">

<Card
    title="Over the public internet"
    body="Control access by restricting connections to specific public IP addresses."
    link="/docs/cloud/secure/ip-restrictions"
    icon="dbt-bit"/>

<Card
    title="Over a private network"
    body="Connect securely without traversing the public internet using PrivateLink or Private Service Connect."
    link="#private-connectivity"
    icon="dbt-bit"/>

</div>

---

## Private connectivity

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Private connections enables secure communication from any <Constant name="cloud" /> environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/), [Azure](https://azure.microsoft.com/en-us/products/private-link), or [GCP](https://cloud.google.com/vpc/docs/private-service-connect), using that provider's private connection technology. Private connections allow <Constant name="cloud" /> customers to meet security and compliance controls as it allows connectivity between <Constant name="cloud" /> and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders type='a data platform' />

### Choose your cloud platform

Select your cloud platform to view private connectivity options, support matrix, and configuration guides.

<div className="grid--3-col" style={{textAlign: 'center'}}>

<Card
    title="AWS"
    link="/docs/cloud/secure/aws/aws-overview"
    icon="aws-logo"
/>

<Card
    title="Azure"
    link="/docs/cloud/secure/azure/azure-overview"
    icon="azure-logo"
/>

<Card
    title="GCP"
    link="/docs/cloud/secure/gcp/gcp-overview"
    icon="gcp-logo"
/>

</div>

