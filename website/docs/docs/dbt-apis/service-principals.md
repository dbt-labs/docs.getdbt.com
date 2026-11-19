---
title: "Service principals"
id: "service-principals"
sidebar_label: "Service principals"
description: "Create service principals to give non-human integrations their own identity, permissions, and tokens in dbt."
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

<IntroText>
A service principal is an identity for a non-human integration, like a CI pipeline. It holds the permissions, and its service tokens hold the secrets. Revoke a token without losing the permissions behind it.
</IntroText>

Service principals gradually replace [service account tokens](/docs/dbt-apis/service-tokens). With a service token alone, revoking the token throws away its permissions too.

## How it works

- A service principal can have multiple service tokens, so you can rotate a token without downtime.
- Tokens only prove who's calling. dbt checks the service principal's permissions on every request, so permission changes, disabling, and deleting apply on the next request.

## Account vs project service principals

| | Account scoped | Project scoped |
|---|---|---|
| Access | Any permission set, across projects | One project, set when you create it |
| Who manages it | Account admins and owners | Project admins, project creators, account admins, and owners |
| Visible to project admins | No | Yes, for their project |

- You can't change a service principal's scope or project after you create it.
- Project admins can't see account service principals, because a token carries all of the principal's access, which can include Account Admin. If a project needs automation, create a project scoped service principal.

## Create a service principal

<Tabs>

<TabItem value="account" label="Account scoped">

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Click **Service principals**, then **Create service principal**.
3. Enter a name.
4. Add permissions. Each row is a **Permission set**, a **Project**, and **Environment write access**.
5. Click **Save**.

</TabItem>

<TabItem value="project" label="Project scoped">

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Click **Projects** and select the project.
3. Under **Service principals**, click **Create service principal**.
4. Enter a name and add permissions.
5. Click **Save**.

</TabItem>

</Tabs>

Project scoped service principals can only use these permission sets: Admin, Analyst, Analyst Read, Cost Insights Admin, Cost Insights Viewer, Cost Management Admin, Cost Management Viewer, Database Admin, Developer, Fusion Admin, Git Admin, Job Admin, Job Creator, Job Runner, Job Viewer, Metadata Only, Semantic Layer Only, Stakeholder, and Team Admin.

Project creators can only grant permission sets they hold themselves, so they can't grant Admin or the Cost Insights sets.

## Add a service token

1. Open the service principal and click **Edit**.
2. Click **New service token**.
3. Copy the token and store it somewhere safe.

:::caution
dbt shows the token once. If you lose it, revoke it and create a new one.
:::

TODO: Add token dialog fields (name, expiry) once the Figma is shared.

## Edit a service principal

1. Open the service principal and click **Edit**.
2. Change the name or permissions.
3. Click **Save**.

New permissions apply to all of its tokens on the next request. Tokens aren't revoked or reissued, so check them before you add permissions.

## Revoke a token or delete a service principal

1. Open the service principal and click **Edit**.
2. To revoke a token, click the trash can icon next to it.
3. To delete the service principal, click **Delete**. This stops all of its tokens.

## Managed service principals

Some features, like SCIM and Git webhooks, create their own service principals. You can't see or edit them in the list. They appear in the [audit log](/docs/platform/manage-access/audit-log) as the actor, for example "SCIM".

## Existing service tokens

TODO: Confirm with the PM whether customers need to do anything. The PRD says existing tokens keep working.

## Audit log

TODO: List the service principal and token events once engineering confirms the names.
