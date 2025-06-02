---
title: Can I set a different connection at the environment level?
description: "Separate projects for different environments workaround"
sidebar_label: 'Set different database connections at environment level'
id: diff-database-environment
---

<Constant name="cloud" /> supports [Connections](/docs/cloud/connect-data-platform/about-connections#connection-management), available to all <Constant name="cloud" /> users. Connections allows different data platform connections per environment, eliminating the need to duplicate projects. Projects can only use multiple connections of the same warehouse type. Connections are reusable across projects and environments.

In dbt Core, you can maintain separate production and development environments through the use of [`targets`](/reference/dbt-jinja-functions/target) within a [profile](/docs/core/connect-data-platform/profiles.yml). dbt Core users can define different targets in their profiles.yml, which means you can have targets for different data warehouses for the same profile.
