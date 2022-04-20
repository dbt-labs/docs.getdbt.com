---
title: "Exit codes"
id: "exit-codes"
---

When dbt exits, it will return an exit code of either 0, 1, or 2.

| Exit Code | Condition |
| --------- | --------- |
| 0 | The dbt invocation completed without error. |
| 1 | The dbt invocation completed with at least one handled error (eg. model syntax error, bad permissions, etc). The run was completed, but some models may have been skipped. |
| 2 | The dbt invocation completed with an unhandled error (eg. ctrl-c, network interruption, etc). |

While these exit codes may change in the future, a zero exit code will always imply success whereas a nonzero exit code will always imply failure.
