---
title: "About private connectivity"
id: private-connectivity
description: "Configuring private connections."
sidebar_label: "About private connectivity"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import CloudProviders from '/snippets/_private-connection-across-providers.md';
import PrivateLinkHostnameWarning from '/snippets/_private-connection-hostname-restriction.md';

<SetUpPages />

<PrivateLinkHostnameWarning />

Private connections enables secure communication from any <Constant name="dbt" /> environment to your data platform hosted on a cloud provider, such as [AWS](https://aws.amazon.com/privatelink/), [Azure](https://azure.microsoft.com/en-us/products/private-link), or [GCP](https://cloud.google.com/vpc/docs/private-service-connect), using that provider's private connection technology. Private connections allow <Constant name="dbt" /> customers to meet security and compliance controls as it allows connectivity between <Constant name="dbt" /> and your data platform without traversing the public internet. This feature is supported in most regions across North America, Europe, and Asia, but [contact us](https://www.getdbt.com/contact/) if you have questions about availability.

<CloudProviders />


## Available platforms

Select your cloud platform to view private connectivity options, support matrix, and configuration guides.

<div className="grid--3-col">

<Card
    title="AWS"
    body="Amazon Web Services PrivateLink"
    link="/docs/platform/secure/private-connectivity/aws/aws-overview"
    icon="dbt-bit"
/>

<Card
    title="Azure"
    body="Microsoft Azure Private Link"
    link="/docs/platform/secure/private-connectivity/azure/azure-overview"
    icon="dbt-bit"
/>

<Card
    title="GCP"
    body="Google Cloud Platform Private Service Connect"
    link="/docs/platform/secure/private-connectivity/gcp/gcp-overview"
    icon="dbt-bit"
/>

</div>
