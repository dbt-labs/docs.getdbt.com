---
title: How do I remove deleted models from my data warehouse?
description: "Remove deleted models directly in your data warehouse"
sidebar_label: 'Removing deleted models from your warehouse'
id: removing-deleted-models

---

If you delete a model from your dbt project, dbt does not automatically drop the relation from your schema. This means that you can end up with extra objects in schemas that dbt creates, which can be confusing to other users.

(This can also happen when you switch a model from being a <Term id="view" /> or <Term id="table" />, to ephemeral)

When you remove models from your dbt project, you should manually drop the related relations from your schema.
