---
title: How we style our YAML
id: 5-how-we-style-our-yaml
---

## YAML Style Guide

- 2️⃣ Indents should be two spaces
- ➡️ List items should be indented
- 🆕 Use a new line to separate list items that are dictionaries where appropriate
- 📏 Lines of YAML should be no longer than 80 characters.
- 🛠️ Use the [dbt JSON schema](https://github.com/dbt-labs/dbt-jsonschema) with any compatible IDE and a YAML formatter (we recommend [Prettier](https://github.com/dbt-labs/dbt-jsonschema)) to validate your YAML files and format them automatically.

### Example YAML

```yaml
version: 2

models:
  - name: events
    columns:
      - name: event_id
        description: This is a unique identifier for the event
        tests:
          - unique
          - not_null

      - name: event_time
        description: "When the event occurred in UTC (eg. 2018-01-01 12:00:00)"
        tests:
          - not_null

      - name: user_id
        description: The ID of the user who recorded the event
        tests:
          - not_null
          - relationships:
              to: ref('users')
              field: id
```
