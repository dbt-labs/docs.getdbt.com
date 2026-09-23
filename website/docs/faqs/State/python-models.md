---
title: Does dbt State support Python models?
description: "Learn how dbt State works with Python models."
sidebar_label: 'Does State support Python models?'
id: python-models
---

dbt State builds Python models but does not reuse them. It executes Python models on every run, even when their code and upstream data have not changed.
