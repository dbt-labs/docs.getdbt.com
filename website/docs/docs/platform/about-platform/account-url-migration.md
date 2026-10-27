---
title: "Migrating to account-specific access URLs"
id: "account-url-migration"
description: "Learn how to migrate to account-specific access URLs."
pagination_next: null
pagination_prev: null
unlisted: true
availability:
  surface: platform
  access: login_required
---

Account-specific access URLs are being assigned to <Constant name="dbt" /> accounts as part of our ongoing efforts to improve your experience and strengthen security. Each account will receive its own unique <Constant name="dbt_platform" /> and [API access URLs](/docs/dbt-apis/overview) on the **dbt.com** domain rather than sharing generic **getdbt.com** region URLs. For example:

- Old: `https://cloud.getdbt.com`
- New: `https://ab123.us1.dbt.com`

## What does this mean for me?

If your account has been assigned a new access URL, please review the [migration timeline](#migration-timeline) and update your account's external integrations using the [integration checklist](#integration-checklist).

If your account has not been assigned a new access URL, you will receive an email and in-app notification with a scheduled enablement date. When the change takes effect, you'll be automatically redirected to your **dbt.com** account-specific access URL. Account sign-in remains the same. Both the new **dbt.com** and **getdbt.com** region URLs will support integrations according to the dates on the [migration timeline](#migration-timeline).

:::info
Before assignment, if your organization uses network allowlisting, add the **dbt.com** domain to your allowlists. For single-tenant accounts, there will be no change to IP addresses. For multi-tenant accounts, refer to [Access, Regions, & IP addresses](/docs/platform/about-platform/access-regions-ip-addresses) for updated IPs. If your account has [IP restrictions](/docs/platform/secure/ip-restrictions) enabled, review [Validating IP restrictions](#validating-ip-restrictions) before your assignment date.
:::

## Migration timeline

Accounts across all regions and service providers are being assigned new access URLs. **getdbt.com** region URLs will continue to support integrations until the scheduled deprecation date, unless otherwise specified.

| Stage | Status | Timeline |
|---|---|---|
| Multi-tenant **dbt.com** access URL assignment | ✅ Completed | January 2026 |
| Single tenant **dbt.com** access URL assignment | In Progress | April - September 2026 |
| **getdbt.com** region URL deprecation | Scheduled | February 3, 2027 (previously November 1, 2026) |

## Integration checklist

Review the following checklist before the **getdbt.com** region URL deprecation date documented in the [migration timeline](#migration-timeline). Update each integration that uses a <Constant name="dbt" /> access URL. If your integration isn't in this list, please speak with your IT or applicable team to identify whether you need to take action. 

dbt Labs updates the <Constant name="dbt" /> GitHub application, the Slack application, and GitLab webhooks automatically. Inbound Azure DevOps service hooks are not included.

### Identity and access management

| Integration | Action required |
|---|---|
| [Google Workspace SSO](/docs/platform/manage-access/set-up-sso-google-workspace#creating-credentials) | Update or add an OAuth client |
| [SCIM (Okta)](/docs/platform/manage-access/scim#set-up-dbt-cloud) | Update the SCIM base URL in Okta |

### Git providers

GitLab and Azure DevOps repositories use your legacy **getdbt.com** URL for OAuth flows until you update them.

For GitLab, account admins can update an existing GitLab application to your new account access URL in the <Constant name="dbt_platform" />. See [Update redirect URIs in the dbt platform](#update-redirect-uris-in-the-dbt-platform). You can't yet update an existing Azure DevOps repository. Instead, recreate the repository to generate a redirect URI based on your new account access URL.

| Integration | Action required |
|---|---|
| [GitLab (dbt Labs app)](/docs/platform/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Add the new redirect URI to your GitLab group application, then [update it in dbt](#update-redirect-uris-in-the-dbt-platform) |
| [GitLab (bring-your-own app)](/docs/platform/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Add the new redirect URI to your GitLab group application, then [update it in dbt](#update-redirect-uris-in-the-dbt-platform) |
| [Azure DevOps (service principal)](/docs/platform/git/setup-service-principal) | Update or add an app registration |
| GitHub On-premises | Contact [dbt Labs Support](mailto:support@getdbt.com) |

### Data platform connections

Data platform connections use your legacy **getdbt.com** URL for OAuth flows until you update them. Account admins can update existing Snowflake, Databricks, and BigQuery OAuth connections to your new account access URL in the <Constant name="dbt_platform" />. See [Update redirect URIs in the dbt platform](#update-redirect-uris-in-the-dbt-platform).

| Integration | Action required |
|---|---|
| [Snowflake OAuth](/docs/platform/manage-access/set-up-snowflake-oauth#subdomain-migration) | Add the new redirect URI to your security integration, then [update it in dbt](#update-redirect-uris-in-the-dbt-platform) |
| [Snowflake External OAuth](/docs/platform/manage-access/snowflake-external-oauth#identity-provider-configuration) | Update the redirect URI in your IdP application |
| [Databricks OAuth](/docs/platform/manage-access/set-up-databricks-oauth) | Add the new redirect URI to your Databricks OAuth app, then [update it in dbt](#update-redirect-uris-in-the-dbt-platform) |
| [BigQuery OAuth](/docs/platform/manage-access/set-up-bigquery-oauth) | Add the new redirect URI to your Google Cloud OAuth client, then [update it in dbt](#update-redirect-uris-in-the-dbt-platform) |
| [Redshift External OAuth](/docs/platform/manage-access/redshift-external-oauth) | Update the redirect URI in your IdP application |

### Update redirect URIs in the dbt platform

If your account has an account-specific access URL, <Constant name="dbt_platform" /> flags each Snowflake, Databricks, or BigQuery OAuth connection and GitLab application that still uses a legacy redirect URI. Updating connections requires the Account Admin or Project Creator [permission set](/docs/platform/manage-access/enterprise-permissions). Updating a GitLab application requires the Account Admin permission set.

1. In **Account settings**, go to **Connections** (or **Integrations** for GitLab) and select a flagged item. The page shows the new redirect URI.
2. Add the new redirect URI to the OAuth configuration in your data platform or GitLab, alongside the existing one. The existing URI keeps working until you remove it.
3. In the <Constant name="dbt_platform" />, click **Update redirect URI**.
4. Test data platform connections by signing in again from your development credentials. For GitLab, repeat the [personal GitLab authorization flow](/docs/platform/git/connect-gitlab#personally-authenticating-with-gitlab) from **Account settings** > **Personal profile** > **Linked accounts**. Confirm that the relevant OAuth flow returns successfully to the <Constant name="dbt_platform" /> before removing the old redirect URI.

Existing sessions keep working after the update. When a session expires, <Constant name="dbt_platform" /> uses the updated redirect URI.

If the test fails, click **Revert to previous URI** within 7 days to restore the previous redirect URI. Once all your integrations use the new URI, you can remove the old one from your data platform or GitLab.

If several connections share one OAuth app, add the new redirect URI to that app once, then update each connection in <Constant name="dbt_platform" />.

### Network and API

| Integration | Action required |
|---|---|
| Network allowlists | Add new access URLs to your allowlist policies |
| Inbound webhooks | Update access URLs in your webhook configurations |
| [API integrations](/docs/dbt-apis/overview) | Update access URLs in your API clients |
| [Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs) | Update access URLs in your Terraform configuration |
| Browser bookmarks | Update personal and shared bookmarks |

## Validating IP restrictions

If you've received notification of a new access URL assignment and have IP restrictions enabled, review the network rules that point specifically at your **\*.getdbt.com** domain. These include VPN split-tunneling rules, proxy (PAC) rules, and firewall egress rules. Update these rules for your new **\*.dbt.com** access URL before your account's scheduled assignment date so access isn't disrupted.

To confirm your new access URL is accessible, send a test request from the same network you'd normally use to reach your **\*.getdbt.com** URL. Replace `NEW_ACCESS_URL` with your account's new access URL and `ACCOUNT_ID` with your account ID:

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

Sign in to your <Constant name="dbt_platform" /> account. If your browser location has `dbt.com`, your account has been assigned a new access URL. If your browser location has `getdbt.com`, your account has not been assigned a new access URL. You may refer to [API Access URLs](/docs/platform/about-platform/access-regions-ip-addresses#api-access-urls).

</Expandable>

<Expandable alt_header="How do I find my account's new access URLs?">

Refer to [API Access URLs](/docs/platform/about-platform/access-regions-ip-addresses#api-access-urls).

</Expandable>

<Expandable alt_header="What happens if my integrations are not updated by the getdbt.com deprecation date?">

You may not be able to access your account through your identity provider, and <Constant name="dbt_platform" /> may be degraded or inoperable. For assistance, contact [dbt Labs Support](mailto:support@getdbt.com).

</Expandable>

<Expandable alt_header="What is unaffected by the migration to new access URLs?">

The following are unaffected:
- Your dbt project code, models, and configurations
- Your data platform connections and credentials
- Your account settings, environments, jobs, and schedules
- The <Constant name="dbt" /> GitHub application, the Slack application, and GitLab webhooks
- Egress private connectivity
- The underlying <Constant name="dbt_platform" /> functionality

</Expandable>

For questions or assistance, contact [dbt Labs Support](mailto:support@getdbt.com).
