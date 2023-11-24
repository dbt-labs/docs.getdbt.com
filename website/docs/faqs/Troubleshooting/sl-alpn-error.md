---
title: I'm receiving an `Failed ALPN` error when trying to connect to the dbt Semantic Layer.
description: "To resolve the 'Failed ALPN' error in the dbt Semantic Layer, create a SSL interception exception for the dbt Cloud domain."
sidebar_label: 'Use SSL exception to resolve `Failed ALPN` error'
---

If you're receiving a `Failed ALPN` error when trying to connect the dbt Semantic Layer with the available [data integration tool](/docs/use-dbt-semantic-layer/avail-sl-integrations), it typically happens when connecting from a computer behind a corporate VPN or Proxy, such as Zscaler. 

To fix this, add an SSL interception exception for the dbt Cloud domain in your settings.

This issue is common with integrations like Tableau, DBeaver, Datagrip, ADBC, or JDBC.
