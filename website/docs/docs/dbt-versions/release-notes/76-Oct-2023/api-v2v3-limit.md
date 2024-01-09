---
title: "API results limited to `100`"
id: apiv3-limit"
description: "Oct 2023: In order to enhance the efficiency and stability of our services, we will limit all API results to `100` records. This limit is applicable to multi-tenant instances only."
sidebar_label: "Update: API results limited to `100`"
sidebar_position: 04
tags: [Oct-2023, API]
---


Beginning December 1, 2023, the [Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) v2 and v3 will expect you to limit all "list" or `GET` API methods to 100 results per API request. This limit enhances the efficiency and stability of our services. If you need to handle more than 100 results, then use the `limit` and `offset` query parameters to paginate those results; otherwise, you will receive an error. 

This maximum limit applies to [multi-tenant instances](/docs/cloud/about-cloud/regions-ip-addresses) only, and _does not_ apply to single tenant instances.

Refer to the [API v3 Pagination](https://docs.getdbt.com/dbt-cloud/api-v3#/) or [API v2 Pagination](https://docs.getdbt.com/dbt-cloud/api-v2#/) sections for more information on how to paginate your API responses. 
