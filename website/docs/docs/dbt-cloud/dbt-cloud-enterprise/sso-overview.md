---
title: "SSO Overview"
id: "sso-overview"

---

:::info Enterprise Feature

This guide describes a feature of the dbt Cloud Enterprise plan. 
If you’re interested in learning more about an Enterprise plan, contact us at sales@getdbt.com.

:::

This overview explains how users are provisioned in dbt Cloud via Single Sign-On (SSO). 
dbt Cloud supports JIT (Just-in-Time) provisioning and IdP-initiated login. You can learn more about our supported options [here](/docs/dbt-cloud/dbt-cloud-enterprise).

The diagram below explains the basic process by which users are provisioned in dbt Cloud upon logging in with SSO.

<Lightbox src="/img/sso_overview.png" title="SSO diagram" />

#### Diagram Explanation

- **Login Page**: The user accesses the dbt Cloud login page, initiating the SSO flow.
- **IdP-Initiated Login**: The user accesses the dbt Cloud login page within the Identity Provider by selecting the dbt Cloud application. This will begin the IdP login flow.
- **IdP Login Page**: The user is prompted to login to the Identity Provider. This will grant the dbt Cloud application access to the details of their account.
- **Login?**: The user can choose to continue or to abort the login process.
  - **Yes**: The user logs in, grants the dbt Cloud application, and continues.
  - **No**: The user does not log in. They return to the IdP login page.
- **User Exists?**: This step checks if the user already exist in dbt Cloud's user database.
  - **Yes**: If so, skip the user creation process
  - **No**: If so, create a new entry in the dbt Cloud database for the new user.
- **Create dbt Cloud User**: This will create a new entry in the dbt Cloud database for the new user. This user record contains the user's email address, first and last name, and any IdP attributes (e.g. groups) passed along from the Identity Provider.
- **Attach Matching Accounts**: dbt Cloud find all of the accounts configured to match the SSO config used by this user to log in, and then create a user license record mapping the user to the account. This step will also delete any licenses that the user should not have based on the current SSO config.
- **Attach Matching Permissions (Groups)**: dbt Cloud iterates through the groups on the matching accounts, and find all that fit one of the below catergories:
    - have an SSO mapping group that is assigned to the user
    - have the "Assign by Default" option checked. 
Then, assign all of these (and only these) to the user license. This step will also remove any permissions that the user should not have based on the current SSO group mappings.
- **dbt Cloud Application**: After these steps, the user is redirected into the dbt Cloud application, and they can begin to use the application normally.

## SSO Enforcement 

:::info Security Update

This section outlines changes that will be released after September 15, 2022. If you have SSO enabled but have non-admin end-users that are logging in with a password, please read the section below carefully

:::

Starting September 15, 2022, we will be making some security changes to SSO that will  increase the security posture of your environment. We are making two main changes: 

1. **SSO Enforcement:** If you have SSO turned on in your org, dbt Cloud will enforce SSO-only logins for all non-admin users. If an Account Admin already has a password, they can continue logging in with a password
2. **SSO Re-Authentication:** dbt Cloud will prompt you to re-authenticate using your SSO provider every 24 hours to ensure high security. 

Non-admin users that currently login with a password will no longer be able to do so. They must login via the IdP (Okta, Azure AD, etc) or via the dbt Enterprise Login URL. 

There are a few scenarios where you may need to login via a password, we recommend the following security best-practices for the two most common scenarios:
1. **Onboarding partners and contractors** - We highly recommend that you add partners and contractors to your Identity Provider. IdPs like Okta and AAD offer capabilities explicitly for temporary employees. We highly recommend that you reach out to your IT team to provision them an SSO license. This is highly secure, reduces any breach risk, and significantly increases the security posture of your dbt Cloud environment. 
2. **Identity Provider is down -** Account admins will continue to be able to log in with a password which would allow them to work with your Identity Provider to troubleshoot the problem.

If you are reading this and you have any non-admin users that are logging in to dbt Cloud with a password today, we recommend the following actions: 

1. Ensure that all users have a user account in your Identity Provider and are assigned dbt Cloud to ensure they don’t lose access. 
2. Alert all dbt Cloud users that they won’t be able to use a password for login anymore unless they are already an Admin and have already set a password. 

**We DO NOT recommend promoting any users to Admins just to preserve password-based logins.
**
