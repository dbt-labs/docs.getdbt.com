---
title: "The Catalog Linked Database Diaries: On Freshness and Writes"
description: "Learn about catalog linked databases with Apache Iceberg."
slug: catalog-linked-databases
authors: [anna_lee, mila_page]
tags: [iceberg, catalogs]
hide_table_of_contents: false
date: 2026-03-26
is_featured: true
---

## The Catalog Linked Database Diaries: On Freshness and Writes

Last November, at dbt Summit, Jeremy introduced dbt’s multi-platform Iceberg capabilities. 

<div style={{ display: 'flex', justifyContent: 'center', }}>
<iframe width="560" height="315" src="https://www.youtube.com/embed/bRJJkeJkUsE?si=mQTD3jUNpPqvwrJb" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>

With them, Snowflake can seamlessly query and write Iceberg tables to catalogs in other platforms. We wanted to push those claims to their limit and did so by exploring the interconnectivity of Databricks Unity Catalog and Snowflake.

AI’s all the rage, but another little revolution is taking shape: Teams are breaking their data storage out of vendor-specific platforms. The Iceberg table format and Iceberg REST catalogs are the emerging standards powering that flexibility.

We have been chatting for months with users excited to adopt Iceberg as a core pillar of their data architecture. For dbt’s part, we see two opportunities to power this little revolution.

- **dbt projects at scale**: Teams share one logical database, with many schemas and hundreds to thousands of tables
- **Cross-platform mesh**: One project in Snowflake, one in Databricks, sharing data without juggling manual refreshes or metadata pointers

<!-- truncate -->

## What is a Catalog Linked Database?

In the Iceberg model, the catalog is the system of record for table metadata—schemas, snapshots, and evolution. It’s designed so multiple engines can interoperate against that same metadata layer. A catalog-linked database (CLD) is Snowflake’s way of exposing an open Apache Iceberg catalog, and all the Iceberg tables it contains, inside Snowflake as just another database.

The dream is for teams to share Iceberg tables across platforms without recreating their metadata pointers one by one or copying actual data. Consider an organization with finance using figures in Databricks and a marketing team using Snowflake. The Snowflake team wants that upstream data fresh and even wants to backport manual row updates now and then. Old-school synced tables would treat Databricks as a source of truth. With Iceberg and a CLD-enabled architecture, both data platforms point to the same catalog-defined source of truth.

Some upfront configuration work in Snowflake buys you seamless cross-platform queries on seamlessly synced data objects—that’s the on-paper guarantee. (Snowflake recently published a [step-by-step tutorial](https://docs.snowflake.com/en/user-guide/tutorials/tables-iceberg-set-up-bidirectional-access-to-unity-catalog) for using CLDs to enable bidirectional data sharing with Databricks — unimaginable a few years ago, and achievable today.)

As we developed our testing suite, we wondered what happens at scale for both reads and writes. Turn up the chaos: what happens when both are happening at once? For example, if the accounting team writes into a Databricks cluster at 6 a.m. every morning, but the synchronization step to the marketing team’s Snowflake cluster takes 2-3 hours, when will it be safe for their morning data analysis jobs to kick off?

## Our testing regimen

Based on our telemetry of real-world dbt projects, we see that large projects number in the hundreds of models. Some number in the thousands. For the purposes of our testing, we make the riskiest assumption that *every single model* would be materialized as an Iceberg table. This is our upper bound. (It’s rare behavior in dbt projects adopting Iceberg, but a team could have legitimate reasons for choosing this.)

At these scales, catalog behavior, metadata operations, and refresh mechanics really start to matter. We observed latencies and frictions in the hundreds, but for science, we pushed this to its extreme. We loaded 500k tables into one database and tested write performance, synchronization promises, etc.

1. **Reading at scale:** What’s the overhead when Snowflake reads tables owned elsewhere?
2. **Writing at scale:** How does performance change when you’re creating/updating lots of tables and querying big sums of metadata?
3. **Freshness under change:** When one platform updates data, how reliably and quickly does the other see it?

## Reads at scale: Good performance, but only after platforms sync {#reads-at-scale}

Using TPC-H queries over large benchmarking datasets, we found that once data is visible and up to date, querying those Iceberg tables from Snowflake is as fast as you’d want in any reasonable analytics workflow. Databricks querying the same data from the owning side is speedy too.

The catch is that “read performance” is really only half the story. In practice, what users experience is not “how fast is this query,” but “am I even querying the latest thing?” When freshness slips, CLDs stop feeling like a pipe and start feeling like waiting for a package held up in customs.

## Writes and change at scale: The compute bottleneck {#writes-and-changes-at-scale}

When Snowflake is the one making lots of changes (creating tables, updating metadata, producing many Iceberg commits), the limiting factor quickly becomes the write path. In a dbt-shaped workload—many small/medium table operations rather than one giant append—this can make runs slow and sometimes fragile under contention. This can lead to outright failures that claim your table no longer exists.

When Databricks is making changes, writes are the same as ordinary Databricks Iceberg writes. Snowflake’s ability to reflect those changes is unpredictable.

## The biggest finding: As scale increases, refresh latency does too {#the-biggest-finding}

CLDs promise fast syncing. We found this is relatively true at small and medium scales, but at large scale, we observed that changes in Databricks to synchronize with the external Iceberg tables in Snowflake lagged dramatically, sometimes 2x longer than expected. When we dialed things up to 500k tables, the refresh on Snowflake for a trivial Databricks `INSERT` could take close to two days to propagate. Some tables seemed to get “stuck” until we learned how to manually nudge refresh forward (including hacking refresh-related settings to jog the system — we hear the fine folks at Snowflake have ergonomic improvements on the way).

Ultimately, the question of whether and how you should adopt Snowflake CLDs comes down to scale and latency:

1. How many Iceberg tables are you syncing across multiple engines?
2. Do your workflows require that Snowflake has a near-real-time view of externally managed Iceberg? Or can you treat it as a view that might be stale, accept eventual consistency, and live without clear guarantees unless you build your own monitoring and manual playbook?

## Interoperability friction: Why it’s not just the metadata {#interoperability-friction}

Two non-performance issues showed up quickly:

- Naming, quoting, and casing differences become friction points when dbt is generating objects that need to be understood identically by two engines. Our deep dive has given us ideas for dbt to abstract over these ergonomic challenges. In the future, users shouldn’t need to memorize the casing/quoting rules of every catalog/engine combo. For now, unfortunately, that’s just the cost of doing platform-agnostic business.
- Metadata and refresh behavior become part of your job. You’re managing tables and the system that decides when tables “exist.” And those show iceberg tables queries are slow.

## The takeaway

CLDs work—up to a point. They solve recurring problems about keeping data connected across platforms. If the number of tables or update volume is very large (on the order of tens of thousands), the pattern stops being a useful abstraction. The same goes if you depend on per-second precision for synchronizing writes. But until you approach that edge, CLDs really do make it possible to treat external Iceberg catalogs like any other database.

For us, that can unlock some very exciting capabilities within customers’ dbt workflows—cross-platform mesh, external sources, and maybe even running the same dbt project / DAG against multiple warehouses. We believe that Iceberg integrations will continue to improve, becoming more performant and easier to use. We need only look to the past year of features (like CLDs!) to be excited for what’s coming in the next.

We’d be remiss to end without thanks to the Unity Catalog team for their half of the story.