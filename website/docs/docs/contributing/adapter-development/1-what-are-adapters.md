---
title: "What are adapters? Why do we need them?"
id: "1-what-are-adapters"
---

## What are adapters?

dbt "adapters" are responsible for _adapting_ dbt's functionality to a given database. If you want to make dbt work with a new database, you'll probably need to build a new adapter, or extend an existing one. Adapters are comprised of three layers:

1. At the lowest level: An *adapter class* implementing all the methods responsible for connecting to a database and issuing queries.
2. In the middle: A set of *macros* responsible for generating SQL that is compliant with the target database.
3. (Optional) At the highest level: A set of *<Term id="materialization">materializations</Term>* that tell dbt how to turn model files into persisted objects in the database.

For any questions you may have, don't hesitate to ask in the [#adapter-ecosystem](https://getdbt.slack.com/archives/C030A0UF5LM) Slack channel. The community is very helpful and likely has experienced a similar issue as you.

Below is a diagram of how dbt-postgres, the adapter at the center of dbt-core, works.

![adapter architecture diagram](/img/adapter-guide/adapter architecture - postgres.png)