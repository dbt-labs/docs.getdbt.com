---
title: How do I change a user license type to read-only in dbt Cloud?
description: "Changing a user license type to read-only in dbt Cloud"
sidebar_label: 'How to change a user license type to read-only'
id: change-user-license

---

To change the license type for a user from `developer` to `read-only` in dbt Cloud, you must be an account owner or have admin privileges. You might make this change to free up a billable seat but retain the user’s access to view the information in the dbt Cloud account.

1. From dbt Cloud, click the gear icon at the top right and select **Account Settings**.

<Lightbox src="/img/docs/dbt-cloud/Navigate To Account Settings.png" title="Navigate to account settings" />

2. In **Account Settings**, select **Users** under **Teams**.
3. Select the user you want to remove, and click **Edit** in the bottom of their profile.
4. For the **License** option, choose **Read-only** (from **Developer**), and click **Save**.

<Lightbox src="/img/docs/dbt-cloud/change_user_to_read_only_20221023.gif" title="Change users license type" />
