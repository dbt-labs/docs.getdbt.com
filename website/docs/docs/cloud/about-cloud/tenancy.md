---
title: Tenancy
id: tenancy
description: "Single tenant, multi-tenant, and cell-based (multi-cell) dbt platform hosting"
---

import AboutCloud from '/snippets/_test-tenancy.md';

<AboutCloud tenancy={'/snippets/_test-tenancy.md'}/>

## Multi-tenant

The Multi Tenant (SaaS) deployment environment refers to the SaaS <Constant name="dbt" /> application hosted by dbt Labs. This is the most commonly used deployment and is completely managed and maintained by dbt Labs, the makers of dbt. As a SaaS product, a user can quickly [create an account](https://www.getdbt.com/signup/) on our North American servers and get started using the dbt and related services immediately. _If your organization requires cloud services hosted on EMEA or APAC regions_, please [contact us](https://www.getdbt.com/contact/). The deployments are hosted on AWS or Azure and are always kept up to date with the currently supported dbt versions, software updates, and bug fixes.

### Cell-based hosting (multi-cell) {#cell-based-hosting-multi-cell}

Multi-cell (also called cell-based hosting) means your <Constant name="dbt_platform" /> account runs in a cell: a defined slice of our shared SaaS stack with its own capacity, scaling, and status boundaries. Cells segment how we run multi-tenant infrastructure at scale; you remain on the same multi-tenant product managed by dbt Labs. Cell-based hosting is different to [single tenant](#single-tenant) in that it doesn't give you a dedicated VPC or isolated cloud account by itself.

Most of the time, your plan and the features available to you stay the same as for other multi-tenant accounts in your cloud and region (see [Available features](#available-features)). The difference with a cell-based hosting account is that you may need to update some setup details: like the URL you use to sign in, which IP addresses to allow, and which status page to watch if something goes wrong in your cell.

#### How to access dbt and related endpoints

- <Constant name="dbt_platform" /> — Use the [access URL](/docs/cloud/about-cloud/access-regions-ip-addresses#accessing-your-account) that matches your account and region. Find your access URL in **Account settings** → **Account information**. For example, if your account prefix is `abc123` in the North American AWS region, your access URL is `abc123.us1.dbt.com`.
- APIs and Semantic Layer — Use the exact base URLs found in <Constant name="dbt_platform" />: **Account settings** → **Account information**, under **Access URLs**. That list is the source of truth for Admin API, Discovery, Semantic Layer JDBC/GraphQL, and similar endpoints. Details: [API access URLs](/docs/cloud/about-cloud/access-regions-ip-addresses#api-access-urls).
- IPs and status — Region-specific IP lists and separate Multi-tenant vs Cell based status links are in [Access, regions, & IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses).

## Single tenant

The single tenant deployment environment provides a hosted alternative to the multi-tenant (SaaS) <Constant name="dbt" /> environment. While still managed and maintained by dbt Labs, single tenant <Constant name="dbt" /> instances provide dedicated infrastructure in a virtual private cloud (VPC) environment. This is accomplished by spinning up all the necessary infrastructure with a re-usable Infrastructure as Code (IaC) deployment built with [Terraform](https://www.terraform.io/). The single tenant infrastructure lives in a dedicated AWS or Azure account and can be customized with certain configurations, such as firewall rules, to limit inbound traffic or hosting in a specific regions.

A few common reasons for choosing a single tenant deployment over the Production SaaS product include:
- A requirement that the <Constant name="dbt" /> application be hosted in a dedicated VPC that is logically separated from other customer infrastructure
- A desire for multiple isolated <Constant name="dbt" /> instances for testing, development, etc

_To learn more about setting up a <Constant name="dbt" /> single tenant deployment, [please contact our sales team](mailto:sales@getdbt.com)._

## Available features

<Snippet path="cloud-feature-parity" />
