---
title: Can I restrict the generic test to a subset of my model data?
---

Yes! The generic tests in dbt Core accept a `where:` clause, which can contain
SQL that restricts the data subset under test. For example, if you want to 
allow for a lagging table when testing relationships, you could define a 
`where:` clause like so (using Snowflake's `dateadd` syntax):

```yml
- name: agent_id
  tests:
    - relationships:
        to: ref('dim_agents')
        field: agent_id
        where: "received_at <= dateadd(day, -1, getdate())"
```