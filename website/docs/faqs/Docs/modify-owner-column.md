---
title: How do I populate the owner column in the generated docs?
description: "Modify owner column"
sidebar_label: 'Can I populate owner column in docs?'
id: modify-owner-column
---


Unfortunately, you're unable to modify the owner column your generated documentation. 
 
The _owner_ field in `dbt-docs` is pulled from database metdata (`catalog.json`), meaning the owner of that table in the database. With the exception of exposures, it's not pulled from an `owner` field set within dbt.
 
Generally, dbt's database user owns the tables created in the database. Source tables are usually owned by the service responsible for ingesting/loading them. 
 
If you set `meta.owner`, you should now be seeing that field appear under **meta** (pulled from dbt), but still not under the top-level **owner** field.
