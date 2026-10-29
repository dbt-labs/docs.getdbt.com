---
title: "Migrating to account-specific access URLs"
id: "account-url-migration"
description: "Learn how to migrate to account-specific access URLs."
pagination_next: null
pagination_prev: null
availability:
  surface: platform
  access: login_required
---

Account-specific access URLs are being assigned to <Constant name="dbt" /> accounts as part of our ongoing efforts to improve your experience and strengthen security. Each account will receive its own unique <Constant name="dbt_platform" /> and [API access URLs](/docs/dbt-apis/overview) on the `dbt.com` domain rather than sharing legacy region URLs such as `cloud.getdbt.com`, `emea.dbt.com`, and `au.dbt.com`. For example:

- Multi-tenant: `https://cloud.getdbt.com` becomes `https://ab123.us1.dbt.com`
- Single tenant: `https://acme.getdbt.com` becomes `https://ab123.acme.dbt.com`

## What does this mean for me?

If your account has been assigned a new access URL, please review the [migration timeline](#migration-timeline) and update your account's external integrations using the [integration checklist](#integration-checklist).

If your account has not been assigned a new access URL, you will receive an email and in-app notification with a scheduled enablement date. When the change takes effect, you'll be automatically redirected to your account-specific access URL. Account sign-in remains the same. Both your new access URL and your legacy region URL will support integrations according to the dates on the [migration timeline](#migration-timeline).

:::info Update network rules before your assignment date
Network rules must be in place before your assignment date. You can update the other integrations in the [integration checklist](#integration-checklist) any time before the end-of-support date. For a summary, refer to [What do I need to update before and after my assignment date?](#what-do-i-need-to-update-before-and-after-my-assignment-date)

If your organization uses network allowlisting, add a rule that matches all subdomains of `dbt.com` (for example, `*.dbt.com`). Some access URLs are more than one level deep, such as `ab123.us1.dbt.com`, so confirm your wildcard matches multi-level subdomains. For single-tenant accounts, IP addresses don't change as part of this migration. For multi-tenant accounts, refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses) for updated IPs. If your account has [IP restrictions](/docs/platform/secure/ip-restrictions) enabled, review [Validating IP restrictions](#validating-ip-restrictions) before your assignment date.

If your account uses inbound private connectivity (ingress PrivateLink), [dbt Support](mailto:support@getdbt.com) will contact you before your assignment with guidance for your configuration.
:::

## Migration timeline

Accounts across all regions and service providers are being assigned new access URLs. Legacy region URLs will continue to support integrations until the end-of-support date for your account.

| Stage | Status | Timeline |
|---|---|---|
| Multi-tenant account-specific access URL assignment | ✅ Completed | January 2026 |
| Single tenant account-specific access URL assignment | In Progress | April 2026 - March 2027 |
| Legacy region URL end of support (multi-tenant) | Scheduled | February 3, 2027 |
| Legacy region URL end of support (single tenant) | Scheduled | Provided in your assignment notification |

## Integration checklist

Review the following checklist before the legacy region URL end-of-support date documented in the [migration timeline](#migration-timeline). Update each integration that uses a <Constant name="dbt" /> access URL. If your integration isn't in this list, please speak with your IT or applicable team to identify whether you need to take action. 

The managed <Constant name="dbt" /> GitHub application, the Slack application, and GitLab webhooks are updated automatically. Customer-owned GitHub Enterprise applications and inbound Azure DevOps service hooks are not included.

### Identity and access management

| Integration | Action required |
|---|---|
| [SAML 2.0 SSO](/docs/platform/manage-access/set-up-sso-saml-2.0) | No change to your identity provider application. Update any identity provider-initiated sign-in links to your new access URL. |
| [Google Workspace SSO](/docs/platform/manage-access/set-up-sso-google-workspace#creating-credentials) | Update or add an OAuth client |
| [SCIM (Okta)](/docs/platform/manage-access/scim#set-up-dbt-cloud) | Update the SCIM base URL in Okta |

### Git providers

GitLab and Azure DevOps repositories connected before your account had an account-specific access URL keep using your legacy region URL for OAuth until you update them. Repositories connected after that already use your new access URL.

For GitLab, account admins can update an existing GitLab application to your new account access URL in <Constant name="dbt_platform" />. See [Update redirect URIs in dbt platform](#update-redirect-uris-in-dbt-platform). You can't yet update an existing Azure DevOps repository. Instead, recreate the repository to generate a redirect URI based on your new account access URL.

| Integration | Action required |
|---|---|
| [GitLab (managed app)](/docs/platform/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Add the new redirect URI to your GitLab group application, then [update it in <Constant name="dbt_platform" />](#update-redirect-uris-in-dbt-platform) |
| [GitLab (bring-your-own app)](/docs/platform/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Add the new redirect URI to your GitLab group application, then [update it in <Constant name="dbt_platform" />](#update-redirect-uris-in-dbt-platform) |
| [Azure DevOps (service principal)](/docs/platform/git/setup-service-principal) | Update or add an app registration |
| GitHub Enterprise (customer-owned app) | Before your assignment date, add `https://oauth.TENANT_NAME.dbt.com/complete/github` as a callback URL in your GitHub app. Update webhook URLs to your new access URL before the end-of-support date. For help, contact [dbt Support](mailto:support@getdbt.com). |

### Data platform connections

Data platform connections created before your account had an account-specific access URL keep using your legacy region URL for OAuth until you update them. Connections created after that already use your new access URL, so they need no changes.

Account admins can update older Snowflake, Databricks, and BigQuery OAuth connections to your new access URL directly in <Constant name="dbt_platform" />. See [Update redirect URIs in dbt platform](#update-redirect-uris-in-dbt-platform).

| Integration | Action required |
|---|---|
| [Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth#subdomain-migration) | Add the new redirect URI to your security integration, then [update it in <Constant name="dbt_platform" />](#update-redirect-uris-in-dbt-platform) |
| [Snowflake External OAuth](/docs/platform/manage-access/snowflake-external-oauth#identity-provider-configuration) | Update the redirect URI in your IdP application |
| [Databricks OAuth](/docs/platform/manage-access/set-up-databricks-oauth) | Add the new redirect URI to your Databricks OAuth app, then [update it in <Constant name="dbt_platform" />](#update-redirect-uris-in-dbt-platform) |
| [BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth) | Add the new redirect URI to your Google Cloud OAuth client, then [update it in <Constant name="dbt_platform" />](#update-redirect-uris-in-dbt-platform) |
| [Redshift External OAuth](/docs/platform/manage-access/redshift-external-oauth) | Update the redirect URI in your IdP application |

### Update redirect URIs in dbt platform

If your account has an account-specific access URL, <Constant name="dbt_platform" /> flags each Snowflake, Databricks, or BigQuery OAuth connection and GitLab application that still uses a legacy redirect URI. Updating connections requires the Account Admin or Project Creator [permission set](/docs/platform/manage-access/enterprise-permissions). Updating a GitLab application requires the Account Admin permission set.

1. In <Constant name="dbt_platform" /> **Account settings**, go to **Connections** (or **Integrations** for GitLab) and select a flagged item. The page shows the new redirect URI.
2. Add the new redirect URI to the OAuth configuration in your data platform or GitLab, alongside the existing one. The existing URI keeps working until you remove it.
3. In <Constant name="dbt_platform" />, click **Update redirect URI**.
4. Test data platform connections by signing in again from your development credentials. For GitLab, repeat the [personal GitLab authorization flow](/docs/platform/git/connect-gitlab#personally-authenticating-with-gitlab) from **Account settings** > **Personal profile** > **Linked accounts**. Confirm that the relevant OAuth flow returns successfully to <Constant name="dbt_platform" /> before removing the old redirect URI.

Updating the redirect URI doesn't interrupt active sessions. The new URI takes effect the next time a session expires and the user signs in again.

If sign-in fails after the update, you have 7 days to roll back this change. Open the connection or GitLab application and click **Revert to previous URI** to restore the previous redirect URI while you troubleshoot. After you confirm that every integration works with the new URI, remove the old URI from your data platform or GitLab.

If several connections share one OAuth app, add the new redirect URI once to that app, then update each connection in <Constant name="dbt_platform" />.

### Network and API

| Integration | Action required |
|---|---|
| Network allowlists | Add `*.dbt.com` to your allowlist policies before your assignment date. See the [note on network rules](#what-does-this-mean-for-me). |
| Inbound webhooks | Update access URLs in your webhook configurations |
| [API integrations](/docs/dbt-apis/overview) | Update access URLs in your API clients |
| [Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs) | Update access URLs in your Terraform configuration |
| Browser bookmarks | Update personal and shared bookmarks |

## Validating IP restrictions

If you've received notification of a new access URL assignment and have IP restrictions enabled, review the network rules that point specifically at your legacy region URL. These include VPN split-tunneling rules, proxy (PAC) rules, and firewall egress rules. Update these rules for your new `*.dbt.com` access URL before your account's scheduled assignment date so access isn't disrupted.

To confirm your new access URL is accessible, send a test request from the same network you'd normally use to reach your legacy region URL. Replace `NEW_ACCESS_URL` with your account's new access URL and `ACCOUNT_ID` with your account ID:

- **Browser:** Go to `https://NEW_ACCESS_URL/api/v2/accounts/ACCOUNT_ID/`
- **Terminal:** Run `curl -s https://NEW_ACCESS_URL/api/v2/accounts/ACCOUNT_ID/`

| Result | Response detail | What it means |
|---|---|---|
| ✅ Passed | `{ ... "detail": "Authentication credentials were not provided." ... }` | The request reached the API and passed IP restrictions. There's no authenticated session, which is expected for this test. |
| ⚠️ Blocked | `{ ... "user_message": "Forbidden: Access denied" ... }` | The request's IP address isn't on your allowlist. Update your network egress rules for the new access URL and test again. |

## FAQs

<Expandable alt_header="Why are access URLs changing?">

We are transitioning from generic region URLs to account-specific URLs to enhance your experience and strengthen security. This change provides more descriptive URLs to improve <Constant name="dbt" /> URL management, and enables stronger cookie and token policies to protect account data.

</Expandable>

<Expandable alt_header="How do I know if my account has new access URLs?">

Sign in to your <Constant name="dbt_platform" /> account. If your browser location starts with an account prefix, such as `ab123.us1.dbt.com`, your account has been assigned a new access URL. If your browser location is a legacy region URL, such as `cloud.getdbt.com`, `emea.dbt.com`, or `au.dbt.com`, your account has not been assigned a new access URL. You may refer to [API Access URLs](/docs/platform/about-platform/access-regions-ip-addresses#api-access-urls).

</Expandable>

<Expandable alt_header="How do I find my account's new access URLs?">

Refer to [API Access URLs](/docs/platform/about-platform/access-regions-ip-addresses#api-access-urls).

</Expandable>

<Expandable alt_header="What do I need to update before and after my assignment date?">

| When | What to update |
|---|---|
| Before your assignment date | [Network allowlists](#what-does-this-mean-for-me), VPN, proxy, and firewall rules for [IP restrictions](#validating-ip-restrictions), and callback URLs for customer-owned GitHub Enterprise applications |
| After your assignment date, before the end-of-support date | OAuth redirect URIs for [data platform connections](#data-platform-connections) and [Git providers](#git-providers), [identity and access management](#identity-and-access-management) settings, API clients, Terraform configurations, inbound webhooks, and bookmarks |

</Expandable>

<Expandable alt_header="What happens if my integrations are not updated by the end-of-support date?">

After the end-of-support date, legacy region URLs are no longer actively supported. Update your integrations before this date to avoid disruption. For assistance, contact [dbt Support](mailto:support@getdbt.com).

</Expandable>

<Expandable alt_header="Do my API tokens and API calls keep working?">

Yes. Personal access tokens and service tokens work with both your legacy region URL and your new access URL. API requests to legacy region URLs are served directly rather than redirected, so update your API clients to your new access URL before the end-of-support date.

</Expandable>

<Expandable alt_header="What is unaffected by the migration to new access URLs?">

The following are unaffected:
- Your dbt project code, models, and configurations
- Your data platform credentials (OAuth connections need a redirect URI update; see [Data platform connections](#data-platform-connections))
- Your account settings, environments, jobs, and schedules
- The managed <Constant name="dbt" /> GitHub application, the Slack application, and GitLab webhooks
- Egress private connectivity
- The underlying <Constant name="dbt_platform" /> functionality

</Expandable>

For questions or assistance, contact [dbt Support](mailto:support@getdbt.com).
