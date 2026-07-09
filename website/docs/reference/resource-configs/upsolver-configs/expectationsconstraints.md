---
title: "Expectations and constraints"
sidebar_label: "Expectations and constraints"
description: "Add data quality expectations to Upsolver jobs using dbt check and not_null constraints."
---

Data quality conditions can be added to your job to drop a row or trigger a warning when a column violates a predefined condition.

```sql
WITH EXPECTATION <expectation_name> EXPECT <sql_predicate>
ON VIOLATION WARN
```

Expectations can be implemented with dbt constraints
Supported constraints: check and not_null

```yaml
models:
  - name: <model name>
    # required
    config:
      contract:
        enforced: true
    # model-level constraints
    constraints:
      - type: check
        columns: ['<column1>', '<column2>']
        expression: "column1 <= column2"
        name: <constraint_name>
      - type: not_null
        columns: ['column1', 'column2']
        name: <constraint_name>

    columns:
      - name: <column3>
        data_type: string

        # column-level constraints
        constraints:
          - type: not_null
          - type: check
            expression: "REGEXP_LIKE(<column3>, '^[0-9]{4}[a-z]{5}$')"
            name: <constraint_name>
```
