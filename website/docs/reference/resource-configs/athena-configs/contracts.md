---
title: "Contracts"
sidebar_label: "Contracts"
description: "How the Amazon Athena adapter partially supports model contracts, including data type checks and unsupported constraints."
---

The adapter partly supports contract definitions:

- `data_type` is supported but needs to be adjusted for complex types. Types must be specified entirely (for example, `array<int>`) even though they won't be checked. Indeed, as dbt recommends, we only compare the broader type (array, map, int, varchar). The complete definition is used to check that the data types defined in Athena are ok (pre-flight check).
- The adapter does not support the constraints since Athena has no constraint concept.
