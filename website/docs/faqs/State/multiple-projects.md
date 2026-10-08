---
title: What if I work on multiple projects that each use their own dbt State?
description: "Learn how to configure dbt State when working across multiple projects."
sidebar_label: 'What if I work on multiple projects that use their own State?'
id: multiple-projects
---

You can specify your org ID in `dbt_project.yml`:

```yaml
dbt-cloud:
  state-org-id: <your-org-id>
```
