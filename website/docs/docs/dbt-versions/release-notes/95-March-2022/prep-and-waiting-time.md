---
title: "Dividing queue time into waiting and prep time"
id: "prep-and-waiting-time"
description: "dbt Cloud now shows waiting time and prep time for a run."
sidebar_label: "Enhancement: Waiting time and prep time"

tags: [v1.1.46, March-02-2022]
---

dbt Cloud now shows "waiting time" and "prep time" for a run, which used to be expressed in aggregate as "queue time". Waiting time captures the time dbt Cloud waits to run your job if there isn't an available run slot or if a previous run of the same job is still running. Prep time represents the time it takes dbt Cloud to ready your job to run in your cloud data warehouse.

<Lightbox src="/img/docs/dbt-cloud/v1.1.46releasenotes_img1.png" title="New prep time and waiting time"/>
