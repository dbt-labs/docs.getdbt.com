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

- [Snowflake](/docs/cloud/secure/private-connectivity/azure/azure-snowflake)
- [Databricks](/docs/cloud/secure/private-connectivity/azure/azure-databricks)
- [Database for Postgres Flexible Server](/docs/cloud/secure/private-connectivity/azure/azure-postgres)
- [Synapse](/docs/cloud/secure/private-connectivity/azure/azure-synapse)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/private-connectivity/azure/azure-self-hosted)

---

## Terminology

For definitions of terms like **Native**, **Vendor**, **Customer-provisioned**, and **dbt-provisioned**, see the [Terminology section](/docs/cloud/secure/private-connectivity/private-connectivity#terminology) in the private connectivity overview.
