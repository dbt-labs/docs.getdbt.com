---
title: "Instance requirements"
sidebar_label: "Instance requirements"
description: "Review the IBM Netezza instance, catalog, and permission requirements for using the dbt-ibm-netezza adapter."
---

To use IBM Netezza with `dbt-ibm-netezza` adapter, ensure the instance has an attached catalog that supports creating, renaming, altering, and dropping objects such as tables and views. The user connecting to the instance via the `dbt-ibm-netezza` adapter must have the necessary permissions for the target database.

For more details, please visit the official [IBM documentation](https://cloud.ibm.com/docs/netezza?topic=netezza-getstarted)


### IBM Netezza SQL Extension Toolkit

Ensure that you have the SQL Extension Toolkit installed on your IBM Netezza system. This is a pre-reqsuisite to run all the function which require string data manipulation and view options. Check [docs](https://www.ibm.com/docs/en/netezza?topic=toolkit-sql-extensions-installation-setup) for more details.
