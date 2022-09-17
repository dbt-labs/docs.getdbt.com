---
title: I'm receiving a "Permission denied while getting Drive credential" error when trying to query from Google Drive?
description: "Grant BigQuery service account access"
sidebar_label: 'Error when trying to query from Google Drive'
id: access-gdrive-credential

---

If you're seeing the below error when you try to query a dataset from a Google Drive document in the IDE,  the IDE due to the below error message, we'll do our best to get you unstuck with the below steps! 

```
Access denied: BigQuery BigQuery: Permission denied while getting Drive credentials
```

Usually this errors indicates that you haven't granted the BigQuery service account access to the specific Google Drive document. If you're seeing this error, try giving the service account (client email seen [here](https://docs.getdbt.com/docs/dbt-cloud/cloud-configuring-dbt-cloud/connecting-your-database#connecting-to-bigquery)) you are using for your BigQuery connection in dbt Cloud, permission to your Google Drive or Google Sheet. You'll want to do this directly in your Google Document and click the 'share' button and enter the client email there. 

If you've tried the step above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
