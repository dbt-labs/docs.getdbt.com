---
title: "Licenses and groups"
id: "licenses-and-groups"
---

## Overview

dbt Cloud administrators can use dbt Cloud's permissioning model to control
user-level access in a dbt Cloud account. This access control comes in two flavors:
License-based and Role-based.

- **License-based Access Controls:** User are configured with account-wide
  license types. These licenses control the specific parts of the dbt Cloud application
  that a given user can access.
- **Role-based Access Control (RBAC):** Users are assigned to _groups_ that have
  specific permissions on specific projects or the entire account. A user may be
  a member of multiple groups, and those groups may have permissions on multiple
  projects.

## License-based access control

Each user on an account is assigned a license type when the user is first
invited to a given account. This license type may change over time, but a
user can only have one type of license at any given time.

A user's license type controls the features in dbt Cloud that the user is able
to access. dbt Cloud's three license types are:
 - **Read-Only**
 - **Developer**
 - **IT**

For more information on these license types, see [Seats & Users](/docs/cloud/manage-access/seats-and-users).
At a high-level, Developers may be granted _any_ permissions, whereas Read-Only
users will have read-only permissions applied to all dbt Cloud resources
regardless of the role-based permissions that the user is assigned. IT users will have Security Admin and Billing Admin permissions applied regardless of the role-based permissions that the user is assigned.

## Role-based access control

:::info dbt Cloud Enterprise

Role-based access control is a feature of the dbt Cloud Enterprise plan

:::

Role-based access control allows for <Term id="grain">fine-grained</Term> permissioning in the dbt Cloud
application. With role-based access control, users can be assigned varying
permissions to different projects within a dbt Cloud account. For teams on the
Enterprise tier, role-based permissions can be generated dynamically from
configurations in an [Identity Provider](sso-overview).

Role-based permissions are applied to _groups_ and pertain to _projects_. The
assignable permissions themselves are granted via _permission sets_.


### Groups

A group is a collection of users. Users may belong to multiple groups. Members
of a group inherit any permissions applied to the group itself.

Users can be added to a dbt Cloud group based on their group memberships in the
configured [Identity Provider](sso-overview) for the account. In this way, dbt
Cloud administrators can manage access to dbt Cloud resources via identity
management software like Azure AD, Okta, or GSuite. See _SSO Mappings_ below for
more information.

You can view the groups in your account or create new groups from the **Team > Groups**
page in your Account Settings.

<Lightbox
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/group-list.png"
    title="Viewing a list of groups in the Account Settings page."
/>


### SSO Mappings

SSO Mappings connect Identity Provider (IdP) group membership to dbt Cloud group
membership. When a user logs into dbt Cloud via a supported identity provider,
their IdP group memberships are synced with dbt Cloud. Upon logging in
successfully, the user's group memberships (and therefore, permissions) are
adjusted accordingly within dbt Cloud automatically.

:::tip Creating SSO Mappings

While dbt Cloud supports mapping multiple IdP groups to a single dbt Cloud
group, we recommend using a 1:1 mapping to make administration as simple as
possible. Consider using the same name for your dbt Cloud groups and your IdP
groups.

:::


### Permission Sets

Permission sets are predefined collections of granular permissions. Permission
sets combine low-level permission grants into high-level roles that can be
assigned to groups. Some examples of existing permission sets are:
 - Account Admin
 - Git Admin
 - Job Admin
 - Job Viewer
 - ...and more

For a full list of enterprise permission sets, see [Enterprise Permissions](/docs/cloud/manage-access/enterprise-permissions).
These permission sets are available for assignment to groups and control the ability
for users in these groups to take specific actions in the dbt Cloud application.

In the following example, the _dbt Cloud Owners_ group is configured with the
**Account Admin** permission set on _All Projects_ and the **Job Admin** permission
set on the _Internal Analytics_ project.

<Lightbox
    src="/img/docs/dbt-cloud/dbt-cloud-enterprise/access-control/group-permissions.png"
    title="Configuring permissions for the Admins group"
/>


### Manual assignment

<Changelog>

- New in version 1.1.23 (March, 2021)

</Changelog>

dbt Cloud administrators can manually assign users to groups independently of
IdP attributes. If a dbt Cloud group is configured _without_ any
SSO Mappings, then the group will be _unmanaged_ and dbt Cloud will not adjust
group membership automatically when users log into dbt Cloud via an identity
provider. This behavior may be desirable for teams that have connected an identity
provider, but have not yet configured SSO Mappings between dbt Cloud and the
IdP.

If an SSO Mapping is added to an _unmanaged_ group, then it will become
_managed_, and dbt Cloud may add or remove users to the group automatically at
sign-in time based on the user's IdP-provided group membership information.


## FAQs
- **When are IdP group memberships updated for SSO Mapped groups?** Group memberships
  are updated every time a user logs into dbt Cloud via a supported SSO provider. If
  you've changed group memberships in your identity provider or dbt Cloud, ask your
  users to log back into dbt Cloud for these group memberships to be synchronized.

- **Can I set up SSO without RBAC?** Yes, see the documentation on
  [Manual Assignment](#manual-assignment) above for more information on using
  SSO without RBAC.

- **Can I configure a user's License Type based on IdP Attributes?** Yes, see
  the docs on [managing license types](/docs/cloud/manage-access/seats-and-users#managing-license-types)
  for more information.
