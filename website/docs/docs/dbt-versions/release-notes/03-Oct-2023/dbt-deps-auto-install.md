---
title: "Enhancement: dbt Cloud auto-installs 'dbt deps' on startup"
description: "October 2023 :The dbt Cloud IDE and dbt Cloud CLI auto-handles 'dbt deps' on startup; manual run needed for 'packages.yml' changes. Available for multi-tenant users (single-tenant support coming soon) and applies to all dbt versions."
sidebar_label: "Enhancement: dbt Cloud auto-installs 'dbt deps' on startup"
tags: [Oct-2023, IDE]
date: 2023-10-13
sidebar_position: 06
---

The dbt Cloud IDE and dbt Cloud CLI now automatically installs `dbt deps` when your environment starts or when necessary. Previously, it would prompt you to run `dbt deps` during initialization. However, you still need to run `dbt deps` if you modify your `packages.yml` or `dependencies.yml` file.

This improved workflow is available to all multi-tenant dbt Cloud users (Single-tenant support coming next week) and applies to dbt versions.
