---
title: "Query management macros"
sidebar_label: "Query management macros"
description: "Use DeltaStream adapter macros to list, describe, terminate, and restart running queries from dbt."
---

DeltaStream dbt adapter provides macros to help you manage and terminate running queries directly from dbt.

### List all queries

The `list_all_queries` macro displays all queries currently known to DeltaStream, including their state, owner, and SQL:

```bash
dbt run-operation list_all_queries
```

### Describe query

Use the `describe_query` macro to check the logs and details of a specific query:

```bash
dbt run-operation describe_query --args '{query_id: "<QUERY_ID>"}'
```

### Terminate a specific query

Use the `terminate_query` macro to terminate a query by its ID:

```bash
dbt run-operation terminate_query --args '{query_id: "<QUERY_ID>"}'
```

### Terminate all running queries

Use the `terminate_all_queries` macro to terminate all currently running queries:

```bash
dbt run-operation terminate_all_queries
```

### Restart a query

Use the `restart_query` macro to restart a failed query by its ID:

```bash
dbt run-operation restart_query --args '{query_id: "<QUERY_ID>"}'
```
