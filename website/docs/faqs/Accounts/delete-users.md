---
title: How do I delete a user in dbt?
description: "Deleting a user in dbt"
sidebar_label: 'How to delete a user'
id: delete-users

---

To delete a user in <Constant name="cloud" />, you must be an account owner or have admin privileges. If the user has a `developer` license type, this will open up their seat for another user or allow the admins to lower the total number of seats. 

1. From <Constant name="cloud" />, click on your account name in the left side menu and, select **Account settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate-to-account-settings.png" title="Navigate to account settings" />

2. In **Account settings**, select **Users** under **Teams**.
3. Select the user you want to delete, then click **Edit**. 
4. Click **Delete** in the bottom left. Click **Confirm Delete** to immediately delete the user without additional password prompts. This action cannot be undone. However, you can re-invite the user with the same information if the deletion was made in error. 

<Lightbox src="/img/docs/dbt-cloud/delete_user.png" width="85%" title="Deleting a user" />

import LicenseCount from '/snippets/_license-count.md';

<LicenseCount/>


<Lightbox src="/img/docs/dbt-cloud/faq-account-settings-billing.png" width="85%" title="Navigate to Account settings -> Users to modify dbt users" />

## Related docs

- [<Constant name="cloud" /> licenses](/docs/cloud/manage-access/seats-and-users#licenses)
