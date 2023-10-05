---
title: Tenancy
id: tenancy
description: "Information about single tenant and multi-tenant dbt Cloud instances"
---

import AboutCloud from '/snippets/_test-tenancy.md';

<AboutCloud tenancy={'/snippets/_test-tenancy.md'}/>

### Multi-tenant

The Multi Tenant (SaaS) deployment environment refers to the SaaS dbt Cloud application hosted by dbt Labs. This is the most commonly used deployment and is completely managed and maintained by dbt Labs, the makers of dbt. As a SaaS product, a user can quickly [create an account](https://www.getdbt.com/signup/) on our North American servers and get started using the dbt and related services immediately. _If your organization requires cloud services hosted on EMEA or APAC regions_, please [contact us](https://www.getdbt.com/contact/). The deployment is hosted on AWS and is always kept up to date with the currently supported dbt versions, software updates, and bug fixes.

### Single tenant

The single tenant deployment environment provides a hosted alternative to the multi-tenant (SaaS) dbt Cloud environment. While still managed and maintained by dbt Labs, single tenant dbt Cloud instances provide dedicated infrastructure in a virtual private cloud (VPC) environment. This is accomplished by spinning up all the necessary infrastructure with a re-usable Infrastructure as Code (IaC) deployment built with [Terraform](https://www.terraform.io/). The single tenant infrastructure lives in a dedicated AWS or Azure account and can be customized with certain configurations, such as firewall rules, to limit inbound traffic or hosting in specific regions.

A few common reasons for choosing a single tenant deployment over the Production SaaS product include:
- A requirement that the dbt Cloud application be hosted in a dedicated VPC that is logically separated from other customer infrastructure
- A desire for multiple isolated dbt Cloud instances for testing, development, etc

_To learn more about setting up a dbt Cloud single tenant deployment, [please contact our sales team](mailto:sales@getdbt.com)._

### Available features

<Snippet path="cloud-feature-parity" />
