---
title: One of my tests failed, how can I debug it?
---
To debug a failing test, find the SQL that dbt ran by:
* dbt Cloud:
    * Within the test output, click on the failed test, and then select "Details"
* dbt CLI:
    * Open the file path returned as part of the error message.
    * Navigate to the `target/compiled/schema_tests` directory for all compiled test queries

Copy the SQL into a query editor (in dbt Cloud, you can paste it into a new `Statement`), and run the query to find the records that failed.

