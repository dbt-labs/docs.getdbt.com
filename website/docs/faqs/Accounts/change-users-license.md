---
title: How do I change a user license type to read-only in dbt?
description: "Changing a user license type to read-only in dbt"
sidebar_label: 'How to change a user license type to read-only'
id: change-user-license

---

To change the license type for a user from `developer` to `read-only` or `IT` in <Constant name="dbt" />, you must be an account owner or have admin privileges. You might make this change to free up a billable seat but retain the user’s access to view the information in the <Constant name="dbt" /> account.

1. From <Constant name="dbt" />, click on your account name in the left side menu and, select **Account settings**.

<Lightbox src="/img/docs/dbt-platform/account-settings-menu.png" width="85%" title="Open Account settings from the account menu in the left sidebar" />

2. Under **Settings**, select **Users**.
3. Select the user you want to modify and click **Edit** in the bottom of their profile.
4. In the **License** field, select **Read-only** or **IT** (from **Developer**), and click **Save**.

<Lightbox src="/img/docs/dbt-platform/change-user-license-details.png" width="85%" title="Change the license type on the User details page" />

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />
