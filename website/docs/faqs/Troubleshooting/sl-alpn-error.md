---
title: I'm receiving an `Failed ALPN` error when trying to connect to the dbt Semantic Layer.
description: "To resolve the 'Failed ALPN' error in the dbt Semantic Layer, create a SSL interception exception for the dbt Cloud domain."
sidebar_label: 'Use SSL exception to resolve `Failed ALPN` error'
---

If you're receiving a `Failed ALPN` error when trying to connect the dbt Semantic Layer with the various [data integration tools](/docs/use-dbt-semantic-layer/avail-sl-integrations) (such as Tableau, DBeaver, Datagrip, ADBC, or JDBC), it typically happens when connecting from a computer behind a corporate VPN or Proxy (like Zscaler or Check Point). 

The root cause is typically the proxy interfering with the TLS handshake as the dbt Semantic Layer uses gRPC/HTTP2 for connectivity. To resolve this:

- If your proxy supports gRPC/HTTP2 but isn't configured to allow ALPN, adjust its settings accordingly to allow ALPN. Or create an exception for the dbt Cloud domain.
- If your proxy does not support gRPC/HTTP2, add an SSL interception exception for the dbt Cloud domain in your proxy settings

This should help in successfully establishing the connection without the Failed ALPN error.
