---
title: "APIs Overview"
description: "Learn how dbt accounts on the Team and Enterprise plans can query the dbt Cloud APIs."
id: "overview"
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

# APIs overview <Lifecycle status="team,enterprise"/>

Accounts on the _Team_ and _Enterprise_ plans can query the dbt Cloud APIs.

dbt Cloud provides the following APIs:

- The [dbt Cloud Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) can be used to administrate a dbt Cloud account. It can be called manually or with [the dbt Cloud Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- The [dbt Cloud Discovery API](/docs/dbt-cloud-apis/discovery-api) can be used to fetch metadata related to the state and health of your dbt project.
- The [dbt Semantic Layer APIs](/docs/dbt-cloud-apis/sl-api-overview) provides multiple API options which allow you to query your metrics defined in the dbt Semantic Layer.

If you want to learn more about webhooks, refer to [Webhooks for your jobs](/docs/deploy/webhooks).

## How to Access the APIs

dbt Cloud supports two types of API Tokens: [personal access tokens](/docs/dbt-cloud-apis/user-tokens) and [service account tokens](/docs/dbt-cloud-apis/service-tokens). Requests to the dbt Cloud APIs can be authorized using these tokens.
