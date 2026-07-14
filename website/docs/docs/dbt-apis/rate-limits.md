---
title: "API rate limits"
description: "Learn how request limits apply when you use the dbt platform Administrative API, Discovery (GraphQL) API, SCIM provisioning, and remote MCP."
id: "rate-limits"
sidebar_label: "Rate limits"
pagination_next: "docs/dbt-apis/user-tokens"
pagination_prev: "docs/dbt-apis/overview"
---

# API rate limits <Lifecycle status="self_service,managed,managed_plus" />

<IntroText>

<Constant name="dbt" /> applies request limits across the <Constant name="dbt_platform" /> APIs so integrations stay reliable and predictable.

</IntroText>

The [Administrative API](/docs/dbt-apis/admin-api) and the [Discovery API](/docs/dbt-apis/discovery-api) do not share the same limit. You can send more requests per minute to admin endpoints under `/api/` and fewer to Discovery's GraphQL endpoints under `/graphql/`, because Discovery queries often return more data per call.

You use the same credentials for both APIs: [personal access tokens](/docs/dbt-apis/user-tokens), [service account tokens](/docs/dbt-apis/service-tokens), and OAuth when your organization supports it. Refer to [Authentication tokens](/docs/dbt-apis/authentication) to create and use those credentials, and the [APIs overview](/docs/dbt-apis/overview) to learn what each API does.

This page summarizes the default rate limits across the main API and integration surfaces:

- [Administrative API](/docs/dbt-apis/admin-api): 5,000 requests per minute per account (`/api/`).
- [Discovery API](/docs/dbt-apis/discovery-api) (GraphQL): 500 requests per minute (`/graphql/`).
- [SCIM and IdP provisioning](#scim-and-idp-provisioning): 20 requests every 5 seconds per account.
- [Remote MCP](#remote-mcp): 5,000 requests per minute per IP (global API rate limit).
- [Local MCP](#local-mcp): Uses the Administrative and Discovery API limits above.

For SCIM scope, throttling responses, and identity provider behavior, see [SCIM and IdP provisioning](#scim-and-idp-provisioning) and [Set up SCIM](/docs/platform/manage-access/scim). For MCP integration and usage patterns, see [Remote MCP](#remote-mcp) and [Local MCP](#local-mcp).

## Pagination and the Discovery API

The most common way teams hit the Discovery API limit is to request very small pages in GraphQL (for example, `first: 1`) repeatedly. Each page is another request, so small pages require far more calls than fetching the same data in larger chunks. Use the largest page size that still works for you, up to what that query allows (often up to `500`). Full examples, including how to page with `after`, are in [Query the Discovery API](/docs/dbt-apis/discovery-querying).

## SCIM and IdP provisioning <Lifecycle status="managed,managed_plus" />

For SCIM, the application rate limit of 20 requests every 5 seconds per account (Enterprise and Enterprise+) applies only to creating a user (`POST /api/v3/accounts/{account_id}/scim/v2/Users`) and replacing a user (`PUT /api/v3/accounts/{account_id}/scim/v2/Users/{user_id}`). dbt counts requests in a fixed 5-second window.

It does not apply to `GET`, `PATCH`, or `DELETE` requests for users; to any Group operations (create, list, get, replace, patch, or delete); or to other SCIM endpoints such as Service Provider Config, schemas, resource types, or config token routes. Those operations are outside this limit but may still be subject to other platform rate limits.

When you exceed that limit, dbt returns `429 Too Many Requests` with both `Retry-After` and `x-rate-limit-retry-after-seconds` (for example, Okta integrations often honor `Retry-After`, while SailPoint often honors `x-rate-limit-retry-after-seconds`). These headers indicate how long to wait before you send the next request. Configure your identity provider to read the header your provisioning stack supports, and to retry with exponential backoff when throttled.

For configuration steps, use [Set up SCIM](/docs/platform/manage-access/scim). For information on licenses, permissions, [SSO](/docs/platform/manage-access/sso-overview), and how SCIM fits into account access, refer to [About user access in dbt](/docs/platform/manage-access/about-user-access).

## Remote MCP

[Remote MCP](/docs/dbt-ai/about-mcp) uses the same default global API rate limit as other <Constant name="dbt" /> APIs: 5,000 requests per minute per IP. It uses the same authentication as other integrations (for example, personal access tokens, service account tokens, or OAuth where supported).

Treat remote MCP automation like any other API client: avoid retrying without pausing between attempts. When you receive a `429` response, wait before trying again, and wait longer between retries if you continue to receive `429` responses.

## Local MCP

[Local MCP](/docs/dbt-ai/about-mcp) calls the public [Administrative API](/docs/dbt-apis/admin-api) and [Discovery API](/docs/dbt-apis/discovery-api) directly, so those limits apply: 5,000 requests per minute per account for `/api/` and 500 requests per minute for `/graphql/`, as summarized above.

## Exceeding the rate limit

For the [Administrative API](/docs/dbt-apis/admin-api) and [Discovery API](/docs/dbt-apis/discovery-api), if you exceed the limit, dbt returns `429 Too Many Requests` and enforces a five-minute cooldown. After five minutes, you can send requests again as usual.

