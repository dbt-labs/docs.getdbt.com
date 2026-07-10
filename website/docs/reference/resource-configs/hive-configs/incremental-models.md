---
title: "Incremental models"
sidebar_label: "Incremental models"
description: "Review the supported incremental model modes in dbt-hive, including append and insert_overwrite."
---

Supported modes for incremental model:
 - **`append`** (default): Insert new records without updating or overwriting any existing data.
 - **`insert_overwrite`**: For new records, insert data. When used along with partition clause, update data for changed record and insert data for new records. 
