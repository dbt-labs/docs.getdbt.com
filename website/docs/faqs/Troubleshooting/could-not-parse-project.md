---
title: Receiving a 'Could not parse dbt_project.yml' error in dbt job
description: "Receiving a 'Could not parse dbt_project.yml' error in dbt? This error is typically caused by a tab indentation in your dbt_project.yml file."
sidebar_label: 'Could not parse dbt_project.yml error in dbt'
---

The error message `Could not parse dbt_project.yml: while scanning for...` in your <Constant name="cloud" /> job run or development usually occurs for several reasons:

- There's a parsing failure in a YAML file (such as a tab indentation or Unicode characters).
- Your `dbt_project.yml` file has missing fields or incorrect formatting.
- Your `dbt_project.yml` file doesn't exist in your dbt project repository.

To resolve this issue, consider the following:
- Use an online YAML parser or validator to check for any parsing errors in your YAML file. Some known parsing errors include missing fields, incorrect formatting, or tab indentation.
- Or ensure your `dbt_project.yml` file exists.

Once you've identified the issue, you can fix the error and rerun your <Constant name="cloud" /> job.
