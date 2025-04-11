---
title: Can I connect my dbt project to two databases?
description: "Prepare your warehouse for dbt transformations"
sidebar_label: 'Can you connect dbt project to two databases?'
id: connecting-to-two-dbs-not-allowed

---

The meaning of the term 'database' varies with each major warehouse manager. Hence, the answer to "can a <Constant name="dbt" /> project connect to more than one database?" depends on the warehouse used in your tech stack.

* <Constant name="dbt" /> projects connecting to warehouses like Snowflake or Bigquery&mdash;these empower one set of credentials to draw from all datasets or 'projects' available to an account&mdash;are _sometimes_ said to connect to more than one database.
* <Constant name="dbt" /> projects connecting to warehouses like Redshift and Postgres&mdash;these tie one set of credentials to one database&mdash;are said to connect to one database only.

Sidestep the 'one database problem' by relying on <Term id="elt" /> thinking (i.e. extract -> load -> transform). Remember, dbt is not a loader--with few exceptions, it doesn't move data from sources to a warehouse. dbt is a transformer. It enters the picture after extractors and loaders have funneled sources into a warehouse. It moves and combines data inside the warehouse itself.

Hence, instead of thinking "how do I connect my <Constant name="dbt" /> project to two databases", ask "what loader services will best prepare our warehouse for <Constant name="dbt" /> transformations."

For more on the modern 'ELT-powered' data stack, see the "<Constant name="dbt" /> and the modern BI stack" section of this [<Constant name="dbt" /> blog post](https://blog.getdbt.com/what-exactly-is-dbt).
