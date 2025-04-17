---
title: "Cache"
id: "cache"
sidebar: "Cache"
---

### Cache population

At the start of runs, dbt caches metadata about all the objects in all the schemas where it might materialize resources (such as models). By default, dbt populates the relational cache with information on all schemas related to the project.

There are two ways to optionally modify this behavior:
- `POPULATE_CACHE` (default: `True`): Whether to populate the cache at all. To skip cache population entirely, use the `--no-populate-cache` flag or `DBT_POPULATE_CACHE: False`. Note that this does not _disable_ the cache; missed cache lookups will run queries, and update the cache afterward.
- `CACHE_SELECTED_ONLY` (default `False`): Whether to limit cache population to just the resources selected in the current run. This can offer significant speed improvements when running a small subset of a large project, while still providing the benefit of caching upfront.

For example, to quickly compile a model that requires no database metadata or introspective queries:
```text

dbt --no-populate-cache compile --select my_model_name

```

Or, to improve speed and performance while focused on developing Salesforce models, which are materialized into their own dedicated schema, you could select those models and pass the `cache-selected-only` flag:

```text

dbt --cache-selected-only run --select salesforce

```

### Logging relational cache events

import LogLevel from '/snippets/_log-relational-cache.md';

<LogLevel
event="relational cache"
/>
