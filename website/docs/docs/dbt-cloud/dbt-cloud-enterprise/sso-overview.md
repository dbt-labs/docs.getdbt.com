---
title: "SSO Overview"
id: "sso-overview"

---

<Callout type="info" title="Enterprise Feature">

This guide describes a feature of the dbt Cloud Enterprise plan. If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

</Callout>

This guide explains how users are provisioned in dbt Cloud via Single Sign-On (SSO). dbt Cloud supports JIT (Just-in-Time) provisioning and IdP-initiated login. You can learn more about our supported options [here](/docs/dbt-cloud/dbt-cloud-enterprise)

The diagram below explains the basic process by which users are provisioned in dbt Cloud upon logging in with SSO.

![SSO-diagram](https://user-images.githubusercontent.com/46451573/84191012-d9c1d880-aa65-11ea-8dcd-f1aeb7369cfd.png)


#### Vocabulary

- **Login Page**: the dbt Cloud login page, where users can initiate the SSO flow.
- **IdP-Initiated Login**: the login page within your Identity Provider, where users can select the dbt Cloud application and begin the login flow.
- **IdP Login Page**: the user is prompted to login to the Identity Provider, and grant the dbt Cloud application to access the details of their account.
- **Login?**: the user can choose to continue, or to abort the login process.
  - **Yes**: the user logs in, grants the dbt Cloud application, and continues.
  - **No**: the user does not log in. They return to the IdP login page.
- **User Exists?**: does the user already exist in dbt Cloud's user database?
  - **Yes**: skip the user creation process
  - **No**: create a new entry in the dbt Cloud database for the new user.
- **Create dbt Cloud User**: create a new entry in the dbt Cloud database for the new user. This user record contains the user's email address, first and last name, and any IdP attributes (e.g. groups) passed along from the Identity Provider.
- **Attach Matching Accounts**: find all of the accounts configured to match the SSO config used by this user to log in, and then create a user license record mapping the user to the account. This step will also delete any licenses that the user should not have based on the current SSO config.
- **Attach Matching Permissions (Groups)**: iterate through the groups on the matching accounts, and find all that either (a) have an SSO mapping group that is assigned to the user, or (b) have the "Assign by Default" option checked. Then, assign all of these (and only these) to the user license. This step will also delete any permissions that the user should not have based on the current SSO group mappings.
- **dbt Cloud Application**: After these steps, the user is redirected into the dbt Cloud application, and they can begin to use the application normally.

