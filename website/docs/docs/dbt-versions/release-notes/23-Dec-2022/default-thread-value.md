---
title: "Threads default value changed to 4"
id: "default-thread-value"
description: "Threads now default to 4 users' profile."
sidebar_label: "Enhancement: Threads default value changed to 4 "
tags: [Dec-2022]
---

Threads help parallelize node execution in the dbt directed acyclic graph [(DAG)](https://docs.getdbt.com/terms/dag). 

Previously, the thread value defaulted to 1, which can increase the runtime of your project. To help reduce the runtime of your project, the default value for threads in user profiles is now set to 4 threads. 

You can supply a custom thread count if you'd prefer more or less parallelization. 

For more information, read [Understanding threads](/docs/running-a-dbt-project/using-threads). 
