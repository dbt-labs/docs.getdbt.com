---
title: "Migrating to dbt Cloud Administrative API v2"
description: "You should migrate to API v2 while we deprecate API v4 "
sidebar_label: "Migrating to API v2"
id: "migrating-to-v2"
---


When migrating from dbt Cloud Administrative API v4 to API v2, there are a few differences you should consider when querying your dbt Cloud account. 

## Key differences

When using the [List runs](/dbt-cloud/api-v2#tag/Runs) endpoint, you can include triggered runs and sort by ID. You can use the following request in v2 to get a similar response as v4, replacing the `{accountId}` with your own:

```shell
GET https://cloud.getdbt.com/api/v2/accounts/{accountId}/runs/?include_related=[%22trigger%22]&order_by=-id
```

Differences in responses include:

| Property description | API v4    | API v2     |
|---------------------|-----------|-------------|
| Reverse sort order when you use sort by `-id`  | Defaults to order by most recent | Defaults to order by least recent |
| Change timestamps | Unix timestamps | ISO strings |
| Update to IDs: `id`, `environment_id`, `account_id`, `project_id`, `job_id` | Values are the same, but they are strings | Values are the same, but they are numeric |
| Return runs with the specified status | `status` property |  Maps to `status_humanized` |
| Include related field with run | `replace` property | Maps to the `trigger` property |
