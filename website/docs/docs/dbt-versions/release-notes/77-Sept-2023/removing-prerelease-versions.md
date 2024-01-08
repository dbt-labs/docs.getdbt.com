---
title: "Update: Removing old (prerelease) versions of dbt from dbt Cloud when (latest) is available"
description: "Sept 2023: Improving the version selection options by removing prerelease versions whenever the latest version is available."
sidebar_label: "Update: Removing old prerelease versions from dbt Cloud"
tags: [Sept-2023, Versions]
date: 2023-09-26
sidebar_position: 07
---

Previously, when dbt Labs released a new [version](/docs/dbt-versions/core#how-dbt-core-uses-semantic-versioning) in dbt Cloud, the older patch _prerelease_ version and the _latest_ version remained as options in the dropdown menu available in the **Environment settings**. Now, when the _latest_ version is released, the _prerelease_ version will be removed and all customers remaining on it will be migrated seamlessly. There will be no interruptions to service when this migration occurs. 

To see which version you are currently using and to upgrade, select **Deploy** in the top navigation bar and select **Environments**. Choose the preferred environment and click **Settings**. Click **Edit** to make a change to the current dbt version. dbt Labs recommends always using the latest version whenever possible to take advantage of new features and functionality. 


<Lightbox src="/img/docs/release-notes/dbt-cloud-versions.png" title="dbt Cloud versions dropdown"/>