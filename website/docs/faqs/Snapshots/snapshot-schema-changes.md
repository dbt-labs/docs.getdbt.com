---
title: What happens if I add new columns to my snapshot query?
description: "Reconcile changes when adding new columns in snapshot query"
sidebar_label: 'Snapshot column changes'
id: snapshot-schema-changes

---
When the columns of your source query changes, dbt will attempt to reconcile this change in the destination snapshot <Term id="table" />. dbt does this by:

1. Creating new columns from the source query in the destination table
2. Expanding the size of string types where necessary (eg. `varchar`s on Redshift)

dbt _will not_ delete columns in the destination snapshot table if they are removed from the source query. It will also not change the type of a column beyond expanding the size of varchar columns. That is, if a `string` column is changed to a `date` column in the snapshot source query, dbt will not attempt to change the type of the column in the destination table.
