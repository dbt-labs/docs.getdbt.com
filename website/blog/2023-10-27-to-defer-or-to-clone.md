---

title: To defer or to clone, that is the question
description: "In dbt v1.6, we introduce support for zero-copy cloning via the new dbt clone command. In this blog post, Kshitij will cover what clone is, how it is different from deferral, and when to use each."
slug: to-defer-or-to-clone

authors: [kshitij_aranke, doug_beatty]

tags: [analytics craft]
hide_table_of_contents: false

date: 2023-10-31
is_featured: true

---

Hi all, I’m Kshitij, a senior software engineer on the Core team at dbt Labs.
One of the coolest moments of my career here thus far has been shipping the new `dbt clone` command as part of the dbt-core v1.6 release.

However, one of the questions I’ve received most frequently is guidance around “when” to clone that goes beyond [the documentation on “how” to clone](https://docs.getdbt.com/reference/commands/clone).
In this blog post, I’ll attempt to provide this guidance by answering these FAQs:

1. What is `dbt clone`?
2. How is it different from deferral?
3. Should I defer or should I clone?
<!--truncate-->
## What is `dbt clone`?

`dbt clone` is a new command in dbt 1.6 that leverages native zero-copy clone functionality on supported warehouses to **copy entire schemas for free, almost instantly**.

### How is this possible?

Well, the warehouse “cheats” by only copying metadata from the `source` schema to the `target` schema; the underlying data remains at rest during this operation. 
This metadata includes materialized objects like tables and views, which is why you see a **clone** of these objects in the target schema.

In computer science jargon, `clone` makes a copy of the pointer from the `source` schema to the underlying data; after the operation there are now two pointers (`source` and `target` schemas) that each point to the same underlying data.

## How is cloning different from deferral?

On the surface, cloning and deferral seem similar – **they’re both ways to save costs in the data warehouse.**
They do this by bypassing expensive model re-computations – clone by [eagerly copying](https://en.wikipedia.org/wiki/Evaluation_strategy#Eager_evaluation) an entire schema into the target schema, and defer by [lazily referencing](https://en.wikipedia.org/wiki/Lazy_evaluation) pre-built models in the source schema.

Let’s unpack this sentence and explore its first-order effects:

|                           | defer                                                                                                                                                              | clone                                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| **How do I use it?**      | Implicit via the `--defer` flag                                                                                                                                    | Explicit via the `dbt clone` command                                                                                                     |
| **What are its outputs?** | Doesn't create any objects itself, but dbt might create objects in the target schema if they’ve changed from those in the source schema.                           | Copies objects from source schema to target schema in the data warehouse, which are persisted after operation is finished.               |
| **How does it work?**     | Compares manifests between source and target dbt runs and overrides ref to resolve models not built in the target run to point to objects built in the source run. | Uses zero-copy cloning if available to copy objects from source to target schemas, else creates pointer views (`select * from my_model`) |

These first-order effects lead to the following second-order effects that truly distinguish clone and defer from each other:

|                                                                          | defer                                                                                                                              | clone                                                                                  |
|--------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **Where can I use objects built in the target schema?**                  | Only within the context of dbt                                                                                                     | Any downstream tool (e.g. BI)                                                          |
| **Can I safely modify objects built in the target schema?**              | No, since this would modify production data                                                                                        | Yes, cloning is a cheap way to create a sandbox of production data for experimentation |
| **Will data in the target schema drift from data in the source schema?** | No, since deferral will always point to the latest version of the source schema                                                    | Yes, since clone is a point-in-time operation                                          |
| **Can I use multiple source schemas at once?**                           | Yes, defer can dynamically switch between source schemas e.g. ref unchanged models from production and changed models from staging | No, clone copies objects from one source schema to one target schema                   |

## Should I defer or should I clone?

Putting together all the points above, here’s a handy cheat sheet for when to defer and when to clone:

|                                                                           | defer | clone |
|---------------------------------------------------------------------------|-------|-------|
| **Save time & cost by avoiding re-computation**                           | ✅     | ✅     |
| **Create database objects to be available in downstream tools (e.g. BI)** | ❌     | ✅     |
| **Safely modify objects in the target schema**                            | ❌     | ✅     |
| **Avoid creating new database objects**                                   | ✅     | ❌     |
| **Avoid data drift**                                                      | ✅     | ❌     |
| **Support multiple dynamic sources**                                      | ✅     | ❌     |

To absolutely drive this point home:

1. If you send someone this cheatsheet by linking to this page, you are deferring to this page
2. If you print out this page and write notes in the margins, you have cloned this page

## Putting it in practice

Using the cheat sheet above, let’s explore a few common scenarios and explore whether we should use defer or clone for each:

1. **Testing staging datasets in BI**

    In this scenario, we want to:
    1. Make a copy of our production dataset available in our downstream BI tool
    2. To safely iterate on this copy without breaking production datasets
    
    Therefore, we should use **clone** in this scenario
    
2. **[Slim CI](https://discourse.getdbt.com/t/how-we-sped-up-our-ci-runs-by-10x-using-slim-ci/2603)**

    In this scenario, we want to:
    1. Refer to production models wherever possible to speed up continuous integration (CI) runs
    2. Only run and test models in the CI staging environment that have changed from the production environment
    3. Reference models from different environments – prod for unchanged models, and staging for modified models
    
    Therefore, we should use **defer** in this scenario
    
3. **[Blue/Green Deployments](https://discourse.getdbt.com/t/performing-a-blue-green-deploy-of-your-dbt-project-on-snowflake/1349)**

    In this scenario, we want to:
    1. Ensure that all tests are always passing on the production dataset, even if that dataset is slightly stale
    2. Atomically rollback a promotion to production if tests aren’t passing across the entire staging dataset
    
    In this scenario, we can use **clone** to implement a deployment strategy known as blue-green deployments where we build the entire staging dataset and then run tests against it, and only clone it over to production if all tests pass.
    

As a rule of thumb, deferral lends itself better to continuous integration (CI) use cases whereas cloning lends itself better to continuous deployment (CD) use cases.

## Wrapping Up

In this post, we covered what `dbt clone` is, how it is different from deferral, and when to use each. Often, they can be used together within the same project in different parts of the deployment lifecycle. 

Thanks for reading, and I look forward to seeing what you build with `dbt clone`.

*Thanks to [Jason Ganz](https://docs.getdbt.com/author/jason_ganz) and [Gwen Windflower](https://www.linkedin.com/in/gwenwindflower/) for reviewing drafts of this article*
