---
id: virtual-private-dbt-deployment
title: Virtual Private dbt
---

Virtual Private dbt provides advanced security and data residency options compared to the Multi Tenant (SaaS) dbt Cloud environment. While still managed and maintained by dbt Labs, the Virtual Private dbt environment provides dedicated infrastructure with one or more instances of dbt Cloud that can only be accessed by a single customer. This is accomplished by spinning up all the necessary infrastructure with a re-usable Infrastructure as Code (IaC) deployment built with [Terraform](https://www.terraform.io/). The Virtual Private dbt infrastructure lives in a dedicated AWS account and can be customized with certain configurations such as Firewall rules to limit ingress traffic or hosting in a specific AWS Region.

A few common reasons for choosing a Virtual Private dbt deployment over the Multi Tenant (SaaS) product include:
- A requirement that the dbt Cloud application be hosted in a dedicated VPC that is logically separated from other customer infrastructure
- A desire for multiple isolated dbt Cloud instances for testing, development, etc

_To learn more about setting up a dbt Cloud Virtual Private dbt deployment, [please contact our sales team](mailto:sales@getdbt.com)._

For more information about the dbt Cloud Virtual Private dbt deployment see the below.

- [Application Data Flows](/docs/dbt-cloud/deployments/deployment-architecture#application-data-flows)
- [Hosted Network Architecture](/docs/dbt-cloud/deployments/deployment-architecture#hosted-network-architecture)
