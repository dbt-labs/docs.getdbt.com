---
title: "Read from catalog"
sidebar_label: "Read from catalog"
description: "Add an external catalog to StarRocks and reference its tables as dbt sources."
---

First you need to add this catalog to starrocks. The following is an example of hive.

```sql
CREATE EXTERNAL CATALOG `hive_catalog`
PROPERTIES (
    "hive.metastore.uris"  =  "thrift://127.0.0.1:8087",
    "type"="hive"
);
```
How to add other types of catalogs can be found in the documentation. [Catalog Overview](https://docs.starrocks.io/en-us/latest/data_source/catalog/catalog_overview) Then write the sources.yaml file.
```yaml
sources:
  - name: external_example
    schema: hive_catalog.hive_db
    tables:
      - name: hive_table_name
```
Finally, you might use below marco quote
```jinja
{{ source('external_example', 'hive_table_name') }}
```
