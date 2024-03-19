---
title: Receiving a 'Could not parse the dbt project' error in dbt Cloud job
description: "Receiving a Could not parse the dbt project' error error in dbt Cloud? This error is typically caused by a tab indentation in your dbt_project.yml file."
sidebar_label: 'Could not parse the dbt project error in dbt Cloud'
---

If you're receiving a `Could not parse the dbt project. Please check that the repository contains a valid dbt project` error in a dbt Cloud job run, here are the some reasons why you're seeing this error:

- You have a tab indentation in your `dbt_project.yml` file instead of spaces.
- Your `dbt_project.yml` file doesn't exist in your dbt project repository.
- There's a parsing failure in a YAML file.
- Your `dbt_project.yml` file has missing fields or incorrect formatting.

To identify and confirm this error:
- Use an online YAML parser or validator to check for any parsing errors in your YAML file. Some known parsing errors include missing fields, incorrect formatting, or tab indentation.
- Or ensure your `dbt_project.yml` file.

Once you've identified the issue, you can fix the error and re-run your dbt Cloud job.
