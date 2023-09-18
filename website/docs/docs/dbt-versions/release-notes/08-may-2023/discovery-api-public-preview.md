---
title: "Latest environment state in the dbt Cloud Discovery API"
id: "discovery-api-public-preview"
description: "Public preview of the dbt Cloud Discovery API is now available."
sidebar_label: "New: Latest environment state in the Discovery API"
sidebar_position: 5
tags: [May-2023, API]
---

Users of the Discovery API can now query the latest state of their environment, meaning there's no need to consolidate results across jobs or artifact files. The environment essentially represents the latest production state of a dbt project. The new `environment` endpoint is in public preview and can be used with the existing `modelByEnvironment` endpoint for historical analysis. For details, refer to these docs:

- [About the Discovery API](/docs/dbt-cloud-apis/discovery-api)
- [Use cases and examples for the Discovery API](/docs/dbt-cloud-apis/discovery-use-cases-and-examples)
- [Query the Discovery API](/docs/dbt-cloud-apis/discovery-querying)
- [Project state in dbt Cloud](/docs/dbt-cloud-apis/project-state) 

## Roadmap

dbt Labs is continually enhancing the dbt Cloud Discovery API to ensure you have access to timely, rich, and reliable metadata about your dbt runs. In the coming year, we’ll expand the range of questions the API helps answer so you can more easily understand the state, meaning, and structure of your data to inform data development and analysis experiences.

- **[Now] Query across jobs & lineage** &mdash; Get the latest state of a dbt DAG (production environment) to find, understand, and trust the right dataset to analyze.
    - **[Ongoing] Improvements** &mdash; Enhanced developer ergonomics, state fidelity, and metadata timeliness.
- **[Soon] Query across projects** &mdash; View and manage cross-project lineage using public models to define, use, and manage governed datasets for enhanced collaboration across teams.
- **[Later] Query over time** &mdash; Understand longer-term dbt Cloud execution result trends to optimize pipeline performance and costs, such as improving costly, error-prone, or slow datasets.
