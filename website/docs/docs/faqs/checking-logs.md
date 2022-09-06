---
title: How can I see the SQL that dbt is running?
---
To check out the SQL that dbt is running, you can look in:
* dbt Cloud:
   * Within the run output, click on a model name, and then select "Details"
* dbt CLI:
   * The `target/compiled/` directory for compiled `select` statements
   * The `target/run/` directory for compiled `create` statements
   * The `logs/dbt.log` file for verbose logging.
