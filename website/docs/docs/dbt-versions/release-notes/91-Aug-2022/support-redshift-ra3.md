---
title: "Enhancement: Support for cross-database sources on Redshift RA3 instances"
id: "support-redshift-ra3.md"
description: "Adding support for cross-database queries for RA3"
sidebar_label: "Enhancement: Support for RA3"
tags: [Aug-2022, 1.1.61.5]

---

Cross-database queries for RA3 instances are now supported by dbt Cloud projects using a Redshift connection. 

With cross-database queries, you can seamlessly query data from any database in the cluster, regardless of which database you are connected to with dbt. 

The [connection configuration](https://docs.getdbt.com/reference/warehouse-profiles/redshift-profile) `ra3_node` has been defaulted to `true`. This allows users to:

- benefit from the full RA3 nodes’ capabilities, 
- generate appropriate dbt documentation.

