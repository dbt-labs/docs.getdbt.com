---
title: "AWS private connectivity"
id: aws-overview
description: "Configure private connections for AWS deployments of dbt Cloud"
sidebar_label: "Overview"
---

import SetUpPages from '/snippets/_available-tiers-private-connection.md';
import AWSMatrix from '/snippets/_aws-private-connectivity-matrix.md';

<SetUpPages features={'/snippets/_available-tiers-private-connection.md'}/>

AWS PrivateLink enables secure, private connectivity between <Constant name="cloud" /> and your AWS-hosted services. With PrivateLink, traffic between dbt and your data platforms or self-hosted services stays within the AWS network and does not traverse the public internet.

For more details, refer to the [AWS PrivateLink documentation](https://docs.aws.amazon.com/vpc/latest/privatelink/).

<AWSMatrix />

---

## Configuration guides

### Data platforms

- [Snowflake](/docs/cloud/secure/aws/aws-snowflake)
- [Databricks](/docs/cloud/secure/aws/aws-databricks)
- [Redshift](/docs/cloud/secure/aws/aws-redshift)
- [Postgres](/docs/cloud/secure/aws/aws-postgres)

### Self-hosted services

- [Self-hosted services (VCS, databases, and more)](/docs/cloud/secure/aws/aws-self-hosted)

---

## Terminology

### Parties

| Term | Definition |
|------|------------|
| **<Term id="consumer">Consumer</Term>** | The party that creates a VPC endpoint to connect to a service. The consumer initiates the connection. |
| **<Term id="service-producer">Service producer</Term>** | The party that provisions and manages the service that the consumer connects to. The service producer publishes an endpoint service name that the consumer uses to establish the connection. |

### Provisioning models

These models describe who acts as the <Term id="service-producer">service producer</Term>.

| Term | Definition |
|------|------------|
| **<Term id="native-provisioned">Native</Term>** | AWS is the service producer for its own services (Redshift, Athena). You obtain the endpoint service name from AWS and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the VPC endpoint. |
| **<Term id="vendor-provisioned">Vendor</Term>** | A third-party vendor (Snowflake, Databricks, Teradata) is the service producer. You obtain the endpoint service name from the vendor and share it with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the VPC endpoint. |
| **<Term id="customer-provisioned">Customer-provisioned</Term>** | You are the service producer. You create a VPC Endpoint Service and share the endpoint service name with dbt; dbt is the <Term id="consumer">consumer</Term> and creates the VPC endpoint. |
| **<Term id="dbt-provisioned">dbt-provisioned</Term>** | dbt is the service producer. You are the <Term id="consumer">consumer</Term> and create a VPC endpoint in your environment to connect to <Constant name="cloud" />. This applies only to connections TO dbt Cloud (Single-Tenant). |

### Endpoint types

| Term | Definition |
|------|------------|
| **<Term id="dedicated-endpoint">Dedicated endpoint</Term>** | A private endpoint that provides network isolation and is dedicated to a single customer. Access is controlled by network policies, authorization, and authentication. |
| **<Term id="shared-endpoint">Shared endpoint</Term>** | A private endpoint that is shared across multiple customers. Access is primarily controlled by authentication and authorization mechanisms. |
