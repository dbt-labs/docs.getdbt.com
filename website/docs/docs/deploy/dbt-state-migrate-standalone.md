---
title: "Migrating from the standalone app to dbt platform"
sidebar_label: "Migrate from standalone app"
description: "Step-by-step guide for migrating from the standalone dbt State app to a dbt platform account."
id: "dbt-state-migrate-standalone"
tags: ['dbt State']
---

# Migrating from the standalone app to dbt platform <Lifecycle status="preview" />

The standalone dbt State app is no longer accepting new sign-ups. Existing users can still access their account, but we recommend migrating to a <Constant name="dbt_platform" /> account to take advantage of platform integrations.
<!--this page needs more info eg which plan should users select-->

## Prerequisites

- An existing standalone dbt State (`app.state.dbt.com`) account
- A [supported dbt version and data platform](/docs/deploy/dbt-state-setup#prerequisites)

## Migrating to dbt platform

1. Sign up for a [<Constant name="dbt_platform" /> account](https://www.getdbt.com/pricing).

2. Follow the [dbt State setup guide](/docs/deploy/dbt-state-setup) to enable dbt State on your account.

3. Have your team members run [`dbt login`](/reference/commands/login) to authenticate.
