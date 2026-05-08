---
title: "Azure private connectivity"
id: azure-overview
description: "Configure private connections for Azure deployments of the dbt platform."
sidebar_label: "About Azure Private Link"
---

import SetUpPages from '/snippets/_available-tiers-enterprise-plus.md';
import AzureMatrix from '/snippets/_azure-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-enterprise-plus.md'}/>

Azure Private Link enables secure, private connectivity between <Constant name="dbt" /> and your Azure-hosted services. With Private Link, traffic between dbt and your data platforms or self-hosted services stays within the Azure network and does not traverse the public internet.

For more details, refer to the [Azure Private Link documentation](https://learn.microsoft.com/en-us/azure/private-link/).

<AzureMatrix />

## Cross-region private connections

dbt Labs has globally connected private networks specifically used to host private endpoints, which are connected to <Constant name="dbt" /> instance environments. This connectivity allows <Constant name="dbt" /> environments to connect to any supported region from any <Constant name="dbt" /> instance within the same cloud provider network. To ensure security, access to these endpoints is protected by security groups, network policies, and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each of the connected platforms.
