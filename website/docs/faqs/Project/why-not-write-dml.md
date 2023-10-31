---
title: "Why can't I just write DML in my transformations?"
description: "Using SQL in your transformations instead of DML."
sidebar_label: 'Why not write in DML'
id: why-not-write-dml

---

#### `select` statements make transformations accessible

More people know how to write `select` statements, than <Term id="dml" />, making the transformation layer accessible to more people!

#### Writing good DML is hard

If you write the <Term id="ddl" /> / DML yourself you can end up getting yourself tangled in problems like:

* What happens if the <Term id="table" /> already exists? Or this table already exists as a <Term id="view" />, but now I want it to be a table?
* What if the schema already exists? Or, should I check if the schema already exists?
* How do I replace a model atomically (such that there's no down-time for someone querying the table)
* What if I want to parameterize my schema so I can run these transformations in a development environment?
* What order do I need to run these statements in? If I run a `cascade` does it break other things?

Each of these problems _can_ be solved, but they are unlikely to be the best use of your time.

#### dbt does more than generate SQL

You can test your models, generate documentation, create snapshots, and more!

#### You reduce your vendor lock in

SQL dialects tend to diverge the most in DML and DDL (rather than in `select` statements) — check out the example [here](/faqs/models/sql-dialect). By writing less SQL, it can make a migration to a new database technology easier.

If you do need to write custom DML, there are ways to do this in dbt using [custom materializations](/guides/creating-new-materializations).
