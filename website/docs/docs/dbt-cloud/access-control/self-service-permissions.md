---
title: "Self-Service Permissions"
id: "self-service-permissions"
---

## Overview

dbt Cloud supports two different permission sets to manage permissions for self-service accounts: **Member** and **Owner**. The permissions afforded to each role are described below:

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

Users configured with Read Only license types will experience a restricted set of permissions in dbt Cloud. If a user is associated with an member permission set and a Read Only seat license, then they will only have access to what a Read-Only seat allows. See [Seats and Users](cloud-seats-and-users) for more information on the impact of licenses on these permissions.

## Owner and Member Groups in dbt Cloud Enterprise

By default, new users are added to the Member and Owner groups when they onboard to dbt Cloud. This is necessary for account onboarding but can create confusion when initially setting up SSO and RBAC for dbt Cloud Enterprise accounts as described in the [Enterprise Permissions](enterprise-permissions) guide. Owner and Member groups are **account level** groups, so their permissions override any project-level permissions you wish to apply.

We recommend the following steps be taken after onboarding Administrative users and before adding less priveleged users to a dbt Cloud Enterprise account.

1) Click the Hamburger icon at the top left of the Cloud Console, then Account Settings >> Groups >> <Owner/Member>  
2) Click "Edit" in the upper right corner

<Lightbox src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/edit-group.png" title="Editing a Group"/>

3) Scroll to the bottom of the group page
4) Click "Delete"
