---
title: "Unit test limitations"
sidebar_label: "Unit test limitations"
description: "Limitations for unit tests on BigQuery, including the requirement to specify all fields in a STRUCT."
---

You must specify all fields in a BigQuery `STRUCT` for [unit tests](/docs/build/unit-tests). You cannot use only a subset of fields in a `STRUCT`.
