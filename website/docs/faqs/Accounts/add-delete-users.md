---
title: How do I add or remove a user in dbt Cloud?
description: "Adding or deleting a user in dbt Cloud"
sidebar_label: 'How to add or remove a user'
id: add-delete-users

---

To add or remove developers, you'll need to make two changes: adjust your developer user seat count AND your developer billing seat count. 

- The developer user seat count manages the users invited to your dbt Cloud project. 
- The developer billing seat count manages the number of billable seats. 

You can add or remove developers by increasing or decreasing the number of users and billable seats in your account settings:

- [**Adding users**](#adding-users) &mdash; To add more developers, you'll need to  increase your developer seat count first in your **Account settings** -> **Billing**. Then you'll need to add developers in the **Account settings** -> **Users**.

- [**Deleting users**](#deleting-users) &mdash; To reduce your seat count, you would need to remove the developers first in **Account settings** -> **Users**. Then you'll need to modify your developer seat count in **Account settings** -> **Billing**.

For detailed steps, refer to the following guidance:

### Adding users

To add a user in dbt Cloud, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to add or lower the total number of seats. 

**Step 1**

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" width="100%" title="Navigate to account settings" />

2. In **Account Settings**, select **Billing**. 
3. Enter the number of developer seats you want and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.jpg" width="100%" title="Navigate to account settings -> Billing to modify billing seat count" />

**Step 2**

Now that you've updated your billing, you can now invite users to join your dbt Cloud account. Take these steps to add users:

4. Stay in **Account Settings**, select **Users** under **Teams**.
5. Select the user you want to add by clicking **Invite Users**.
6. In the **Invite Users** side panel, add the invited user's email(s), assign their license, and Groups. 
7. Click **Send Invitations** at the bottom of the page. 

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-users.jpg" width="100%" title="Navigate to account settings -> Billing to modify dbt Cloud users" />

Great work! After completing those two steps, your dbt Cloud user count and billing count should now be the same.

### Deleting users

To delete a user in dbt Cloud, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

**Step 1**

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" width="85%" title="Navigate to account settings" />

2. In **Account Settings**, select **Users** under **Teams**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" width="85%" title="Deleting a user" />

**Step 2**

If you are on a **Teams** plan and you are deleting users to reduce the number of billable seats, you also need to take these steps to lower the license count:
1. In **Account Settings**, select **Billing**. 
2. Enter the number of developer seats you want and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/change-developer-seats.png" width="85%" title="Developer seats" />

Great work! After completing those two steps, your dbt Cloud user count and billing count should now be the same.
