---
title: "User tokens"
id: "user-tokens"
pagination_next: "docs/dbt-cloud-apis/service-tokens"
---

## User API tokens

Each dbt Cloud user with a [Developer license](/docs/cloud/manage-access/seats-and-users) is
issued an API token. This token can be used to execute queries against
the dbt Cloud API on the user's behalf. User API tokens inherit the
permissions of the user the that they were created for.

You can find your User API token in the Profile page under the `API Access`
label.

<Lightbox src="/img/api-access-profile.png" title="Finding your API token in your dbt Cloud Profile" />

## FAQs

<FAQ path="API/rotate-token" />
<FAQ path="Accounts/find-user-id" />
