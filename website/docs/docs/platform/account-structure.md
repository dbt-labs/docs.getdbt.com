---
title: "How a dbt account is structured"
id: account-structure
description: "See what lives at the account level and what lives inside each project in the dbt platform."
sidebar_label: "Account structure"
availability:
  surface: platform
  access: login_required
---

<IntroText>
This page shows how a <Constant name="dbt_platform" /> account is organized. Some things, like git and single sign-on (SSO), you set up once for everyone. Others, like environments, you set up inside each project.
</IntroText>

Think of your account as an office building. The front door and security desk are shared by everyone. Each team gets its own floor with its own rooms.

<DocCarousel slidesPerView={1}>

<Lightbox src="/img/docs/dbt-platform/account-structure-account.svg" width="95%" title="The account: what you set up once, and the projects that share it." />

<Lightbox src="/img/docs/dbt-platform/account-structure-project.svg" width="95%" title="Inside a project: the repository, connection profiles, and environments." />

</DocCarousel>

## What lives where

The following table shows where you configure each part of your account.

<SimpleTable>

| Level | What you set up here | How many |
|-------|----------------------|----------|
| Account | [Git integration](/docs/platform/account-integrations) | One per git provider |
| Account | [Single sign-on (SSO)](/docs/platform/manage-access/sso-overview) | One per account |
| Account | [Users, groups, and permissions](/docs/platform/manage-access/about-user-access) | Defined once, then scoped to projects |
| Account | [Security and networking](/docs/platform/secure/about-network-security) | Defined once |
| Account | [Warehouse connections](/docs/platform/connect-data-platform/about-connections#connection-management) | As many as you need |
| Project | Repository | One per project |
| Project | [Connection profiles](/docs/platform/about-profiles) | As many as you need |
| Project | [Environments](/docs/dbt-platform-environments) and jobs | One development environment, plus deployment environments |

</SimpleTable>

## Common mix-ups

These are the things that trip people up most during setup.

- **You don't need a project per environment.** A project isn't "dev" or "prod". Each project an have a development, staging, or production environments. Create a new project when you have a separate codebase or team, not a separate stage. [Refer to [types of environments](/docs/dbt-platform-environments?version=2#types-of-environments) for more info.
- **Integrations are shared by every project.** You connect your git provider and your SSO identity provider once at the account level. You can't set a different one for each project. For example, an account supports [one GitHub application](/docs/platform/git/connect-github), not one per project.
- **Warehouse connections belong to the account, not the project.** Any project can reuse a connection. A connection only reaches a project when you attach it to one of that project's environments.
- **Connection profiles belong to the project.** A profile bundles one connection with deployment credentials and extended attributes. Profiles you create in one project aren't visible in others, and they don't apply to development environments.

## Environments in a project

Each project has the following environment types.

<SimpleTable>
  
| Environment type | How many per project | What it's for | Shows in <Constant name="catalog" /> |
|------------------|----------------------|---------------|------|
| Development | One at most | Building in the <Constant name="studio_ide" /> or <Constant name="platform_cli" /> with your personal credentials | No |
| General | As many as you need | Deployment work like QA, sandboxes, or ad hoc runs | No |
| Staging | One at most | Testing with production tools before changes reach production | Yes |
| Production | One at most | Scheduled and triggered jobs that build your source of truth | Yes |

</SimpleTable>

For more information, refer to [dbt environments](/docs/dbt-platform-environments) and [Deployment environments](/docs/deploy/deploy-environments).

## More than one data platform

One account can hold connections to more than one data platform. Each project picks the connection it needs for each environment. Your git, SSO, users, and security settings stay shared across the whole account.
