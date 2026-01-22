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
- [Postgres](/docs/cloud/secure/azure/azure-postgres)
- [Synapse](/docs/cloud/secure/azure/azure-synapse)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/azure/azure-self-hosted)

