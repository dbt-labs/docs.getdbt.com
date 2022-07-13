---
title: "Self-Service Permissions"
id: "self-service-permissions"
---

## Overview

dbt Cloud supports two different permission sets to manage permissions for self-service accounts: **Member** and **Owner**.  

The permissions afforded to each role are described below:

| Action | Member | Owner |
| ------ | ------ | ----- |
| View and edit resources | ✅ | ✅ |
| Trigger runs | ✅ | ✅ |
| Access the IDE | ✅ | ✅ |
| Invite Members to the account | ✅ | ✅ |
| Manage billing | ❌ | ✅ |
| Manage team permissions | ❌ | ✅ |
| Invite Owners to the account | ❌ | ✅ |

## Read Only vs. Developer License Types

Users configured with Read Only license types will experience a restricted set of permissions in dbt Cloud. If a user is associated with a _Member_ permission set and a Read Only seat license, then they will only have access to what a Read-Only seat allows. See [Seats and Users](cloud-seats-and-users) for more information on the impact of licenses on these permissions.

## Owner and Member Groups in dbt Cloud Enterprise  

By default, new users are added to the Member and Owner groups when they onboard to a new dbt Cloud. Member and Owner groups are included with every new dbt Cloud account. They're used to provide access for Administrators to add additional users, groups and apply permission sets. This is necessary for account onboarding but can create confusion when initially setting up SSO and RBAC for dbt Cloud Enterprise accounts as described in the [Enterprise Permissions](enterprise-permissions) guide. Owner and Member groups are **account level** groups, so their permissions override any project-level permissions you wish to apply.

After onboarding Administrative users and configuring RBAC/SSO groups, we recommend the following steps for onboarding users to a dbt Cloud Enterprise account.

### Create Account Admins Group

**Important:** Do this BEFORE proceeding to the next section

1) Create an Account Admins group  
2) Assign at least one user to the Account Admins

The assigned user will manage future group, SSO mapping and user / group assignment.

### Remove the Owner and Member groups

Follow the steps below for each of the Owner and Member groups in turn:

1) Click the Hamburger icon at the top left of the Cloud Console, then Account Settings >> Groups >> <Owner/Member>  
2) Click "Edit" in the upper right corner

<Lightbox src="/img-next/docs/dbt-cloud/dbt-cloud-enterprise/access-control/edit-group.png" title="Editing a Group"/>

3) Scroll to the bottom of the group page  
4) Click "Delete"

From here, the Account Admin can add additional SSO mapping groups, permission sets and users as needed.
