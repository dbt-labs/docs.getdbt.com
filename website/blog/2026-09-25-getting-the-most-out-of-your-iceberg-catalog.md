---
title: "Getting the most out of your Iceberg catalog (plus a Fivetran MDLS bonus)"
description: "Tools for browsing, scripting against, and consolidating your Apache Iceberg catalog, plus what's new for Fivetran Managed Data Lake Service customers."
slug: getting-the-most-out-of-your-iceberg-catalog
authors: [jack_lowery, casey_karst]
tags: [iceberg, catalogs]
hide_table_of_contents: false
date: 2026-09-25
is_featured: true
---

:::caution Draft post
This post is a work in progress. The VS Code extension and connector-migration sections below are marked **[NEEDS CONFIRMATION FROM JACK/CASEY]** — they're written from limited access to those repos and need a real pass (actual capabilities, inputs, prerequisites, and ideally a screenshot or short clip) before this goes live. Don't merge over those flags without replacing them with real detail.
:::

Here's a test: pull up your Apache Iceberg catalog right now. Can you tell me, without opening a query engine, what tables live in it and when their schemas last changed? Can you hit the Iceberg REST API directly without reverse-engineering an OAuth flow from a Postman error message? If you've got a dozen near-identical tables — one per tenant, one per region — sitting in your lake, could you unify them into one queryable table this afternoon, without rewriting a single Parquet file?

If the answer to any of those is "not really," you're not doing anything wrong. Apache Iceberg has effectively won the open table format war, but winning the format war didn't fix the practitioner experience around it. That gap is what this post is about.

<!-- truncate -->

## 1. Exploring your catalog from VS Code

Query engines are the wrong tool for "what tables exist, what are their current schemas, when did they last change" — that's a browsing problem, not a querying problem, and today the answer for most people is opening a notebook and running `DESCRIBE TABLE` a dozen times. Third-party tools like DBCode's generic Iceberg extension exist for exactly this reason, but they're built to browse anything with an Iceberg catalog rather than being tuned to any one catalog's specific behavior.

[fivetran/iceberg-explorer-vscode](https://github.com/fivetran/iceberg-explorer-vscode) brings catalog and Iceberg table metadata browsing into the editor most of us already have open all day, instead of a separate notebook or query session.

*[NEEDS CONFIRMATION FROM JACK/CASEY: exact capabilities of this repo — what the extension actually surfaces (table list, schema history, snapshot/manifest detail?), install steps, and a screenshot or short clip for the final version of this post.]*

## 2. A Postman collection for Iceberg REST metadata

Sometimes you don't want an editor extension or a query engine — you want to hit the API directly, script something, or debug why a client isn't seeing the snapshot you expect. That's exactly the territory where hand-rolled REST Catalog calls get painful: OAuth setup, endpoint shapes, and error responses that don't tell you much on their own.

Fivetran ships an official Postman collection for this. It's linked from the [API tools section](https://fivetran.com/docs/developer-resources/rest-api/api-tools#apitools) of the developer docs as the **Fivetran Iceberg REST Catalog Postman collection**, and it's built specifically for pulling metadata out of tables in a Fivetran Iceberg REST Catalog. You'll need to set up OAuth 2.0 credentials first (the collection walks you through it), but once that's done, you've got a ready-made set of requests for exploring catalog and table metadata over REST — without writing an HTTP client from scratch or guessing at request shapes from the spec.

## 3. No-rewrite unified lake tables, fast

If you're running per-tenant, per-region, or per-customer ingestion, you end up with N structurally identical Iceberg tables in your lake — one `orders` table per customer instead of one `orders` table, period. Querying across all of them means unioning N tables by hand, or building and maintaining a view that does it for you every time a new tenant gets onboarded.

The fix sounds simple once you remember what an Iceberg table actually *is*: mostly metadata. A table is a manifest — a list of which Parquet files currently belong to it — plus a schema. If you want to consolidate N tables into one, you don't need to touch a single data file. You need a new manifest that points at all the existing files across all N source tables. That's the entire idea behind [unified_lake_tables](https://github.com/fivetran-jacklowery/unified_lake_tables): build the new manifest, skip the rewrite, get a single queryable table in the time it takes to list some files.

Worth flagging up front: this repo lives under Jack's personal GitHub namespace, not the Fivetran org. It's a community/example build being shared because it's genuinely useful and unusually well-documented, not a shipped, GA product feature — treat it accordingly.

Here's the part that makes this more than an afternoon of manifest-splicing, and worth reading the README for even if you never run the code: Iceberg doesn't resolve columns by name, it resolves them by an internal numeric field ID. Two source tables that evolved independently — say, two tenants who each added their own new column at different times — can land unrelated new columns on the *same* field ID. Iceberg won't error on this. It'll just silently serve the wrong column's data through the unified table, which is about the worst failure mode you can get from a metadata operation that's supposed to be free.

The repo's fix is a three-layer approach: reserve a range of field IDs up front so tables don't collide by default, widen for free when two schemas are compatible enough that no actual conflict exists, and only fall back to an actual rewrite when there's a genuine collision that can't be resolved any other way.

A few known gaps, documented on purpose:

- It's been validated against exactly one schema-change pattern so far: a source table adding a new nullable column.
- True column renames are an acknowledged, currently open gap — the unified table will keep silently serving the old column name forever, with no error or warning.
- Dropped columns and changed data types are untested; behavior is unknown, not "known to work."
- It's explicitly not a general-purpose ETL replacement. It's additive-column-safe. It is not transform-safe.

### Get hands-on with an Iceberg catalog and DuckDB

If you want to try all of this against a real catalog without provisioning any infrastructure, check out the [Iceberg quickstart guide](/guides/iceberg?step=12) — it walks through standing up a catalog and querying it with DuckDB right on your laptop.

## Bonus: for Fivetran MDLS customers

### Upgrading existing connectors to MDLS

If you're running Fivetran into a warehouse today and have been eyeing a move to a managed lakehouse, there's a more direct path than standing up Polaris and reconfiguring destinations by hand. The tool for this lives at [fivetran/cakarst_mdls_migrator](https://github.com/fivetran/cakarst_mdls_migrator) — a repo aimed at upgrading existing Fivetran setups to Fivetran Managed Data Lake Service (MDLS) rather than having you reconstruct the destination and catalog wiring from scratch.

*[NEEDS CONFIRMATION FROM JACK/CASEY: exact capabilities of this repo — what it actually automates, what inputs it expects, and any prerequisites or limitations, before we describe it in more detail here.]*

If you want the "why," not just the "how," [the business case for upgrading to a data lake](https://www.fivetran.com/blog/the-business-case-for-upgrading-to-a-data-lake) covers the reasoning and incremental migration steps this tool is meant to make more concrete.

### MDLS supports writes now

We [announced Write Credentials for MDLS a few weeks ago](https://www.fivetran.com/blog/introducing-fivetran-managed-data-lake-write-credentials), and it's worth putting in context here, because it's the piece that turns MDLS from "a place Fivetran writes to and you read from" into a two-way relationship with your lake.

MDLS now issues a second, write-permissioned credential set, separate from the read-only credentials you've had all along. Write Credentials are gated to Destination Admins and Account Admins specifically, and they let you run real DDL and DML — create, alter, and drop tables, insert, update, delete, and merge rows — directly against the hosted Apache Polaris catalog through whatever query engine you're already using.

One caveat worth repeating every time this comes up: **pause the Fivetran connection before altering a table**. Writing to a table while a connection is still syncing into it can cause permanent data loss.

Before this shipped, the REST Catalog was read-only from external query engines — Fivetran was the only thing that wrote metadata, a constraint [covered in detail in the governance post](https://www.fivetran.com/blog/governing-your-lakehouse-with-fivetran-managed-data-lake-service). Write Credentials is what changes that constraint — and it's the reason the no-rewrite table unification above has a path to actually landing changes back in your catalog, rather than staying read-only forever.
