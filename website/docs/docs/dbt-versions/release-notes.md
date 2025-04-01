---
title: "dbt Cloud release notes"
description: "dbt Cloud release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt Cloud release notes"
pagination_next: null
pagination_prev: null
---

dbt Cloud release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

## March 2025

- **Behavior change**: As of March 31st, 2025, dbt Core versions 1.0, 1.1, and 1.2 have been deprecated from dbt Cloud. They are no longer available to select as versions for dbt projects. Workloads currently on these versions will be automatically upgraded to v1.3, which may cause new failures.
- **Enhancement**: [dbt Semantic Layer](/docs/use-dbt-semantic-layer/dbt-sl) users on single-tenant configurations no longer need to contact their account representative to enable this feature. Setup is now self-service and available across all tenant configurations.
- **New**: The dbt Semantic Layer now supports Postgres as a data platform. For more details on how to set up the dbt Semantic Layer for Postgres, see [Set up the dbt Semantic Layer](/docs/use-dbt-semantic-layer/setup-sl).
- **New**: New [environment variable default](/docs/build/environment-variables#dbt-cloud-context) `DBT_CLOUD_INVOCATION_CONTEXT`. 
- **Enhancement**: Users assigned [read-only licenses](/docs/cloud/manage-access/about-user-access#licenses) are now able to view the [Deploy](/docs/deploy/deployments) section of their dbt Cloud account and click into the individual sections but not edit or otherwise make any changes. 

#### dbt Developer day

The following features are new or enhanced as part of our [dbt Developer day](https://www.getdbt.com/resources/webinars/dbt-developer-day) on March 19th and 20th, 2025:

- **New**: The [`--sample` flag](/docs/build/sample-flag), now available for the `run` and `build` commands, helps reduce build times and warehouse costs by running dbt in sample mode. It generates filtered refs and sources using time-based sampling, allowing developers to validate outputs without building entire models.
- **New**: dbt Copilot, an AI-powered assistant, is now generally available in the dbt Cloud IDE for all dbt Cloud Enterprise accounts. Check out [dbt Copilot](/docs/cloud/dbt-copilot) for more information.   

#### Also available this month

- **New**: Bringing your own [Azure OpenAI key](/docs/cloud/enable-dbt-copilot#bringing-your-own-openai-api-key-byok) for [dbt Copilot](/docs/cloud/dbt-copilot) is now generally available. Your organization can configure dbt Copilot to use your own Azure OpenAI keys, giving you more control over data governance and billing.
- **New**: The dbt Semantic Layer supports Power BI as a [partner integration](/docs/cloud-integrations/avail-sl-integrations), available in private beta. To join the private beta, please reach out to your account representative. Check out the [Power BI](/docs/cloud-integrations/semantic-layer/power-bi) integration for more information.
- **New**: [dbt Cloud release tracks](/docs/dbt-versions/cloud-release-tracks) are Generally Available. Depending on their plan, customers may select among the Latest, Compatible, or Extended tracks to manage the update cadences for development and deployment environments.
- **New:** The dbt Cloud-native integration with Azure DevOps now supports [Entra ID service principals](/docs/cloud/git/setup-service-principal). Unlike a services user, which represents a real user object in Entra ID, the service principal is a secure identity associated with your dbt Cloud app to access resources in Azure unattended. Please [migrate your service user](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) to a service principal for Azure DevOps  as soon as possible.


## February 2025

- **Enhancement**: The [Python SDK](/docs/dbt-cloud-apis/sl-python) added a new timeout parameter to Semantic Layer client and to underlying GraphQL clients to specify timeouts. Set a timeout number or use the `total_timeout` parameter in the global `TimeoutOptions` to control connect, execute and close timeouts granularly. `ExponentialBackoff.timeout_ms` is now deprecated.
- **New**: The [Azure DevOps](/docs/cloud/git/connect-azure-devops) integration for Git now supports [Entra service principal apps](/docs/cloud/git/setup-service-principal) on dbt Cloud Enterprise accounts. Microsoft is enforcing MFA across user accounts, including service users, which will impact existing app integrations. This is a phased rollout, and dbt Labs recommends [migrating to a service principal](/docs/cloud/git/setup-service-principal#migrate-to-service-principal) on existing integrations once the option becomes available in your account.

## January 2025

- **Enhancement**: The dbt Semantic Layer now fully supports the [`--favor-state` flag](/docs/cloud/about-cloud-develop-defer) when used with `defer` in the dbt Cloud IDE. This enhancement allows you to always resolve `{{ ref() }}` functions using staging or production metadata, ignoring any development version.
- **New**: Added the `dbt invocation` command to the [dbt Cloud CLI](/docs/cloud/cloud-cli-installation). This command allows you to view and manage active invocations, which are long-running sessions in the dbt Cloud CLI. For more information, see [dbt invocation](/reference/commands/invocation).
- **New**: Users can now switch themes directly from the user menu, available [in Preview](/docs/dbt-versions/product-lifecycles#dbt-cloud). We have added support for **Light mode** (default), **Dark mode**, and automatic theme switching based on system preferences. The selected theme is stored in the user profile and will follow users across all devices.
  - Dark mode is currently available on the Developer plan and will be available for all [plans](https://www.getdbt.com/pricing) in the future. We’ll be rolling it out gradually, so stay tuned for updates. For more information, refer to [Change your dbt Cloud theme](/docs/cloud/about-cloud/change-your-dbt-cloud-theme).
- **Fix**: dbt Semantic Layer errors in the Cloud IDE are now displayed with proper formatting, fixing an issue where newlines appeared broken or difficult to read. This fix ensures error messages are more user-friendly and easier to parse.
- **Fix**: Fixed an issue where [saved queries](/docs/build/saved-queries) with no [exports](/docs/build/saved-queries#configure-exports) would fail with an `UnboundLocalError`. Previously, attempting to process a saved query without any exports would cause an error due to an undefined relation variable. Exports are optional, and this fix ensures saved queries without exports don't fail.
- **New**: You can now query metric alias in dbt Semantic Layer [GraphQL](/docs/dbt-cloud-apis/sl-graphql) and [JDBC](/docs/dbt-cloud-apis/sl-jdbc) APIs. 
  - For the JDBC API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-jdbc#query-metric-alias) for more information.
  - For the GraphQL API, refer to [Query metric alias](/docs/dbt-cloud-apis/sl-graphql#query-metric-alias) for more information.
- **Enhancement**: Added support to automatically refresh access tokens when Snowflake's SSO connection expires. Previously, users would get the following error: `Connection is not available, request timed out after 30000ms` and would have to wait 10 minutes to try again.
- **Enhancement**: The [`dbt_version` format](/reference/commands/version#versioning) in dbt Cloud now better aligns with [semantic versioning rules](https://semver.org/). Leading zeroes have been removed from the month and day (`YYYY.M.D+<suffix>`). For example:
  - New format: `2024.10.8+996c6a8`
  - Previous format: `2024.10.08+996c6a8`
