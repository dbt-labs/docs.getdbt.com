---
title: "List Runs API Endpoint `order_by` restrictions"
id: "api-endpoint-restriction"
sidebar_label: "Deprecation: List Runs API Endpoint order_by restrictions"
sidebar_position: 10
tags: [Apr-2023, API]
---

Starting May 15, 2023, we will support only the following `order_by` functionality for the List Runs endpoint:

- `id` and `-id`
- `created_at` and `-created_at`
- `finished_at` and `-finished_at`

We recommend that you change your API requests to https://<YOUR_ACCESS_URL>/api/v2/accounts/{accountId}/runs/ to use a supported `order_by` before this date. 

:::info Access URLs
 
dbt Cloud is hosted in multiple regions around the world, and each region has a different access URL. Users on Enterprise plans can choose to have their account hosted in any one of these regions. For a complete list of available dbt Cloud access URLs, refer to [Regions & IP addresses](/docs/cloud/about-cloud/regions-ip-addresses).  

:::

For more info, refer to our [documentation](/dbt-cloud/api-v2-legacy#tag/Runs/operation/listRunsForAccount).
