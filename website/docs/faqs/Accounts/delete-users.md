---
title: How do I delete a user in dbt?
description: "Deleting a user in dbt"
sidebar_label: 'How to delete a user'
id: delete-users

---

To delete a user in <Constant name="dbt" />, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From <Constant name="dbt" />, click on your account name in the left side menu and, select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/account-settings-menu.png" title="Open Account settings from the account menu in the left sidebar" />

2. In **Account settings**, select **Users** under **Teams**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-platform/delete_user.png" width="85%" title="Deleting a user" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>

## Related docs

- [<Constant name="dbt" /> licenses](/docs/platform/manage-access/seats-and-users#licenses)
