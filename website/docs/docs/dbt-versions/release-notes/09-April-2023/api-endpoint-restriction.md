---
title: "API requests have a maximum limit of `100`"
id: api-endpoint-restriction
description: "Mar 2023: In order to ease pressure on our API, we have implemented a maximum limit of `100` for all API requests to our `list` endpoints. This limit is applicable to multi-tenant instances only."
sidebar_label: "Update: API requests have a maximum limit of `100`"
tags: [Apr-6-2023, API]
---

Starting May 15, 2023, we will support only the following `order_by` functionality for the List Runs endpoint:

- `id` and `-id`
- `created_at` and `-created_at`
- `finished_at` and `-finished_at`

We recommend that you change your API requests to [https://cloud.getdbt.com/api/v2/accounts/{accountId}/runs/](https://cloud.getdbt.com/api/v2/accounts/%7BaccountId%7D/runs/) to use a supported `order_by` before this date.

For more info, refer to our [documentation](/dbt-cloud/api-v2#tag/Runs/operation/listRunsForAccount).
