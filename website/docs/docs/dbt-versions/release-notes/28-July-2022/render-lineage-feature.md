---
title: "Enhancement: Large DAG feature"
id: "render-lineage-feature"
description: "Jul 2022 release note: Use the Render Lineage button to visualize large DAGs"
sidebar_label: "Enhancement: Large DAG feature"
tags: [July-2022, v1.1.56, IDE]

---

You can now select **Render Lineage** to visualize large DAGs. 

Large DAGs can take a long time (10 or more seconds, if not minutes) to render and can cause browsers to crash. 

The new button prevents large DAGs from rendering automatically. Instead, you can select **Render Lineage** to load the visualization. This should affect about 15% of the DAGs.

<Lightbox src="/img/docs/dbt-cloud/dag v1.1.56 release.png" title="Render Lineage"/>
