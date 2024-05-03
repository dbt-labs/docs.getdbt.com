---
title: "Behavior change: no spaces in resource names"
description: "May 2024: New flag that raises an exception if it finds a resource name containing spaces. Disabled by default."
sidebar_label: "Behavior change: no spaces in resource names"
sidebar_position: 09
tags: [May-2024]
date: 2024-05-02
---

In dbt Core 1.8, we introduced the `require_resource_names_without_spaces` flag, which is opt-in and disabled by default. If set to `True`, dbt will raise an exception if it finds a resource name containing a space in your project or an installed package. This will become the default in a future version of dbt. Read [No spaces in resource names](/reference/global-configs/legacy-behaviors#no-spaces-in-resource-names) for more information about this flag.

Refer to [Behavior change flags](/reference/global-configs/legacy-behaviors#behavior-change-flags) to learn more about how we use behavior change flags.
