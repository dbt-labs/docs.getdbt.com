---
title: "Invite users to dbt Cloud"
description: "Learn how to manually invite users to dbt Cloud"
id: "invite-users"
sidebar: "Invite users"
---

dbt Cloud makes it easy to invite new users to your environment out of the box. This feature is available to all dbt Cloud customers on Teams or Enterprise plans (Developer plans are limited to a single user).

## Prerequisites

You must have proper permissions to invite new users:

- [**Teams accounts**](/docs/cloud/manage-access/self-service-permissions) &mdash; must have `member` or `owner` permissions.
- [**Enterprise accounts**](/docs/cloud/manage-access/enterprise-permissions) &mdash; must have `admin`, `account admin`, `project creator`, or `security admin` permissions.
- The admin inviting the users must have a `developer` or `IT` license.

## Invite new users

1. In your dbt Cloud account, select your account name in the bottom left corner. Then select **Account settings**.
2. Under **Settings**, select **Users**.
3. Click on **Invite users**.

<Lightbox src="/img/docs/dbt-cloud/access-control/invite-users.png" width="60%" title="The invite users pane"/>

4. In the **Email Addresses** field, enter the email addresses of the users you want to invite separated by a comma, semicolon, or a new line.
5. Select the license type for the batch of users from the **License** dropdown.
6. Select the group(s) you want the invitees to belong to.
7. Click **Send invitations**.
    - If the list of invitees exceeds the number of licenses your account has available, you will receive a warning when you click **Send Invitations** and the invitations will not be sent. 


## User experience

dbt Cloud generates and sends emails from `support@getdbt.com` to the specified addresses. Make sure traffic from the `support@getdbt.com` email is allowed in your settings to avoid emails from going to spam or being blocked. This is the originating email address for all [instances worldwide](/docs/cloud/about-cloud/access-regions-ip-addresses).


The email contains a link to create an account. When the user clicks on this they will be brought to one of two screens depending on whether SSO is configured or not.

<Lightbox src="/img/docs/dbt-cloud/access-control/email-invite.png" width="60%" title="Example or an email invitation"/>

<Tabs>

<TabItem value="Local user">

The default settings send the email, the user clicks the link, and is prompted to create their account:

<Lightbox src="/img/docs/dbt-cloud/access-control/default-user-invite.png" width="60%" title="Default user invitation"/>

</TabItem>

<TabItem value="SSO user">

If SSO is configured for the environment, the user clicks the link, is brought to a confirmation screen, and presented with a link to authenticate against the company's identity provider:

<Lightbox src="/img/docs/dbt-cloud/access-control/sso-user-invite.png" width="60%" title="User invitation with SSO configured"/>

</TabItem>

</Tabs>


Once the user completes this process, their email and user information will populate in the **Users** screen in dbt Cloud.

## FAQ

* Is there a limit to the number of users I can invite? _Your ability to invite users is limited to the number of licenses you have available._
* Why are users are clicking the invitation link and getting an `Invalid Invitation Code` error? _We have seen scenarios where embedded secure link technology (such as enterprise Outlooks [Safe Link](https://learn.microsoft.com/en-us/microsoft-365/security/office-365-security/safe-links-about?view=o365-worldwide) feature) can result in errors when clicking on the email link. Be sure to include the `getdbt.com` URL in the allowlists for these services._
* Can I have a mixure of users with SSO and username/password authentication? _Once SSO is enabled, you will no longer be able to add local users. If you have contractors or similar contingent workers, we recommend you add them to your SSO service._
* What happens if I need to resend the invitation? _From the Users page, click on the invite record, and you will be presented with the option to resend the invitation._
* What can I do if I entered an email address incorrectly? _From the Users page, click on the invite record, and you will be presented with the option to revoke it. Once revoked, generate a new invitation to the correct email address._

<Lightbox src="/img/docs/dbt-cloud/access-control/resend-invite.png" width="60%" title="Resend or revoke the users invitation"/>
