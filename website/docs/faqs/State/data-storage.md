---
title: How is data stored in dbt State?
description: "Learn what data dbt State sends to dbt Labs servers and how it is stored."
sidebar_label: 'How is data stored?'
id: data-storage
---

dbt State sends the following metadata to dbt Labs servers:

- **Last-modified timestamps**: Used to determine whether upstream data has changed since the last run
- **SQL statement hashes**: SQL statements are processed to detect and classify changes, then hashed. Only the hash is persisted for future comparisons.

No actual data from your warehouse is transmitted.

The dbt State service runs in a single US multi-tenant (MT) instance. The service never connects to your data warehouse. No actual data from your warehouse is transmitted. The only connection is to your running dbt process (CLI or platform) in order to exchange the metadata described above. For data retention details, refer to the [dbt Labs privacy policy](https://www.getdbt.com/cloud/privacy-policy).
