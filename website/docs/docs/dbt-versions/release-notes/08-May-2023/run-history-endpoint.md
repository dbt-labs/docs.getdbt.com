---
title: "Run history retention changing to 365 days"
id: "run-history-endpoint"
sidebar_label: "Update: Run history available for 365 days"
sidebar_position: 6
tags: [May-22-2023, API, Scheduler]
---

Beginning on June 1, 2023, dbt Cloud multi-tenant users can access run history for the previous 365 days on a rolling basis through the dbt Cloud user interface (UI) and API. This update improves the application's speed and reliability, making it more performant for all users.

Specifically, all `GET` requests to the dbt Cloud [Runs endpoint](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs) will return information on runs, artifacts, logs, and run steps only for the past 365 days.  The run history displayed in the dbt Cloud UI will only show runs for the past 365 days.  

<Lightbox src="/img/docs/dbt-cloud/rn-run-history.jpg" width="100%" title="The dbt Cloud UI displaying a Run history"/>

dbt Labs will retain older run history until September 1, 2023, and will make it available to users who reach out to the Support team. To request older run history info, contact dbt Cloud Support to request at [support@getdbt.com](mailto:support@getdbt.com) or use the dbt Cloud application chat for help by clicking the `?` icon in the dbt Cloud UI. 

This is a one-time event on limiting the self-service of run history. dbt Labs may introduce a metadata retention policy in the future. 
