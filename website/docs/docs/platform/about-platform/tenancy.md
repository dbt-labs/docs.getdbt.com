---
title: Tenancy
id: tenancy
description: "Single tenant, multi-tenant, and cell-based (multi-cell) dbt platform hosting"
---

import AboutCloud from '/snippets/_test-tenancy.md';

<AboutCloud tenancy={'/snippets/_test-tenancy.md'}/>

## Multi-tenant

The Multi Tenant (SaaS) deployment environment refers to the SaaS <Constant name="dbt" /> application hosted by dbt Labs. This is the most commonly used deployment and is completely managed and maintained by dbt Labs, the makers of dbt. As a SaaS product, a user can quickly [create an account](https://www.getdbt.com/signup/) on our North American servers and get started using the dbt and related services immediately. _If your organization requires cloud services hosted on EMEA or APAC regions_, please [contact us](https://www.getdbt.com/contact/). The deployments are hosted on AWS or Azure and are always kept up to date with the currently supported dbt versions, software updates, and bug fixes.

#### Multi-cell hosting

Multi-cell (also called cell-based hosting) means your <Constant name="dbt_platform" /> account runs in a cell: a defined slice of our shared SaaS stack with its own capacity, scaling, and status boundaries. Cells segment how we run multi-tenant infrastructure at scale; you still remain on the same multi-tenant product managed by dbt Labs. Cell-based hosting is different from [single tenant](#single-tenant) in that it doesn't provide a dedicated virtual private cloud (VPC) or isolated cloud account on its own.

Generally, your plan and the features available to you stay the same as for other multi-tenant accounts in your managed cloud provider and region (see [Available features](#available-features)). The main differences are in some setup details, such as the URL you use to sign in, which IP addresses to allow, and which status page to monitor if something goes wrong in your cell. See the [API access URLs](/docs/platform/about-platform/access-regions-ip-addresses#api-access-urls) section for more information.

## Single tenant

The single tenant deployment environment provides a hosted alternative to the multi-tenant (SaaS) <Constant name="dbt" /> environment. While still managed and maintained by dbt Labs, single tenant <Constant name="dbt" /> instances provide dedicated infrastructure in a VPC environment. This is accomplished by spinning up all the necessary infrastructure with a re-usable Infrastructure as Code (IaC) deployment built with [Terraform](https://www.terraform.io/). The single tenant infrastructure lives in a dedicated AWS or Azure account and can be customized with certain configurations, such as firewall rules, to limit inbound traffic or hosting in a specific regions.

A few common reasons for choosing a single tenant deployment over the Production SaaS product include:
- A requirement that the <Constant name="dbt" /> application be hosted in a dedicated VPC that is logically separated from other customer infrastructure
- A desire for multiple isolated <Constant name="dbt" /> instances for testing, development, etc

_To learn more about setting up a <Constant name="dbt" /> single tenant deployment, [please contact our sales team](mailto:sales@getdbt.com)._

## Available features

<Snippet path="cloud-feature-parity" />
