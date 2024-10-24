---
title: "Service account tokens"
id: "service-tokens"
description: "Service account tokens help you define permissions for securing access to your dbt Cloud account and its projects."
---

# Service account tokens <Lifecycle status="team,enterprise"/>

:::info Important service account token update

If you have service tokens created on or before July 18, 2023, please read [this important update](/docs/dbt-cloud-apis/service-tokens#service-token-update).

:::

Service account tokens enable you to securely authenticate with the dbt Cloud API by assigning each token a narrow set of permissions that more precisely manages access to the API. While similar to [personal access tokens](user-tokens), service account tokens belong to an account rather than a user.

You can use service account tokens for system-level integrations that do not run on behalf of any one user. Assign any permission sets available in dbt Cloud to your service account token, which can vary slightly depending on your plan:

* Enterprise plans can apply any permission sets available to service tokens.
* Team plans can apply Account Admin, Member, Job Admin, Read-Only, Metadata, and Semantic Layer permissions set to service tokens.

You can assign as many permission sets as needed to one token. For more on permissions sets, see "[Enterprise Permissions](/docs/cloud/manage-access/enterprise-permissions)."

## Generate service account tokens

You can generate service tokens if you have a Developer [license](/docs/cloud/manage-access/seats-and-users) and account admin [permissions](/docs/cloud/manage-access/about-user-access#permission-sets). To create a service token in dbt Cloud, follow these steps:

1. Open the **Account Settings** page by clicking the gear icon on the right-hand side.
2. On the left sidebar, click on **Service Tokens**.
3. Click the **+ New Token** button to generate a new token.
4. Once the token is generated, you won't be able to view this token again so make sure to save it somewhere safe.

## Permissions for service account tokens

You can assign service account tokens to any permission set available in dbt Cloud. When you assign a permission set to a token, you will also be able to choose whether to grant those permissions to all projects in the account or to specific projects.

### Team plans using service account tokens

The following permissions can be assigned to a service account token on a Team plan. Refer to [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions) for more information about these roles. 

- Account Admin &mdash; Account Admin service tokens have full `read + write` access to an account, so please use them with caution.  A Team plan refers to this permission set as an "Owner role."
- Billing Admin
- Job Admin 
- Metadata Only
- Member
- Read-only 
- Semantic Layer Only 

### Enterprise plans using service account tokens

Refer to [Enterprise permissions](/docs/cloud/manage-access/enterprise-permissions) for more information about these roles. 

- Account Admin &mdash; Account Admin service tokens have full `read + write` access to an account, so please use them with caution. 
- Account Viewer
- Admin
- Analyst
- Billing Admin
- Database Admin
- Developer
- Git Admin
- Job Admin
- Job Runner
- Job Viewer
- Manage marketplace apps
- Metadata Only 
- Semantic Layer Only 
- Security Admin
- Stakeholder
- Team Admin


## Service token update

On July 18, 2023, dbt Labs made critical infrastructure changes to service account tokens. These enhancements improve the security and performance of all tokens created after July 18, 2023. To ensure security best practices are in place, we recommend you rotate your service tokens created before this date.

To rotate your token:
1. Navigate to **Account settings** and click **Service tokens** on the left side pane.
2. Verify the **Created** date for the token is _on or before_ July 18, 2023. 
    <Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/service-token-date.png" title="Service token created date"/>
3. Click **+ New Token** on the top right side of the screen. Ensure the new token has the same permissions as the old one. 
4. Copy the new token and replace the old one in your systems. Store it in a safe place, as it will not be available again once the creation screen is closed.
5. Delete the old token in dbt Cloud by clicking the **trash can icon**. _Only take this action after the new token is in place to avoid service disruptions_.

## FAQs
<FAQ path="Troubleshooting/ip-restrictions" />
