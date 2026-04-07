---
title: "Migrating to account-scoped access URLs"
id: "account-url-migration"
description: "Learn how to update your dbt platform integrations after account-scoped access URLs are assigned to your account."
pagination_next: null
pagination_prev: null
unlisted: true
---

Account-scoped access URLs are being assigned to <Constant name="dbt_platform" /> accounts as part of our ongoing efforts to improve your experience and strengthen security. [Access URLs](/docs/cloud/about-cloud/access-regions-ip-addresses) are moving from the `getdbt.com` domain to `dbt.com`, and each account will receive its own unique URL rather than sharing a deployment-level URL.

- Old: `https://cloud.getdbt.com`
- New: `https://abc123.dbt.com` (account-specific) where `abc123` is your account's unique identifier and `dbt.com` is the new domain.

## What does this mean for me?

You'll receive an email and in-app notification when your account is scheduled for new access URL assignment. When the change takes effect, you'll be automatically redirected to your `dbt.com` access URL. Log in remains the same, but you'll be redirected to your new access URL. The `getdbt.com` access URL will continue to support integrations until November 1, 2026 unless otherwise specified. 

:::info
Before the rollout, if your organization uses network allowlisting, add the `dbt.com` domain to your allowlists. For single-tenant accounts, there will be no change to IP addresses. For multi-tenant accounts, refer to [Access, Regions, & IP Addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for updated IPs.
:::

### What changes and what stays the same

The following summarizes what will and won't change when your account-scoped access URL is assigned.

**What changes:**

- All access URLs for the <Constant name="dbt_platform" />, Discovery, Administrative, and Semantic Layer APIs
- Any integration that uses an access URL in its configuration (OAuth redirect URIs, SCIM base URLs, allowlists, webhook callbacks, API base URLs)

**What stays the same:**

- Your dbt project code, models, and configurations
- Your data platform connections and credentials
- Your account settings, environments, jobs, and schedules
- Egress Private Connectivity
- The underlying <Constant name="dbt_platform" /> functionality

## Finding your new access URLs

Once the details of your new access URL are available, you can find them in **Account settings** → **Access URLs**. Each account on your instance has its own URL.

## Integration checklist

Review the following checklist before your existing URL deprecation date. Update each integration that uses a <Constant name="dbt" /> access URL. If your integration isn't in this list, please speak with your IT or applicable team to identify whether you need to take action or not. 

All dbt Labs managed integrations will be updated automatically, which consists of the <Constant name="dbt" /> GitHub Application, Slack, and outbound git provider webhooks.

| Integration | Action required |
|---|---|
| [Google Workspace SSO](/docs/cloud/manage-access/set-up-sso-google-workspace#creating-credentials) | Update or add OAuth Client |
| [Azure ADO OAuth SSO](/docs/cloud/git/setup-service-principal) | Update or add App Registration |
| [GitLab (dbt Labs app)](/docs/cloud/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Update or add GL Group Application with new Redirect URI |
| [GitLab (bring-your-own app)](/docs/cloud/git/connect-gitlab#setting-up-a-gitlab-oauth-application) | Update or add GL Group Application with new Redirect URI |
| GitHub On-premises | Contact [dbt Labs Support](mailto:support@getdbt.com) |
| [Snowflake OAuth](/docs/cloud/manage-access/set-up-snowflake-oauth#subdomain-migration) | Update or add Security Integration; update dbt connection |
| [Snowflake External OAuth](/docs/cloud/manage-access/snowflake-external-oauth#identity-provider-configuration) | Update Redirect URI in your IdP application |
| [Databricks OAuth](/docs/cloud/manage-access/set-up-databricks-oauth) | Update Redirect URLs or add a new Connection; update dbt connection |
| [BigQuery OAuth](/docs/cloud/manage-access/set-up-bigquery-oauth) | Update Redirect URI or add a new Connection; update dbt connection |
| [Redshift External OAuth](/docs/cloud/manage-access/redshift-external-oauth) | Update Redirect URI in your IdP application |
| Network allowlists | Add new access URLs to your allowlist policies |
| Inbound webhooks | Update access URLs in your webhook configurations |
| [SCIM (Okta)](/docs/cloud/manage-access/scim#set-up-dbt-cloud) | Update the SCIM base URL in Okta |
| Admin API, Discovery API, Semantic Layer API | Update access URLs in your API clients |
| [Terraform provider](https://registry.terraform.io/providers/dbt-labs/dbtcloud/latest/docs) | Update access URLs in your Terraform configuration |

---

## FAQs

<Expandable alt_header="How long will the `getdbt.com` access URL continue to support integrations?">
  - The `getdbt.com` access URL will continue to support integrations until November 1, 2026 unless otherwise specified.
</Expandable>

<Expandable alt_header="How do I find my new access URL?">
  - You can find your new access URL in **Account settings** → **Access URLs**. Each account on your instance has its own URL.
</Expandable>

<Expandable alt_header="What do I need to change in my integrations?">
  - You need to update your integrations to use the new access URLs. Refer to the [Integration checklist](#integration-checklist) for more information.
</Expandable>

For questions or assistance, contact [dbt Labs Support](mailto:support@getdbt.com).
