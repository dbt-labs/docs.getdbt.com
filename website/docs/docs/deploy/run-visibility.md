---
title: "Run visibility"
description: "You can enable continuous integration (CI) to test every single change prior to deploying the code to production just like in a software development workflow."
tags: ["scheduler"]
---

## Model timing 
> Available on [multi-tenant](/docs/cloud/about-cloud/regions-ip-addresses) dbt Cloud accounts on the [Team or Enterprise plans](https://www.getdbt.com/pricing/).

The model timing dashboard on dbt Cloud displays the composition, order, and time taken by each model in a job run. The visualization appears for successful jobs and highlights the top 1% model durations. This helps you identify bottlenecks in your runs, so you can investigate them and potentially make changes to improve their performance. 

You can find the dashboard on the **Run Overview** page. 

<Lightbox src="/img/docs/dbt-cloud/model-timing.jpg" width="85%" title="The model timing tab displays the top 1% of model durations and visualizes model bottlenecks" />