---
title: "Service principals"
id: "service-principals"
sidebar_label: "Service principals"
description: "TODO"
availability:
  surface: platform
  access: paid_plan
  minPlan: enterprise
---


<IntroText>
TODO: One or two sentences on what a service principal is (the identity and permissions for a non-human integration) and why you'd use one instead of a bare service token.
</IntroText>

## Service principals vs credentials

TODO: Explain the split with a small table. Principal = who the integration is and what it can do. Credential = the secret it uses to log in (service token now, OAuth client credential later).

## Account vs project service principals

TODO: Table comparing who creates each, where it lives in settings, and what permissions it can have. Note that project principals can't mix in account-level permissions.

## Choose an authentication method

TODO: Short table comparing service token, OAuth client credential and PAT. Say when to use each.

## Create a service principal

TODO: Steps for account admins in account settings. Mention scoping permissions to specific projects or environments.

## Add a credential

TODO: Steps to issue a service token under a principal. Add a note on saving it, since it's shown once. Link OAuth client credentials once they ship.

## Edit a service principal

TODO: How to change the name or permissions. Add the warning that new permissions apply to all its credentials, and that credentials aren't revoked.

## Delete a service principal or revoke a credential

TODO: What the confirmation says, and that deleting a principal deletes all its credentials. Add a note that deleting a project deletes its project-scoped principals.

## Permissions

TODO: Who can create, view and manage principals at each level, and which permission sets are needed. Check against the new `project_service_principal_*` permissions once they're public.

## Existing service tokens

TODO: Say whether customers need to do anything. The PRD says existing tokens migrate with no behavior change. Confirm with the PM.

## Audit log

TODO: List the events for principal and credential create, update and delete. Link to the audit log page.

## FAQs

TODO: Add after review. Likely questions are what happens if the creator leaves and who sees project principals.
