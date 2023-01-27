---
title: "Environments"
id: "environments"
---

## What are environments?
In software engineering, environments are used to enable engineers to develop and test code without impacting the users of their software.

“Production” (or _prod_) refers to the environment that end users interact with, while “development” (or _dev_) is the environment that engineers work in. This means that engineers can work iteratively when writing and testing new code in _development_, and once they are confident in these changes, deploy their code to _production_.

In traditional software engineering, different environments often use completely separate architecture. For example, the dev and prod versions of a website may use different servers and databases.

<Term id="data-warehouse">Data warehouses</Term> can also be designed to have separate environments – the _production_ environment refers to the relations (i.e. schemas, tables, and <Term id="view">views</Term>) that your end users query (often through a BI tool).


## Related docs
- [About dbt Core versions](/docs/dbt-versions/core)
