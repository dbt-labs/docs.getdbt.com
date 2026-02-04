---
title: "About private connectivity"
id: private-connectivity
description: "Configuring private connections."
sidebar_label: "About private connectivity"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';

<SetUpPages />

Private connections enables secure communication from any <Constant name="cloud" /> environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/), [Azure](https://azure.microsoft.com/en-us/products/private-link), or [GCP](https://cloud.google.com/vpc/docs/private-service-connect), using that provider's private connection technology. Private connections allow <Constant name="cloud" /> customers to meet security and compliance controls as it allows connectivity between <Constant name="cloud" /> and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders />


## Available platforms

Select your cloud platform to view private connectivity options, support matrix, and configuration guides.

<div className="grid--3-col">

<Card
    title="AWS"
    body="Amazon Web Services PrivateLink"
    link="/docs/cloud/secure/private-connectivity/aws/aws-overview"
    icon="dbt-bit"
/>

<Card
    title="Azure"
    body="Microsoft Azure Private Link"
    link="/docs/cloud/secure/private-connectivity/azure/azure-overview"
    icon="dbt-bit"
/>

<Card
    title="GCP"
    body="Google Cloud Platform Private Service Connect"
    link="/docs/cloud/secure/private-connectivity/gcp/gcp-overview"
    icon="dbt-bit"
/>

</div>

## Cross-region private connections

<PrivateLinkHostnameWarning />

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="cloud" /> instance environments. This connectivity allows <Constant name="cloud" /> environments to connect to any supported region from any <Constant name="cloud" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.


