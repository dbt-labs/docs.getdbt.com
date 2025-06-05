---
title: "Self-service Starter account permissions"
description: "Learn how dbt administrators can use self-service permissions to control access in a dbt Starter account."
sidebar_label: "Starter permissions"
id: "self-service-permissions"
---

Self-service Starter accounts are a quick and easy way to get <Constant name="cloud" /> up and running for a small team. 

For teams looking to scale and access advanced features like SSO, group management, and support for larger user bases, upgrading to an [Enterprise-tier](/docs/cloud/manage-access/enterprise-permissions) account unlocks these capabilities &mdash; if you're interested in upgrading, contact [dbt Labs today](https://www.getdbt.com/contact).

## Groups and permissions

Groups determine a user's permission and there are three groups are available for the Starter plan <Constant name="cloud" /> accounts: Owner, Member, and Everyone. The first Owner user is the person who created the <Constant name="cloud" /> account. 

New users are added to the Member and Everyone groups when they onboard but this can be changed when the invitation is created. These groups only affect users with a [Developer license](#licenses) assigned. 

The group access permissions are as follows:

- **Owner** &mdash; Full access to account features.
- **Member** &mdash; Robust access to the account with restrictions on features that can alter billing or security.
- **Everyone** &mdash; A catch-all group for all users in the account. This group does not have any permission assignments beyond the user's profile. Users must be assigned to either the Member or Owner group to work in <Constant name="cloud" />. 

## Licenses

You assign licenses to every user onboarded into <Constant name="cloud" />. You only assign Developer-licensed users to the Owner and Member groups. The groups have no impact on Read-only or IT licensed users.

There are three license types:

- **Developer** &mdash; The default license. Developer licenses don't restrict access to any features, so users with this license should be assigned to either the Owner or Member group. You're allotted up to 8 developer licenses per account.
- **Read-Only** &mdash; Read-only access to your project, including environments <Constant name="explorer" />. Doesn't have access to account settings at all. Functions the same regardless of group assignments. You're allotted up to 5 read-only licenses per account.
- **IT** &mdash; Partial access to the account settings including users, integrations, billing, and API settings. Cannot create or edit connects or access the project at all. Functions the same regardless of group assignments. You're allocated 1 seat per account.

See [Seats and Users](/docs/cloud/manage-access/seats-and-users) for more information on the impact of licenses on these permissions.

## Table of groups, licenses, and permissions

Key:

* (W)rite &mdash; Create new or modify existing. Includes `send`, `create`, `delete`, `allocate`, `modify`, and `read`.
* (R)ead &mdash; Can view but can not create or change any fields.
* No value &mdash; No access to the feature.

Permissions:

* [Account-level permissions](#account-permissions-for-account-roles) &mdash; Permissions related to management of the <Constant name="cloud" /> account. For example, billing and account settings.
* [Project-level permissions](#project-permissions-for-account-roles) &mdash; Permissions related to the projects in <Constant name="cloud" />. For example, <Constant name="explorer" /> and the <Constant name="cloud_ide" />.

The following tables outline the access that users have if they are assigned a Developer license and the Owner or Member group, Read-only license, or IT license.

#### Account permissions for account roles

| Account-level permission| Owner | Member | Read-only license|  IT license  |
|:------------------------|:-----:|:------:|:----------------:|:------------:|
| Account settings        |   W   |   W    |         -        |       W      |
| Billing                 |   W   |   -    |         -        |       W      |
| Invitations             |   W   |   W    |         -        |       W      |
| Licenses                |   W   |   R    |         -        |       W      |
| Users                   |   W   |   R    |         -        |       W      |
| Project (create)        |   W   |   W    |         -        |       W      |
| Connections             |   W   |   W    |         -        |       W      |
| Service tokens          |   W   |   -    |         -        |       W      |
| Webhooks                |   W   |   W    |         -        |       -      |
 
#### Project permissions for account roles

|Project-level permission | Owner | Member  | Read-only | IT license |
|:------------------------|:-----:|:-------:|:---------:|:----------:|
| Adapters                |   W   |    W    |    R      |      -      |
| Connections             |   W   |    W    |    R      |      -      |
| Credentials             |   W   |    W    |    R      |      -      |
| Custom env. variables   |   W   |    W    |    R      |      -      |
| Develop (<Constant name="cloud_ide" /> or <Constant name="cloud" /> CLI)| W |  W    |    -      |      -      |
| Environments            |   W   |    W    |    R      |      -      |
| Jobs                    |   W   |    W    |    R      |      -      |
| <Constant name="explorer" />            |   W   |    W    |    R      |      -      |
| Permissions             |   W   |    R    |    -      |      -      |
| Profile                 |   W   |    W    |    R      |      -      |
| Projects                |   W   |    W    |    R      |      -      |
| Repositories            |   W   |    W    |    R      |      -      |
| Runs                    |   W   |    W    |    R      |      -      |
| <Constant name="semantic_layer" /> Config   |   W   |    W    |    R      |      -      |
