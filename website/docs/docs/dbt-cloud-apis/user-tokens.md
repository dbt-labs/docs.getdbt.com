---
title: "User tokens"
id: "user-tokens"
pagination_next: "docs/dbt-cloud-apis/service-tokens"
---

:::warning Action required

The [user API tokens](/docs/dbt-cloud-apis/user-tokens) is being be deprecated. The deprecation date is yet to be determined, but we recommend you update to account-scoped personal access tokens to avoid service disruptions in the future.

The current API key is located under **Personal Settings → API Key.** 

Please [contact support](/docs/dbt-support#dbt-cloud-support) with any questions or concerns.

:::

## User API tokens

Each dbt Cloud user with a [Developer license](/docs/cloud/manage-access/seats-and-users) is
issued an API token. This token can be used to execute queries against
the dbt Cloud API on the user's behalf. User API tokens inherit the
permissions of the user the that they were created for.

You can find your User API token in the Profile page under the `API Access`
label.

<Lightbox src="/img/api-access-profile.jpg" title="Finding your API token in your dbt Cloud Profile" />


## Account-scoped personal access tokens

Each dbt Cloud user with a [developer license](https://docs.getdbt.com/docs/cloud/manage-access/seats-and-users) can create a personal access token (PAT) to access the dbt Cloud API. This token is used to execute queries against the dbt Cloud API on the user's behalf. User API tokens inherit the permissions of the user that they were created for. These tokens are account-specific; If a user has access to more than one dbt Cloud account with the same email address, you need to create a unique PAT for each one of these accounts. 


All new personal API Access Tokens (PATs) created will be account-specific. PATs differ from [Service Tokens](/docs/dbt-cloud-apis/service-tokens), which remain unaffected by this change. Prior to this update, API keys were user-specific and, as such, were not scoped to an account. To enhance the security of dbt Cloud, we are moving away from this model to account-specific tokens. This has a few implications if you’re using a user token today:

* **All existing API keys will stop working after April X, 2024:** 
    * To promote least privilege and high security assurance for your dbt Cloud accounts, we highly recommend moving to the new account-scoped personal access tokens. 
* **You must create and implement unique tokens in each of your dbt Cloud accounts associated with the same email:** 
    * For example, paul@atreides.com belongs to two dbt Cloud accounts: Spice Harvesting Account and Guild Navigator Account. Before this release, the same API key was used to access both accounts.
    * After this release, Paul has to individually go into these accounts and create a unique PAT for each account he wants to access the API. These API tokens are account-specific and not user-specific. 
* **Cross-Account API endpoints will stop working after April X, 2024:**
    * These are /v2/accounts and /v3/accounts. Since all tokens are now account-specific, tying all accounts to a username will not work. So /v3/accounts will be deprecated.
    * Moving forward, dbt Cloud will no longer support this model. User account metadata will only contain information about the specific account under which the request is made. 
    * Any other accounts that belong to that user account will need to be requested through the PAT that belongs to that account.


:::warning Undocumented API endpoints

If you’re using any undocumented and unsupported API endpoints, please note that these can be deprecated without any notice. If you're using any undocumented endpoints and have use-cases that are not satisfied by the current API, please reach out to apifeedback@dbt.com. 

:::

### Migration Checklist

If you are not using a user API key to access dbt Cloud APIs, you do not need to take any action. If you are using a user API key, please read the following instructions:  

1. Make a list of all the places where you’re making a call to the dbt Cloud API using the dbt Cloud user API key. 
2. Create a new personal access token under **Settings** → **Access Token** 
    * (Need screenshot)
3. Use this new PAT to replace the old user API key. 
4. Ensure that you’re using a PAT only where it’s needed. For any workflows that require a service account, please use a [service token](/docs/dbt-cloud-apis/service-tokens).


## FAQs

<FAQ path="API/rotate-token" />
<FAQ path="Accounts/find-user-id" />