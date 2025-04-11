---
title: I'm receiving a "Permission denied while getting Drive credential" error when trying to query from Google Drive?
description: "Grant BigQuery service account access"
sidebar_label: 'Error when trying to query from Google Drive'
id: access-gdrive-credential

---

If you're seeing the below error when you try to query a dataset from a Google Drive document in the <Constant name="cloud_ide" />,  the <Constant name="cloud_ide" /> due to the below error message, we'll do our best to get you unstuck with the below steps! 

```
Access denied: BigQuery BigQuery: Permission denied while getting Drive credentials
```

Usually, this error indicates that you haven't granted the BigQuery service account access to the specific Google Drive document. If you're seeing this error, try giving the service account (Client email field seen [here](/docs/cloud/connect-data-platform/connect-bigquery)) you are using for your BigQuery connection in <Constant name="cloud" />, permission to your Google Drive or Google Sheet. You'll want to do this directly in your Google Document, click the **Share** button, and enter the client email. 

If you are experiencing this error when using OAuth, and you have verified your access to the Google Sheet, you may need to grant permissions for gcloud to access Google Drive:

```
gcloud auth application-default login --disable-quota-project
```
For more info see the [gcloud auth application-default documentation](https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login)

If you've tried the earlier steps and are still experiencing this behavior, try using the following command to log into Google Cloud and enable access to Google Drive. It also updates the Application Default Credentials (ADC) file, which many Google Cloud libraries use to authenticate API calls.

```
gcloud auth login --enable-gdrive-access --update-adc
```

For more info, refer to [gcloud auth login documentation](https://cloud.google.com/sdk/gcloud/reference/auth/login#--enable-gdrive-access).

If you've tried the steps above and are still experiencing this behavior - reach out to the Support team at support@getdbt.com and we'll be happy to help!
