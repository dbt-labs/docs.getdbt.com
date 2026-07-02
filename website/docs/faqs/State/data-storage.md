---
title: How is data stored in dbt State?
description: "Learn what data dbt State sends to dbt Labs servers and how it is stored."
sidebar_label: 'How is data stored?'
id: data-storage
---

dbt State sends the following metadata to dbt Labs servers:

- **Last-modified timestamps**: Used to determine whether upstream data has changed since the last run
- **SQL statement hashes**: SQL statements are hashed before transmission, so dbt Labs cannot see the contents; only hashes are stored and compared across runs to detect logic changes

No actual data from your warehouse is transmitted.

The dbt State service runs in a single US multi-tenant (MT) instance and does _not_ make any live connections to your data warehouse. For data retention details, refer to the [dbt Labs privacy policy](https://www.getdbt.com/cloud/privacy-policy).
