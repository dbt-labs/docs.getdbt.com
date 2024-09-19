---
title: "User tokens"
id: "user-tokens"
pagination_next: "docs/dbt-cloud-apis/service-tokens"
---

# User tokens <Lifecycle status="team,enterprise"/>

:::note Announcement

_User tokens will be deprecated on October 22nd, 2024._

The [user API tokens](/docs/dbt-cloud-apis/user-tokens#user-api-tokens) are being replaced by [account-scoped personal access tokens(PATs)](#account-scoped-personal-access-tokens). If you do not rotate your existing user tokens with PATs by October 22nd, the services using the tokens will encounter errors. 


Cloud CLI config files need to be re-downloaded before October 22nd, 2024.

The current API key is located under **Personal Settings → API Key.** 

Please [contact support](/docs/dbt-support#dbt-cloud-support) with any questions or concerns.

:::

## Account-scoped personal access tokens

:::info New 

On Feb 7, 2024, we introduced a new type of token for individual users called personal access tokens. Note that these differ from [Service Tokens or API Keys](/docs/dbt-cloud-apis/authentication#types-of-api-access-tokens). Before this release, user API keys were the only way to access dbt Cloud API on behalf of the user. These API Keys were user-specific and were not scoped to an account. To enhance the security of dbt Cloud, we are moving away from this model to account-specific tokens. 

:::

Each dbt Cloud user with a [Developer license](https://docs.getdbt.com/docs/cloud/manage-access/seats-and-users) can create a new personal access token (PAT) to access the dbt Cloud API and dbt Cloud CLI. This token can execute queries against the dbt Cloud API on the user's behalf. To access dbt Cloud APIs and resources on behalf of the _account_, we recommend using service Tokens instead. Learn more about [which token type you should use](/docs/dbt-cloud-apis/authentication#which-token-type-should-you-use) to understand the token differences.

PATs inherit the permissions of the user that created them. For example, if a developer-licensed user with Project Admin role access to specific projects creates a PAT, the token will get the Project Admin role with access to the same projects as the user. These tokens are also account-specific, so if a user has access to more than one dbt Cloud account with the same email address, they need to create a unique PAT for each one of these accounts. 

### Migrate from user API keys to personal access tokens

The migration to PATs is critical if you are using user API keys today. The current API key is located under **Personal Settings → API Key**.

 There are a few things to understand if you are using a user API key today: 

* Personal access tokens are more secure. 
    * To promote the least privilege and high-security assurance for your dbt Cloud accounts, we highly recommend moving to the new account-scoped personal access tokens.
* You must create and use unique tokens in each one of your dbt Cloud accounts that share the same email address.
    * For example, if paul.atreides@example.com belongs to two dbt Cloud accounts: Spice Harvesting Account and Guild Navigator Account. Before this release, the same API key was used to access both of these accounts. 
    * After this release, Paul has to individually go into these accounts and create a unique PAT for each account he wants to access the API for. These PATs are account-specific and not user specific. 
* Cross-Account API endpoints will change in behavior when using the personal access tokens.
    * These are namely /v2/accounts and /v3/accounts. Since all PATs are now account specific, getting all accounts associated with a username cannot work. /v3/accounts will only return account metadata that’s relevant to the PAT that’s being used. 
    * User account metadata will only contain information about the specific account under which the request is being made. 
    * Any other accounts that belong to that user account will need to be requested through the PAT that belongs to that account. 

:::warning Undocumented APIs

If you’re using any undocumented and unsupported API endpoints, please note that these can be deprecated without any notice. If you are using any undocumented endpoints and have use-cases that are not satisfied by the current API, please reach out to [support@getdbt.com](mailto:support@getdbt.com). 

:::

### Using the new personal access tokens

Are you using a user API key today to access dbt Cloud APIs in any of your workflows? If not, you don’t have any action to take. If you are using a user API key, please follow the instructions below. 

1. Make a list of all the places where you’re making a call to the dbt Cloud API using the dbt Cloud user API key. 
2. Create a new personal access token under **Account Settings → API Tokens → Personal Tokens.** 
3. Create and copy the new PAT to replace the old user API key. 
4. Ensure that you’re using a PAT only where it's needed. For any flows that requires a service account, please use a service token. Read the section below for more information.

## User API tokens

Each dbt Cloud user with a [Developer license](/docs/cloud/manage-access/seats-and-users) is
issued an API token. This token can be used to execute queries against
the dbt Cloud API on the user's behalf. User API tokens inherit the
permissions of the user that they were created for.

You can find your user API token in the **Profile page** under the **API Access**
label.

<Lightbox src="/img/api-access-profile.jpg" title="Finding your API token in your dbt Cloud Profile" />

## FAQs

<FAQ path="API/rotate-token" />
<FAQ path="Accounts/find-user-id" />
