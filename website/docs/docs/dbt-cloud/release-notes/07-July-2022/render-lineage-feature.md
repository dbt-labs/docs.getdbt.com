
---
title: "Enhancement: Large DAG feature"
id: "render-lineage-feature"
description: "Add a render button for Large DAGs to visualize"
sidebar_label: "Enhancement: Large DAG feature"
tags: [July-5-2022, v1.1.56]

---

You can now select **Render Lineage** to visualize large DAGs. 

Large DAGs can take a long time (10+ seconds, if not minutes) to render and can cause browsers to crash. 

The new button feature prevents large DAGs from rendering automatically. Instead, you can select **Render Lineage** to load up the visualization. This should affect only ~15% of the DAGs.


<Lightbox src="/img/docs/dbt-cloud/dag v1.1.56 release.png" title="Render Lineage"/>
