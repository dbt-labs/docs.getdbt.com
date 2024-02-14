---
title: "New: Override dbt version with new User development settings"
description: "February 2024: Test new dbt features on your user account before safely upgrading the dbt version in your development environment."
sidebar_label: "New: Override dbt version"
sidebar_position: 10
tags: [Feb-2024]
date: 2024-02-02
---

You can now [override the dbt version](/docs/dbt-versions/upgrade-dbt-version-in-cloud#override-dbt-version) that's configured for the development environment within your project and use a different version &mdash; affecting only your user account. This lets you test new dbt features without impacting other people working on the same project. And when you're satisfied with the test results, you can safely upgrade the dbt version for your project(s).  

Use the **dbt version** dropdown to specify the version to override with. It's available on your project's credentials page in the **User development settings** section. For example:

<Lightbox src="/img/docs/dbt-cloud/cloud-configuring-dbt-cloud/choosing-dbt-version/example-override-version.png" title="Example of overriding the dbt version on your user account"/>

