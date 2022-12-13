---
title: How do I delete a user in dbt Cloud?
description: "Deleting a user in dbt Cloud"
sidebar_label: 'How to delete a user'
id: delete-users

---

This article outlines the steps for deleting a user in dbt Cloud. If the user has a 'developer' license type, this will open up their seat for another user or allow the admins to lower the total number of seats. You must be an account owner or admin to perform these actions.

1. From  dbt cloud, click the gear icon and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" title="Navigate to account settings" />

2. In the left menu, click **Teams** and select **Users**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left, and click **Confirm Delete** to complete the action. The user will be deleted immediately after confirmation without additional password prompts. Once you delete a user, this action cannot be undone. However, you can re-invite a user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-cloud/delete_user_20221023.gif" title="Deleting a user" />

If you are on a **Teams** plan and you are deleting users to reduce the number of billable seats, you also need to take these steps to lower the license count:
1. In the Account Settings pane, click **Billing**. 
2. Type the number of developer seats you want and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/change-developer-seats.png" title="Developer seats" />
