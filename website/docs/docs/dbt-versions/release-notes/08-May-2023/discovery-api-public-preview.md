---
title: "Latest environment state in the dbt Cloud Discovery API"
id: "discovery-api-public-preview"
description: "Public preview of the dbt Cloud Discovery API is now available."
sidebar_label: "New: Latest environment state in the Discovery API"
tags: [May-24-2023, API]
---

Users of the Discovery API can now query the latest state of their environment, meaning there's no need to consolidate results across jobs or artifact files. The environment essentially represents the latest production state of a dbt project. The new `environment` endpoint is in public preview and can be used with the existing `modelByEnvironment` endpoint for historical analysis. For details, refer to these docs:

- [About the Discovery API](/docs/dbt-cloud-apis/discovery-api)
- [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)
- [Project state in dbt Cloud](/docs/deploy/project-state#project-state-in-dbt-cloud) 