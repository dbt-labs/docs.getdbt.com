---
title: "List Runs API Endpoint order_by restrictions"
id: api-endpoint-restriction
sidebar_label: "Deprecation: "List Runs API Endpoint order_by restrictions"
tags: [Apr-6-2023, API]
---

Starting May 15, 2023, we will support only the following `order_by` functionality for the List Runs endpoint:

- `id` and `-id`
- `created_at` and `-created_at`
- `finished_at` and `-finished_at`

We recommend that you change your API requests to [https://cloud.getdbt.com/api/v2/accounts/{accountId}/runs/](https://cloud.getdbt.com/api/v2/accounts/%7BaccountId%7D/runs/) to use a supported `order_by` before this date.

For more info, refer to our [documentation](/dbt-cloud/api-v2#tag/Runs/operation/listRunsForAccount).
