--- 
title: "About dbt Canvas" 
id: canvas      
sidebar_label: "About dbt Canvas" 
description: "dbt Canvas enables you to quickly create and visualize dbt models through a visual, drag-and-drop experience inside of dbt." 
pagination_next: "docs/cloud/canvas-interface"
pagination_prev: null
image: /img/docs/dbt-cloud/canvas/canvas.png
---

import Prerequisites from '/snippets/_canvas-prerequisites.md';

# About Canvas <Lifecycle status='managed,managed_plus'/> 

<p style={{ color: '#717d7d', fontSize: '1.1em' }}>
<Constant name="visual_editor" /> helps you quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation.
</p>

<Constant name="visual_editor" /> allows organizations to enjoy the many benefits of code-driven development—such as increased precision, ease of debugging, and ease of validation &mdash; while retaining the flexibility to have different contributors develop wherever they are most comfortable. Users can also take advantage of built-in AI for custom code generation, making it an end-to-end frictionless experience.

These models compile directly to SQL and are indistinguishable from other dbt models in your projects:
- Visual models are version-controlled in your backing <Constant name="git" /> provider.
- All models are accessible across projects in [<Constant name="mesh" />](/best-practices/how-we-mesh/mesh-1-intro).
- Models can be materialized into production through [<Constant name="cloud" /> orchestration](/docs/deploy/deployments), or be built directly into a user's development schema.
- Integrate with [<Constant name="explorer" />](/docs/explore/explore-projects) and the [<Constant name="cloud_ide" />](/docs/cloud/studio-ide/develop-in-studio).

<Lightbox src="/img/docs/dbt-cloud/canvas/canvas.png" width="90%" title="Create or edit dbt models with Canvas, enabling everyone to develop with dbt through a drag-and-drop experience inside of dbt." />

<Prerequisites feature={'/snippets/_canvas-prerequisites.md'} />

## Feedback

Please note, always review AI-generated code and content as it may produce incorrect results.

To give feedback, please reach out to your dbt Labs account team. We appreciate your feedback and suggestions as we improve <Constant name="visual_editor" />.

## Resources

Learn more about Canvas: 

- How to [use Canvas](/docs/cloud/use-canvas)
- The Canvas [quickstart guide](/guides/canvas)
- [Canvas fundamentals course](https://learn.getdbt.com/learn/course/canvas-fundamentals) on [dbt Learn](https://learn.getdbt.com/catalog)
