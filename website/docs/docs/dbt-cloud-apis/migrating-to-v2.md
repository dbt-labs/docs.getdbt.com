---
title: "Migrating to dbt Cloud Administrative API v2"
description: "You should migrate to API v2 while we deprecate API v4 "
sidebar_label: "Migrating to API v2"
id: "migrating-to-v2"
---


In an attempt to provide an improved dbt Cloud Administrative API experience, the dbt Cloud API v4 will be deprecated by April 30th, 2023. We suggest you migrate to dbt Cloud Administrative API v2. When migrating from API v4 to API v2, there are a few differences you should consider when querying your dbt Cloud account.

## Key differences

When using the [List runs](/dbt-cloud/api-v2-legacy#tag/Runs) endpoint, you can include triggered runs and sort by ID. You can use the following request in v2 to get a similar response as v4, replacing the `{accountId}` with your own and `{YOUR_ACCESS_URL}` with the appropriate [Access URL](https://docs.getdbt.com/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan:

```shell
GET https://{YOUR_ACCESS_URL}/api/v2/accounts/{accountId}/runs/?include_related=[%22trigger%22]&order_by=-id
```
For example, if your region is EMEA multi-tenant and your account ID is `001`, your endpoint would be:

```shell
GET https://emea.dbt.com/api/v2/accounts/001/runs/?include_related=[%22trigger%22]&order_by=-id`
```

Differences in responses include:

| Property description | API v4    | API v2     |
|---------------------|-----------|-------------|
| Reverse sort order when you use sort by `-id`  | Defaults to order by most recent | Defaults to order by least recent |
| Update to timestamps | Unix timestamps | ISO strings |
| Update to IDs: `id`, `environment_id`, `account_id`, `project_id`, `job_id` | Values are the same, but they are strings | Values are the same, but they are numeric |
| New property for returning runs with the specified status | `status` property |  Maps to `status_humanized` |
| New property for including related field with run | `replace` property | Maps to the `trigger` property |
