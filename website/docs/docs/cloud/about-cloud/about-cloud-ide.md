---
title: "About Studio IDE"
id: about-cloud-ide
description: "about dbt Studio Integrated Development Environment"
sidebar_label: About dbt Studio IDE
---

The <Constant name="cloud" /> integrated development environment (<Constant name="cloud_ide" />) is a single interface for building, testing, running, and version-controlling dbt projects from your browser. With the Cloud <Constant name="cloud_ide" />, you can compile dbt code into SQL and run it against your database directly.

With the Cloud <Constant name="cloud_ide" />, you can:

- Write modular SQL models with select statements and the ref() function,
- Compile dbt code into SQL and execute it against your database directly,
- Test every model before deploying them to production,
- Generate and view documentation of your dbt project,
- Leverage git and version-control your code from your browser with a couple of clicks,
- Create and test Python models:
    * Compile Python models to see the full function that gets executed in your data platform
    * See Python models in DAG in dbt version 1.3 and higher
    * Currently, you can't preview python models
- Visualize a directed acyclic graph (DAG), and more.

<Lightbox src src="/img/docs/dbt-cloud/cloud-ide/cloud-ide-v2.png" width="85%" title="The Studio IDE in dark mode"/>

For more information, read the complete [Cloud <Constant name="cloud_ide" /> guide](/docs/cloud/studio-ide/develop-in-studio).

## Related docs

- [<Constant name="cloud_ide" /> user interface](/docs/cloud/studio-ide/ide-user-interface)
- [Keyboard shortcuts](/docs/cloud/studio-ide/keyboard-shortcuts)
