---
title: "Seeds behavior"
sidebar_label: "Seeds"
description: "Learn how the dbt seed command performs a DROP CASCADE operation instead of TRUNCATE in Firebolt."
---

When running the ```dbt seed``` command we perform a `DROP CASCADE` operation instead of `TRUNCATE`.
