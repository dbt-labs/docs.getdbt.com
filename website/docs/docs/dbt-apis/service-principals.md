---
title: "Service principals"
id: "service-principals"
sidebar_label: "Service principals"
description: "Create service principals to give non-human integrations their own identity, permissions, and credentials in dbt."
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---

<IntroText>
A service principal is an identity for a non-human integration, like a CI pipeline or an orchestrator. It holds the permissions; its credentials hold the secrets. Rotate or revoke a credential without losing the permissions behind it.
</IntroText>

Service principals gradually replace [service account tokens](/docs/dbt-apis/service-tokens). With a service token, the permissions and the secret are one thing, so revoking the token throws away the permissions too. A service principal keeps them apart.

## Service principals vs credentials

| | What it is | Example |
|---|---|---|
| Service principal | Who the integration is and what it can do | `airflow-prod` with Job Admin on one project |
| Credential | The secret the integration uses to authenticate | A service token (OAuth client credentials are coming) |

- One service principal can have multiple credentials, so you can rotate without downtime.
- Credentials carry identity only. dbt checks the service principal's permissions on every request.

## Account vs project service principals

Pick the level based on how much access the integration needs.

| | Account service principal | Project service principal |
|---|---|---|
| Scope | Whatever its permissions say, across projects | Exactly one project, set at creation |
| Who can create and manage it | Account admins and owners | Project admins, project creators, account admins, and owners |
| Permission sets | Any | A limited list of project-level sets (see [Permissions](#permissions)) |
| Visible to project admins | No | Yes, for their project |

- A project service principal can't be moved to another project, and it can't become an account service principal.
- If a project needs automation, create a project service principal. Account admins can create those too.

:::note
Project admins can't see account service principals, even when those principals have permissions on their project. Anyone who can issue a token for an account service principal gets all of its access, which can include Account Admin.
:::

## Choose an authentication method

TODO: Short table comparing service token, OAuth client credential, and PAT. Confirm with PM what ships first.

## Create a service principal

<Tabs>

<TabItem value="account" label="Account scoped">

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Click **Service principals**. The **Account scoped** tab lists your account service principals, with who created each one and when it was last used.
3. Click **Create service principal**.
4. Enter a name.
5. Add permissions. Each row is a **Permission set**, the **Project** it applies to, and its **Environment write access**. This works like [group permissions](/docs/platform/manage-access/about-user-access).
6. Click **Save**.

</TabItem>

<TabItem value="project" label="Project scoped">

1. From <Constant name="dbt" />, click your account name in the left side menu and select **Account settings**.
2. Click **Projects** and select the project.
3. Scroll to **Service principals**. You'll see the project's service principals, who created each one, when it was last used, and how many service tokens it has.
4. Click **Create service principal**.
5. Enter a name and add permissions, then click **Save**.

You can also see all project service principals on the **Project scoped** tab of the **Service principals** page.

</TabItem>

</Tabs>

## Add a credential

1. Open the service principal. The **Service tokens** table lists each token's name, who created it, when it was last used, and when it expires.
2. Click **Edit**, then **New service token**. If the service principal has no tokens yet, you can also click **New service token** in the empty state.
3. Copy the token and store it somewhere safe.

TODO: Add the token dialog fields (name, expiry) once the Figma for that step is shared.

:::caution
dbt shows the token once. If you lose it, revoke it and create a new one.
:::

## Edit a service principal

1. Open the service principal and click **Edit**.
2. Change the name or the permissions.
3. Click **Save**, or **Cancel** to discard your changes.

- You can't change the level, the creator, or the project.
- Permission changes apply to every credential on the next request. Credentials aren't revoked or reissued.

:::caution
Adding permissions widens what every existing credential can do. Review the credentials before you save.
:::

## Delete a service principal or revoke a credential

1. Open the service principal and click **Edit**.
2. To revoke a credential, click the trash can icon next to the service token.
3. To delete the service principal, click **Delete**.

| Action | What happens |
|---|---|
| Revoke a credential | That credential stops working. The service principal and its other credentials stay. |
| Delete a service principal | The service principal and all of its credentials stop working. |

- Disabling or deleting a service principal takes effect on the next request.
- Deleting a project also deletes the project service principals scoped to it. TODO: confirm with PM.
- TODO: Once OAuth client credentials ship, add that access tokens already issued can keep working for up to one hour after you revoke the credential.

## Permissions

Who can do what depends on the level.

| Task | Account service principal | Project service principal |
|---|---|---|
| View | Account admins and owners | Project admins and creators on that project, account admins and owners |
| Create and edit | Account admins and owners | Project admins and creators on that project, account admins and owners |
| Add and revoke credentials | Account admins and owners | Project admins and creators on that project, account admins and owners |

TODO: Confirm the final permission names with engineering, because the PRD and the skeleton disagree (`project_service_*` vs `project_service_principal_*`).

Project service principals can only have these project-level permission sets:

- Admin
- Analyst
- Analyst Read
- Cost Insights Admin
- Cost Insights Viewer
- Cost Management Admin
- Cost Management Viewer
- Database Admin
- Developer
- Fusion Admin
- Git Admin
- Job Admin
- Job Creator
- Job Runner
- Job Viewer
- Metadata Only
- Semantic Layer Only
- Stakeholder
- Team Admin

Some of these include account-level permissions, same as when a project admin assigns them to a group.

Two limits to know:

- Project creators can only grant permission sets they hold themselves. They can't grant Admin or the Cost Insights sets.
- Webhooks Only isn't available for project service principals.

## Existing service tokens

TODO: Say whether customers need to do anything. The PRD says every machine token ends up on a service principal and existing tokens keep working. Confirm with the PM.

## Managed service principals

Some features create their own service principals, like SCIM and Git webhooks.

- You can't see, edit, or delete them in the service principals list.
- SCIM tokens stay on the SCIM settings page.
- They show up as the actor in the [audit log](/docs/platform/manage-access/audit-log), for example "SCIM" or "Git webhooks".

## Audit log

TODO: List the events for principal and credential create, update, and delete once engineering confirms the names. Link to the [audit log](/docs/platform/manage-access/audit-log) page.

## FAQs

TODO: Add after review. Likely questions: what happens if the creator leaves, and who sees project service principals.
