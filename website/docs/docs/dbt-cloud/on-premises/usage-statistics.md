---
id: usage-statistics
title: Usage Statistics
---

:::note

We longer support new on-premises deployments, and instead have moved to a [Single Tenant](single-tenant) model hosted in the cloud

:::

## Overview

On-premises dbt Cloud deployments send high-level dbt Cloud metadata
for an installation back to dbt Labs. dbt Labs uses this
information to record license utilization and better assist in supporting
on-premises deployments of dbt Cloud.

Usage statistics are tracked once weekly, and include the following information:
 - The account ids and account names present in a deployment
 - The number of developer and read only licenses utilized in each account
 - The version of dbt Cloud installed in the on-premises environment

This information is sent as a <Term id="json" /> payload to usage.getdbt.com. A typical
payload looks like:

```json
{
  "accounts": [
    "id": 1,
    "name": "dbt Labs",
    "develolper_licenses": 20,
    "read_only_licenses": 50,
    "dbt_cloud_version": "1.0.0"
  ]
}
```

## Allow outbound traffic

To enable the collection of this metadata for your deployment, please allow
outbound http traffic to https://usage.getdbt.com from your dbt Cloud installation.
