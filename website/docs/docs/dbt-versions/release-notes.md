---
title: "dbt release notes"
description: "dbt release notes"
id: "dbt-cloud-release-notes"
sidebar: "dbt release notes"
pagination_next: null
pagination_prev: null
---

<Constant name="cloud" /> release notes for recent and historical changes. Release notes fall into one of the following categories:

- **New:** New products and features
- **Enhancement:** Performance improvements and feature enhancements
- **Fix:** Bug and security fixes
- **Behavior change:** A change to existing behavior that doesn't fit into the other categories, such as feature deprecations or changes to default settings

Release notes are grouped by month for both multi-tenant and virtual private cloud (VPC) environments.

## January 2026

**Coming soon!**

## December 2025
- **Enhancement**:  dbt SSO slugs are now system-generated during SSO setup and aren't customizable. SSO slug configurations currently in use will remain valid; they will be read-only and cannot be changed. If you delete your existing SSO configuration and create a new one, you'll be provided with a new system-generated SSO slug. This change enhances security and prevents accounts from setting slugs that "impersonate" other organizations.
- **Enhancement**: For users in the default region (`US1`) that previously created a dbt account in the past, the dbt VS Code extension now supports registering with OAuth . This makes it easier to register the extension for users who may have forgotten their password or are locked out of their account. For more information, see [Register the extension](/docs/install-dbt-extension#register-the-extension).
- **New and enhancements:** The dbt [Studio IDE user interface](/docs/cloud/studio-ide/ide-user-interface) has been enhanced to bring more powerful development features to your fingertips:
  -  A newly designed toolbar that groups all of your action and project insight tabs for easy access.
  - A dedicated inline **Commands** tab for history and logs.
  - When you upgrade your development environment to the <Constant name="fusion_engine" />, the environment includes a new **Problems** tab that gives you live error detection on issues that could block your project from running successfully. 

The remaineder of the 2025 release notes have been archived [here](/docs/dbt-versions/2025-release-notes).