---
id: predicate-pushdown
title: predicate pushdown
description: A predicate pushdown is an expression used to determine what rows in a database apply to a particular query
displayText: Predicate pushdown
hoverSnippet: A predicate pushdown is an expression used to determine what rows in a database apply to a particular query
---

A predicate pushdown is an expression used to determine what rows in a database apply to a particular query. For example, if you filter in a `WHERE` clause based on a specific dimension value, the database searches to determine what values in the database apply to the query. The optimization known as "predicate pushdown" involves applying this filtering process to the database, leading to enhanced and faster query performance.

