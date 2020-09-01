---
title: "Seats and Users"
id: "cloud-seats-and-users"
---

## Overview

In dbt Cloud, _seats_ are used to allocate users to your account. There are two different types of seat licenses in dbt Cloud: _Developer_ and _Read Only_ .

The type of license a user is assigned to controls which capabilities of dbt Cloud the user is permitted to access. Developers are granted access to the Deployment and [Development](the-dbt-ide) functionality in dbt Cloud, whereas Read Only users are not. 

| Functionality | Developer User | Read Only Users |
| ------------- | -------------- | --------------- |
| Use the Developer IDE | ✅ | ❌ |
| Use Jobs | ✅ | ❌ |
| Manage Account | ✅ | ❌ |
| API Access | ✅ | ❌ |
| Use [Source Freshness](cloud-snapshotting-source-freshness) | ✅ | ✅ |
| Use [Docs](cloud-generating-documentation) | ✅ | ✅ |

## Included seats

Each dbt Cloud plan comes with a base number of  Developer and Read Only seats. To add additional seats to your account, navigate to the Billing tab of the Account Settings page in your dbt Cloud account. Note: accounts on the Developer plan must upgrade to the Team plan to add additional team members to their account.

The table below shows the base number of Developer and Read Only seats for each dbt Cloud plan.

| Plan | Developer Seats | Read Only Seats |
| ---- | --------------- | --------------- |
| Developer (free) | 1 | 0 |
| Team | $50/developer/mo | 50 ($0/mo) |
| Enterprise | Custom | Custom |

## Changing user license types

To change the license type for users on your team, navigate to the Team page in your account settings and change the click the "edit" button for the user you want to manage. On this page, you can configure the license type and role for the user. **Note:** you will need to already have an available license ready for the user. If you do not, you may need to upgrade your account (or add more seats to your plan) in order to complete a license change.
