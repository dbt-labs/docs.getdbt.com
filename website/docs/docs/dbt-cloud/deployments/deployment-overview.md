---
id: deployment-overview
title: Overview
---

:::info Deployments

This section provides an overview of the various deployment types available for dbt Cloud. 
If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

In general, the dbt Cloud application deployment models fall into two categories: **hosted** and **customer managed**.

**Hosted** deployments are those that are hosted on infrastructure managed by Fishtown Analytics. The deployments in this category include _Multi Tenant_ and _Single Tenant_. Both hosted models leverage AWS infrastructure as described in the [Architecture](deployment-architecture) section.

**Customer managed** deployments are configured and managed by the customer. The [Kubernetes Off-The-Shelf (KOTS)](https://kots.io/) software distributed by [Replicated](https://www.replicated.com/) is leveraged to facilitate the management of deploying and upgrading dbt Cloud in customer managed environments.

For more information on the deployments view the below pages.

**Hosted Deployments**
- [Multi Tenant](multi-tenant-deployment)
- [Single Tenant](single-tenant-deployment)

**Customer Managed Deployments**
- [Customer Managed](docs/dbt-cloud/on-premises/index)
