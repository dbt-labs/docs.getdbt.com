---
title: "Authentication tokens"
description: "Learn how to authenticate with user tokens and service account tokens "
pagination_next: "docs/dbt-cloud-apis/user-tokens"
pagination_prev: null
---

<div className="grid--2-col">

<Card
    title="Personal access tokens"
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

**Personal access tokens:** Preferred and secure way of accessing dbt Cloud APIs on behalf of a user. PATs are scoped to an account and can be enhanced with more granularity and control. 

**Service tokens:** Service tokens are similar to service accounts and are the preferred method to enable access on behalf of the dbt Cloud account.

### Which token type should you use

You should use service tokens broadly for any production workflow where you need a service account. You should use PATs only for developmental workflows _or_ dbt Cloud client workflows that require user context. The following examples show you when to use a personal access token (PAT) or a service token: 

* **Connecting a partner integration to dbt Cloud** &mdash; Some examples include the [dbt Semantic Layer Google Sheets integration](/docs/cloud-integrations/avail-sl-integrations), Hightouch, Datafold, a custom app you’ve created, etc. These types of integrations should use a service token instead of a PAT because service tokens give you visibility, and you can scope them to only what the integration needs and ensure the least privilege. We highly recommend switching to a service token if you’re using a personal acess token for these integrations today. 
* **Production Terraform** &mdash; Use a service token since this is a production workflow and is acting as a service account and not a user account. 
* **Cloud CLI** &mdash; Use a PAT since the dbt Cloud CLI works within the context of a user (the user is making the requests and has to operate within the context of their user account).
* **Testing a custom script and staging Terraform or Postman** &mdash; We recommend using a PAT as this is a developmental workflow and is scoped to the user making the changes. When you push this script or Terraform into production, use a service token instead.
