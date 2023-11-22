---
title: "Invite users to dbt Cloud"
description: "Learn how to manually invite users to dbt Cloud"
id: "invite-users"
sidebar: "Invite users"
---

dbt Cloud makes it easy to invite new users to your environment out of the box. This feature is available to all dbt Cloud customers on Teams or Enteprise plans (Developer plans are limited to a single user).

## Prerequisites

You must have proper permissions to invite new users:

- [**Teams accounts**](/docs/cloud/manage-access/self-service-permissions) &mdash; must have `member` or `owner` permissions.
- [**Enterprise accounts**](/docs/cloud/manage-access/enterprise-permissions) &mdash; must have `admin`, `account admin`, `project creator`, or `security admin` permissions.

## Invite new users

1. In your dbt Cloud account, select the gear menu in the upper right corner and then select **Account Settings**.
2. From the left sidebar, select **Users**.

<Lightbox src="/img/docs/dbt-cloud/access-control/users-screen.png" width"70%" title="The user screen in the Account Settings page"/>

3. Click on **Invite Users**.

<Lightbox src="/img/docs/dbt-cloud/access-control/invite-users.png" title="The invite users pane"/>

4. In the **Email Addresses** field, enter the email addresses of the users you would like to invite separated by comma, semicolon, or a new line.
5. Select the license type for the batch of users from the **License** dropdown.
6. Select the group(s) you would like the invitees to belong to.
7. Click **Send Invitations**.
    - If the list of invitees exceeds the number of licenses your account has available, you will receive a warning when you click **Send Invitations** and the invitations will not be sent. 


## User experience

dbt generates and sends the email to the addresses defined in dbt Cloud. Be sure to allow traffic from `support@getdbt.com` to prevent emails from going to spam or being blocked (this is the originating email address for all [instances worldwide](/docs/cloud/about-cloud/regions-ip-addresses)).

The email contains a link to create an account. When the user clicks on this they will be brought to one of two screens depending on whether SSO is configured or not.

<Lightbox src="/img/docs/dbt-cloud/access-control/email-invite.png" title="Example or an email invitation"/>

The default settings send the email, the user clicks the link, and is prompted to create their account:

<Lightbox src="/img/docs/dbt-cloud/access-control/default-user-invite.png" title="Default user invitation"/>

If SSO is configured for the environment, the user clicks the link, is brought to a confirmation screen, and presented with a link to authenticate against the company's identity provider:

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-user-invite.png" title="User invitation with SSO configured"/>

Once the user completes this process, their email and user information will populate in the **Users** screen in dbt Cloud.

## FAQ

* Is there a limit to the number of users I can invite? _Your ability to invite users is limited to the number of licenses you have available._
* Why are users are clicking the invite link and getting an `Invalid Invitation Code` error? _We have seen scenarios where embedded secure link technology (such as enterprise Outlooks [Safe Link](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links-about?view=o365-worldwide) feature) can result in errors when clicking on the email invite. Be sure to include the `getdbt.com` URL in the allowlists for these services._
* Can I have a mixure of users with SSO and username/password authentication? _Once SSO is enabled, you will no longer be able to add local users. If you have contractors or similar contingent workers, we recommend you add them to your SSO service._