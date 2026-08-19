| Approach | How | When to use |
|---|---|---|
| **Separate schemas** (recommended) | Each environment writes to a different schema in the same database | Works for most teams; lowest cost and easiest to set up |
| **Separate databases** | Each environment targets a different database. | Useful when schema-level access controls are insufficient. |
| **Separate accounts or clusters** | Each environment connects to a completely different warehouse account or cluster. | Needed for strict network or compliance isolation between environments. |