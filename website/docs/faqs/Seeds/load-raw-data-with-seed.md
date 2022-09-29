---
title: Can I use seeds to load raw data?
description: "Use seeds to load business specific logic"
sidebar_label: 'Seed data files requirements'
id: load-raw-data-with-seed

---

Seeds should **not** be used to load raw data (for example, large CSV exports from a production database).

Since seeds are version controlled, they are best suited to files that contain business-specific logic, for example a list of country codes or user IDs of employees.

Loading CSVs using dbt's seed functionality is not performant for large files. Consider using a different tool to load these CSVs into your <Term id="data-warehouse" />.
