---
title: "Query metadata API for data from the previous 3 months"
id: "metadata-api-data-retention-limits.md"
description: "Metadata API data retention limits"
sidebar_label: "Fix: Metadata API data retention limits"
tags: [Sept-29-2022]
---

In order to make the metadata API more scalable and improve its latency, we’ve implemented data retention limits. The metadata API can now query data from the previous 3 months. For example, If today is March 1, you can query data back to January 1st.

For more information, see "[Metadata API](/docs/dbt-cloud/dbt-cloud-api/metadata/metadata-overview.md)"
