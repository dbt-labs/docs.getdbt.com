---
title: "Cluster requirements"
sidebar_label: "Cluster requirements"
description: "Understand the catalog and permission requirements for the cluster dbt connects to when using the Trino adapter."
---

The designated cluster must have an attached catalog where objects such as tables and views can be created, renamed, altered, and dropped. Any user connecting to the cluster with dbt must also have these same permissions for the target catalog.
