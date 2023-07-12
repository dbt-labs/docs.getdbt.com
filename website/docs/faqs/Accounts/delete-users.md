---
title: How do I delete a user in dbt Cloud?
description: "Deleting a user in dbt Cloud"
sidebar_label: 'How to delete a user'
id: delete-users

---

To delete a user in dbt Cloud, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" width="85%"  title="Navigate to account settings" />

2. In **Account Settings**, select **Users** under **Teams**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" width="85%" title="Deleting a user" />

If you are on a **Teams** plan and you are deleting users to reduce the number of billable seats, you also need to take these steps to lower the license count:
1. In **Account Settings**, select **Billing**. 
2. Enter the number of developer seats you want and make sure you fill in all the payment details, including the **Billing Address** section. If you leave any field blank, you won't be able to save your changes.
3. Click **Update Payment Information** to save your changes. 

<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.jpg" width="85%" title="Navigate to Account Settings -> Users to modify dbt Cloud users" />

## Related docs

- [dbt Cloud licenses](/docs/cloud/manage-access/seats-and-users#licenses)
