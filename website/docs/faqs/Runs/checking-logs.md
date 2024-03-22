---
title: How can I see the SQL that dbt is running?
description: "Review logs to check the sql dbt is running"
sidebar_label: 'Reviewing sql that dbt runs'
id: checking-logs

---

To check out the SQL that dbt is running, you can look in:

* dbt Cloud:
  * Within the run output, click on a model name, and then select "Details"
* dbt Core:
  * The `target/compiled/` directory for compiled `select` statements
  * The `target/run/` directory for compiled `create` statements
  * The `logs/dbt.log` file for verbose logging.
