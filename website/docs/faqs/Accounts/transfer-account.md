---
title: How do I transfer account ownership to another user? 
description: "Instructions on how to transfer your dbt user account to another user"
sidebar_label: 'How to transfer dbt account?'
id: transfer-account

---

You can transfer your <Constant name="cloud" /> [access control](/docs/cloud/manage-access/about-user-access) to another user by following the steps below, depending on your <Constant name="cloud" /> account plan:

| Account plan| Steps | 
| ------ | ---------- | 
| **Developer** |  You can transfer ownership by changing the email directly on your <Constant name="cloud" /> profile page, which you can access using this URL when you replace `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan: `https://YOUR_ACCESS_URL/settings/profile`. Before doing this, please ensure that you unlink your GitHub profile. The email address of the new account owner cannot be associated with another <Constant name="cloud" /> account.|
| **Starter** | Existing account admins with account access can add users to, or remove users from the owner group. | 
| **Enterprise or Enterprise+** | Account admins can add users to, or remove users from a group with Account Admin permissions. | 
| **If all account owners left the company** | If the account owner has left your organization, you will need to work with _your_ IT department to have incoming emails forwarded to the new account owner. Once your IT department has redirected the emails, you can request to reset the user password. Once you log in, you can change the email on the Profile page when you replace `YOUR_ACCESS_URL` with the [appropriate Access URL](/docs/cloud/about-cloud/access-regions-ip-addresses) for your region and plan:  `https://YOUR_ACCESS_URL/settings/profile`. |

When you make any account owner and email changes:

- The new email address _must_ be verified through our email verification process. 
- You can update any billing email address or [Notifications Settings](/docs/deploy/job-notifications) to reflect the new account owner changes, if applicable.
- When transferring account ownership, please ensure you [unlink](/faqs/Accounts/git-account-in-use) your GitHub account in <Constant name="cloud" />. This is because you can only have your <Constant name="git" /> account linked to one <Constant name="cloud" /> user account. 
 
