---
title: How do I change a user license type to read-only in dbt?
description: "Changing a user license type to read-only in dbt"
sidebar_label: 'How to change a user license type to read-only'
id: change-user-license

---

To change the license type for a user from `developer` to `read-only` or `IT` in <Constant name="dbt" />, you must be an account owner or have admin privileges. You might make this change to free up a billable seat but retain the user’s access to view the information in the <Constant name="dbt" /> account.

1. From <Constant name="dbt" />, click on your account name in the left side menu and, select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/Navigate-to-account-settings.png" title="Navigate to account settings" />

2. In **Account Settings**, select **Users** under **Teams**.
3. Select the user you want to remove and click **Edit** in the bottom of their profile.
4. For the **License** option, choose **Read-only** or **IT** (from **Developer**), and click **Save**.

<Lightbox src="/img/docs/dbt-platform/change_user_to_read_only_20221023.gif" title="Change user's license type" />

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />
