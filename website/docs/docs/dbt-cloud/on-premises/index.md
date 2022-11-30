---
id: index
title: Overview
---

:::note

We longer support new on-premises deployments, and instead have moved to a [Single Tenant](single-tenant) model hosted in the cloud

:::

The Customer Managed deployment environment is configured and managed by the customer. While this deployment model allows for the greatest level of customization and ownership of the dbt Cloud infrastructure, it may not be ideal for most customers as it also comes with the greatest level of troubleshooting and maintenance costs.

dbt Cloud is a bundled Kubernetes appliance that can be automatically installed into a standalone Kubernetes cluster.

dbt Cloud uses a collection of open source technologies called Kubernetes-off-the-shelf ([KOTS](https://kots.io/)) to manage installations. Internally, dbt Cloud is a Kubernetes appliance, but you do not need to already use Kubernetes to run it. It supports two different deployment models: installation into an existing Kubernetes cluster, or installation onto a bare Linux instance or VM. Installation into a VM is not recommended as this adds an additional layer of complexity and lacks the reliability and scalability of a native Kubernetes deployment.

The following pages are intended for system administrators of Customer Managed installations and describe the various steps needed to install and maintain a Customer Managed deployment.
