---
title: "Migrating to dbt Cloud Administrative API v2"
description: "You should migrate to API v2 while we deprecate API v4 "
sidebar_label: "Migrating to API v2"
id: "admin-cloud-api"
---


When migrating from dbt Cloud Administrative API v4 to API v2, there are a few differences you should account when querying your data. 

## Key differences

When using the `List runs` endpoint, you can include triggered runs and sort by ID. Use the following curl, replacing the `{accountId}` with your own:

```shell
GET https://cloud.getdbt.com/api/v2/accounts/{accountId}/runs/?include_related=["trigger"]&order_by=-id
```

The differences in the response include:
|Feature | API v4       |      API v2 |
|--------|-----------|-------------|
| sort by `-id` | default orders by most recent | defaults order by  |
| timestamps | Unix timestamps | ISO strings |
| id, environment_id, account_id, project_id, job_id values | values are the same, but they are strings | values are the same, but they are numeric |
| status | status property |  maps to status_humanized |
| replace | replace property | maps to the `trigger` property |

