---
title: "GCP private connectivity"
id: gcp-overview
description: "Configure private connections for GCP deployments of dbt Cloud"
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import GCPMatrix from '/snippets/_gcp-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

GCP Private Service Connect (PSC) enables secure, private connectivity between <Constant name="cloud" /> and your GCP-hosted services. With PSC, traffic between dbt and your data platforms or self-hosted services stays within the Google network and does not traverse the public internet.

For more details, refer to the [GCP Private Service Connect documentation](https://cloud.google.com/vpc/docs/private-service-connect).

<GCPMatrix />

---

## Configuration guides

### Data platforms

- [Snowflake](/docs/cloud/secure/gcp/gcp-snowflake)
- [BigQuery](/docs/cloud/secure/gcp/gcp-bigquery)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/gcp/gcp-self-hosted)

---

## Terminology

### Parties

| Term | Definition |
|------|------------|
| **<Term id="consumer">Consumer</Term>** | The party that creates a PSC endpoint to connect to a service. The consumer initiates the connection. |
| **<Term id="service-producer">Service producer</Term>** | The party that provisions and manages the service that the consumer connects to. The service producer publishes a service attachment URI that the consumer uses to establish the connection. |

### Provisioning models

These models describe who acts as the <Term id="service-producer">service producer</Term>.

| Term | Definition |
|------|------------|
| **<Term id="native-provisioned">Native</Term>** | GCP is the service producer for its own services (BigQuery). You obtain the service attachment URI from GCP and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the PSC endpoint. |
| **<Term id="vendor-provisioned">Vendor</Term>** | A third-party vendor (Snowflake, Teradata) is the service producer. You obtain the service attachment URI from the vendor and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the PSC endpoint. |
| **<Term id="customer-provisioned">Customer-provisioned</Term>** | You are the service producer. You create a Service Attachment and share the service attachment URI with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the PSC endpoint. |

### Endpoint types

| Term | Definition |
|------|------------|
| **<Term id="dedicated-endpoint">Dedicated endpoint</Term>** | A private endpoint that provides network isolation and is dedicated to a single customer. Access is controlled by network policies, authorization, and authentication. |
| **<Term id="shared-endpoint">Shared endpoint</Term>** | A private endpoint that is shared across multiple customers. Access is primarily controlled by authentication and authorization mechanisms. |
