---
title: "Source freshness known limitation"
sidebar_label: "Source freshness limitation"
description: "Learn why Snowflake source freshness relies on the LAST_ALTERED column, which updates on any object change, not only data updates."
---

Snowflake calculates source freshness using information from the `LAST_ALTERED` column, meaning it relies on a field updated whenever any object undergoes modification, not only data updates. No action must be taken, but analytics teams should note this caveat. 

Per the [Snowflake documentation](https://docs.snowflake.com/en/sql-reference/info-schema/tables#usage-notes): 

  >The `LAST_ALTERED` column is updated when the following operations are performed on an object:
  >- DDL operations.
  >- DML operations (for tables only).
  >- Background maintenance operations on metadata performed by Snowflake.
