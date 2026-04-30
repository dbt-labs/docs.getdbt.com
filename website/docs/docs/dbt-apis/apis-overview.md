---
title: "APIs Overview"
description: "Learn how dbt accounts on the Enterprise-tier plans can query the dbt APIs."
id: "overview"
pagination_next: "docs/dbt-apis/user-tokens"
pagination_prev: null
---

# APIs overview <Lifecycle status="self_service,managed,managed_plus" />

Accounts on the Starter, Enterprise, and Enterprise+ plans can query the <Constant name="dbt" /> APIs.

<Constant name="dbt" /> provides the following APIs:

- The [<Constant name="dbt" /> Administrative API](/docs/dbt-apis/admin-cloud-api) can be used to administrate a <Constant name="dbt" /> account. It can be called manually or with [the <Constant name="dbt" /> Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- The [<Constant name="dbt" /> Discovery API](/docs/dbt-apis/discovery-api) can be used to fetch metadata related to the state and health of your dbt project.
- The [<Constant name="semantic_layer" /> APIs](/docs/dbt-apis/sl-api-overview) provides multiple API options which allow you to query your metrics defined in the <Constant name="semantic_layer" />.

If you want to learn more about webhooks, refer to [Webhooks for your jobs](/docs/deploy/webhooks).

## How to Access the APIs

<Constant name="dbt" /> supports two types of API Tokens: [personal access tokens](/docs/dbt-apis/user-tokens) and [service account tokens](/docs/dbt-apis/service-tokens). Requests to the <Constant name="dbt" /> APIs can be authorized using these tokens.
