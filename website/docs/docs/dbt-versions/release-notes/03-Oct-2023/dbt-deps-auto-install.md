---
title: "Enhancement: dbt Cloud auto-installs 'dbt deps' on startup"
description: "October 2023 :The dbt Cloud IDE and dbt Cloud CLI auto-handles 'dbt deps' on startup; manual run needed for 'packages.yml' changes. Available for multi-tenant users (single-tenant support coming soon) and applies to all dbt versions."
sidebar_label: "Enhancement: dbt Cloud auto-installs 'dbt deps' on startup"
tags: [Oct-2023, IDE]
date: 2023-10-17
sidebar_position: 06
---

The dbt Cloud IDE and dbt Cloud CLI now automatically installs `dbt deps` when your environment starts or when necessary. Previously, it would prompt you to run `dbt deps` during initialization. 

This improved workflow is available to all multi-tenant dbt Cloud users (Single-tenant support coming next week) and applies to dbt versions.

However, you should still run the `dbt deps` command in these situations:

- When you make changes to the `packages.yml` or `dependencies.yml` file.
- When you update the package version in the `packages.yml` or `dependencies.yml` file. (From dbt v1.7 or higher)
- If you edit the `dependencies.yml` file and the number of packages remains the same, run `dbt deps`. (Note that this is a known bug dbt Labs will fix in the future.)



