---
title: "New: Trigger on job completion"
description: "February 2024: Native support now available in dbt Cloud for triggering deploy jobs when other deploy jobs finish."
sidebar_label: "New: Trigger on job completion"
sidebar_position: 07
tags: [Feb-2024]
date: 2024-02-15
---

# New: Trigger on job completion <Lifecycle status="team,enterprise" />

Now available for dbt Cloud Team and Enterprise plans is the ability to trigger deploy jobs when other deploy jobs complete. You can enable this feature [in the UI](/docs/deploy/deploy-jobs) with the  **Run when another job finishes** option or with the [Create Job API endpoint](/dbt-cloud/api-v2#/operations/Create%20Job). 

When enabled, your job will run when the upstream job that you specified completes. You can configure which run status(es) will trigger your job. It can be just on `Success` or on all statuses. If you have dependencies between your dbt projects, this allows you to _natively_ orchestrate your jobs within dbt Cloud &mdash; no need to set up a third-party tool.

An example of the **Triggers** section when creating the job:  

<Lightbox src="/img/docs/dbt-cloud/using-dbt-cloud/example-triggers-section.png" width="90%" title="Example of Triggers on the Deploy Job page"/>
