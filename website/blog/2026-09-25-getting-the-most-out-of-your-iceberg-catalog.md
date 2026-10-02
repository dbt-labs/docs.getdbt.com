---
title: "Getting the most out of your Iceberg catalog"
description: "Three tools for browsing, scripting against, and consolidating tables in an Apache Iceberg REST catalog, plus what's new for Fivetran Managed Data Lake Service customers."
slug: getting-the-most-out-of-your-iceberg-catalog
authors: [jack_lowery, casey_karst]
tags: [data ecosystem, iceberg, catalogs]
hide_table_of_contents: false
date: 2026-09-25
is_featured: true
---

:::caution Draft post
The VS Code extension and connector-upgrade sections are marked **NEEDS CONFIRMATION**. They were written from limited access to those repos and need a pass from Jack or Casey (real capabilities, prerequisites, and a screenshot or clip) before this merges.
:::

Adopting Apache Iceberg is the easy part. Running it well day to day is where teams get stuck. A few questions worth asking about your own setup:

- Can you see which tables are in your catalog, and when their schemas last changed, without starting a query engine?
- Can you call your catalog's REST API directly, OAuth and all, when a client isn't seeing the snapshot you expect?
- If you have a dozen identical tables (one per tenant, one per region), can you query them as one table without copying any data?

If any of those made you wince, this post is for you. Below are three tools we've been using to make Iceberg catalogs easier to work with. The examples run against Fivetran Managed Data Lake Service (MDLS) because that's what we use every day, but the ideas apply to any Iceberg REST catalog.

<!-- truncate -->

## Browse your catalog from VS Code

Most people answer "what's in my catalog?" by opening a notebook and running `DESCRIBE TABLE` over and over. That's a browsing problem being solved with a query engine.

[iceberg-explorer-vscode](https://github.com/fivetran/iceberg-explorer-vscode) puts catalog and table metadata in a sidebar in the editor you already have open. Generic options like DBCode's Iceberg extension exist too; this one is built and tested against Polaris, the catalog behind MDLS.

*[NEEDS CONFIRMATION FROM JACK/CASEY: what the extension surfaces (table list, schema history, snapshots, manifests?), which catalogs it supports besides Polaris, install steps, and a screenshot or short clip of it running against MDLS.]*

## Call the REST catalog API with Postman

When something looks wrong, sometimes you want to skip every client library and ask the catalog directly. The Iceberg REST catalog spec is well defined, but getting an OAuth token and the right request shapes by hand takes longer than it should.

The **Fivetran Iceberg REST Catalog Postman collection**, linked from the [Fivetran API tools docs](https://fivetran.com/docs/developer-resources/rest-api/api-tools#apitools), gives you a ready-made set of requests for listing namespaces and tables and pulling table metadata. Set up OAuth 2.0 client credentials once (the collection walks you through it), and you can see the shape of every response before you write any code for a metadata audit or monitoring check.

*[NEEDS CONFIRMATION: the collection is built for the Fivetran catalog. Confirm whether it works against other Iceberg REST catalogs by swapping the base URL and token endpoint, and adjust this section's framing if not.]*

## Unify identical tables without rewriting data

Per-tenant ingestion leaves you with one `orders` table per customer instead of one `orders` table. Querying across them means a growing `UNION ALL` view that someone has to update each time a tenant is onboarded.

An Iceberg table is mostly metadata: a schema plus manifests listing which Parquet files belong to it. To combine N tables, you don't need to move any data. You need one new manifest that points at the files the N tables already have. That's what [unified_lake_tables](https://github.com/fivetran-jacklowery/unified_lake_tables) does.

<Lightbox src="/img/blog/2026-09-25-iceberg-catalog/unified-manifest.svg" title="Three tenant tables share their Parquet files with a new unified table through a single new manifest" width="90%" />

If you've used Iceberg's `add_files` procedure in Spark, the idea will feel familiar. The hard part is schemas. Iceberg matches columns by numeric field ID, not by name, and the IDs are baked into each Parquet file. Two tenant tables that each added a different column at different times can assign both new columns the *same* ID. Iceberg won't raise an error. It will quietly return one column's values under the other's name.

The repo handles this in three steps:

1. Reserve a range of field IDs up front so tables don't collide by default.
2. When two schemas are compatible, widen the unified schema without touching data.
3. Only rewrite files when there's a real collision that can't be resolved any other way.

This is an example project under Jack's personal GitHub account, not a supported product. Its README is candid about what's covered today:

- Tested: source tables adding a new nullable column, and copy-on-write updates and deletes (including MDLS's soft deletes).
- Known gap: column renames. The unified table keeps serving the old name, with no warning.
- Untested: dropped columns and changed data types.

Run your own validation before pointing it at anything in production.

## Try it yourself

Want to see an Iceberg REST catalog shared across engines end to end? The [Snowflake Horizon and Apache Iceberg guide](/guides/iceberg) walks you through building tables in Snowflake, then reading and writing those same tables from DuckDB on your laptop through Horizon's REST catalog. You'll need a Snowflake account and an S3 bucket, and about an hour.

## Bonus: if you use Fivetran MDLS

### Upgrade existing connectors to MDLS

If you already load data with Fivetran into a warehouse, [cakarst_mdls_migrator](https://github.com/fivetran/cakarst_mdls_migrator) helps you move those connectors to MDLS without rebuilding the destination and catalog setup by hand.

*[NEEDS CONFIRMATION FROM JACK/CASEY: what it automates, required inputs and permissions, prerequisites, and limitations. The draft called this a "skill"; confirm whether it's an agent skill, a CLI, or a script.]*

For the reasoning behind making the move, see [the business case for upgrading to a data lake](https://www.fivetran.com/blog/the-business-case-for-upgrading-to-a-data-lake).

### MDLS supports writes

MDLS used to be read-only from outside: Fivetran wrote the tables, and your query engines read them. With [Write Credentials](https://www.fivetran.com/blog/introducing-fivetran-managed-data-lake-write-credentials), Destination Admins and Account Admins can issue a separate write-enabled credential and run DDL and DML (create, alter, drop, insert, update, delete, merge) against the Polaris catalog from Snowflake or any other engine. A common first use is deleting a user's records to honor a GDPR request.

One rule: *pause the Fivetran connection before you alter a table.* Writing to a table while a sync is loading into it can cause permanent data loss.

For how access control works underneath, see [governing your lakehouse with MDLS](https://www.fivetran.com/blog/governing-your-lakehouse-with-fivetran-managed-data-lake-service).
