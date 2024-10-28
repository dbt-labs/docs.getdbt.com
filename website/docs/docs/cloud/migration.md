--- 
title: "Multi-cell migration checklist"
id: migration 
sidebar_label: "Multi-cell migration checklist"
description: "Prepare for account migration to AWS cell-based architecture." 
pagination_next: null
pagination_prev: null
---

dbt Labs is in the process of rolling out a new cell-based architecture for dbt Cloud. This architecture provides the foundation of dbt Cloud for years to come, and brings improved reliability, performance, and consistency to users of dbt Cloud.

We're scheduling migrations by account. When we're ready to migrate your account, you will receive a banner or email communication with your migration date. If you have not received this communication, then you don't need to take action at this time. dbt Labs will share information about your migration with you, with appropriate advance notice, when applicable to your account.

Your account will be automatically migrated on or after its scheduled date. However, if you use certain features, you must take action before that date to avoid service disruptions.

## Recommended actions

:::info Rescheduling your migration

If you're on the dbt Cloud Enterprise tier, you can postpone your account migration by up to 45 days. To reschedule your migration, navigate to **Account Settings** → **Migration guide**.

For help, contact the dbt Support Team at [support@getdbt.com](mailto:support@getdbt.com).
:::

We highly recommended you take these actions:

- Ensure pending user invitations are accepted or note outstanding invitations. Pending user invitations might be voided during the migration. You can resend user invitations after the migration is complete.
- Commit unsaved changes in the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).  Unsaved changes might be lost during migration.
- Export and download [audit logs](/docs/cloud/manage-access/audit-log) older than 90 days, as they will be unavailable from dbt Cloud after the migration is complete. Logs older than 90 days while within the data retention period are not deleted, but you will have to work with the dbt Labs Customer Support team to recover.

## Required actions

These actions are required to prevent users from losing access dbt Cloud:

- If you still need to, complete [Auth0 migration for SSO](/docs/cloud/manage-access/auth0-migration) before your scheduled migration date to avoid service disruptions. If you've completed the Auth0 migration, your account SSO configurations will be transferred automatically. 
- Update your IP allow lists. dbt Cloud will be using new IPs to access your warehouse post-migration. Allow inbound traffic from all of the following new IPs in your firewall and include them in any database grants:

    - `52.3.77.232` 
    - `3.214.191.130`
    - `34.233.79.135`

    Keep the old dbt Cloud IPs listed until the migration is complete.

## Post-migration​

Complete all of these items to ensure your dbt Cloud resources and jobs will continue working without interruption.

Use one of these two URL login options:

- `us1.dbt.com.` If you were previously logging in at `cloud.getdbt.com`, you should instead plan to log in at us1.dbt.com. The original URL will still work, but you’ll have to click through to be redirected upon login.
- `ACCOUNT_PREFIX.us1.dbt.com`: A unique URL specifically for your account. If you belong to multiple accounts, each will have a unique URL available as long as they have been migrated to multi-cell. 
Check out [access, regions, and IP addresses](/docs/cloud/about-cloud/access-regions-ip-addresses) for more information.

Remove the following old IP addresses from your firewall and database grants: 

- `52.45.144.63` 
- `54.81.134.249`
- `52.22.161.231`
