---
title: Putting it all together
id: 6-migrating-from-stored-procedures-conclusion
---

The techniques shared above are useful ways to get started converting the individual DML statements that are often found in stored procedures. Using these types of patterns, legacy procedural code can be rapidly transitioned to dbt models that are much more readable, maintainable, and benefit from software engineering best practices like <Term id='dry'>DRY principles</Term>. Additionally, once transformations are rewritten as dbt models, it becomes much easier to test the transformations to ensure that the data being used downstream is high-quality and trustworthy.
