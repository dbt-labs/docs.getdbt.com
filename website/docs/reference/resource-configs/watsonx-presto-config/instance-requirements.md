---
title: "Instance requirements"
sidebar_label: "Instance requirements"
description: "Learn the catalog and permission requirements for using IBM watsonx.data Presto with the dbt-watsonx-presto adapter."
---

To use IBM watsonx.data Presto(java) with `dbt-watsonx-presto` adapter, ensure the instance has an attached catalog that supports creating, renaming, altering, and dropping objects such as tables and views. The user connecting to the instance via the `dbt-watsonx-presto` adapter must have the necessary permissions for the target catalog.

For detailed setup instructions, including setting up watsonx.data, adding the Presto(Java) engine, configuring storages, registering data sources, and managing permissions, refer to the official IBM documentation:
- watsonx.data Software Documentation: [IBM watsonx.data Software Guide](https://www.ibm.com/docs/en/watsonx/watsonxdata/2.1.x)
- watsonx.data SaaS Documentation: [IBM watsonx.data SaaS Guide](https://cloud.ibm.com/docs/watsonxdata?topic=watsonxdata-getting-started)
