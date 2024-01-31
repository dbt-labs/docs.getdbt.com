---
title: "New: Override dbt version with new User development settings"
description: "January 2024: Test new dbt features on your user account before safely upgrading the dbt version in the development environment."
sidebar_label: "New: Override dbt version"
sidebar_position: 06
tags: [Jan-2024]
date: 2024-01-31
---

You can now [override the dbt version](/docs/dbt-versions/upgrade-core-in-cloud#override-dbt-version) that's configured for the development environment within your project and use a different version &mdash; affecting only your user account. This lets you test new dbt features without impacting other people working on the same project. And when you're satisfied with the test results, you can safely upgrade the dbt version for your project(s).  

The **dbt version** dropdown is available from the **User development settings** section in the project's credentials. For example:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" title="Example of overriding the dbt version on your user account"/>

