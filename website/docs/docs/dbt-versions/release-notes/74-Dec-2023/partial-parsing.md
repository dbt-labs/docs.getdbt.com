---
title: "New: Native support for partial parsing"
description: "December 2023: For faster run times with your dbt invocations, configure dbt Cloud to parse only the changed files in your project."
sidebar_label: "New: Native support for partial parsing"
sidebar_position: 09
tags: [Dec-2023]
date: 2023-12-14
---

By default, dbt parses all the files in your project at the beginning of every dbt invocation. Depending on the size of your project, this operation can take a long time to complete. With the new partial parsing feature in dbt Cloud, you can reduce the time it takes for dbt to parse your project. When enabled, dbt Cloud parses only the changed files in your project instead of parsing all the project files. As a result, your dbt invocations will take significantly less time to run.

To learn more, refer to [Partial parsing](/docs/deploy/deploy-environments#partial-parsing).

<Lightbox src="/img/docs/deploy/example-account-settings.png" width="85%" title="Example of the Partial parsing option" />

