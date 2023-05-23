---
title: "Run history retention changing to 365 days"
id: "run-history-endpoint"
sidebar_label: "Update: Run history available for 365 days"
sidebar_position: 6
tags: [May-22-2023, API, Scheduler]
---

We are making a change to our data retention policy for run history in dbt Cloud.


**Beginning June 1, 2023**, developers on the dbt Cloud multi-tenant application will be able to self-serve access to their account’s run history through dbt Cloud user interface (UI) and API for only the precious 365 days, on a rolling basis. This update minimizes the amount of metadata we retain and while maximizing application performance for all users. 

Specifically, all `GET` requests to the dbt Cloud [Runs endpoint](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs) will return information on runs, artifacts, logs, and run steps only for the past 365 days.  Additionally, the run history displayed in the dbt Cloud UI will only show runs for the past 365 days.  

<Lightbox src="/img/docs/dbt-cloud/rn-run-history.jpg" width="100%" title="The dbt Cloud UI displaying a Run history"/>

dbt Labs will retain older run history until September 1, 2023, and will make it available to users who reach out to the Support team. To request older run history info, contact dbt Cloud Support to request at [support@getdbt.com](mailto:support@getdbt.com) or use the dbt Cloud application chat for help by clicking the `?` icon in the dbt Cloud UI. 

