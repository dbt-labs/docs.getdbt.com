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

---

## Terminology

### Parties

| Term | Definition |
|------|------------|
| **<Term id="consumer">Consumer</Term>** | The party that creates a private endpoint to connect to a service. The consumer initiates the connection. |
| **<Term id="service-producer">Service producer</Term>** | The party that provisions and manages the service that the consumer connects to. The service producer publishes an alias that the consumer uses to establish the connection. |

### Provisioning models

These models describe who acts as the <Term id="service-producer">service producer</Term>.

| Term | Definition |
|------|------------|
| **<Term id="native-provisioned">Native</Term>** | Azure is the service producer for its own services (Synapse, PostgreSQL Flexible Server). You obtain the alias from Azure and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the private endpoint. |
| **<Term id="vendor-provisioned">Vendor</Term>** | A third-party vendor (Snowflake, Databricks, Teradata) is the service producer. You obtain the alias from the vendor and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the private endpoint. |
| **<Term id="customer-provisioned">Customer-provisioned</Term>** | You are the service producer. You create a Private Link Service and share the alias with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the private endpoint. |
| **<Term id="dbt-provisioned">dbt-provisioned</Term>** | dbt is the service producer. You are the <Term id="consumer">consumer</Term> and create a private endpoint in your environment to connect to <Constant name="cloud" />. This applies only to connections TO dbt Cloud (Single-Tenant). |

### Endpoint types

| Term | Definition |
|------|------------|
| **<Term id="dedicated-endpoint">Dedicated endpoint</Term>** | A private endpoint that provides network isolation and is dedicated to a single customer. Access is controlled by network policies, authorization, and authentication. |
| **<Term id="shared-endpoint">Shared endpoint</Term>** | A private endpoint that is shared across multiple customers. Access is primarily controlled by authentication and authorization mechanisms. |
