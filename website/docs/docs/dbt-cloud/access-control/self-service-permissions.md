---
title: "Self-Service Permissions"
id: "self-service-permissions"
---

## Overview

dbt Cloud supports two different permission sets to manage permissions for self-service accounts: **Member** and **Owner**. The permissions afforded to each role are described below.

**Note:** Users configured with Read Only license types will experience a restricted set of permissions in dbt Cloud. If a user is associated with an member permission set and a Read Only seat license, then they will only have access to what a Read-Only seat allows. See [Seats and Users](cloud-seats-and-users) for more information on the impact of licenses on these permissions.

| Action | Member | Owner |
| ------ | ------ | ----- |
| View and edit resources | ✅ | ✅ |
| Trigger runs | ✅ | ✅ |
| Access the IDE | ✅ | ✅ |
| Invite Members to the account | ✅ | ✅ |
| Manage billing | ❌ | ✅ |
| Manage team permissions | ❌ | ✅ |
| Invite Owners to the account | ❌ | ✅ |
