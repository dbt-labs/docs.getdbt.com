---
title: How is data stored in dbt State?
description: "Learn what data dbt State sends to dbt Labs servers and how it is stored."
sidebar_label: 'How is data stored?'
id: data-storage
---

dbt State sends last-modified timestamps and SQL statements to dbt Labs servers. SQL statements are hashed before transmission, so dbt Labs cannot see the contents. These hashes are used to identify whether a statement has changed by comparing them on each run.
