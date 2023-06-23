---
title: Do I need to add a YAML entry for column for it to appear in the docs site?
description: "All columns appear in your docs site"
sidebar_label: 'Types of columns included in doc site'
id: document-all-columns
---
Fortunately, no!

dbt will introspect your warehouse to generate a list of columns in each relation, and match it with the list of columns in your `.yml` files. As such, any undocumented columns will still appear in your documentation!
