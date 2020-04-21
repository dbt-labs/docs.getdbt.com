---
title: Do snapshots capture hard deletes?
---

No, snapshots do not invalidate records when they are deleted from the result set.

Check out the discussion on:
- [this GitHub issue](https://github.com/fishtown-analytics/dbt/issues/249)
- [this Discourse article](https://discourse.getdbt.com/t/handling-hard-deletes-from-source-tables-in-snapshots/1005/5) with a workaround.

It's also possible to create your own snapshot strategy that handles hard deletes ([docs](strategy#examples) — this is an advanced usage of dbt!
