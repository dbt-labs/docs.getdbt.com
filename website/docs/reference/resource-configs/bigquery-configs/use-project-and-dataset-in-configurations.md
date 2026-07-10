---
title: "Use project and dataset in configurations"
sidebar_label: "Project and dataset"
description: "How BigQuery project and dataset map to the dbt database and schema concepts in configurations."
---

- `schema` is interchangeable with the BigQuery concept `dataset`
- `database` is interchangeable with the BigQuery concept of `project`

For our reference documentation, you can declare `project` in place of `database.`
This will allow you to read and write from multiple BigQuery projects. Same for `dataset`.
