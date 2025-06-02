---
title: "APIs Overview"
description: "Learn how dbt accounts on the Enterprise-tier plans can query the dbt APIs."
id: "overview"
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

# APIs overview <Lifecycle status="managed,managed_plus" />

Accounts on the Enterprise and Enterprise+ plans can query the <Constant name="cloud" /> APIs.

<Constant name="cloud" /> provides the following APIs:

- The [<Constant name="cloud" /> Administrative API](/docs/dbt-cloud-apis/admin-cloud-api) can be used to administrate a <Constant name="cloud" /> account. It can be called manually or with [the <Constant name="cloud" /> Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest).
- The [<Constant name="cloud" /> Discovery API](/docs/dbt-cloud-apis/discovery-api) can be used to fetch metadata related to the state and health of your dbt project.
- The [<Constant name="semantic_layer" /> APIs](/docs/dbt-cloud-apis/sl-api-overview) provides multiple API options which allow you to query your metrics defined in the <Constant name="semantic_layer" />.

If you want to learn more about webhooks, refer to [Webhooks for your jobs](/docs/deploy/webhooks).

## How to Access the APIs

<Constant name="cloud" /> supports two types of API Tokens: [personal access tokens](/docs/dbt-cloud-apis/user-tokens) and [service account tokens](/docs/dbt-cloud-apis/service-tokens). Requests to the <Constant name="cloud" /> APIs can be authorized using these tokens.
