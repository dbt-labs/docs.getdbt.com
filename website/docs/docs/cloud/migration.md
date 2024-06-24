--- 
title: "Multi-cell migration checklist"
id: migration 
sidebar_label: "Multi-cell migration checklist"
description: "Prepare for account migration to AWS cell-based architecture." 
pagination_next: null
pagination_prev: null
---

dbt Labs is in the process of migrating dbt Cloud to a new _cell-based architecture_. This architecture will be the foundation of dbt Cloud for years to come, and will bring improved scalability, reliability, and security to all customers and users of dbt Cloud.

There is some preparation required to ensure a successful migration.

Migrations are being scheduled on a per-account basis. _If you haven't received any communication (either with a banner or by email) about a migration date, you don't need to take any action at this time._ dbt Labs will share migration date information with you, with appropriate advance notice, before we complete any migration steps in the dbt Cloud backend.

This document outlines the steps that you must take to prevent service disruptions before your environment is migrated over to the cell-based architecture. This will impact areas such as login, IP restrictions, and API access. 

## Pre-migration checklist

Prior to your migration date, your dbt Cloud account admin will need to make some changes to your account. Most of your configurations will be migrated automatically, but a few will require manual intervention. 

If your account is scheduled for migration, you will see a banner indicating your migration date when you log in. If you don't see a banner, you don't need to take any action.

1. **IP addresses** &mdash; dbt Cloud will be using new IPs to access your warehouse after the migration. Make sure to allow inbound traffic from these IPs in your firewall and include it in any database grants. All six of the IPs below should be added to allowlists.
    * Old IPs: `52.45.144.63`, `54.81.134.249`, `52.22.161.231`
    * New IPs: `52.3.77.232`, `3.214.191.130`, `34.233.79.135`
2. **User invitations** &mdash; Any pending user invitations will be invalidated during the migration. You can resend the invitations after the migration is complete.
3. **SSO integrations** &mdash; If you've completed the Auth0 migration, your account SSO configurations will be automatically transferred. If you haven't completed the Auth0 migration, dbt Labs recommends doing that before starting the mult-cell migration to avoid service disruptions.

## Post-migration

After migration, if you completed all the [Pre-migration checklist](#pre-migration-checklist) items, your dbt Cloud resources and jobs will continue to work as they did before. 

You have the option to log in to dbt Cloud at a different URL:
 * If you were previously logging in at `cloud.getdbt.com`, you should instead plan to login at `us1.dbt.com`. The original URL will still work, but you’ll have to click through to be redirected upon login.
 * You may also log in directly with your account’s unique [access URL](/docs/cloud/about-cloud/access-regions-ip-addresses#accessing-your-account).

:::info Login with GitHub
Users who previously used the "Login with GitHub" functionality will no longer be able to use this method to login to dbt Cloud after migration. To continue accessing your account, you can use your existing email and password.
