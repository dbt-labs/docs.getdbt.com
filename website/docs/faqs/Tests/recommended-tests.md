---
title: What tests should I add to my project?
description: "Recommended tests for project"
sidebar_label: 'Recommended tests for project'
id: recommended-tests

---
We recommend that every model has a test on a <Term id="primary-key" />, that is, a column that is `unique` and `not_null`.

We also recommend that you test any assumptions on your source data. For example, if you believe that your payments can only be one of three payment methods, you should test that assumption regularly — a new payment method may introduce logic errors in your SQL.

In advanced dbt projects, we recommend using [sources](/docs/build/sources) and running these source data-integrity tests against the sources rather than models.
