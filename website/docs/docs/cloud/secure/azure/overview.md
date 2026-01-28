---
title: "Azure private connectivity"
id: azure-overview
description: "Configure private connections for Azure deployments of dbt Cloud"
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import AzureMatrix from '/snippets/_azure-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

Azure Private Link enables secure, private connectivity between <Constant name="cloud" /> and your Azure-hosted services. With Private Link, traffic between dbt and your data platforms or self-hosted services stays within the Azure network and does not traverse the public internet.

For more details, refer to the [Azure Private Link documentation](https://learn.microsoft.com/en-us/azure/private-link/).

<AzureMatrix />

---

## Configuration guides

### Data platforms

- [Snowflake](/docs/cloud/secure/azure/azure-snowflake)
- [Databricks](/docs/cloud/secure/azure/azure-databricks)
- [Azure Database for PostgreSQL Flexible Server](/docs/cloud/secure/azure/azure-postgres)
- [Azure Synapse](/docs/cloud/secure/azure/azure-synapse)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/azure/azure-self-hosted)

---

## Cross-region private connections

dbt Labs maintains globally connected private networks to host private endpoints across Azure regions. This allows <Constant name="cloud" /> environments to connect to supported regions from any <Constant name="cloud" /> instance within Azure. Access to these endpoints is protected by network policies and application connection safeguards, in addition to the authentication and authorization mechanisms provided by each connected platform.

:::caution Environment variables
Using [Environment variables](/docs/build/environment-variables) when configuring private connection endpoints isn't supported in <Constant name="cloud" />. Instead, use [Extended Attributes](/docs/deploy/deploy-environments#extended-attributes) to dynamically change these values in your <Constant name="cloud" /> environment.
:::

