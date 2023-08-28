---
title: "Running dbt Cloud jobs on fresh data"
id: "fresh-rebuilds"
slug: fresh-rebuilds
description: Learn how to avoid running models on stale data
displayText: Fresh data rebuilds
hoverSnippet: Learn how to avoid running models on stale data.
---

Many organizations encounter a situation in which their `sources` are updated on unpredictable intervals. In this case, it can be difficult to understand which downstream models actually need to run, and which can be left alone since their upstream sources haven't changed. 

Fortunately, dbt Cloud supports using the source status selector to help!

#### Configuring dbt Cloud jobs for source freshness

To configure a dbt Cloud job with this strategy, include the `source freshness` option in the job configuration as shown in the screenshot below.

`dbt build --select source_status:fresher+` # build all the models whose sources have been updated since the last job run.

`dbt build --select source_status:fresher+,+tag:daily` # build all the daily models, and their upstream dependencies, including only those for which the raw sources have been updated. 

