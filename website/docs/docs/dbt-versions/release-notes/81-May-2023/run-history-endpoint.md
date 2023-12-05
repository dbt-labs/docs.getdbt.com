---
title: "Older Run History retrieval change"
id: "run-history-endpoint"
sidebar_label: "Update: Older Run History retrieval change"
sidebar_position: 6
tags: [May-2023, API, Scheduler]
---

dbt Labs is making a change to the metadata retrieval policy for Run History in dbt Cloud. 


**Beginning June 1, 2023,** developers on the dbt Cloud multi-tenant application will be able to self-serve access to their account’s run history through the dbt Cloud user interface (UI) and API for only 365 days, on a rolling basis. Older run history will be available for download by reaching out to Customer Support. We're seeking to minimize the amount of metadata we store while maximizing application performance. 


Specifically, all `GET` requests to the dbt Cloud [Runs endpoint](https://docs.getdbt.com/dbt-cloud/api-v2-legacy#tag/Runs) will return information on runs, artifacts, logs, and run steps only for the past 365 days.  Additionally, the run history displayed in the dbt Cloud UI will only show runs for the past 365 days.  

<Lightbox src="/img/docs/dbt-cloud/rn-run-history.jpg" width="100%" title="The dbt Cloud UI displaying a Run History"/>

We will retain older run history in cold storage and can make it available to customers who reach out to our Support team. To request older run history info, contact the Support team at [support@getdbt.com](mailto:support@getdbt.com) or use the dbt Cloud application chat by clicking the `?` icon in the dbt Cloud UI. 

