---
title: "Authentication tokens"
description: "Learn how to authenticate with user tokens and service account tokens "
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

<div className="grid--2-col">

<Card
    title="User tokens"
    body="Learn about user tokens and how to use them to execute queries against the dbt Cloud API."
    link="/docs/dbt-cloud-apis/user-tokens"
    icon="dbt-bit"/>

<Card
    title="Service account tokens"
    body="Learn how to use service account tokens to securely authenticate with the dbt Cloud API for system-level integrations."
    link="/docs/dbt-cloud-apis/service-tokens"
    icon="dbt-bit"/>

</div>

## Types of API access tokens

**User API Keys (Legacy):** User API keys were historically the only method available to access dbt Cloud APIs on the user’s behalf. They are scoped to the user and not the account. User API Keys will eventually be deprecated for the more secure Personal Access Tokens.

**Personal Access Tokens (New):** Personal Access Tokens (PATs) are the new, preferred, and secure way of accessing dbt Cloud APIs on behalf of a user. They are more secure than user API Keys. PATs are scoped to an account and can be enhanced with more granularity and control. 

**Service Tokens:** Service Tokens are similar to service accounts and are the preferred method to enable access on behalf of the dbt Cloud account.

### Which token type should you use

The following use cases highlight scenarios where you should use a personal access token (PAT) vs. a service token. Service tokens are broadly used for any production workflow where service accounts are required. PATs are recommended only for developmental workflows _or_ dbt Cloud client workflows that require user context. 

* **Connecting a partner integration to dbt Cloud** &mdash; Some examples are Hightouch, Datafold, a custom app you’ve created, etc. All of these integrations should use a service token instead of a PAT because service tokens give you visibility, and you can scope them specifically to only what the integrations need and ensure the least privilege. We highly recommend switching to a service token if you’re using a user API key for these today. 
* **Production Terraform** &mdash; Use a service token since this is a production workflow and is acting as a service account and not a user account. 
* **Cloud CLI and Semantic Layer Sheets Integration** &mdash; Use a PAT since both the dbt Cloud CLI and Semantic Layer Google Sheets integrations work within the context of a user (the user is making the requests and has to operate within the context of their user account).
* **Testing a custom script and staging Terraform or Postman** &mdash; We recommend using a PAT as this is a developmental workflow and is scoped to the user making the changes. There are certain instances where you may need/require a service token. However, when you push this script or Terraform into production, use a service token instead.