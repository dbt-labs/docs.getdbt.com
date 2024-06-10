---
title: "Add documentation step to a job"
sidebar_label: "Add documentation step to a job"
description: "Learn how to set up a documentation job and generate metadata to power dbt Explorer and display details about the state of your dbt project."
---

You can set up documentation for a job in dbt Cloud when you edit your job settings or create a new job.  This step is necessary to view column and statistics for models, sources, and snapshots in dbt Explorer.

To generate documentation, you must configure at least one job in the deployment environment.

import SetUpDocsJob from '/snippets/_docs-setup-doc-job.md';

<SetUpDocsJob/>
