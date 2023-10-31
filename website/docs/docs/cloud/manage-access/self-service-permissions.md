---
title: "Self-service permissions"
description: "Learn how dbt Cloud administrators can use self-service permissions to control access in a dbt Cloud account."
id: "self-service-permissions"
---

dbt Cloud supports two different permission sets to manage permissions for self-service accounts: **Member** and **Owner**.  

The permissions afforded to each role are described below:

| Action | Member | Owner |
| ------ | ------ | ----- |
| View and edit resources | ✅ | ✅ |
| Trigger runs | ✅ | ✅ |
| Access the dbt Cloud IDE | ✅ | ✅ |
| Access the dbt Cloud CLI | ✅ | ✅ |
| Invite Members to the account | ✅ | ✅ |
| Manage billing | ❌ | ✅ |
| Manage team permissions | ❌ | ✅ |
| Invite Owners to the account | ❌ | ✅ |

## Read-Only vs. Developer License Types

Users configured with Read-Only license types will experience a restricted set of permissions in dbt Cloud. If a user is associated with a _Member_ permission set and a Read-Only seat license, then they will only have access to what a Read-Only seat allows. See [Seats and Users](/docs/cloud/manage-access/seats-and-users) for more information on the impact of licenses on these permissions.

## Owner and Member Groups in dbt Cloud Enterprise  

By default, new users are added to the Member and Owner groups when they onboard to a new dbt Cloud account. Member and Owner groups are included with every new dbt Cloud account because they provide access for administrators to add users and groups, and to apply permission sets.

You will need owner and member groups to help with account onboarding, but these groups can create confusion when initially setting up SSO and RBAC for dbt Cloud Enterprise accounts as described in the [Enterprise Permissions](enterprise-permissions) guide. Owner and Member groups are **account level** groups, so their permissions override any project-level permissions you wish to apply.

After onboarding administrative users and configuring RBAC/SSO groups, we recommend the following steps for onboarding users to a dbt Cloud Enterprise account.


### Prerequisites

You need to create an Account Admins group before removing any other groups.

1. Create an Account Admins group.  
2. Assign at least one user to the Account Admins group. The assigned user can manage future group, SSO mapping, and user or group assignment.

### Remove the Owner and Member groups

Follow these steps for both Owner and Member groups:

1. Log into dbt Cloud.
2. Click the gear icon at the top right and select **Account settings**.
3. Select **Groups** then select **OWNER** or **MEMBER**** group.  
4. Click **Edit**.
5. At the bottom of the Group page, click **Delete**.

The Account Admin can add additional SSO mapping groups, permission sets, and users as needed.
