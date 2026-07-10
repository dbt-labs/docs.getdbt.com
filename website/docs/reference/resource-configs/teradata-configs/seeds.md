---
title: "Seeds"
sidebar_label: "Seeds"
description: "Learn how to load seeds in Teradata, including the use_fastload option to speed up large seed files."
---

:::info Using seeds to load raw data

As explained in [dbt seeds documentation](/docs/build/seeds), seeds should not be used to load raw data (for example, large CSV exports from a production database).

Since seeds are version controlled, they are best suited to files that contain business-specific logic, for example a list of country codes or user IDs of employees.

Loading CSVs using dbt's seed functionality is not performant for large files. Consider using a different tool to load these CSVs into your <Term id="data-warehouse" />.

:::

* `use_fastload` - use [fastload](https://github.com/Teradata/python-driver#FastLoad) when handling `dbt seed` command. The option will likely speed up loading when your seed files have hundreds of thousands of rows. You can set this seed configuration option in your `project.yml` file, e.g.:

    ```yaml
    seeds:
      <project-name>:
        +use_fastload: true
    ```
