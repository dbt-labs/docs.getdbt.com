---
id: predicate-pushdown
title: predicate pushdown
description: Predicate pushdown is an expression used to make database queries faster.
displayText: predicate pushdown
hoverSnippet: Predicate pushdown is an expression used make database queries faster by applying filters as early as possible in the query process. 
---

Predicate pushdown is a technique used to make database queries faster. Here's how it works:

When you run a query with a filter (for example, using a `where` clause), the database has to find which rows match that filter.

Predicate pushdown means that instead of checking each row one by one, the database applies the filter as early as possible in the query process. This way, it reduces the amount of data it needs to process, making the query run faster.
