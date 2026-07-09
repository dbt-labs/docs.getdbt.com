---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "Supported and unsupported incremental strategies for building incremental models with the dbt-impala plugin."
---

Supported modes for incremental model:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: For new records, insert data. When used along with partition clause, update data for changed record and insert data for new records. 


Unsupported modes:
 - **`unique_key`** This is not suppored option for incremental models in dbt-impala
 - **`merge`**: Merge is not supported by the underlying warehouse, and hence not supported by dbt-impala
