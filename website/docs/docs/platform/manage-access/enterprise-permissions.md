---
title: "Enterprise permissions"
id: "enterprise-permissions"
description: "Permission sets for Enterprise plans."
hide_table_of_contents: true #For the sake of the tables on this page
pagination_next: null
---

# Enterprise permissions <Lifecycle status="managed,managed_plus" />

import Permissions from '/snippets/_enterprise-permissions-table.md';
import SetUpPages from '/snippets/_available-enterprise-only.md';

<SetUpPages features={'/snippets/_available-enterprise-only.md'}/>

The <Constant name="dbt" /> Enterprise and Enterprise+ plans support a number of pre-built permission sets to help manage access controls within a <Constant name="dbt" /> account. See the docs on [access control](/docs/platform/manage-access/about-user-access) for more information on Role-Based access control (RBAC).


## Permission sets

The following permission sets are available for assignment in all <Constant name="dbt" /> Enterprise-tier accounts. They can be granted to <Constant name="dbt" /> groups and then to users. A <Constant name="dbt" /> group can be associated with more than one permission set. Permission assignments with more access take precedence. 

Access to <Constant name="dbt" /> features and functionality is split into `account-level` and `project-level` permission sets. Account-level permissions are primarily for account administration (inviting users, configuring SSO, and creating groups). Project-level permissions are for the configuration and maintenance of the projects themselves (configuring environments, accessing IDE, and running jobs). Account permission sets may have access to project features, and project permission sets may have access to account features. Check out the [permissions tables](/docs/platform/manage-access/enterprise-permissions#account-permissions) to compare sets and their access. 

<Expandable alt_header="Account admin">

The Account admin permission set is the highest level of access and control over your <Constant name="dbt" /> account and projects. We recommend limiting the number of users and groups assigned the account admin permission set.

Notable features:
- Account admin is an account-level set.
- Unrestricted access to every feature.
- The default permissions for every user who creates a new <Constant name="dbt" /> account.
- The default permissions assigned to the `Owner` group.

</Expandable>
<Expandable alt_header="Admin">

The Admin permission set is intended for project administration but with limited account-level access to invite and assign users. 

Notable features:
- Admin is a project-level set.
- Unrestricted access to existing projects, but can't create new projects.
- Can invite new members and assign access but can't create groups.
- Can access <Constant name="catalog" />.
- The default permissions assigned to the `Member` group.

</Expandable>
<Expandable alt_header="Analyst">

The Analyst permission set is designed for users who need to run and analyze dbt models in the IDE but can't create or edit anything outside the IDE. 

Notable features:
- Analyst is a project-level set.
- Full access to the IDE and the ability to configure personal credentials for adapters and Git. 
- Read-only access to environment configs.
- Can view jobs but can't edit them.
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Billing admin">

The Billing admin permission set can review product usage information that impacts the final billing of <Constant name="dbt" /> (for example, models run).

Notable features:
- Billing admin is an account-level set.
- Unrestricted access to the **Billing** section of your **Account settings**. 
- Read access to public models. 
- No other access. 

</Expandable>

<Expandable alt_header="Cost Insights Admin">

The Cost Insights Admin permission set provides the minimum permissions needed to configure and manage [Cost Insights](/docs/explore/cost-insights) settings and view cost data.

Notable features:
- Cost Insights Admin is both an account-level and project-level set.
- Can configure platform metadata credentials and Cost Insights settings in connection settings.
- Can view cost and savings data across projects, models, and jobs.
- Read-only access to connections, projects, jobs, and metadata.
- Can access dbt <Constant name="catalog" />.

</Expandable>

<Expandable alt_header="Cost Insights Viewer">

The Cost Insights Viewer permission set provides read-only access to [Cost Insights](/docs/explore/cost-insights) data with the minimum permissions needed to view estimated cost and reduction information.

Notable features:
- Cost Insights Viewer is both an account-level and project-level set.
- Read-only access to cost and savings data across projects, models, and jobs.
- Read-only access to connections, platform metadata credentials, projects, jobs, and metadata.
- Cannot configure or edit Cost Insights settings.
- Can access dbt <Constant name="catalog" />.

</Expandable>

<Expandable alt_header="Database admin">

Database admins manage configurations between <Constant name="dbt" /> and the underlying databases. 

Notable features: 
- Database admin is a project-level set. 
- Can set up and maintain environment variables and <Constant name="semantic_layer" /> configs.
- Write access to data platform configurations within environments (credentials, warehouse, schema per environment).
- Helpful for scenarios where your data warehouse admins only need access to <Constant name="dbt" /> to configure data platform settings within environments.
- Read-only access to account-level connections, Git repo, job, and run settings. 
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Developer">

The Developer permission set is intended for users who build and maintain dbt models under development and manage production behavior. This is the primary permission set for users working in the IDE and should not be conflated with the [Developer license](/docs/platform/manage-access/seats-and-users#licenses).

Notable features:
- Developer is a project-level set.
- Can create, edit, and test dbt code in the IDE.
- Read-only access to the underlying configs for environments, jobs, runs, and Git.
- Users manage their credentials to data warehouses and Git. 
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Fusion admin">

This permission set enables users to interact with <Constant name="fusion"/> upgrade workflows. We recommend limiting this permission to users who are actively [working on migrating](/guides/upgrade-to-fusion?step=1) a project to <Constant name="fusion"/>.

By default, all users can access the <Constant name="fusion"/> upgrade experience. When the upgrade permissions setting is enabled, only users with the **Fusion admin** or **Account admin** permission set can perform upgrades. If the setting is disabled (no check mark), upgrades are not restricted.

- **Fusion admin** &mdash; Assign to user accounts only. Cannot be assigned to service tokens.
- **Account admin** &mdash; Assign to user accounts or service tokens. Allows both users and service tokens to perform upgrades.

For more information, refer to [Upgrade to dbt <Constant name="fusion"/>](/docs/dbt-versions/upgrade-dbt-platform-version#dbt-fusion-engine).

</Expandable>
<Expandable alt_header="Git admin">

Git admins manage Git repository integrations and cloning.

Notable features:
- Git admin is a project-level set.
- Can create new Git integrations and environment variables.
- Can edit project settings.
- Read-only access to account settings (including users and groups). 
- No access to the IDE.
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Job admin">
Job admin is an administrative permission set for users who create, run, and manage jobs in <Constant name="dbt" />.

Notable features:
- Job admin is a project-level set.
- Job admins can create and edit jobs, runs, environment variables, and data warehouse configs. 
- Job admins can set up project integrations, including [Tableau lineage](/docs/platform-integrations/semantic-layer/tableau).
- Read-only access to project configs. 
- Read-only access to connections and public models.
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Job runner">

Job runner is a specialized permission set for users who need access to run jobs and view the outcomes. 

Notable features:
- Job runner is a project-level set.
- Can run jobs.
- Has read-only access to jobs, including status and results.
- No other access to <Constant name="dbt" /> features. 

</Expandable>
<Expandable alt_header="Job viewer">

Job viewer enables users to monitor and review job executions within <Constant name="dbt" />. Users with this role can see jobs’ status, logs, and outcomes but cannot initiate or modify them. 

Notable features:
- Job viewer is a project-level set.
- Read-only access to job results, status, and logs.
- No other access to <Constant name="dbt" /> features. 
- Can access <Constant name="catalog" />.

</Expandable>

<Expandable alt_header="Manage marketplace apps">
Manage marketplace apps is a specialized permission set associated with <Constant name="dbt" /> marketplace apps. Usually implemented for the Snowflake Native App.

Notable features:
- Manage marketplace apps is an account-level set.
- Used exclusively for marketplace app integrations. 
- Not intended for general user/group assignment.

</Expandable>
<Expandable alt_header="Metadata (Discovery API only)">

Metadata is intended to be a read-only [Discovery API](/docs/dbt-apis/discovery-api) integration permission set. 

Notable features:
- Metadata is a project-level set.
- Grants read-only access to metadata related to dbt models, runs, sources, and tests.
- No access to modify, execute, or manage dbt jobs, repositories, or users.
- No other access to <Constant name="dbt" /> features.

</Expandable>
<Expandable alt_header="Project creator">

The Project creator permission set can create, configure, and set up new projects. It is recommended for the admin of teams that will own a project. 

Notable features:
- Project creator is an account-level set.
- Only permission set other than Account admin that can create projects.
- Limited account settings access. The project creator can create and edit connections, invite users, create groups, and assign licenses.
- Unrestricted access to project configurations. 
- Can access <Constant name="catalog" />

</Expandable>
<Expandable alt_header="Security admin">

Security admins have limited access to the security settings and policies for the <Constant name="dbt" /> account. This is intended for members of a security team who need to ensure compliance with security standards and oversee the implementation of best security practices across the account. The [IT license-type](/docs/platform/manage-access/seats-and-users#licenses) includes this permission set by default. 

Notable features:
- Security admin is an account-level set. 
- Can create and edit users and groups and assign licenses.
- Can create and edit authentication and SSO settings. 
- Can create and edit IP restrictions, view service tokens, and manage user access controls. 
- No access to jobs, runs, environments, or the IDE.
  
</Expandable>
<Expandable alt_header="Semantic Layer">

A specialized permission set with strict access to only query the <Constant name="semantic_layer" /> using a service token. 

Notable features:
- <Constant name="semantic_layer" /> is a project-level set.
- Can only query <Constant name="semantic_layer" />.
- No other access to <Constant name="dbt" /> features. 

</Expandable>
<Expandable alt_header="Stakeholder and Read-Only">

The Stakeholder and Read-Only are identical permission sets that are similar to Viewer, but without access to sensitive content such as account settings, billing information, or audit logs. Useful for personas who need to monitor projects and their configurations.

Notable features: 
- Stakeholder is a project-level set.
- Read-only access to projects, environments, jobs, and runs.
- Read-only access to user and group information.
- Can access <Constant name="catalog" />.
- No access to the IDE.
- Limited access to audit log content that excludes sensitive information, such as user settings and account-level changes.

</Expandable>
<Expandable alt_header="Team admin">
Team admin is an administrative permission set intended for team leaders or similar personas. The permissions grants the ability to manage projects for the team. 

Notable features: 
- Team admin is a project-level set. 
- Access to manage the project(s) for a team of users. Limited scope and access can be extended via environment permissions. 
- Read-only access to many account settings (excluding sensitive content like billing and auth providers).
- Can access <Constant name="catalog" />.

</Expandable>
<Expandable alt_header="Viewer">
The Account Viewer permissions set provides read-only access to the <Constant name="dbt" /> account. Useful for any persona who needs insights into your <Constant name="dbt" /> account without access to create or change configurations.

The Viewer permission set is frequently paired with the [Read-only license-type](/docs/platform/manage-access/seats-and-users).

Notable features:
- Viewer is an account-level set.
- Read-only access to all settings, projects, environments, and runs.
- Read-only access to audit logs, including sensitive account-level information.
- No access to the IDE. 
- Can access <Constant name="catalog" />

</Expandable>

import LicenseOverrideNote from '/snippets/_license-override-note.md';

<LicenseOverrideNote />

<Permissions feature={'/snippets/_enterprise-permissions-table.md'} />

## Additional resources

- [Grant users access](/docs/platform/manage-access/about-user-access#grant-access)
- [Role-based access control](/docs/platform/manage-access/about-user-access#role-based-access-control-)
- [Environment-level permissions](/docs/platform/manage-access/environment-permissions)

