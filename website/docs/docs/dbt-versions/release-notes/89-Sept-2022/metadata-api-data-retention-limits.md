---
title: "Query the previous three months of data using the metadata API"
id: "metadata-api-data-retention-limits.md"
description: "Metadata API data retention limits"
sidebar_label: "Fix: Metadata API data retention limits"
tags: [Sept-2022]
---

In order to make the metadata API more scalable and improve its latency, we’ve implemented data retention limits. The metadata API can now query data from the previous three months. For example, if today was March 1, you could query data back to January 1st.

For more information, see [Metadata API](/docs/dbt-cloud-apis/discovery-api)
