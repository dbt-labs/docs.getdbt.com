---
title: Why does the BigQuery OAuth application require scopes to Google Drive?
description: "Learn more about Google Drive scopes in the BigQuery OAuth application"
sidebar_label: "BigQuery OAuth Drive Scopes"
id: bq-oauth-drive-scope
---

BigQuery supports external tables over both personal Google Drive files and shared files. 

When using Google Drive based external tables, BigQuery relies on OAuth scopes to determine which resources it can access. These scopes allow BigQuery to interact with Google Drive files (including shared files), query and manage BigQuery datasets, and identify the authenticated Google account.

To enforce the principle of least privilege, you can customize OAuth scopes to limit what dbt and its users are able to access.

For more information, refer to [Create Google Drive external tables](https://cloud.google.com/bigquery/docs/external-data-drive).
