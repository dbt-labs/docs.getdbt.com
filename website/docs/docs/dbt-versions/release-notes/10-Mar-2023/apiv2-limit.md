---
title: "API requests have a maximum limit of `100`"
id: apiv2-limit"
description: "Mar 2023: In order to ease pressure on our API, we have implemented a maximum limit of `100` for all API requests to our `list` endpoints. This limit is applicable to multi-tenant instances only."
sidebar_label: "Update: API requests have a maximum limit of `100`"
tags: [Mar-2023, API]
---


To make the API more scalable and reliable, we've implemented a maximum limit of `100` for all API requests to our `list` endpoints. If API requests exceed the maximum limit parameter of `100`, a user will receive an API error message.

This maximum limit applies to [multi-tenant instances](/docs/cloud/about-cloud/access-regions-ip-addresses) only, and _does not_ apply to single tenant instances.

Refer to the [Pagination](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#section/Pagination) section for more information on this change. 
