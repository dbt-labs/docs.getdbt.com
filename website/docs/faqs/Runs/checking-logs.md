---
title: How can I see the SQL that dbt is running?
description: "Review logs to check the SQL dbt is running"
sidebar_label: 'Reviewing SQL that dbt runs'
id: checking-logs

---

To check out the SQL that dbt is running, you can look in:

* <Constant name="cloud" />:
  * Within the run output, click on a model name, and then select "Details"
* <Constant name="core" />:
  * The `target/compiled/` directory for compiled `select` statements
  * The `target/run/` directory for compiled `create` statements
  * The `logs/dbt.log` file for verbose logging.
