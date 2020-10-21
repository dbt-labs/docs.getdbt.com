---
title: Can I connect my dbt project to two databases?
---

No. dbt talks to one database at a time, namely your data warehouse.

The modern data stack reflects ELT thinking (i.e. extract -> load -> transform). The three components of ELT are all modular services--building blocks--that can be assembled into robust pipelines.

dbt enters the picture after your extractors and loaders have funneled data into a warehouse. Hence, instead of thinking "how do I connect my dbt project to two databases", ask "what loader services will best prepare our warehouse for dbt transformations."

For more on the modern data stack, see the "dbt and the modern BI stack" section of this [dbt blog post](https://blog.getdbt.com/what--exactly--is-dbt-/).

