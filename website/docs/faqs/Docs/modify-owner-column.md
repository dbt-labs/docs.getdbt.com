
---
title: How do I populate the "Owner" column of the tables that display at the top of the model pages in the generated docs?
description: "Modify owner column"
sidebar_label: 'Can I populate owner column in docs?'
id: modify-owner-column

---

Unfortunately, you're unable to modify the owner in that way. 
 
The owner field in `dbt-docs` is pulled from database metdata (`catalog.json`) - i.e., the owner of that table in the database. With the exception of exposures, it's not pulled from an `owner` field set within dbt.
 
Generally, dbt's database user owns the tables that it's responsible for creating in the database. Source tables tend to be owned by the service responsible for ingesting/loading them. 
 
If you set `meta.owner`, you should now be seeing that field appear under "meta" (pulled from dbt), but still not under the top-level "owner" field (pulled from the database).
