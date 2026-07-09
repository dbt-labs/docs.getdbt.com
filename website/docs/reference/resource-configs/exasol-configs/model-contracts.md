---
title: "Model contracts"
sidebar_label: "Model contracts"
description: "See which database constraints Exasol supports when enforcing model contracts, including not_null, primary_key, and foreign_key."
---

Exasol supports [model contracts](/docs/mesh/govern/model-contracts) with the following database constraints:

| Constraint Type | Support Status | Description |
|----------------|----------------|-------------|
| `not_null`     | ✅ Enforced    | Prevents NULL values in the column |
| `primary_key`  | ✅ Enforced    | Enforces uniqueness and NOT NULL |
| `foreign_key`  | ✅ Enforced    | References another table's primary key |
| `check`        | ❌ Not supported | Custom validation expressions not supported |
| `unique`       | ❌ Not supported | Unique constraints not supported |

### Example with enforced constraints

<File name='models/customers.yml'>

```yaml
models:
  - name: customers
    config:
      contract:
        enforced: true
    columns:
      - name: customer_id
        data_type: integer
        constraints:
          - type: not_null
          - type: primary_key
      - name: email
        data_type: varchar(255)
        constraints:
          - type: not_null
      - name: country_id
        data_type: integer
        constraints:
          - type: foreign_key
            expression: countries (country_id)
```

</File>

For more information on model contracts, refer to the [model contracts documentation](/docs/mesh/govern/model-contracts).
