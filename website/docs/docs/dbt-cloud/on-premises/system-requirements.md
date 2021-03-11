---
id: system-requirements
title: System Requirements
---

:::note

We longer support new on-premises deployments, and instead have moved to a [Single Tenant](single-tenant) model hosted in the cloud

:::

A dbt Cloud installation requires at least:

- 4 CPU cores
- 16GB of memory
- 100GB of available disk storage for logs and metadata

For every 20 developer users, it is recommended to add another 4 CPU cores, 16 GB of memory, and 100GB of disk. You can accomplish this either by creating a larger instance, or by adding another node to your dbt Cloud cluster.

### Install into an existing Kubernetes cluster

As mentioned above, it is recommended that at least 4 CPU cores, 16GB of memory, and 100GB of storage is made available for the dbt Cloud application. These are the resource totals consumed across the entire Kubernetes cluster by the dbt Cloud application.

### Install into a VM

#### Supported Operating Systems

Our single-line installer requires a Linux VM. It is recommended that you use **Ubuntu 18.04** as the base operating system. Other supported base operating systems include:

- Ubuntu 16.04
- RHEL 7.4, 7.5, 7.6, 7.7
- CentOS 7.4, 7.5, 7.6, 7.7

#### Disk

The disk you provision should be at least 100GB. `ext4` is the recommended filesystem. Other filesystems **except `xfs`** are supported[[1](https://github.com/rook/rook/blob/master/Documentation/ceph-common-issues.md#a-worker-node-using-rbd-devices-hangs-up)].

#### Cloud Providers

For major cloud providers, use the following instance types or larger for a starter deployment.

- **GCP**: n1-standard-4
- **AWS**: m5.xlarge
- **Azure**: D4 v3
