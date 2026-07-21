---
title: How does dbt State calculate that a model has changed?
description: "Learn how dbt State determines whether a model has meaningfully changed."
sidebar_label: 'How do you calculate that a model has changed?'
id: model-change-calculation
---

dbt State only considers substantial changes to a model. Because dbt State understands the entire lineage of your models, it can see through things like whitespace and aliases to determine whether a model is the same or different across environments.
