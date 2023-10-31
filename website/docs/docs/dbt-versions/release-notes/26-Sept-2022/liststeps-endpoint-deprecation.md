---
title: "List Steps API endpoint deprecation warning"
id: "liststeps-endpoint-deprecation.md"
description: "List Steps API deprecation"
sidebar_label: "Deprecation: List Steps API endpoint"
tags: [Sept-2022]
---

On October 14th, 2022 dbt Labs is deprecating the [List Steps](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#tag/Runs/operation/listSteps) API endpoint. From October 14th, any GET requests to this endpoint will fail. Please prepare to stop using the List Steps endpoint as soon as possible. 

dbt Labs will continue to maintain the [Get Run](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#tag/Runs/operation/getRunById) endpoint, which is a viable alternative depending on the use case. 

You can fetch run steps for an individual run with a GET request to the following URL,  replacing `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/regions-ip-addresses) for your region and plan:

`https://YOUR_ACCESS_URL/api/v2/accounts/{accountId}/runs/{runId}/?include_related=["run_steps"]`
