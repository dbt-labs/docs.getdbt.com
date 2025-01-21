---
title: "Why I wish I had a control plane for my renovation"
description: "When I think back to my renovation, I realize how much smoother it would've been if I’d had a control plane for the entire process."
slug: wish-i-had-a-control-plane-for-my-renovation

authors: [mark_wan]

tags: [analytics craft, data_ecosystem]
hide_table_of_contents: false

date: 2025-01-21
is_featured: true
---

When my wife and I renovated our home, we chose to take on the role of owner-builder. It was a bold (and mostly naive) decision, but we wanted control over every aspect of the project. What we didn’t realize was just how complex and exhausting managing so many moving parts would be.

<Lightbox src="/img/blog/2024-12-22-why-i-wish-i-had-a-control-plane-for-my-renovation/control-plane.png" width="70%" title="My wife pondering our sanity" />

We had to coordinate multiple elements:

- The **architects**, who designed the layout, interior, and exterior.
- The **architectural plans**, which outlined what the house should look like.
- The **builders**, who executed those plans.
- The **inspectors**, **councils**, and **energy raters**, who checked whether everything met the required standards.

<!--truncate-->

Each piece was critical &mdash; without the plans, there’s no shared vision; without the builders, the plans don’t come to life; and without inspections, mistakes go unnoticed. 

But as an inexperienced project manager, I was also the one responsible for stitching everything together:
- Architects handed me detailed plans, builders asked for clarifications.
- Inspectors flagged issues that were often too late to fix without extra costs or delays. 
- On top of all this, I also don't speak "builder". 

So what should have been quick and collaborative conversations, turned into drawn-out processes because there was no unified system to keep everyone on the same page.

## In many ways, this mirrors how data pipelines operate

- The **architects** are the engineers &mdash; designing how the pieces fit together.
- The **architectural plans** are your dbt code &mdash; the models, tests, and configurations that define what your data should look like.
- The **builders** are the compute layers (for example, Snowflake, BigQuery, or Databricks) that execute those transformations.
- The **inspectors** are the monitoring tools, which focus on retrospective insights like logs, job performance, and error rates.

Here’s the challenge: monitoring tools, by their nature, look backward. They’re great at telling you what happened, but they don’t help you plan or declare what should happen. And when these roles, plans, execution, and monitoring are siloed, teams are left trying to manually stitch them together, often wasting time troubleshooting issues or coordinating workflows.

## What makes dbt Cloud different

[dbt Cloud](https://www.getdbt.com/product/dbt-cloud) unifies these perspectives into a single [control plane](https://www.getdbt.com/blog/data-control-plane-introduction), bridging proactive and retrospective capabilities:

- **Proactive planning**: In dbt, you declare the desired [state](https://docs.getdbt.com/reference/node-selection/syntax#state-selection) of your data before jobs even run &mdash; your architectural plans are baked into the pipeline.
- **Retrospective insights**: dbt Cloud surfaces [job logs](https://docs.getdbt.com/docs/deploy/run-visibility), performance metrics, and test results, providing the same level of insight as traditional monitoring tools.

But the real power lies in how dbt integrates these two perspectives. Transformation logic (the plans) and monitoring (the inspections) are tightly connected, creating a continuous feedback loop where issues can be identified and resolved faster, and pipelines can be optimized more effectively.

## Why does this matter?

1. **The silo problem**: Many organizations rely on separate tools for transformation and monitoring. This fragmentation creates blind spots, making it harder to identify and resolve issues.
2. **Integrated workflows**: dbt Cloud eliminates these silos by connecting transformation and monitoring logic in one place. It doesn’t just report on what happened; it ties those insights directly to the proactive plans that define your pipeline.
3. **Operational confidence**: With dbt Cloud, you can trust that your data pipelines are not only functional but aligned with your business goals, monitored in real-time, and easy to troubleshoot.

## Why I wish I had a control plane for my renovation

When I think back to my renovation, I realize how much smoother it would have been if I’d had a control plane for the entire process. There are firms that specialize in design-and-build projects, in-house architects, engineers, and contractors. The beauty of these firms is that everything is under one roof, so you know they’re communicating seamlessly.

In my case, though, my architect, builder, and engineer were all completely separate, which meant I was the intermediary. I was the pigeon service shuttling information between them, and it was exhausting. Discussions that should have taken minutes, stretched into weeks and sometimes even months because there was no centralized communication.

dbt Cloud is like having that design-and-build firm for your data pipelines. It’s the control plane that unites proactive planning with retrospective monitoring, eliminating silos and inefficiencies. With dbt Cloud, you don’t need to play the role of the pigeon service &mdash; it gives you the visibility, integration, and control you need to manage modern data workflows effortlessly.
