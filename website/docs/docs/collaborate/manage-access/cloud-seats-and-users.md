---
title: "Seats and Users"
id: "seats-and-users"
---

## Overview

In dbt Cloud, _seats_ are used to allocate users to your account. There are two
different types of seat licenses in dbt Cloud: _Developer_ and _Read Only_.

The type of license a user is assigned controls which capabilities of dbt
Cloud the user is permitted to access. Users with a Developer license can be
granted access to the Deployment and [Development](/docs/get-started/develop-in-the-cloud) functionality
in dbt Cloud, whereas users with Read Only licenses are intended to view the
[artifacts](docs/dbt-cloud/using-dbt-cloud/artifacts) created in a dbt Cloud account.

| Functionality | Developer User | Read Only Users |
| ------------- | -------------- | --------------- |
| Use the Developer IDE | ✅ | ❌ |
| Use Jobs | ✅ | ❌ |
| Manage Account | ✅ | ❌ |
| API Access | ✅ | ❌ |
| Use [Source Freshness](/docs/deploy/source-freshness) | ✅ | ✅ |
| Use [Docs](/docs/collaborate/build-and-view-your-docs) | ✅ | ✅ |

## Included seats

Each dbt Cloud plan comes with a base number of Developer and Read Only seats.
To add additional seats to your account, navigate to the Billing tab of the
Account Settings page in your dbt Cloud account. Note: accounts on the Developer
plan must upgrade to the Team plan to add additional team members to their
account.

The <Term id="table" /> below shows the base number of Developer and Read Only seats for each
dbt Cloud plan.

| Plan | Developer Seats | Read Only Seats |
| ---- | --------------- | --------------- |
| Developer (free) | 1 | 0 |
| Team | $50/developer/mo | 5 ($0/mo) |
| Enterprise | Custom | Custom |

## Managing license types

Licenses can be assigned manually, or automatically based on IdP configuration
(enterprise only). By default, new users in an account will be assigned a
Developer license.

### Manual configuration

To manually assign a specific type of license to a user on your team, navigate
to the Team page in your Account Settings and click the "edit" button for the user
you want to manage. From this page, you can select the license type and relevant
groups for the user.

**Note:** You will need to have an available license ready
to allocate for the user. If your account does not have an available license to
allocate, you will need to add more seats to your plan to complete the license
change.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-manual.png"
          title="Manually assigning licenses"/>

### Mapped configuration

**Note:** This feature is only available on the Enterprise plan.

If your account is connected to an Identity Provider (IdP) for [Single Sign
On](/docs/collaborate/manage-access/sso-overview), you can automatically map IdP user
groups to specific license types in dbt Cloud. To configure license mappings,
navigate to the Account Settings &gt; Team &gt; License Mappings page. From
here, you can create or edit SSO mappings for both Read Only and Developer
license types.

By default, all new members of a dbt Cloud account will be assigned a Developer
license. To assign Read Only licenses to certain groups of users, create a new
License Mapping for the Read Only license type and include a comma separated
list of IdP group names that should receive a Read Only license at sign-in time.

<Lightbox src="/img/docs/dbt-cloud/access-control/license-mapping.png"
          title="Configuring IdP group license mapping"/>

Usage notes:
- If a user's IdP groups match both a Developer and Read Only license type
  mapping, a Developer license type will be assigned
- If a user's IdP groups do not match _any_ license type mappings, a Developer
  license will be assigned
- License types are adjusted when users sign into dbt Cloud via Single Sign On.
  Changes made to license type mappings will take effect the next time users
  sign in to dbt Cloud.
- License type mappings are based on _IdP Groups_, not _dbt Cloud groups_, so be
  sure to check group memberships in your identity provider when configuring
  this feature.


## Granular permissioning

The dbt Cloud Enterprise plan supports Role-Based access controls for
configuring granular in-app permissions. See [access control](/docs/collaborate/manage-access/about-access)
for more information on Enterprise permissioning.
