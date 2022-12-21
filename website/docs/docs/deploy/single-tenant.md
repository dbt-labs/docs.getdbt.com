---
title: Single tenant 
id: single-tenant
---

The Single Tenant deployment environment provides a hosted alternative to the Multi Tenant (SaaS) dbt Cloud environment. While still managed and maintained by dbt Labs, the Single Tenant environment provides dedicated infrastructure with one or more instances of dbt Cloud that can only be accessed by a single customer. This is accomplished by spinning up all the necessary infrastructure with a re-usable Infrastructure as Code (IaC) deployment built with [Terraform](https://www.terraform.io/). The Single Tenant infrastructure lives in a dedicated AWS account and can be customized with certain configurations such as Firewall rules to limit ingress traffic or hosting in a specific AWS Region.

A few common reasons for choosing a Single Tenant deployment over the Production SaaS product include:
- A requirement that the dbt Cloud application be hosted in a dedicated VPC that is logically separated from other customer infrastructure
- A desire for multiple isolated dbt Cloud instances for testing, development, etc

_To learn more about setting up a dbt Cloud Single Tenant deployment, [please contact our sales team](mailto:sales@getdbt.com)._

For more information about the dbt Cloud Single Tenant deployment see the below.

- [Application Data Flows](/docs/deploy/architecture#application-data-flows)
- [Hosted Network Architecture](/docs/deploy/architecture#hosted-network-architecture)
