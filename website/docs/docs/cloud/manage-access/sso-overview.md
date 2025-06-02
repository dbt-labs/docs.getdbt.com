---
title: "Single sign-on (SSO) Overview"
id: "sso-overview"
pagination_next: "docs/cloud/manage-access/set-up-sso-saml-2.0"
pagination_prev: null
---

# Single sign-on (SSO) overview <Lifecycle status="managed, managed_plus" />

This overview explains how users are provisioned in <Constant name="cloud" /> via Single Sign-On (SSO).
<Constant name="cloud" /> supports JIT (Just-in-Time) provisioning and IdP-initiated login. You can learn more about our supported options [here](https://www.getdbt.com/pricing/).

## Prerequisites

- You have a <Constant name="cloud" /> Enterprise or Enterprise+ plan. [Contact us](mailto:sales@getdbt.com) to learn more, book a demo, or enroll.

## Auth0 URIs

<Snippet path="auth0-uri" />

## SSO process

The diagram below explains the basic process by which users are provisioned in <Constant name="cloud" /> upon logging in with SSO.

<Lightbox src="/img/sso_overview.png" title="SSO diagram" />

#### Diagram Explanation

- **Login Page**: The user accesses the <Constant name="cloud" /> login page, initiating the SSO flow.
- **IdP-Initiated Login**: The user accesses the <Constant name="cloud" /> login page within the Identity Provider by selecting the <Constant name="cloud" /> application. This will begin the IdP login flow.
- **IdP Login Page**: The user is prompted to login to the Identity Provider. This will grant the <Constant name="cloud" /> application access to the details of their account.
- **Login?**: The user can choose to continue or to abort the login process.
  - **Yes**: The user logs in, grants the <Constant name="cloud" /> application, and continues.
  - **No**: The user does not log in. They return to the IdP login page.
- **User Exists?**: This step checks if the user already exist in <Constant name="cloud" />'s user database.
  - **Yes**: If so, skip the user creation process
  - **No**: If so, create a new entry in the <Constant name="cloud" /> database for the new user.
- **Create <Constant name="cloud" /> User**: This will create a new entry in the <Constant name="cloud" /> database for the new user. This user record contains the user's email address, first and last name, and any IdP attributes (for example, groups) passed along from the Identity Provider. <Constant name="cloud" /> will send a verification email, and the user must follow the steps in the [User experience section](/docs/cloud/manage-access/invite-users#user-experience) to use SSO in <Constant name="cloud" />.
- **Attach Matching Accounts**: <Constant name="cloud" /> find all of the accounts configured to match the SSO config used by this user to log in, and then create a user license record mapping the user to the account. This step will also delete any licenses that the user should not have based on the current SSO config.
- **Attach Matching Permissions (Groups)**: <Constant name="cloud" /> iterates through the groups on the matching accounts, and find all that fit one of the below categories:
  - Have an SSO mapping group that is assigned to the user
  - Have the "Assign by Default" option checked.
Then, assign all of these (and only these) to the user license. This step will also remove any permissions that the user should not have based on the current SSO group mappings.
- **<Constant name="cloud" /> Application**: After these steps, the user is redirected into the <Constant name="cloud" /> application, and they can begin to use the application normally.

## SSO enforcement

* **SSO Enforcement:** If SSO is turned on in your organization, <Constant name="cloud" /> will enforce SSO-only logins for all non-admin users. By default, if an Account Admin or Security Admin already has a password, they can continue logging in with a password. To restrict admins from using passwords, turn off **Allow password logins for account administrators** in the **Single sign-on** section of your organization's **Account settings**.
* **SSO Re-Authentication:** <Constant name="cloud" /> will prompt you to re-authenticate using your SSO provider every 24 hours to ensure high security.

### How should non-admin users log in?

Non-admin users that currently login with a password will no longer be able to do so. They must login using the dbt Enterprise Login URL or an identity provider (IdP). For example, Okta, Microsoft Entra ID (formerly Azure AD), etc.

### Security best practices

There are a few scenarios that might require you to login with a password. We recommend these security best-practices for the two most common scenarios:
* **Onboarding partners and contractors** &mdash; We highly recommend that you add partners and contractors to your Identity Provider. IdPs like Okta and Microsoft Entra ID offer capabilities explicitly for temporary employees. We highly recommend that you reach out to your IT team to provision an SSO license for these situations. Using an IdP highly secure, reduces any breach risk, and significantly increases the security posture of your <Constant name="cloud" /> environment.
* **Identity Provider is down** &mdash; Account admins will continue to be able to log in with a password which would allow them to work with your Identity Provider to troubleshoot the problem.
* **Offboarding admins** &mdash; When offboarding admins, revoke access to <Constant name="cloud" /> by deleting the user from your environment; otherwise, they can continue to use username/password credentials to log in. 

### Next steps for non-admin users currently logging in with passwords

If you have any non-admin users logging into <Constant name="cloud" /> with a password today:

1. Ensure that all users have a user account in your identity provider and are assigned <Constant name="cloud" /> so they won’t lose access.
2. Alert all <Constant name="cloud" /> users that they won’t be able to use a password for logging in anymore unless they are already an Admin with a password.
3. We **DO NOT** recommend promoting any users to Admins just to preserve password-based logins because you will reduce security of your <Constant name="cloud" /> environment.


