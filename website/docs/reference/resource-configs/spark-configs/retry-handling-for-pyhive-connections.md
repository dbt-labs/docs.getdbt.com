---
title: "Retry handling for PyHive connections"
sidebar_label: "Retry handling"
description: "How to configure polling, timeouts, and connection retries for long-running queries over HTTP or Thrift connections in Apache Spark."
---

<VersionBlock firstVersion="1.11">

When using HTTP or Thrift connection methods, you can configure how dbt handles polling, timeouts, and connection retries for long-running queries. These settings help prevent queries from hanging indefinitely and automatically recover from connection interruptions during query execution.

There are three profile configurations available: 

| Parameter	| Type	| Default |	Description |
|-----------|-------|---------|-------------|
| `poll_interval` | Integer |	5 |	How frequently (in seconds) the adapter polls the Thrift server to check if an async query has completed. |
| `query_timeout`	| Integer |	None | Maximum duration (in seconds) for query execution. If a query exceeds this duration during polling, dbt raises a `DbtRuntimeError`. No timeout by default. |
| `query_retries` | Integer |	1 |	How many times the adapter retries when connection loss occurs during query execution. |

The adapter catches specific connection exceptions (such as `ConnectionResetError`, `BrokenPipeError`, and `TTransportException`) and retries with a fresh cursor when connection loss occurs. After exhausting all retries, dbt raises a `DbtRuntimeError` and suggests increasing `query_retries` in your profile.


</VersionBlock>
