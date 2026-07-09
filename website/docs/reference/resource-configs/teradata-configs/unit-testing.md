---
title: "Unit testing"
sidebar_label: "Unit testing"
description: "Write and run unit tests with the dbt-teradata adapter using the dbt test command."
---

* Unit testing is supported in dbt-teradata, allowing users to write and execute unit tests using the dbt test command.
  * For detailed guidance, refer to the [dbt unit tests documentation](/docs/build/documentation).
> In Teradata, reusing the same alias across multiple common table expressions (CTEs) or subqueries within a single model is not permitted, as it results in parsing errors; therefore, it is essential to assign unique aliases to each CTE or subquery to ensure proper query execution.
