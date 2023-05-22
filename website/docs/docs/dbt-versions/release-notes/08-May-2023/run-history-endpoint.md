---
title: "Run history retention changing to 365 days"
id: "run-history-endpoint"
sidebar_label: "Update: Run history available for 365 days"
sidebar_position: 6
tags: [May-22-2023, API, Scheduler]
---

Beginning on June 1, 2023, dbt Cloud users on the Enterprise and Team multi-tenant plans can access run history for the previous 365 days through the dbt Cloud user interface (UI) and API, improving speed and accessibility. 

Specifically, all `GET` requests to the dbt Cloud [Runs endpoint](https://docs.getdbt.com/dbt-cloud/api-v2#tag/Runs) will return information on runs, artifacts, logs, and run steps starting from June 1, 2022. The run history displayed in the dbt Cloud UI will also show runs from June 1, 2022 and onwards. 

<Lightbox src="/img/docs/dbt-cloud/rn-run-history.jpg" width="100%" title="The dbt Cloud UI displaying a Run history"/>

dbt Labs keeps older run events. To access run history older than 365 days, you'll need to contact dbt Cloud Support to request this. You can contact the Support team at [support@getdbt.com](mailto:support@getdbt.com) or using the dbt Cloud application chat for help by clicking the `?` icon in the dbt Cloud UI. 
