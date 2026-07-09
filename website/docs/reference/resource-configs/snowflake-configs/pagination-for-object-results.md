---
title: "Pagination for object results"
sidebar_label: "Pagination for object results"
description: "Customize how dbt paginates show objects results in large Snowflake schemas using the list relations per page and page limit flags."
---

<VersionBlock firstVersion="1.9">

By default, when dbt encounters a schema with up to 100,000 objects, it will paginate the results from `show objects` at 10,000 per page for up to 10 pages.

Environments with more than 100,000 objects in a schema can customize the number of results per page and the page limit using the following [flags](/reference/global-configs/about-global-configs) in the `dbt_project.yml`:

- `list_relations_per_page` &mdash; The number of relations on each page (Max 10k as this is the most Snowflake allows).
- `list_relations_page_limit` &mdash; The maximum number of pages to include in the results.

For example, if you wanted to include 10,000 objects per page and include up to 100 pages (1 million objects), configure the flags as follows:


```yml

flags:
  list_relations_per_page: 10000
  list_relations_page_limit: 100

```

</VersionBlock>
