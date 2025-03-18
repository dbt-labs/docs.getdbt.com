--- 
title: "About the Visual Editor" 
id: visual-editor       
sidebar_label: "About the Visual Editor" 
description: "The Visual Editor enables you to quickly create and visualize dbt models through a visual, drag-and-drop experience inside of dbt Cloud." 
pagination_next: "docs/cloud/visual-editor-interface"
pagination_prev: null
---

import Prerequisites from '/snippets/_visual-editor-prerequisites.md';

# About the Visual Editor <Lifecycle status='beta, enterprise'/> 

<p style={{ color: '#717d7d', fontSize: '1.1em' }}>
The dbt Cloud Visual Editor helps you quickly access and transform data through a visual, drag-and-drop experience and with a built-in AI for custom code generation.
</p>

:::tip Beta feature
The Visual Editor in dbt Cloud provides users with a seamless and visual, drag-and-drop experience inside dbt Cloud. It's available in private beta for [dbt Cloud Enterprise accounts](https://www.getdbt.com/pricing). 

To join the private beta, [register your interest](https://docs.google.com/forms/d/e/1FAIpQLScPjRGyrtgfmdY919Pf3kgqI5E95xxPXz-8JoVruw-L9jVtxg/viewform) or reach out to your account team to begin this process.
:::

The Visual Editor allows organizations to enjoy the many benefits of code-driven development—such as increased precision, ease of debugging, and ease of validation &mdash; while retaining the flexibility to have different contributors develop wherever they are most comfortable. Users can also take advantage of built-in AI for custom code generation, making it an end-to-end frictionless experience.

These models compile directly to SQL and are indistinguishable from other dbt models in your projects:
- Visual models are version-controlled in your backing Git provider.
- All models are accessible across projects in [dbt Mesh](/best-practices/how-we-mesh/mesh-1-intro).
- Models can be materialized into production through [dbt Cloud orchestration](/docs/deploy/deployments), or be built directly into a user's development schema.
- Integrate with [dbt Explorer](/docs/collaborate/explore-projects) and the [dbt Cloud IDE](/docs/cloud/dbt-cloud-ide/develop-in-the-cloud).

<Lightbox src="/img/docs/dbt-cloud/visual-editor/visual-editor.png" width="90%" title="Create or edit dbt models with the Visual editor, enabling everyone to develop with dbt through a drag-and-drop experience inside of dbt Cloud." />

<Prerequisites feature={'/snippets/_visual-editor-prerequisites.md'} />

## Feedback

Please note, always review AI-generated code and content as it may produce incorrect results. The Visual Editor features and/or functionality may be added or eliminated as part of the beta trial.

To give feedback, please reach out to your dbt Labs account team. We appreciate your feedback and suggestions as we improve the Visual Editor.

